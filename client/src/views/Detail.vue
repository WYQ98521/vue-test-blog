<template>
  <div class="container layout">
    <n-button @click="back">返回</n-button>
    <!-- 标题 -->
    <n-h1>{{ blogInfo.title }}</n-h1>
    <!-- 内容 -->
    <div v-html="blogInfo.content"></div>
    <ul>
      <li v-for="item of commentList" :key="item.id">
        {{ item.content }}
      </li>
    </ul>
    <n-input
      v-model:value="addComment.content"
      type="text"
      placeholder="添加评论"
    />
    <n-button type="primary" @click="add"> 提交 </n-button>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const message = inject("message");

const axios = inject("axios");
const router = useRouter();
const route = useRoute();

const blogInfo = ref({});

const commentList = reactive([]);

const addComment = reactive({
  content: "",
});

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
  loadComment();
};

const add = async () => {
  let res = await axios.post("/comment/add", {
    blog_id: blogInfo.value.id,
    content: addComment.content,
  });
  if (res.data.code == 200) {
    loadComment();
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }
};

const loadComment = async () => {
  let commentRes = await axios.post("/comment/article", {
    blog_id: blogInfo.value.id,
  });
  commentList.splice(0);
  commentList.push(...commentRes.data.data);
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
