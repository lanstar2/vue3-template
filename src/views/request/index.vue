<script setup lang="ts">
import { useRequest } from '/@/hooks'
import { getAddrs } from '/@/api/index'
const { data, loading, run, runParams } = useRequest(getAddrs, {
  apiKey: import.meta.env.VITE_APP_KEY,
})
console.log(data, loading, run)
const handleAgainRequest = () => {
  // 手动调用
  runParams({ apiKey: import.meta.env.VITE_APP_KEY })
}
</script>

<template>
  <button @click="handleAgainRequest">
    重新请求
  </button>

  <div>{{ loading }}</div>
  <div>{{ data }}</div>
</template>

<style scoped></style>
