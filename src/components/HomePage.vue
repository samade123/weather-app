<template>
  <div class="home" v-if="props.theme == 'old'">
    <div class="left" v-if="!setMobile">
      <SideNav :nav="nav" :windowWidth="width" :windowHeight="height" @current-obj="routeLink"
        @open-settings="openSettings" />
    </div>
    <div class="middle">
      <!-- <MainBit /> -->
      <router-view :mobile="setMobile" :data="props.data" :ready="props.ready" :theme="props.theme"
        @open-settings="openSettings" @city-search="emitSearch" />
      <div class="bottom">
        <BottomNav v-if="setMobile" :nav="nav" :windowWidth="width" :windowHeight="height" @current-obj="routeLink" />
      </div>
    </div>
    <div class="right" v-if="!setMobile">
      <!-- <div class="right" v-if="!setMobile && router.currentRoute.value.path == '/'"> -->
      <ThisWeek v-if="props.ready" :mobile="setMobile" :data="props.data" :ready="props.ready" :windowWidth="width"
        :windowHeight="height" />
    </div>
  </div>

  <router-view v-else :mobile="setMobile" :data="props.data" :ready="props.ready" :theme="props.theme"
    @open-settings="openSettings" @city-search="emitSearch"  />
</template>

<script>
// @ is an alias to /src
// import SideNav from "@/components/SideNav.vue";
// import BottomNav from "@/components/BottomNav.vue";
import MainBit from "@/views/DashboardView.vue";
// import ThisWeek from "@/components/ThisWeek.vue";
import { useWindowSize } from "vue-window-size";
import { watch } from "@vue/runtime-core";
import { defineAsyncComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "HomeView",
  components: {
    SideNav: defineAsyncComponent(() =>
      import("@/components/SideNav.vue")
    ),
    BottomNav: defineAsyncComponent(() =>
      import("@/components/BottomNav.vue")
    ),
    MainBit,
    ThisWeek: defineAsyncComponent(() =>
      import("@/components/ThisWeek.vue")
    ),
  },
  emits: ["currentObj", "openSettings", "citySearch"],
  props: ["nav", "data", "ready", "theme"],
  setup(props, ctx) {
    const setMobile = ref(false);
    const { width, height } = useWindowSize();
    const nav = ref(props.nav);
    const newPage = (linkObj) => {
      console.log(nav.value);
      nav.value.forEach((linkObj) => {
        linkObj.current = false;
      });
      const newVal = nav.value.find((link) => link == linkObj);
      newVal.current = true;
    };
    const router = useRouter();

    const openSettings = () => {
      ctx.emit("openSettings");
    };

    const emitSearch = (e) => {
      console.log("homepage")
      ctx.emit("citySearch", e);
    };

    const routeLink = (linkObj) => {
      ctx.emit("currentObj", linkObj);

      return;
    };
    watch(
      width,
      (width) => {
        width < 600 ? (setMobile.value = true) : (setMobile.value = false);
      },
      { immediate: true }
    );

    watch(props.theme, (newValue, oldValue) => {
      console.log(`Theme changed from ${oldValue} to ${newValue}`)
    })

    return {
      width,
      height,
      setMobile,
      nav,
      newPage,
      routeLink,
      props,
      router,
      openSettings,
      emitSearch,
    };
  },
};
</script>

<style lang="scss" scoped>
:root:has(#theme-old:checked) {
  .home {
    display: grid;
    grid-template-columns: minmax(150px, 2fr) 6fr 3fr;
    grid-gap: 2px;
    height: 100%;
    overflow: hidden;

    .middle {
      // background-image: url("./img/background.jpg")
      overflow: auto;
    }
  }

  .bottom {
    position: fixed;
    bottom: 0;
    // height: 30px;
    width: 100%;
    z-index: 50;
  }

  @media (max-width: 600px) {
    .home {
      grid-template-columns: auto;
      width: 100%;

      .middle {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
      }
    }
  }
}
</style>
