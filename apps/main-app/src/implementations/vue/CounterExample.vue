<script setup lang="ts">
import { ref } from 'vue';

const value = ref(0);
</script>

<template>
  <div>
    <button @click="value--">-</button>
    <strong>{{ value }}</strong>
    <button @click="value++">+</button>
  </div>
</template>
