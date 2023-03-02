<template>
  <transition name="fade" appear>
    <div class="theme-body">
      <fieldset
        class="theme-switcher"
        role="radiogroup"
        aria-labelledby="theme-switcher-label"
      >
        <legend id="theme-switcher-label">Choose a theme:</legend>
        <div class="theme-option">
          <input
            type="radio"
            id="theme-old"
            name="theme"
            value="light"
            checked
            aria-labelledby="theme-old-label"
          />
          <label for="theme-old" id="theme-old-label">Old theme</label>
        </div>
        <div class="theme-option">
          <input
            type="radio"
            id="theme-new"
            name="theme"
            value="new"
            aria-labelledby="new-theme-label"
          />
          <label for="theme-new" id="new-theme-label">New theme</label>
        </div>
      </fieldset>
    </div>
  </transition>
</template>

<script>
import { onBeforeMount, ref } from "@vue/runtime-core";
export default {
  name: "ThemeSwitch",
  setup(props, ctx) {
    return {};
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
}

</style>
