<template>
  <div class="about">
    {{a}}
    <button>按钮</button>
  </div>
</template>

<script lang="ts" setup>
const a = '123';
</script>

<style lang="scss" scoped>
$blue: #428dfa;
.about {
  > button {
    width: 100px;
    height: 30px;
    cursor: pointer;
    background-color: $blue;
    outline: none;
    border: none;
    color: #fff;
    border-radius: 2px;
    transition: background-color 0.06s ease-in-out;
    $blue: #428dfa !global;
    &:hover, &:focus {
      background-color: lighten($blue, 7.5);
    }
    &:active {
      background-color: darken($blue, 20%)
    }
  }
}
</style>
