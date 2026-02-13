export function useValentinesApi() {
  const createValentine = async (payload: {
    sender?: string
    recipient: string
    message: string
  }) => {
    try {
      return await $fetch('/api/valentines', {
        method: 'POST',
        body: payload as any,
      })
    } catch (err: any) {
      throw createError({
        statusCode: err?.status || 400,
        statusMessage: err?.data?.message || err?.message || 'Failed to create valentine',
      })
    }
  }

  const fetchValentine = async (id: string) => {
    try {
      return await $fetch(`/api/valentines/${id}`)
    } catch (err: any) {
      throw createError({
        statusCode: err?.status || 404,
        statusMessage: err?.data?.message || err?.message || 'Valentine not found',
      })
    }
  }

  return {
    createValentine,
    fetchValentine,
  }
}
