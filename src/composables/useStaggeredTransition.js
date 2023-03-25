import { ref } from "vue";
import { gsap } from "gsap";

export default function useStaggeredTransition() {
  const transition = ref(false);

  function beforeEnter(el) {
    el.style.opacity = 0;
    el.style.transform = "translateX(10px)";
  }

  function enter(el, done) {
    gsap.to(el, {
      opacity: 1,
      translateX: 0,
      duration: 0.4,
      delay: el.getAttribute('data-index') * 0.3,
      ease: "ease-in-out",
      onComplete: done,
    });
  }

  function leave(el, done) {
    gsap.to(el, {
      opacity: 0,
      translateX: 10,
      duration: 0.4,
      ease: "ease-in-out",
      onComplete: done,
    });
  }

  function delayedEnter(el, i) {

    gsap.to(el, {
      opacity: 1,
      translateX: 0,
      duration: 0.5,
      ease: "ease-in-out",
      delay: i * 0.05,
      onComplete: () => {
        transition.value = false;
      },
    });
  }

  return {
    transition,
    beforeEnter,
    enter,
    leave,
    delayedEnter,
  };
}
