<script setup lang="ts">
useHead({
  titleTemplate: (title) => (title ? `${title} · Nuxt PWA Starter` : 'Nuxt PWA Starter'),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
