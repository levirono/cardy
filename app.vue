<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { name: 'theme-color', content: '#ffffff' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'Cardy' },
  ],
  link: [
    { rel: 'manifest', href: '/manifest.json' },
    { rel: 'icon', href: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { rel: 'icon', href: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { rel: 'apple-touch-icon', href: '/icon-192.png' },
  ]
})

// Register service worker
if (process.client) {
  onMounted(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  });
}
</script>

<template>
  <ColorScheme>
    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </NuxtLayout>
  </ColorScheme>
</template>
