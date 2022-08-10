<template>
<!-- 此组件可自动调节main高度 -->
  <div class="top-middle-bottom-construction">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot name="main"></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
<style lang="scss">
  .top-middle-bottom-construction{
    height: 100%;
    display: flex;
    flex-direction: column;
    main {
      flex:1;
    }
  }
</style>
