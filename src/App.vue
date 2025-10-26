<!-- src/App.vue -->
<template>
  <div id="app">
    <ToastContainer />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/UI/ToastContainer.vue'
</script>

<style>
@import '@/styles/global.css';
@import 'animate.css';
</style>