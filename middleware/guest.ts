export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated, loading, defaultRedirect } = useAuth()
  if (process.client && !loading.value && isAuthenticated.value) {
    return navigateTo(defaultRedirect.value)
  }
})
