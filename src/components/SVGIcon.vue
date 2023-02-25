<template>
  <svg
    id="check"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 100"
    xml:space="preserve"
  >
    <circle id="circle" cx="50" cy="50" r="46" fill="transparent" />
    <polyline id="tick" points="25,55 45,70 75,33" fill="transparent" />
  </svg>
  <svg style="width: 70px; height: 70px">
    <use href="#check" />
  </svg>
</template>

<script>
export default {
  setup(props) {
    const svg = document.getElementById("check");
    svg.classList.add("progress");
    // setInterval(() => {
    //   svg.classList.toggle("progress");
    //   svg.classList.toggle("ready");
    // }, 3000);
  },
};
</script>

<style scoped>
#tick {
  stroke: #63bc01;
  stroke-width: 6;
  transition: all 1s;
}

#circle {
  stroke: #63bc01;
  stroke-width: 6;
  transform-origin: 50px 50px 0;
  transition: all 1s;
}

.progress #tick {
  opacity: 0;
}

.ready #tick {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 8s ease-out forwards;
}

.progress #circle {
  stroke: #4c4c4c;
  stroke-dasharray: 314;
  stroke-dashoffset: 1000;
  animation: spin 3s linear infinite;
}

.ready #circle {
  stroke-dashoffset: 66;
  stroke: #63bc01;
}

#circle {
  stroke-dasharray: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
    stroke-dashoffset: 66;
  }
  50% {
    transform: rotate(540deg);
    stroke-dashoffset: 314;
  }
  100% {
    transform: rotate(1080deg);
    stroke-dashoffset: 66;
  }
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

#check {
  width: 300px;
  height: 300px;
}

body {
  margin: 50px;
  align-items: center;
  justify-content: space-around;
  background: #e7e7e7;
  display: flex;
  flex-wrap: wrap;
}
</style>