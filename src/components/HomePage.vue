<template>
  <div class="home">
    <div class="left" v-if="!setMobile">
      <SideNav :nav="nav" :windowWidth="width" :windowHeight="height" />
    </div>
    <div class="middle">
      <!-- <MainBit /> -->
      <router-view />
    </div>
    <div class="right" v-if="!setMobile">
      <ThisWeek />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import SideNav from "@/components/SideNav.vue";
import MainBit from "@/views/DashboardView.vue";
import ThisWeek from "@/components/ThisWeek.vue";
import { useWindowSize } from "vue-window-size";
import { watch } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";

export default {
  name: "HomeView",
  components: {
    SideNav,
    MainBit,
    ThisWeek,
  },
  setup() {
    const setMobile = ref(false);
    const { width, height } = useWindowSize();
    const nav = ref([
      { title: "Dashboard", link: "/", icon: "la-border-all", current: true },
      { title: "Map", link: "/map", icon: "la-map-marked", current: false },
      {
        title: "Saved Location",
        link: "/saved",
        icon: "la-hdd",
        current: false,
      },
      {
        title: "Calendar",
        link: "/calendar",
        icon: "la-calendar",
        current: false,
      },
    ]);
    watch(width, (width) => {
      width < 600 ? (setMobile.value = true) : (setMobile.value = false);
    });

    // onMounted(() => console.log(setMobile));
    return { width, height, setMobile, nav };
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: grid;
  grid-template-columns: minmax(150px, 2fr) 6fr 3fr;
  grid-gap: 2px;
  height: 100%;
}

// .middle {
//   background-image: url("")
// }

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
