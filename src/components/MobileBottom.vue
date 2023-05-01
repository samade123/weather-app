<template>
    <div class="mobile-selectors">
        <div class="selector" v-for="selector in selectors" :key="selector.name" @click="clickSelector($event, selector)">{{
            selector.name }}</div>
        <div class="mobile-selectors hidden">
            <div class="selector" ref="element" :data-left="elementLeft" :style="{ '--left-value': `${elementLeft}` }">{{
                selectedValue }}
            </div>
        </div>
    </div>

    <div class="bottom-main">
        <transition :name="transitionName">
            <div class="bottom-sections" v-if="switchFunctionality(selectors[0].name)">
                <div class="search-suggestion-wrapper">
                    <div class="search-results-container" v-if="searchResults.length > 0">
                        <div tabindex='0' class="result-wrapper" v-for="(n, index) in 5" :key='n'>
                            <transition name="results" appear mode="out-in">
                                <div tabindex='0' class="results" @keyup.enter="emitSearch(searchResults[index].item.name)"
                                    @click="emitSearch(searchResults[index].item.name)" v-if="searchResults[index]"
                                    :key='searchResults[index].item.name' :style="{ 'transition-delay': `${n * 0.1}s` }"> {{
                                        searchResults[index].item.name }}
                                </div>

                            </transition>
                        </div>
                    </div>
                    <transition :name="transitionName">

                        <!-- <Vue3Lottie v-if='searchResults.length == 0' :animationData="searchMapJson" :loop="false"
                            :pauseAnimation="false" :autoPlay="false" /> -->

                        <LottiePlayer v-if='searchResults.length == 0' :animationData="searchMapJson" :loop="false"
                            :pauseAnimation="false" :autoPlay="false" height="95%" />
                    </transition>
                </div>
                <div class="search-container" @click="buttonClick($event)">
                    <div class="search-icon">
                        <!-- <Vue3Lottie :animationData="searchIconJson" height="40px" width="40px" ref="icon" :loop="false"
                            :pauseAnimation="false" :autoPlay="false" /> -->
                        <LottiePlayer :animationData="searchIconJson" height="40px" width="40px" :loop="false"
                            :pauseAnimation="false" :autoPlay="false" :frames="searchLottieObj.frames"
                            :play="searchLottieObj.play" />
                    </div>
                    <input type="text" class="search" ref="searchInput" @input="inputChange" v-model="searchTerm">
                </div>

            </div>
            <div class="bottom-sections" v-else-if="switchFunctionality(selectors[1].name)">
                <slot name="weather-strip"></slot>
            </div>
            <div class="bottom-sections" v-else-if="switchFunctionality(selectors[2].name)">
                <slot name="progress-chart">
                    <div class="placeholder"></div>
                </slot>
            </div>
        </transition>
    </div>
</template>
  
<script>
import LottiePlayer from "@/components/Lottie.vue";
import { widthFunction } from "@/composables/Mobile.js";
import searchIconJson from "@/assets/lottie-files/search-mobile-two.json";
import searchMapJson from "@/assets/lottie-files/search-map.json";
import { ref, onMounted, toRaw, watch } from 'vue';


export default {
    name: 'MobileBottom',
    emits: ["citySearch"],
    props: ["current"],
    components: {
        LottiePlayer,
    },
    setup(props, ctx) {
        const { width, setMobile, getScreenCategory } = widthFunction();
        const element = ref(null) //lottie player element
        const searchInput = ref(null) //input element
        const searchContainer = ref(null) //input element
        const playIconForwardNext = ref(true)
        const icon = ref(false) //lottie player element

        const searchInputFocus = ref(false);
        const showSearch = ref(false);
        const searchTerm = ref('');
        const elementLeft = ref(0)
        const searchResults = ref([]);
        // const {
        //     transition,
        //     beforeEnter,
        //     enter,
        //     leave,
        //     delayedEnter
        // } = useStaggeredTransition();
        const searchTermTimer = ref(false);
        const currentObj = ref(false)
        const transitionName = ref('slide')

        const selectedValue = ref("")
        const selectors = [{ "name": "Search", "selected": false, "selectedClass": "one" }, { "name": "Hours", "selected": true, "selectedClass": "two" }, { "name": "Forecast", "selected": false, "selectedClass": "three" }]

        const searchLottieObj = {
            frames: [],
            play: false,
        }
        const switchFunctionality = (selectorName) => {

            if (selectorName != selectors[0].name) {
                searchResults.value.length = 0;

                showSearch.value = false;
                searchTerm.value = "";
                playIconForwardNext.value = true;
            }
            return currentObj.value.name == selectorName
        }

        const emitSearch = (e) => {
            ctx.emit("citySearch", removeAccents(e));
            // searchResults.value.length = 0;
            // // icon.value.playSegments([50, 0], true)
            // searchLottieObj.frames = [50, 0]
            // showSearch.value = false;
            // searchTerm.value = "";
            // playIconForwardNext.value = true;
        }
        const buttonClick = (e) => {
            if (!searchInputFocus.value) { //input has no focus
                searchInput.value.focus();
                searchInputFocus.value = true;
                focusOnInput();
            } else {
                searchInput.value.blur();
                searchInputFocus.value = false;
                blurOffInput();
            }
        }

        const focusOnInput = () => {
            // console.log(icon.value)
            if (playIconForwardNext.value) { // the next play direction is forward then play forward 
                searchLottieObj.frames = [0, 50]
                // icon.value.playSegments([0, 50], true)
                playIconForwardNext.value = false;
            }
        }

        const blurOffInput = () => {
            if (!playIconForwardNext.value) {
                searchLottieObj.frames = [50, 0]
                // icon.value.playSegments([50, 0], true)
                searchTerm.value = "";
                search();
                playIconForwardNext.value = true;
            }
        }

        const search = () => {
            if (!searchTerm.value) {
                searchResults.value.length = 0;
                return
            };

            if (searchTerm.value.length < 3) { return };
            const worker = new Worker(new URL('@/webworkers/searchCSV.js', import.meta.url));

            worker.postMessage({ searchTerm: searchTerm.value });
            worker.onmessage = (event) => {
                searchResults.value = [...event.data];
            };

        };

        onMounted(() => {
            elementLeft.value = `${element.value.offsetLeft}px`;
            currentObj.value = selectors[1]
            element.value.classList.add(currentObj.value["selectedClass"])
        });

        const inputChange = () => {
            if (searchTermTimer.value) {
                clearTimeout(searchTermTimer.value)
            }
            searchTermTimer.value = setTimeout(() => {
                search()
            }, 500)
        }

        selectedValue.value = selectors.filter((selector) => selector.selected == true)[0].name
        const selectValue = (selectedObj) => {

            if (selectors.indexOf(selectedObj) > selectors.indexOf(toRaw(currentObj.value))) {
                transitionName.value = 'inverse-slide'

            } else if (selectors.indexOf(selectedObj) < selectors.indexOf(toRaw(currentObj.value))) {
                transitionName.value = 'slide'

            }
            selectors.forEach((selector) => selector["selected"] = false)
            selectedObj["selected"] = true;

            return selectors.filter((selector) => selector.selected == true)[0].name
        }


        const clickSelector = (event, selectedObj) => {

            element.value.classList.add("transition")

            element.value.style.width = `${event.target.offsetWidth}px`
            elementLeft.value = `${event.target.offsetLeft}px`;
            element.value.classList.remove("one", "two", "three")

            selectedValue.value = selectValue(selectedObj);
            currentObj.value = selectedObj;
            element.value.classList.add(selectedObj["selectedClass"])

            element.value.addEventListener("animationend", () => {
                element.value.classList.remove("transition")
            });
        }

        const removeAccents = (str) => {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }


        watch(() => props.current, (newVal) => {

            if (searchResults.value.length > 0) {
                searchResults.value.length = 0;
                // icon.value.playSegments([50, 0], true)
                searchLottieObj.frames = [50, 0]
                showSearch.value = false;
                searchTerm.value = "";
                playIconForwardNext.value = true;
            }
        });



        return {
            width, setMobile, searchTerm,
            search, getScreenCategory,
            searchIconJson, searchMapJson, element, focusOnInput,
            searchInput, blurOffInput, buttonClick,
            searchResults,
            //  transition,
            // beforeEnter,
            // enter,
            // leave,
            // delayedEnter,
            searchContainer,
            inputChange,
            emitSearch,
            selectors,
            clickSelector,
            selectedValue,
            elementLeft,
            currentObj,
            transitionName,
            showSearch,
            icon,
            switchFunctionality,
            searchLottieObj
        };

    },
};
</script>

<style lang="scss" scoped>
@use "./../stylesheets/dashboard/theme-old.scss" as *;
@use "./../stylesheets/dashboard/theme-new.scss" as *;
@use "./../stylesheets/transitions.scss" as *;
@use "./../stylesheets/placeholder.scss" as *;


.search-suggestion-wrapper:has(.lottie-animation-container) {
    position: relative;
}

.search-suggestion-wrapper .lottie-animation-container {
    position: absolute;
    top: 0;
    height: 100%;
    aspect-ratio: 1;
    margin-inline: auto;
}

.bottom-sections .placeholder {
    height: 200px;
    width: 100%;
}
</style>
  