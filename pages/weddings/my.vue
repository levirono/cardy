<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Weddings</h1>
        <p class="text-gray-500 mt-1">Manage your wedding invitations</p>
      </div>
      <NuxtLink to="/weddings/create" class="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold text-sm shadow hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2">
        + New Wedding
      </NuxtLink>
    </div>

    <div v-if="loading" class="grid sm:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="h-52 bg-gray-100 rounded-2xl animate-pulse"></div>
    </div>

    <div v-else-if="weddings.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">💍</div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">No weddings yet</h2>
      <p class="text-gray-500 mb-8">Create your first wedding invitation page</p>
      <NuxtLink to="/weddings/create" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-semibold shadow">
        Plan Your Wedding
      </NuxtLink>
    </div>

    <div v-else class="grid sm:grid-cols-2 gap-6">
      <div v-for="w in weddings" :key="w.id" class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden">
        <!-- Cover -->
        <div class="h-36 relative" :style="{ background: w.cover_image_url ? `url(${w.cover_image_url}) center/cover` : `linear-gradient(135deg, ${w.theme_color || '#d4a5a5'}88, ${w.theme_color || '#d4a5a5'})` }">
          <div class="absolute inset-0 bg-black/20 flex items-center justify-center">
            <h3 class="text-white text-xl font-bold text-center drop-shadow">{{ w.couple_name_1 }} & {{ w.couple_name_2 }}</h3>
          </div>
          <div class="absolute top-3 right-3">
            <span class="text-xs px-2.5 py-1 rounded-full font-medium shadow-sm" :class="w.is_published ? 'bg-green-500 text-white' : 'bg-white/90 text-gray-600'">
              {{ w.is_published ? '● Live' : '○ Draft' }}
            </span>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
            {{ fmtDate(w.wedding_date) }}
          </div>
          <div v-if="w.venue_name" class="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
            {{ w.venue_name }}
          </div>
          <div class="flex gap-2">
            <NuxtLink :to="`/weddings/${w.slug}`"
              class="flex-1 py-2 text-center text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors">
              View Page
            </NuxtLink>
            <button @click="copyLink(w.slug)"
              class="flex-1 py-2 text-center text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              Copy Link
            </button>
            <button @click="confirmDelete(w.id)"
              class="w-10 py-2 text-center text-sm text-red-400 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
              <svg class="w-4 h-4 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Wedding } from '~/types'
definePageMeta({ middleware: 'auth' })
useHead({ title: 'My Weddings' })

const { fetchMyWeddings, deleteWedding } = useWeddings()
const toast = useToast()
const weddings = ref<Wedding[]>([])
const loading = ref(true)

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

const copyLink = async (slug: string) => {
  await navigator.clipboard.writeText(`${window.location.origin}/weddings/${slug}`)
  toast.add({ title: 'Link copied!', color: 'success' })
}

const confirmDelete = async (id: string) => {
  if (!confirm('Delete this wedding? All RSVPs and wishes will be lost.')) return
  const { error } = await deleteWedding(id)
  if (error) { toast.add({ title: 'Error', description: error.message, color: 'error' }); return }
  weddings.value = weddings.value.filter(w => w.id !== id)
  toast.add({ title: 'Wedding deleted', color: 'neutral' })
}

onMounted(async () => {
  const { data } = await fetchMyWeddings()
  weddings.value = data
  loading.value = false
})
</script>
