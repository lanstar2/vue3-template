<template>
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
    </router-view>
  <ModalsContainer />
</template>
<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'
</script>

<style></style>
