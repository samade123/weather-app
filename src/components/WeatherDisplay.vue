<template>
    <div class="middle new">
        <div class="title">the.weather</div>

        <div class="temp-summary temp-one" v-if="!setMobile" :key="1">
            <div class="temp">
                <slot name="temperature">0</slot>&#176;
            </div>
            <div class="location-wrapper">
                <div class="location">
                    <div class="location-name">
                        <div>
                            <slot name="location">..</slot>
                        </div>
                    </div>
                    <div class="location-date">
                        <div>
                            <slot name="day-and-month">..</slot>
                            <!-- <slot name="month">..</slot> -->
                        </div>
                        <div>
                            <slot name="time">..</slot>
                        </div>
                    </div>
                </div>
                <div class="condition">
                    <slot name="weather-svg">
                        <WeatherSVG />
                    </slot>
                    <div class="cloudy">
                        <slot name="condition">Mostly Clear</slot>
                    </div>
                </div>
            </div>
        </div>

        <div class="temp-summary temp-two" v-else :key="2">
            <div class="location-wrapper">
                <div class="condition">
                    <slot name="weather-svg">
                        <WeatherSVG />
                    </slot>
                </div>
                <div class="location">
                    <div class="location-name">
                        <div>
                            <slot name="location">..</slot>
                        </div>
                    </div>
                    <div class="location-date">
                        <div class="cloudy">
                            <slot name="condition">Mostly Clear</slot>, <slot name="time">..</slot>
                        </div>
                    </div>
                </div>

            </div>

            <div class="temp">
                <slot name="temperature">0</slot><span>&#176;</span>
            </div>
        </div>
        <div class="spacer condition" v-if="!setMobile"></div>
    </div>


    <div class="right new" v-if="!setMobile">
        <div class="search-container">
            <input type="text" class="search" ref="searchInput" @input="inputChange" v-model="searchTerm"
                @keydown.enter="search" @focus=focusOnInput @blur="blurOffInput">
            <div class="search-icon" @click="buttonClick($event)">
                <Vue3Lottie :animationData="searchIconJson" height="100%" width="100%" ref="icon" :loop="false"
                    :pauseAnimation="false" :autoPlay="false" />
            </div>
        </div>
        <transition-group tag="div" class="search-results-container" mode="out-in" :css="false" appear
            @before-enter="beforeEnter" @enter="enter">
            <div v-for="(city, index) in searchResults" :key="city.refIndex" @mousedown="emitSearch(city.item.name)"
                :data-index="index" class="result">{{
                    city.item.name }}</div>
        </transition-group>
        <div class="weather-details-title">Weather Details</div>
        <div class="weather-details-container">
            <div class="stats">Cloudy <span>
                    <slot name="cloudy">0</slot>%
                </span></div>
            <div class="stats">Humidity <span>
                    <slot name="humidity">0</slot>%
                </span></div>
            <div class="stats">Wind <span>
                    <slot name="wind">0</slot>km/h
                </span></div>
        </div>
        <div class="weather-details-title">Next 3 Hours</div>
        <div class="next-seven-container">
            <slot name="next-seven"></slot>
        </div>
        <div class="weather-details-title">Progress Chart</div>
        <div class="progress-chart-container">
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
import { ref, watch, onBeforeMount } from 'vue';

export default {
    name: 'WeatherDisplay',
    emits: ["citySearch"],
    components: {
        WeatherSVG,
    },
    setup(props, ctx) {
        const { width, setMobile, getScreenCategory } = widthFunction();
        const icon = ref(null) //lottie player element
        const searchInput = ref(null) //input element
        const searchContainer = ref(null) //input element
        const playIconForwardNext = ref(true)
        const searchInputFocus = ref(false);
        const searchTerm = ref('');
        const searchResults = ref([]);
        const {
            transition,
            beforeEnter,
            enter,
            leave,
            delayedEnter
        } = useStaggeredTransition();
        const searchTermTimer = ref(false);
        const buttonClickTimer = ref(false);

        const emitSearch = (e) => {
            ctx.emit("citySearch", e)
        }
        const buttonClick = (e) => {
            console.log(e)

            // if (buttonClickTimer.value) {
            //     return
            // }
            // buttonClickTimer.value = setTimeout(() => {
            //     clearTimeout(buttonClickTimer.value)
            //     buttonClickTimer.value = false
            // }, 800)

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
            // const worker = new Worker(workerPath);
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

        // onBeforeMount(() => {
        const inputChange = () => {

            // console.log("here")
            if (searchTermTimer.value) {
                clearTimeout(searchTermTimer.value)
            }
            searchTermTimer.value = setTimeout(() => {
                search()
            }, 200)
        }
        // })

        return {
            width, setMobile, searchTerm,
            search, getScreenCategory,
            searchIconJson, icon, focusOnInput,
            searchInput, blurOffInput, buttonClick,
            searchResults, transition,
            beforeEnter,
            enter,
            leave,
            delayedEnter,
            searchContainer,
            inputChange,
            emitSearch,
        };

    },
};
</script>

<style lang="scss" scoped>
@use "./../stylesheets/dashboard/theme-old.scss" as *;
@use "./../stylesheets/dashboard/theme-new.scss" as *;
@use "./../stylesheets/transitions.scss" as *;
</style>
  