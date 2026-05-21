<!-- @datetime 2026-05-21 00:00:00 @model GLM-5.1 -->
<script setup lang="ts">
const toaster = { position: 'top-center' as const }
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
