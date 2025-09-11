// Extend the UI types to include our custom tokens
declare module '@nuxt/ui' {
  interface UICustomToken {
    gradients?: {
      brand?: string
      surface?: string
      subtle?: string
    }
    rings?: {
      card?: string
    }
  }

  interface UIConfiguration {
    tokens?: UICustomToken
  }
}
