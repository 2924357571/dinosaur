<script setup>
import router from './router';
router.beforeEach((to, from, next) => {
  if(to.path === '/'){
    next({path : '/index'})
  } else {
    next();
  }
});
</script>

<template>
  <router-view/>
</template>

<style scoped>

</style>
