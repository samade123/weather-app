<template>
  <transition name="fade" appear>
    <div class="theme-body" :class="{ 'dissapear': dissapear }">
      <div class="minimise" @click="dissapear = true">-</div>
      <fieldset class="theme-switcher" role="radiogroup" ref="draggable" aria-labelledby="theme-switcher-label">
        <legend id="theme-switcher-label">Choose a theme:</legend>
        <div class="theme-option">
          <input type="radio" id="theme-old" name="theme" value="light" checked aria-labelledby="theme-old-label" />
          <label for="theme-old" id="theme-old-label">Old theme</label>
        </div>
        <div class="theme-option">
          <input type="radio" id="theme-new" name="theme" value="new" aria-labelledby="new-theme-label" />
          <label for="theme-new" id="new-theme-label">New theme</label>
        </div>
      </fieldset>
    </div>
  </transition>
</template>

<script>
import { onMounted, ref } from "@vue/runtime-core";
export default {
  name: "ThemeSwitch",
  setup(props, ctx) {
    const draggable = ref(null);
    const dissapear = ref(false);

    onMounted(() => {
      draggable.value.addEventListener("mousedown", onMouseDown);
    });

    const onMouseDown = (event) => {
      event.preventDefault();
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (event) => {
      const { clientX, clientY } = event;
      draggable.value.style.left = `${clientX}px`;
      draggable.value.style.top = `${clientY}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    return {
      draggable,
      dissapear,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@use "./../stylesheets/transitions.scss" as *;
@import "./../stylesheets/buttons.scss";

.theme-body {
  width: 200px;
  // height: 50px;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;

  display: grid;
  background: #f7f7f7;
  border-radius: 20px;

  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  // white-space: ;

  &.dissapear {
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
    width: 10px;
    height: 10px;
  }

  div.minimise {
    opacity: 1 !important;
    position: relative;
    top: -10px;
    right: 0;
    width: 20px;
    border-radius: 50%;
    font-weight: 700;
    background: white;
  }
}

:root:has(#theme-old:checked) {
  .theme-body {
    // background: #00000033;
  }
}

// reset css of fieldset

fieldset {
  margin: 0;
  padding: 0;
  border: none;

  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  height: 100%;
}

legend {
  display: block;
  width: auto;
  padding: 0;
  margin-bottom: 0;
  font-size: 100%;
  line-height: 1.5;
  color: inherit;
  border: 0;
  cursor: move;
  /* Make the legend draggable */

}
</style>
