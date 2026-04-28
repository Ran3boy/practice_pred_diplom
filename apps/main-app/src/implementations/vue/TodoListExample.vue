<script setup lang="ts">
import { ref } from 'vue';

const title = ref('');
const items = ref(['Описать сценарий']);

function addItem() {
  if (!title.value.trim()) return;
  items.value.push(title.value);
  title.value = '';
}
</script>

<template>
  <form @submit.prevent="addItem">
    <input v-model="title" />
    <button>Добавить</button>
    <ul>
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </form>
</template>
