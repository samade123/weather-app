<template>
    <div class="middle new">
        <div class="title">Your weather</div>
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
</template>
  
<script>
import WeatherSVG from "@/components/WeatherSVG.vue";
import { widthFunction } from "@/composables/Mobile.js";

export default {
    name: 'WeatherDisplay',
    components: {
        WeatherSVG,
    },
    setup(props, ctx) {
        const { width, setMobile, getScreenCategory } = widthFunction();
        return {
            width, setMobile, getScreenCategory,
        };

    },
};
</script>

<style lang="scss" scoped>
@use "./../stylesheets/dashboard/theme-old.scss" as *;
@use "./../stylesheets/dashboard/theme-new.scss" as *;
@use "./../stylesheets/transitions.scss" as *;

</style>
  