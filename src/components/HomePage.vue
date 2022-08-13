<template>
  <div class="home">
    <div class="left" v-if="!setMobile">
      <SideNav
        :nav="nav"
        :windowWidth="width"
        :windowHeight="height"
        @current-obj="routeLink"
        @open-settings="openSettings"
      />
    </div>
    <div class="middle">
      <!-- <MainBit /> -->
      <router-view
        :mobile="setMobile"
        :data="props.data"
        :ready="props.ready"
        @open-settings="openSettings"
      />
      <div class="bottom">
        <BottomNav
          v-if="setMobile"
          :nav="nav"
          :windowWidth="width"
          :windowHeight="height"
          @current-obj="routeLink"
        />
      </div>
    </div>
    <div class="right" v-if="!setMobile">
      <!-- <div class="right" v-if="!setMobile && router.currentRoute.value.path == '/'"> -->
      <ThisWeek
        v-if="props.ready"
        :mobile="setMobile"
        :data="props.data"
        :ready="props.ready"
        :windowWidth="width"
        :windowHeight="height"
      />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SideNav from "@/components/SideNav.vue";
import BottomNav from "@/components/BottomNav.vue";
import MainBit from "@/views/DashboardView.vue";
import ThisWeek from "@/components/ThisWeek.vue";
import { useWindowSize } from "vue-window-size";
import { watch } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";

export default {
  name: "HomeView",
  components: {
    SideNav,
    BottomNav,
    MainBit,
    ThisWeek,
  },
  emits: ["openSettings"],
  props: ["nav", "data", "ready"],
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

    // onMounted(() => console.log(setMobile));
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
    };
  },
};
</script>

<style lang="scss" scoped>
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
  }
}

// .left {
//   background: black;
// }
</style>
