<template>
  <transition name="fade" appear>
    <div class="modal-overlay" ref="modal" @click="hideModal" v-if="showModal">
      <div class="modal" role="dialog" v-if="showModal">
        <p>This app has an update available. Would you like to refresh now?</p>
        <button class="buttons" @click="refresh">Yes! Update App</button>
        <button class="buttons white" @click="hideModal">
          No. Update Later
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { onBeforeMount, ref } from "@vue/runtime-core";
export default {
  name: "PWAModal",
  setup(props, ctx) {
    const modal = ref(null);

    let registration = {};
    let updateExists = false;
    let refreshing = false;
    const showModal = ref(false);

    const updateAvailable = (event) => {
      registration = event.detail;
      updateExists = true;
      showModal.value = true;
    };

    const hideModal = (event) => {
      console.log(event.target, modal.value);
      if (event.target === modal.value) {
        showModal.value = false;
      }
    };

    const refresh = () => {
      refreshApp();
    };

    const refreshApp = () => {
      console.debug("refresh!!");
      updateExists = false;
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!registration || !registration.waiting) return;
      // Send message to SW to skip the waiting and activate the new SW
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    };

    onBeforeMount(() => {
      console.log("beforeMounting");
      document.addEventListener("swUpdated", updateAvailable, {
        once: true,
      });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        // We'll also need to add 'refreshing' to our data originally set to false.
        if (refreshing) return;
        refreshing = true;
        // Here the actual reload of the page occurs
        window.location.reload();
      });
    });

    return {
      props,
      modal,
      hideModal,
      refresh,
      refreshApp,
      showModal,
      updateExists,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "./../stylesheets/buttons.scss";

.modal,
.pop-leave-from {
  text-align: center;
  height: fit-content;
  max-width: min(22em, 95vw);
  padding: 2rem;
  // border-radius: 1rem;
  box-shadow: #0000003d 0px 3px 8px;
  background: #fff;
  z-index: 999;
  transform: none;

  display: flex;
  grid-gap: 20px;
  flex-wrap: wrap;
  flex-direction: column;

  justify-content: center;
  color: black;
}
.modal h1 {
  margin: 0 0 1rem;
}

.modal-overlay,
.fade-leave-from {
  content: "";
  position: absolute;
  position: fixed;
  // top: 0;
  right: 0;
  bottom: 0;
  // left: 0;
  z-index: 998;
  background: #2c3e5000;
  // opacity: 0.1;
  cursor: pointer;

  width: 100vw;

  display: flex;
  grid-gap: 20px;
  flex-wrap: wrap;
  flex-direction: column;

  justify-content: flex-end;
  align-items: center;
}

/* ---------------------------------- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform 0.4s cubic-bezier(0.5, 0, 0.5, 1), opacity 0.4s linear;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.3) translateY(-50%);
}

.buttons {
  height: fit-content;
}
</style>
