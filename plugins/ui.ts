export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()
  if (!colorMode.preference) {
    colorMode.preference = 'system'
  }

  return {
    provide: {
      cardy: {
        appName: 'Cardy'
      }
    }
  }
}) 