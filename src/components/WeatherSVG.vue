<template>
    <svg viewBox="0 0 100 100">
      <use xlink:href="#svg-icon" />
    </svg>
  </template>
  
  <script>
  import svgIcon from '@/assets/svg/icon.svg';
  
  export default {
    name: 'SvgImage',
    data() {
      return {
        svg: svgIcon,
      };
    },
  };
  </script>
  