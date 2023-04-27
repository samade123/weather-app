<template>
    <div class="middle new">
        <div class="title"><span>the.weather</span><span @click="openSettings">
                <Vue3Lottie :animationData="settingCog" :loop="false" :pauseAnimation="false" playOnHover="true"
                    :autoPlay="false" />
            </span></div>

        <div class="temp-summary temp-one" v-if="!setMobile" :key="1">
            <div class="temp">
                <slot name="temperature">0</slot>
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
                            <slot name="location">
                                <div class="placeholder"></div>
                            </slot>
                        </div>
                    </div>
                    <div class="location-date">
                        <div class="cloudy">
                            <slot name="condition">Mostly Clear</slot>
                            <slot name="time">..</slot>
                        </div>
                    </div>
                </div>

            </div>

            <div class="temp">
                <slot name="temperature">0</slot>
            </div>
        </div>
        <div class="spacer condition" v-if="!setMobile"></div>
    </div>


    <div class="right new" v-if="!setMobile">
        <div class="search-container">
            <input type="text" class="search" ref="searchInput" @input="inputChange" v-model="searchTerm"
                @keydown.enter="search" @focus='focusOnInput' @blur="blurOffInput">
            <!-- <input type="text" class="search" ref="searchInput" @input="inputChange" v-model="searchTerm"
                @keydown.enter="search" @focus='focusOnInput'> -->
            <div class="search-icon" @click="buttonClick($event)">
                <Vue3Lottie :animationData="searchIconJson" height="45px" ref="icon" :loop="false" :pauseAnimation="false"
                    :autoPlay="false" />
            </div>
        </div>
        <!-- <transition-group tag="div" class="search-results-container" mode="out-in" :css="false" appear
            @before-enter="beforeEnter" @enter="enter">
            <div v-for="(city, index) in searchResults" :key="city.refIndex" @mousedown="emitSearch(city.item.name)"
                :data-index="index" class="result">{{
                    city.item.name }}</div>
        </transition-group> -->
        <transition name="open-up" appear mode="out-in">

            <div class="search-results-container" v-if="searchResults.length > 0">
                <div class="result-wrapper" v-for="(n, index) in 5" :key='n'>
                    <transition name="results" appear mode="out-in">
                        <div class="results" @mousedown="emitSearch(searchResults[index].item.name)"
                            v-if="searchResults[index]" :key='searchResults[index].item.name'
                            :style="{ 'transition-delay': `${n * 0.1}s` }"> {{
                                searchResults[index].item.name }}
                        </div>

                    </transition>
                </div>
            </div>
        </transition>
        <div class="weather-details-title">Weather Details</div>
        <div class="weather-details-container">
            <div class="stats">Cloudy <span>
                    <slot name="cloudy">0</slot>
                </span></div>
            <div class="stats">Humidity <span>
                    <slot name="humidity">0</slot>
                </span></div>
            <div class="stats">Wind <span>
                    <slot name="wind">0</slot>
                </span></div>
        </div>
        <div class="weather-details-title">Next 3 Hours</div>
        <div class="next-seven-container">
            <slot name="next-seven"></slot>
            <div class="next-seven-container-friend"></div>
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
// import useStaggeredTransition from '@/composables/useStaggeredTransition.js';
import searchIconJson from "@/assets/lottie-files/search.json";
import settingCog from "@/assets/lottie-files/settings-sliders.json";
// import workerPath from "@/webworkers/searchCSV.js";
import csvPath from "@/assets/cities-new.csv";
import { ref, watch, onBeforeMount } from 'vue';

export default {
    name: 'WeatherDisplay',
    emits: ["openSettings", "citySearch"],
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
        // const {
        //     transition,
        //     beforeEnter,
        //     enter,
        //     leave,
        //     delayedEnter
        // } = useStaggeredTransition();
        const searchTermTimer = ref(false);
        const buttonClickTimer = ref(false);

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

        const openSettings = () => {
            ctx.emit("openSettings");
        };

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
                searchResults.value.length = 0;
                return
            };
            const worker = new Worker(new URL('@/webworkers/searchCSV.js', import.meta.url));

            worker.postMessage({ csvPath, searchTerm: searchTerm.value });

            worker.onmessage = (event) => {
                // console.log('found', event.data)
                searchResults.value = [...event.data];
            };
        };

        const inputChange = () => {
            if (searchTermTimer.value) {
                clearTimeout(searchTermTimer.value)
            }
            searchTermTimer.value = setTimeout(() => {
                search()
            }, 500)
        }


        return {
            width, setMobile, searchTerm,
            search, getScreenCategory,
            searchIconJson, icon, focusOnInput,
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
            settingCog,
            openSettings,
        };

    },
};
</script>

<style lang="scss" scoped>
@use "./../stylesheets/dashboard/theme-old.scss" as *;
@use "./../stylesheets/dashboard/theme-new.scss" as *;
@use "./../stylesheets/transitions.scss" as *;
@use "./../stylesheets/placeholder.scss" as *;

:root:has(#theme-new:checked) div.outer {
    div.title {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;

        span:first-child {
            grid-column: 2;

        }

        span:nth-child(2) {
            grid-column: 3;
            text-align: end;

            &>div {
                height: 40px;
                width: 40px;

                &:hover {
                    cursor: pointer;
                }
            }
        }
    }

    .progress-chart-container {
        &:has(.checked) {
            position: relative;
        }
    }
}
</style>
  