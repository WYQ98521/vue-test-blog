<template>
  <div class="container">
    <n-button @click="back">返回</n-button>
    <!-- 标题 -->
    <n-h1>{{ blogInfo.title }}</n-h1>
    <!-- 内容 -->
    <div v-html="blogInfo.content"></div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const axios = inject("axios");
const router = useRouter();
const route = useRoute();

const blogInfo = ref({});

const back = () => {
  router.push("/");
};

onMounted(() => {
  loadBlog();
});

const loadBlog = async () => {
  let id = route.query.id;
  let res = await axios.get("/blog/detail?id=" + id);
  blogInfo.value = res.data.rows[0];
};
</script>

<style>
img {
  max-width: 100% !important;
}
</style>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
</style>
