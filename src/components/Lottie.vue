<template>
    <div ref="lottieContainer" :style="{ width: width ? width : null, height: height ? height : null }"></div>
</template>
  
<script>
import { onMounted, ref, watch } from 'vue';


export default {
    name: 'LottieAnimation',
    props: {
        animationData: {
            type: Object,
            required: true,
        },
        loop: {
            type: Boolean,
            default: false,
        },
        autoplay: {
            type: Boolean,
            default: false,
        },
        hoverPlay: {
            type: Boolean,
            default: false,
        },
        speed: {
            type: Number,
            default: 1,
        },
        rendererSettings: {
            type: Object,
            default: () => ({}),
        },
        play: {
            type: Boolean,
            default: false,
        },
        playDirection: {
            type: Number,
            default: 1,
        },
        width: {
            type: String,
        },
        height: {
            type: String,
        },
        frames: {
            type: Array,
            default: () => [],
        },
    },
    setup(props) {
        const lottieContainer = ref(null);
        let lottiePlayer;

        const loadLottieWeb = () => {
            return new Promise((resolve, reject) => {
                // Check if window.lottie is already defined
                if (window.lottie) {
                    resolve(window.lottie);
                } else {
                    // Check if script tag for lottie-web already exists
                    const existingScript = document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.11.0/lottie.min.js"]');
                    if (existingScript) {
                        existingScript.addEventListener('load', () => {
                            resolve(window.lottie);
                        });
                    } else {
                        // If script tag does not exist, create new one and append to document head
                        const script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.async = true;
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.11.0/lottie.min.js';

                        script.onload = () => {
                            resolve(window.lottie);
                        };

                        script.onerror = () => {
                            reject(new Error('Failed to load lottie-web script'));
                        };

                        document.head.appendChild(script);
                    }
                }
            });
        };



        onMounted(() => {
            loadLottieWeb()
                .then((lottie) => {
                    // console.log(props.animationData, lottie, "status")
                    lottiePlayer = lottie.loadAnimation({
                        container: lottieContainer.value,
                        renderer: 'canvas',
                        loop: props.loop,
                        autoplay: props.autoplay,
                        animationData: props.animationData,
                        rendererSettings: props.rendererSettings,
                    });

                    if (props.hoverPlay) {
                        lottieContainer.value.addEventListener('mouseenter', () => {
                            lottiePlayer.play();
                        });

                        lottieContainer.value.addEventListener('mouseleave', () => {
                            lottiePlayer.pause();
                        });
                    }

                    lottiePlayer.setSpeed(props.speed);
                    lottiePlayer.setDirection(props.playDirection);

                    watch(() => props.play, (newVal) => {
                        if (newVal) {
                            if (props.frames.length === 2) {
                                lottiePlayer.playSegments(props.frames, true);
                            } else {
                                lottiePlayer.play();
                            }
                        } else {
                            lottiePlayer.pause();
                        }
                    });

                    watch(() => props.playDirection, (newVal) => {
                        lottiePlayer.setDirection(newVal);
                    });

                    watch(() => props.frames, (newVal) => {
                        if (newVal.length === 2) {
                            lottiePlayer.playSegments(newVal, true);
                        }
                    });

                })
                .catch((err) => console.log(err))



        });

        return {
            lottieContainer,
            lottiePlayer,
            play: props.play,
            playDirection: props.playDirection,
            width: props.width,
            height: props.height,
        };
    },
};
</script>

