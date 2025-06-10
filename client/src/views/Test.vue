<template>
  <div>Hello</div>
</template>

<script setup>
import { TestStore } from "../stores/TestStore";
import { inject } from "vue";
import request from "../utils/request";

const axios = inject("axios");

const testStore = new TestStore();

const username = "wff";
const password = "654321";

const login = async () => {
  const res = request.post("/admin/login", {
    account: username,
    password: password,
  });
  console.log(res);
};

let a = [1, 2, 3, 4, 5];
for (let ch of a) {
  console.log(ch);
}

const say = () => {
  console.log("111");
  console.log("222");
  log();
  console.log("555");
};

const log = () => {
  console.log("333");
  console.log("444");
};

say();

login();
</script>
