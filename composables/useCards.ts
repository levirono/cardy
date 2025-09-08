type MediaType = 'image' | 'video' | 'animation' | 'text'

export interface Card {
  id: string
  title: string
  recipientName: string
  message: string
  mediaType: MediaType
  mediaUrl?: string
  unlockAt?: string // ISO string
  isLocked: boolean
  key?: string
  createdAt: string
  openedAt?: string
}

export interface PrintRequest {
  id: string
  cardId: string
  recipientName: string
  addressLine: string
  wrapStyle: 'classic' | 'festive' | 'minimal'
  note?: string
  createdAt: string
}

const CARDS_KEY = 'cardy.cards'
const PRINTS_KEY = 'cardy.printRequests'

function isClient() {
  return typeof window !== 'undefined'
}

function load<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  if (!isClient()) return
  localStorage.setItem(key, JSON.stringify(value))
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // @ts-expect-error randomUUID available in modern browsers
    return crypto.randomUUID()
  }
  return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function useCards() {
  const runtimeConfig = useRuntimeConfig()
  const route = useRoute()

  function listCards(): Card[] {
    return load<Card[]>(CARDS_KEY, [])
  }

  function getCardById(id: string): Card | undefined {
    return listCards().find(c => c.id === id)
  }

  function createCard(input: Omit<Card, 'id' | 'createdAt' | 'openedAt'>): Card {
    const card: Card = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    const cards = listCards()
    cards.unshift(card)
    save(CARDS_KEY, cards)
    return card
  }

  function deleteCard(id: string) {
    const cards = listCards().filter(c => c.id !== id)
    save(CARDS_KEY, cards)
  }

  function markOpened(id: string) {
    const cards = listCards()
    const idx = cards.findIndex(c => c.id === id)
    if (idx !== -1) {
      cards[idx].openedAt = new Date().toISOString()
      save(CARDS_KEY, cards)
    }
  }

  function canOpen(card: Card, providedKey?: string): { ok: boolean, reason?: string } {
    // Check date/time gate
    if (card.unlockAt) {
      const now = Date.now()
      const target = Date.parse(card.unlockAt)
      if (isFinite(target) && now < target) {
        return { ok: false, reason: 'scheduled' }
      }
    }
    // Check lock
    if (card.isLocked) {
      if (!card.key) return { ok: false, reason: 'locked' }
      if (!providedKey || providedKey !== card.key) return { ok: false, reason: 'locked' }
    }
    return { ok: true }
  }

  function buildShareUrl(id: string, key?: string) {
    const base = (isClient() ? window.location.origin : '') || runtimeConfig.public?.appBase || ''
    const url = new URL(`/card/${id}`, base || 'http://localhost')
    if (key) url.searchParams.set('k', key)
    return url.toString()
  }

  function listPrintRequests(): PrintRequest[] {
    return load<PrintRequest[]>(PRINTS_KEY, [])
  }

  function addPrintRequest(input: Omit<PrintRequest, 'id' | 'createdAt'>): PrintRequest {
    const request: PrintRequest = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
    const all = listPrintRequests()
    all.unshift(request)
    save(PRINTS_KEY, all)
    return request
  }

  return {
    listCards,
    getCardById,
    createCard,
    deleteCard,
    markOpened,
    canOpen,
    buildShareUrl,
    listPrintRequests,
    addPrintRequest,
  }
} 