<template>
  <div class="hello">
    <span v-if="user">{{user.Name}}</span>
    <span>111</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useUserStore } from '@/store/modules/user/index';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup() {
    const userStore = useUserStore();

    const _user = computed(() => userStore.user);
    console.log(_user.value); // null

    console.log(_user.value);
    const { user } = storeToRefs(userStore);
    console.log(user.value);
    onMounted(() => {
      // userStore.getLogin();
      // userStore.getLogin();
      // userStore.getLogin();
      // userStore.getLogin();
      // userStore.getLogin();
    });
    return {
      user,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$blue: #26bcf9;
.hello {
  color: $blue;
}
</style>
