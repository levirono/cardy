export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, loading } = useAuth()
  
  // Wait for auth to initialize
  if (loading.value) {
    await new Promise(resolve => {
      const unwatch = watch(loading, (val) => {
        if (!val) {
          unwatch()
          resolve(true)
        }
      })
    })
  }
  
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})

