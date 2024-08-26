<script setup>
import {ref} from 'vue';
import request from "@/request.js";
let requestUrl = "http://localhost:19090";
let filePath = "/file/common";
let aPath = "/a/";
let url = ref('');
let shortUrl = ref('');

function success(file){
  url.value = file.msg;
}
function createShortChain(){
  request({
    url: "/shortChain",
    method: "post",
    data:{
      longChain: url.value
    }
  }).then((result) => {
    shortUrl.value = result.msg;
  })
}
</script>

<template>
  <div>
    <el-upload
        class="upload-demo"
        drag
        action="http://localhost:19090/common/upload"
        multiple
        :on-success="success"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500M
        </div>
      </template>
    </el-upload>

    <div>
      <div v-if="url">
        长链: <a :href="requestUrl + filePath+ url" target="_blank">{{requestUrl + filePath + url}}</a>
        <el-button style="margin-left: 20px" @click="createShortChain">生成短链</el-button>
      </div>
      <div v-if="shortUrl">
        短链: <a :href="requestUrl + aPath + shortUrl" target="_blank">{{requestUrl + aPath + shortUrl}}</a>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>
