<template>
  <div class="outer">
    <div class="top">
      <span class="target smooth" ref="target"></span>
      <span class="target smooth" ref="target-2"></span>
    </div>
    <div class="middle" ref="sidebar">
      <div
        class="navigation"
        :class="{ unselected: !link.current }"
        v-for="link in nav"
        :key="link.link"
        @click="routeLink(link.link, link)"
        @mouseenter="mouseenterFunc(link)"
        @mouseleave="mouseenterFunc(currentObj, false, false, false)"
        :ref="getRef(link)"
      >
        <div class="icon">
          <i class="las la-lg" :class="returnIconClass(link.icon)"></i>
        </div>
        <div class="title">
          {{ link.title }}
        </div>
      </div>
    </div>
    <div class="bottom" ref="bottom"></div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useWindowSize } from "vue-window-size";

export default {
  props: ["nav", "windowWidth", "windowHeight"],
  emits: ["currentObj"],
  setup(props, ctx) {
    const windowWidth = ref(props.windowWidth);
    const windowHeight = ref(props.windowHeight);

    const router = useRouter();
    const stripDimensions = { width: 0, height: 0, left: 0, right: 0 };

    const nav = ref(props.nav);
    const returnIconClass = (icon) => {
      const classObj = {};
      classObj[icon] = true;
      return classObj;
    };

    const routeLink = (linkRef, pageObj) => {
      // router.push(linkRef);
      ctx.emit("currentObj", pageObj);

      return;
    };

    const getRef = (pageObj) => {
      return nav.value.indexOf(pageObj).toString();
    };
    return { nav, returnIconClass, routeLink, getRef, stripDimensions };
  },
  watch: {
    windowWidth() {
      this.mouseenterFunc(this.currentObj, true);
    },
    "props.nav"() {
      const currentObj = this.nav.filter((page) => page.current == true)[0];

      this.mouseenterFunc(currentObj, false, true);
    },
    deep: true,
    "$route.path"() {
      console.debug(this.$route.path, "watch");
      this.currentPage = this.$route.path;
      this.mouseenterFunc(this.nav[1], false, true);
    },
  },

  methods: {
    mouseenterFunc(
      pageObj,
      resize = false,
      currentPage = false,
      leave = false
    ) {
      let elementRef = this.getRef(pageObj);
      // console.log(this.$refs[elementRef][0].getBoundingClientRect())
      let element = this.$refs[elementRef][0];
      let target = this.$refs["target"];

      if (currentPage) {
        const currentObj = this.nav.filter(
          (page) => page.link == `${this.currentPage}`
        )[0];

        console.debug(
          this.nav,
          currentObj,
          `${this.currentPage}`,
          "inside function"
        );
        elementRef = this.getRef(currentObj);
        element = this.$refs[elementRef][0];
        target = this.$refs["target-2"];
        this.currentObj = currentObj; //for setting the resizing window
      }
      //remove current styling from the current link divfunction here

      // add current styling to the mouse over link div
      this.stripDimensions.width = element.getBoundingClientRect().width;
      this.stripDimensions.height = element.getBoundingClientRect().height;
      // this.stripDimensions.left =
      //   element.getBoundingClientRect().right + window.pageXOffset;
      this.stripDimensions.left =
        this.$refs["sidebar"].getBoundingClientRect().right +
        window.pageXOffset;

      this.stripDimensions.top =
        element.getBoundingClientRect().top + window.pageYOffset;

      // target.style.width = `${this.stripDimensions.width}px`;
      // resize ? target.classList.remove("smooth") : false;
      // resize ? target.classList.add("resize") : false;

      if (resize) {
        target.classList.remove("smooth");
        target.classList.add("resize");
      }
      this.resizeFunction(target, resize);
      if (resize) {
        target = this.$refs["target-2"];
        target.classList.remove("smooth");
        target.classList.add("resize");
        this.resizeFunction(target, true);
      }
    },
    resizeFunction(target, resize) {
      target.style.width = `2px`;
      target.style.height = `${this.stripDimensions.height}px`;
      target.style.left = `${this.stripDimensions.left}px`;
      target.style.top = `${this.stripDimensions.top}px`;
      target.style.borderColor = "#0F1621";
      target.style.transform = "none";
      setTimeout(() => {
        if (resize) {
          target.classList.add("smooth");
          target.classList.remove("resize");
        }
      }, 500);
    },
  },
  mounted() {
    this.mouseenterFunc(this.nav[0]);
    this.currentPage = this.$route.path;

    this.mouseenterFunc(this.nav[1], false, true);

    console.log(this.$route.path, "roiute name");
  },
};
</script>

<style lang="scss" scoped>
div.outer {
  display: grid;
  grid-template-rows: 1fr 5fr 2fr;
  height: 100%;
  grid-gap: 5px;
  border: solid #e6ebf4;
  border-width: 0 2px 0 0;
  color: #0f1621;

  .middle {
    display: grid;
    grid-template-rows: repeat(7, 1fr);
    div.navigation {
      font-weight: bold;
      display: grid;
      grid-template-columns: 1fr 3fr;
      place-items: center;
      grid-gap: 7px;
      transition: all ease-out 0.1s;
      width: 99%;
      &.unselected {
        color: #7f7f8a;
      }
      &:hover {
        background: #0f162111;
        color: #0f1621;

        font-size: 17px;
        // font-weight: bolder;
        cursor: pointer;
      }
      .icon {
        width: 100%;
        text-align: right;
      }
      .title {
        width: 100%;
        text-align: left;
        margin: 0 5px;
        font-size: clamp(13px, 1vw, 16px);
      }

      // .mynav a,
      // .target {
      //   transition: all 0.35s ease-in-out;
      // }
    }
  }
  .target {
    position: absolute;
    border-left: 2px solid transparent;
    z-index: 2;
    display: block;
    // transform: translateX(-60px);

    &.smooth {
      transition: all 0.3s ease-in-out;
    }
    &.resize {
      display: none;
    }
  }
}
</style>

