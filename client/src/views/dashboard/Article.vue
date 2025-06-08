<template>
  <n-tabs v-model:value="tabValue" justify-content="start" type="line">
    <n-tab-pane name="list" tab="文章列表">
      <div v-for="(blog, index) of blogList" style="margin-bottom: 15px">
        <n-card :title="blog.title">
          {{ blog.content }}
          <template #footer>
            <n-space align="center">
              <div>发布时间:{{ blog.create_time }}</div>
              <n-button @click="toUpate(blog)">修改</n-button>
              <n-button @click="toDelete(blog)">删除</n-button>
            </n-space>
          </template>
        </n-card>
      </div>
      <div>
        <n-space>
          <div v-for="pageNum in pageInfo.pageCount">
            <div>
              <n-button
                @click="toPage(pageNum)"
                :style="'color:' + (pageNum == pageInfo.page ? 'blue' : '')"
                >{{ pageNum }}</n-button
              >
            </div>
          </div>
        </n-space>
      </div>
    </n-tab-pane>
    <n-tab-pane name="add" tab="添加文章">
      <n-form>
        <n-form-item label="标题">
          <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="addArticle.categoryId"
            :options="categoryList"
          ></n-select>
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor v-model="addArticle.content"></rich-text-editor>
        </n-form-item>
        <n-form-item label=""
          ><n-button @click="add">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
    <n-tab-pane name="update" tab="修改">
      <n-form>
        <n-form-item label="标题">
          <n-input
            v-model:value="updateArticle.title"
            placeholder="请输入标题"
          />
        </n-form-item>
        <n-form-item label="分类">
          <n-select
            v-model:value="updateArticle.categoryId"
            :options="categoryList"
          ></n-select>
        </n-form-item>
        <n-form-item label="内容">
          <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
        </n-form-item>
        <n-form-item label=""
          ><n-button @click="update">提交</n-button>
        </n-form-item>
      </n-form>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { AdminStore } from "../../stores/AdminStore";
import { ref, reactive, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import RichTextEditor from "../../components/RichTextEditor.vue";
import { useDialog, useMessage } from "naive-ui";

const axios = inject("axios");
const dialog = inject("dialog");
const message = inject("message");

const router = useRouter();
const route = useRoute();

const adminStore = AdminStore();

const tabValue = ref("list");

const addArticle = reactive({
  title: "",
  categoryId: "请选择",
  content: "hello",
});

const updateArticle = reactive({
  id: 0,
  title: "",
  categoryId: 0,
  content: "",
});

const categoryList = ref([]);
const blogList = ref([]);

const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
});

onMounted(() => {
  loadCategorys();
  loadBlogs();
});

const loadCategorys = async () => {
  let res = await axios.get("/category/list");
  categoryList.value = res.data.data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
};

const loadBlogs = async () => {
  let res = await axios.get(
    `/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`
  );
  let temp_rows = res.data.data.rows;
  for (let row of temp_rows) {
    if (row.content.length >= 49) {
      row.content += "...";
    }
    let d = new Date(row.create_time);
    row.create_time = `${d.getUTCFullYear()}年${
      d.getMonth() + 1
    }月${d.getDate()}日`;
  }
  blogList.value = temp_rows;
  pageInfo.count = res.data.data.count;
  pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
};

const add = async () => {
  let res = await axios.post("/blog/_token/add", addArticle);
  if (res.data.code == 200) {
    message.info(res.data.msg);
  } else {
    message.error(res.data.msg);
  }
};

const toPage = async (pageNum) => {
  pageInfo.page = pageNum;
  loadBlogs();
};

const toUpate = async (blog) => {
  tabValue.value = "update";
  let res = await axios.get("/blog/detail?id=" + blog.id);
  updateArticle.id = res.data.rows[0].id;
  updateArticle.categoryId = res.data.rows[0].category_id;
  updateArticle.title = res.data.rows[0].title;
  updateArticle.content = res.data.rows[0].content;
};

const update = async () => {
  let res = await axios.put("/blog/_token/update", updateArticle);
  if (res.data.code == 200) {
    message.info(res.data.msg);
    loadBlogs();
  } else {
    message.error(res.data.msg);
  }
  tabValue.value = "list";
};

const toDelete = async (blog) => {
  dialog.warning({
    title: "警告",
    content: "确定删除？",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    onMaskClick: () => {
      message.warning("请确认选项");
    },
    onPositiveClick: async () => {
      let res = await axios.delete("/blog/_token/delete?id=" + blog.id);
      if (res.data.code == 200) {
        message.info(res.data.msg);
        loadBlogs();
      } else {
        message.error(res.data.msg);
      }
    },
  });
};
</script>

<style lang="scss" scoped></style>
