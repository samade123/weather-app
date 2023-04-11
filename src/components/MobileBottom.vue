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
        <div class="bottom-sections" v-if="currentObj.name == `3-hours`">
            <slot name="weather-strip"></slot>
        </div>
        <div class="bottom-sections" v-if="currentObj.name == `search`">
            <slot name="weather-search"></slot>
        </div>
        <div class="bottom-sections" v-if="currentObj.name == `all-day`">
            <slot name="progress-chart"></slot>
        </div>
    </div>
</template>
  
<script>
import WeatherSVG from "@/components/WeatherSVG.vue";
import { widthFunction } from "@/composables/Mobile.js";
import useStaggeredTransition from '@/composables/useStaggeredTransition.js';
import searchIconJson from "@/assets/lottie-files/search.json";
// import workerPath from "@/webworkers/searchCSV.js";
import csvPath from "@/assets/cities-new.csv";
import { ref, watch, onMounted, computed } from 'vue';

export default {
    name: 'MobileBottom',
    emits: ["citySearch"],
    components: {
        WeatherSVG,
    },
    setup(props, ctx) {
        const { width, setMobile, getScreenCategory } = widthFunction();
        const element = ref(null) //lottie player element
        const searchInput = ref(null) //input element
        const searchContainer = ref(null) //input element
        const playIconForwardNext = ref(true)
        const searchInputFocus = ref(false);
        const searchTerm = ref('');
        const elementLeft = ref(0)
        const searchResults = ref([]);
        const {
            transition,
            beforeEnter,
            enter,
            leave,
            delayedEnter
        } = useStaggeredTransition();
        const searchTermTimer = ref(false);
        const currentObj = ref(false)

        const emitSearch = (e) => {
            ctx.emit("citySearch", e)
        }
        const buttonClick = (e) => {
            if (!searchInputFocus.value) { //input has no focus
                searchInput.value.focus();
                searchInputFocus.value = true;
            } else {
                searchInput.value.blur();
                searchInputFocus.value = false;
            }
        }

        const focusOnInput = () => {
            if (playIconForwardNext.value) { // the next play direction is forward then play forward 
                icon.value.playSegments([0, 50], true)
                playIconForwardNext.value = false;
            }
        }

        const blurOffInput = () => {
            if (!playIconForwardNext.value) {
                icon.value.playSegments([50, 0], true)
                searchTerm.value = "";
                search();
                playIconForwardNext.value = true;
            }
        }

        const search = () => {
            if (!searchTerm.value) {
                document.getElementsByClassName('search-results-container')[0].classList.remove("searching");
                document.getElementsByClassName('search-results-container')[0].classList.add("go-away");
                document.getElementsByClassName('search-results-container')[0].classList.remove("searching");
                setTimeout(() => {
                    document.getElementsByClassName('search-results-container')[0].style.display = "none";
                }, 900);
                searchResults.value.length = 0;
                return
            };
            const worker = new Worker(new URL('@/webworkers/searchCSV.js', import.meta.url));

            worker.postMessage({ csvPath, searchTerm: searchTerm.value });
            document.getElementsByClassName('search-results-container')[0].classList.remove("go-away");
            document.getElementsByClassName('search-results-container')[0].classList.add("searching");
            document.getElementsByClassName('search-results-container')[0].classList.remove("go-away");
            document.getElementsByClassName('search-results-container')[0].style.overflowY = "hidden";
            document.getElementsByClassName('search-results-container')[0].style.display = "grid";

            setTimeout(() => {
                document.getElementsByClassName('search-results-container')[0].style.overflowY = "initial";
            }, 500);
            worker.onmessage = (event) => {
                searchResults.value.length = 0;
                // setTimeout(() => {
                searchResults.value = [...event.data];
                // }, 400);
            };
        };

        onMounted(() => {
            elementLeft.value = `${element.value.offsetLeft}px`;
            currentObj.value = selectors.filter((selector) => selector.name == "3-hours")[0]
            element.value.classList.add(currentObj.value["selectedClass"])

        });


        const inputChange = () => {
            if (searchTermTimer.value) {
                clearTimeout(searchTermTimer.value)
            }
            searchTermTimer.value = setTimeout(() => {
                search()
            }, 200)
        }

        const selectedValue = ref("")
        const selectors = [{ "name": "search", "selected": false, "selectedClass": "one" }, { "name": "3-hours", "selected": true, "selectedClass": "two" }, { "name": "all-day", "selected": false, "selectedClass": "three" }]
        selectedValue.value = selectors.filter((selector) => selector.selected == true)[0].name
        const selectValue = (selectedObj) => {
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

        return {
            width, setMobile, searchTerm,
            search, getScreenCategory,
            searchIconJson, element, focusOnInput,
            searchInput, blurOffInput, buttonClick,
            searchResults, transition,
            beforeEnter,
            enter,
            leave,
            delayedEnter,
            searchContainer,
            inputChange,
            emitSearch,
            selectors,
            clickSelector,
            selectedValue,
            elementLeft,
            currentObj,
        };

    },
};
</script>

<style lang="scss" scoped>
@use "./../stylesheets/dashboard/theme-old.scss" as *;
@use "./../stylesheets/dashboard/theme-new.scss" as *;
@use "./../stylesheets/transitions.scss" as *;
</style>
  