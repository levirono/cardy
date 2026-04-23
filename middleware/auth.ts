export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, loading } = useAuth()
  if (process.client && !loading.value && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})
