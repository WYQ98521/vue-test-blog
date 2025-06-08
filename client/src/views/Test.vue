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

login();
</script>
