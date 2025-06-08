<template>
  <div class="container">
    <div class="nav">
      <div @click="toHomePage">首页</div>
      <n-popselect
        @update:value="searchByCategory"
        v-model:value="selectCategory"
        :options="categoryOptions"
        trigger="click"
      >
        <div>
          分类:<span>{{ categoryName }}</span>
        </div>
      </n-popselect>
      <div @click="toDashboard">后台</div>
    </div>
    <n-divider />

    <n-input
      placeholder="请输入关键字"
      v-model:value="pageInfo.keyword"
      style="width: 1150px"
    ></n-input>
    <n-button type="primary" ghost @click="loadBlogs(0)" style="width: 50px"
      >搜索</n-button
    >

    <div
      v-for="(blog, index) of blogList"
      style="margin-bottom: 15px; cursor: pointer"
    >
      <n-card :title="blog.title" @click="toDetail(blog)">
        <div v-html="blog.content"></div>
        <template #footer>
          <n-space align="center">
            <div>发布时间:{{ blog.create_time }}</div>
          </n-space>
        </template>
      </n-card>
    </div>
    <n-pagination
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pageCount"
      @update:page="loadBlogs()"
    />
    <n-divider />
    <div class="footer">
      <div>Power by wyq</div>
      <div>XICP备XXXXX号-1</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const axios = inject("axios");
const dialog = inject("dialog");
const message = inject("message");

const router = useRouter();
const route = useRoute();

const selectCategory = ref(0);
const categoryOptions = ref([]);

const blogList = ref([]);

const searchByCategory = async (categoryId) => {
  pageInfo.categoryId = categoryId;
  loadBlogs();
};

const toDetail = (blog) => {
  router.push({ path: "/detail", query: { id: blog.id } });
};

const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
  keyword: "",
  categoryId: 0,
});

onMounted(() => {
  loadCategorys();
  loadBlogs();
});

const categoryName = computed(() => {
  let selectedOption = categoryOptions.value.find((option) => {
    return option.value == selectCategory.value;
  });
  return selectedOption ? selectedOption.label : "请选择";
});

const loadCategorys = async () => {
  let res = await axios.get("/category/list");
  categoryOptions.value = res.data.data.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
};

const toDashboard = () => {
  router.push("/login");
};
const toHomePage = () => {
  router.push("/");
};

const loadBlogs = async (page = 0) => {
  if (page != 0) {
    pageInfo.page = page;
  }
  let res = await axios.get(
    `/blog/search?categoryId=${pageInfo.categoryId}&keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`
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
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}

.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;
  div {
    cursor: pointer;
    margin-right: 15px;

    &:hover {
      color: #f60;
    }

    span {
      font-size: 12px;
    }
  }
}

.footer {
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
</style>
