export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, loading, isAdmin } = useAuth()
  if (process.client && !loading.value) {
    if (!isAuthenticated.value) return navigateTo('/login')
    if (!isAdmin.value) return navigateTo('/dashboard')
  }
})
