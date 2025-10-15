import type { Card, PrintRequest } from '~/types/ui'

export function useCardsApi() {
  const fetchCards = async () => {
    try {
      return await $fetch<Card[]>('/api/cards')
    } catch (err: any) {
      throw createError({ statusCode: err?.status || 500, statusMessage: err?.data?.message || err?.message || 'Failed to fetch cards' })
    }
  }

  const fetchCard = async (id: string) => {
    try {
      return await $fetch<Card>(`/api/cards/${id}`)
    } catch (err: any) {
      throw createError({ statusCode: err?.status || 404, statusMessage: err?.data?.message || err?.message || 'Card not found' })
    }
  }

  const createCard = async (payload: Omit<Card, 'id' | 'createdAt' | 'openedAt'>) => {
    try {
      return await $fetch<Card>('/api/cards', {
        method: 'POST',
        body: payload as any,
      })
    } catch (err: any) {
      throw createError({ statusCode: err?.status || 400, statusMessage: err?.data?.message || err?.message || 'Failed to create card' })
    }
  }

  const updateCard = async (id: string, payload: Partial<Card>) => {
    try {
      return await $fetch<Card>(`/api/cards/${id}`, {
        method: 'PUT',
        body: payload as any,
      })
    } catch (err: any) {
      throw createError({ statusCode: err?.status || 400, statusMessage: err?.data?.message || err?.message || 'Failed to update card' })
    }
  }

  const deleteCard = async (id: string) => {
    try {
      await $fetch(`/api/cards/${id}`, { method: 'DELETE' })
    } catch (err: any) {
      throw createError({ statusCode: err?.status || 400, statusMessage: err?.data?.message || err?.message || 'Failed to delete card' })
    }
  }

  const addPrintRequest = async (payload: Omit<PrintRequest, 'id' | 'createdAt'>) => {
    try {
      return await $fetch<PrintRequest>('/api/prints', {
        method: 'POST',
        body: payload as any,
      })
    } catch (err: any) {
      throw createError({ statusCode: err?.status || 400, statusMessage: err?.data?.message || err?.message || 'Failed to add print request' })
    }
  }

  return {
    fetchCards,
    fetchCard,
    createCard,
    updateCard,
    deleteCard,
    addPrintRequest,
  }
}


