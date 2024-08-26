<script setup>
import {ref} from 'vue';
import request from "@/request.js";

let PVNum = ref('');
let UVNum = ref('');

//统计pvuv
statistic();

function statistic(){
  request({
    url: "/pvuv",
    method: "get",
  }).then((res) => {
    PVNum.value = res.pv;
    UVNum.value = res.uv;
  })
}
</script>

<template>
  <div>PV数量: {{PVNum}}</div>
  <div>UV数量: {{UVNum}}</div>
</template>

<style scoped>

</style>
