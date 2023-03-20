<template>
    <div class="middle new">
        <div class="title">the.weather</div>
        <!-- <transition name="fade-in" mode="out-in" appear appear-class=""> -->

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
        <!-- </transition> -->
        <div class="spacer condition" v-if="!setMobile"></div>
    </div>


    <div class="right new" v-if="!setMobile">
        <div class="search-container">
            <input type="text" class="search" ref="searchInput" @blur="playIcon">
            <div class="search-icon" @click="playIcon">
                <Vue3Lottie :animationData="searchIconJson" height="100%" width="100%" ref="icon" :loop="false"
                    :pauseAnimation="false" :autoPlay="false" />
            </div>
        </div>
        <div class="search-results-container">
            <div class="result">Birmingham</div>
            <div class="result">Manchester</div>
            <div class="result">New York</div>
            <div class="result">California</div>
        </div>
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
        </div>
    </div>
</template>
  
<script>
import WeatherSVG from "@/components/WeatherSVG.vue";
import { widthFunction } from "@/composables/Mobile.js";
import searchIconJson from "@/assets/lottie-files/search.json";
import { ref } from 'vue';

export default {
    name: 'WeatherDisplay',
    components: {
        WeatherSVG,
    },
    setup(props, ctx) {
        const { width, setMobile, getScreenCategory } = widthFunction();
        const icon = ref(null) //lottie player element
        const searchInput = ref(null) //input element
        const iconPlayState = ref(false)

        const playIcon = () => {
            iconPlayState.value = !iconPlayState.value
            if (iconPlayState.value) {
                icon.value.playSegments([0, 50], true)
                searchInput.value.focus()
            } else {
                icon.value.playSegments([50, 0], true)
            }
        }

        return {
            width, setMobile, getScreenCategory, searchIconJson, icon, playIcon, searchInput,
        };

    },
};
</script>

<style lang="scss" scoped>
@use "./../stylesheets/dashboard/theme-old.scss" as *;
@use "./../stylesheets/dashboard/theme-new.scss" as *;
@use "./../stylesheets/transitions.scss" as *;
</style>
  