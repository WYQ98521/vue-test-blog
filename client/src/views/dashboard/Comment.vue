<template>
  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>文章id</th>
        <th>评论内容</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) of commentList">
        <td>{{ item.blog_id }}</td>
        <td>{{ item.content }}</td>
        <td>
          <n-space>
            <n-button @click="delete_Comment(item)">删除</n-button></n-space
          >
        </td>
      </tr>
    </tbody>
  </n-table>

  <template>
    <n-space>
      <n-button @click="handleButtonClick"> 警告 </n-button>
    </n-space>
  </template>
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStore";
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const axios = inject("axios");
const dialog = inject("dialog");
const message = inject("message");

const router = useRouter();
const route = useRoute();
const commentList = ref([]);

onMounted(() => {
  loadDatas();
});

const loadDatas = async () => {
  let res = await axios.get("/comment/list");
  commentList.value = res.data.data;
};

const delete_Comment = async (comment) => {
  dialog.warning({
    title: "警告",
    content: "确定要删除该评论？",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    onMaskClick: () => {
      message.warning("请确认选项");
    },
    onPositiveClick: async () => {
      let res = await axios.delete(`/comment/_token/delete?id=${comment.id}`);
      if (res.data.code == 200) {
        loadDatas();
        message.info(res.data.msg);
      } else {
        message.error(res.data.msg);
      }
    },
  });
};
</script>

<style lang="scss" scoped></style>
