<template>
  <div class="outer">
    <div class="top"></div>
    <div class="middle">
      <div
        class="navigation"
        :class="{ unselected: !link.current }"
        v-for="link in nav"
        :key="link.link"
        @click="routeLink(link.link)"
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
import { useRouter } from "vue-router";

export default {
  props: ["nav"],
  setup(props) {
    // console.log(props.nav[0].title)    
    const router = useRouter()

    const nav = ref(props.nav);
    const returnIconClass = (icon) => {
      const classObj = {};
      classObj[icon] = true;
      return classObj;
    };

    const routeLink = (linkRef) => {
      router.push(linkRef);
      return;
    };
    return { nav, returnIconClass, routeLink };
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
      }
    }
  }
}
</style>

