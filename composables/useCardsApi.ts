import type { Card, PrintRequest } from '~/types/ui'

export function useCardsApi() {
  const fetchCards = async () => {
    const { data, error } = await useFetch<Card[]>('/api/cards')
    if (error.value) throw createError({ statusCode: 500, statusMessage: error.value.message })
    return data.value || []
  }

  const fetchCard = async (id: string) => {
    const { data, error } = await useFetch<Card>(`/api/cards/${id}`)
    if (error.value) throw createError({ statusCode: 404, statusMessage: error.value.message })
    return data.value as Card
  }

  const createCard = async (payload: Omit<Card, 'id' | 'createdAt' | 'openedAt'>) => {
    const { data, error } = await useFetch<Card>('/api/cards', {
      method: 'POST',
      body: payload as any,
    })
    if (error.value) throw createError({ statusCode: 400, statusMessage: error.value.message })
    return data.value as Card
  }

  const updateCard = async (id: string, payload: Partial<Card>) => {
    const { data, error } = await useFetch<Card>(`/api/cards/${id}`, {
      method: 'PUT',
      body: payload as any,
    })
    if (error.value) throw createError({ statusCode: 400, statusMessage: error.value.message })
    return data.value as Card
  }

  const deleteCard = async (id: string) => {
    const { error } = await useFetch(`/api/cards/${id}`, { method: 'DELETE' })
    if (error.value) throw createError({ statusCode: 400, statusMessage: error.value.message })
  }

  const addPrintRequest = async (payload: Omit<PrintRequest, 'id' | 'createdAt'>) => {
    const { data, error } = await useFetch<PrintRequest>('/api/prints', {
      method: 'POST',
      body: payload as any,
    })
    if (error.value) throw createError({ statusCode: 400, statusMessage: error.value.message })
    return data.value as PrintRequest
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


