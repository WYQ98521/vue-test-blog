<template>
  <n-button @click="showAddModal = true">添加</n-button>
  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>编号</th>
        <th>名称</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) of categoryList">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>
          <n-space>
            <n-button @click="toUpdate(item)">修改</n-button>
            <n-button @click="delete_Category(item)">删除</n-button></n-space
          >
        </td>
      </tr>
    </tbody>
  </n-table>

  <n-modal v-model:show="showAddModal">
    <n-card
      style="width: 600px"
      title="添加分类"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div>
        <n-input
          v-model:value="addCategory.name"
          type="text"
          placeholder="请输入分类名"
        ></n-input>
      </div>
      <template #footer>
        <div>
          <n-button @click="add">提交</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>

  <n-modal v-model:show="showUpdateModal">
    <n-card
      style="width: 600px"
      title="修改分类"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div>
        <n-input
          v-model:value="updateCategory.name"
          type="text"
          placeholder="请输入分类名"
        ></n-input>
      </div>
      <template #footer>
        <div>
          <n-button @click="update_Category">提交</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>

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

const adminStore = AdminStore();

const showAddModal = ref(false);
const showUpdateModal = ref(false);
const addCategory = reactive({
  name: "",
});
const updateCategory = reactive({
  id: 0,
  name: "",
});
const categoryList = ref([]);

onMounted(() => {
  loadDatas();
});

const loadDatas = async () => {
  let res = await axios.get("/category/list");
  categoryList.value = res.data.data;
};

const add = async () => {
  let res = await axios.post("/category/_token/add", {
    name: addCategory.name,
  });
  if (res.data.code == 200) {
    loadDatas();
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }
  showAddModal.value = false;
};

const toUpdate = async (category) => {
  showUpdateModal.value = true;
  updateCategory.id = category.id;
  updateCategory.name = category.name;
};

const update_Category = async () => {
  let res = await axios.put("/category/_token/update", {
    id: updateCategory.id,
    name: updateCategory.name,
  });
  if (res.data.code == 200) {
    loadDatas();
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }
  showUpdateModal.value = false;
};

const delete_Category = async (category) => {
  dialog.warning({
    title: "警告",
    content: "确定要删除该分类？",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    onMaskClick: () => {
      message.warning("请确认选项");
    },
    onPositiveClick: async () => {
      let res = await axios.delete(`/category/_token/delete?id=${category.id}`);
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
