<script setup>
import request from "@/request.js";
import SparkMD5 from "spark-md5";
import {ref} from 'vue'

const fileChunkList = ref([])
const haveList = ref([])

function handleBeforeUpload(file) {
  const chunkSize = 1024 * 1024 * 10; // 10MB
  // 计算md5
  md5(file, chunkSize).then(md5 => {
    //检查是否秒传
    request({
      url: "/upload/check/" + md5,
      method: "get",
    }).then(result => {
      const isOk = result.isOk;
      const haveList2 = result.haveList;
      console.log(haveList2);
      if(isOk) {
        console.log("秒传成功");
        return;
      }
      haveList.value = haveList2;
      let chunkIndex = 0;
      //上传第一个分片
      upload(fileChunkList.value, chunkIndex, md5, file);
    })
  });
  return false;
}

function upload(fileChunkList, chunkIndex, md5, file) {
  if(chunkIndex >= fileChunkList.length){
    return;
  }
  if(haveList.value.includes(chunkIndex)){
    upload(fileChunkList, chunkIndex + 1, md5, file);
    return;
  }
  //开始分片上传
  request({
    url: "/upload/shard",
    method: "post",
    data: {
      "file": fileChunkList[chunkIndex],
      "chunkIndex": chunkIndex,
      "md5": md5,
      "totalFileSize": file.size,
      "fileName": file.name
    },
    headers: {
      "Content-Type": "multipart/form-data"
    },
  }).then(result => {
    const isOk = result.isOk;
    if (isOk) {
      console.log("上传成功");
    } else {
      console.log("上传继续");
      upload(fileChunkList, chunkIndex + 1, md5, file);
    }
  })
}

function md5(file, chunkSize) {
  return new Promise((resolve, reject) => {
    let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
    let chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    let spark = new SparkMD5.ArrayBuffer(); //追加数组缓冲区。
    let fileReader = new FileReader(); //读取文件
    fileReader.onload = function (e) {
      spark.append(e.target.result);
      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end());//完成md5的计算，返回十六进制结果。
      }
    };

    fileReader.onerror = function (e) {
      reject(e);
    };

    function loadNext() {
      let start = currentChunk * chunkSize;
      let end = start + chunkSize;
      (end > file.size) && (end = file.size);
      let blob = blobSlice.call(file, start, end);
      fileChunkList.value.push(blob); //分片数据
      fileReader.readAsArrayBuffer(blob);
    }

    loadNext();
  });
}

</script>

<template>
  <div>
    <el-upload
        drag
        action=""
        multiple
        :before-upload="handleBeforeUpload"
    >
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </el-upload>
  </div>
</template>

<style scoped>

</style>
