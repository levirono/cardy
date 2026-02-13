<template>
  <section class="relative h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-red-50 to-rose-100 dark:from-red-950 dark:via-pink-900 dark:to-rose-950">
    <!-- Animated SVG Heart Drawing -->
    <svg 
      v-if="showHeartDrawing && !letterOpened" 
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 opacity-20"
      width="600" 
      height="600" 
      viewBox="0 0 200 200"
    >
      <path
        class="heart-path"
        d="M100,170 C100,170 30,120 30,80 C30,55 45,40 65,40 C80,40 90,50 100,65 C110,50 120,40 135,40 C155,40 170,55 170,80 C170,120 100,170 100,170 Z"
        fill="none"
        stroke="#ff6b9d"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>

    <!-- Floating sparkles -->
    <div
      v-for="sparkle in sparkles"
      :key="'sparkle-' + sparkle.id"
      class="sparkle absolute text-xl"
      :style="sparkle.style"
    >
      ✨
    </div>

    <!-- Falling flowers/petals -->
    <div
      v-for="flower in flowers"
      :key="'flower-' + flower.id"
      class="flower absolute text-3xl"
      :style="flower.style"
    >
      {{ flower.emoji }}
    </div>

    <!-- Rose petals -->
    <div
      v-for="petal in petals"
      :key="'petal-' + petal.id"
      class="petal absolute"
      :style="petal.style"
    >
      🌸
    </div>

    <!-- Floating hearts - NOW FALLING -->
    <div
      v-for="heart in hearts"
      :key="'heart-' + heart.id"
      class="heart absolute text-2xl opacity-60"
      :style="heart.style"
    >
      ❤️
    </div>

    <!-- Butterflies -->
    <div
      v-for="butterfly in butterflies"
      :key="'butterfly-' + butterfly.id"
      class="butterfly absolute text-2xl"
      :style="butterfly.style"
    >
      🦋
    </div>

    <!-- Main letter container -->
    <div class="flex items-center justify-center h-full relative z-10">
      <div 
        v-if="!letterOpened"
        @click="openLetter"
        class="letter-envelope cursor-pointer transform transition-all duration-500 hover:scale-105"
        :class="{ 'opening': isOpening }"
      >
        <div class="envelope-wrapper relative">
          <!-- Pulse ring effect -->
          <div class="absolute inset-0 rounded-full animate-ping-slow opacity-20 bg-red-400"></div>
          
          <!-- Envelope back -->
          <div class="envelope-back absolute w-80 h-52 bg-rose-200 dark:bg-rose-800 rounded-lg shadow-2xl"></div>
          
          <!-- Envelope flap -->
          <div 
            class="envelope-flap absolute w-80 origin-top transition-transform duration-1000"
            :class="{ 'flap-open': isOpening }"
          >
            <div class="w-0 h-0 border-l-[160px] border-r-[160px] border-t-[120px] border-l-transparent border-r-transparent border-t-red-400 dark:border-t-red-700"></div>
          </div>
          
          <!-- Envelope front -->
          <div class="envelope-front absolute w-80 h-52 bg-rose-300 dark:bg-rose-700 rounded-lg shadow-xl flex items-center justify-center border-4 border-red-400/30 dark:border-red-600/30">
            <div class="text-center text-white dark:text-rose-100">
              <p class="text-3xl font-script mb-3 animate-bounce-gentle">💌</p>
              <p class="text-sm font-medium tracking-wide">Click to open your surprise</p>
              <p class="text-xs mt-2 opacity-75">✨ Something special awaits ✨</p>
            </div>
          </div>
          
          <!-- Wax seal with shine effect -->
          <div class="wax-seal absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 dark:from-red-700 dark:to-red-900 rounded-full shadow-lg flex items-center justify-center text-2xl z-10 animate-rotate-slow">
            <div class="shine-effect"></div>
            💕
          </div>
        </div>
      </div>

      <!-- Letter content -->
      <div 
        v-else
        class="letter-content bg-white dark:bg-gray-800 w-[90%] max-w-2xl h-[80vh] max-h-[600px] rounded-lg shadow-2xl p-8 md:p-12 overflow-y-auto animate-unfold relative"
      >
        <!-- Decorative corners -->
        <div class="absolute top-4 left-4 text-2xl opacity-30">🌹</div>
        <div class="absolute top-4 right-4 text-2xl opacity-30">🌹</div>
        <div class="absolute bottom-4 left-4 text-2xl opacity-30">💐</div>
        <div class="absolute bottom-4 right-4 text-2xl opacity-30">💐</div>

        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-5xl font-script text-red-500 dark:text-red-400 mb-4 animate-fade-in">
            Happy Valentine's Day! 💝
          </h1>
          <div class="flex justify-center gap-4 text-4xl animate-pulse-slow">
            🌹 💕 🌹
          </div>
        </div>

        <div class="prose prose-lg dark:prose-invert mx-auto space-y-4 text-gray-700 dark:text-gray-200">
          <p class="text-lg leading-relaxed animate-slide-up font-script text-2xl text-red-500 dark:text-red-400" style="animation-delay: 0.2s">
            {{ greeting }}
          </p>

          <template v-for="(para, idx) in messageParagraphs" :key="idx">
            <p
              class="leading-relaxed animate-slide-up"
              :style="{ 'animation-delay': `${0.4 + idx * 0.2}s` }"
            >
              {{ para }}
            </p>
          </template>

          <div
            class="text-right leading-relaxed animate-slide-up"
            :style="{ 'animation-delay': `${0.4 + messageParagraphs.length * 0.2}s` }"
          >
            {{ closing }}
          </div>
        </div>

        <div class="text-center mt-8 space-x-4">
          <UButton 
            @click="closeAndReplay" 
            variant="outline" 
            class="px-6 py-2 hover:scale-105 transition-transform"
          >
            Close & Replay 🔄
          </UButton>
        </div>
      </div>
    </div>

    <!-- Back home button -->
    <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-4">
      <UButton to="/valentines/create" variant="outline" class="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:scale-105 transition-transform">
        Write your own
      </UButton>
      <UButton to="/" variant="outline" class="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:scale-105 transition-transform">
        Back home
      </UButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useValentinesApi } from '~/composables/useValentinesApi'

interface AnimatedElement {
  id: number
  style: Record<string, string>
  emoji?: string
}

// dynamic content state
const recipient = ref('Valentine')
const sender = ref('')
const message = ref('')

const messageParagraphs = computed(() => {
  return message.value ? message.value.split(/\n{2,}/) : []
})

const greeting = computed(() => {
  if (recipient.value) {
    return `My Dearest ${recipient.value},`
  }
  return 'My Dearest Valentine,'
})
const closing = computed(() => {
  if (sender.value) {
    return `Forever and always,\n${sender.value}`
  }
  return 'Forever and always, Your Valentine ❤️'
})

const { fetchValentine } = useValentinesApi()


const hearts = ref<AnimatedElement[]>([])
const flowers = ref<AnimatedElement[]>([])
const petals = ref<AnimatedElement[]>([])
const sparkles = ref<AnimatedElement[]>([])
const butterflies = ref<AnimatedElement[]>([])
const letterOpened = ref(false)
const isOpening = ref(false)
const showHeartDrawing = ref(false)

const flowerEmojis = ['🌸', '🌺', '🌹', '🌷', '🌼', '💐', '🏵️', '🌻']

// Generate all animations
onMounted(async () => {
  // load data if id present
  const route = useRoute()
  const id = route.query.id as string | undefined
  if (id) {
    try {
      const res: any = await fetchValentine(id)
      if (res) {
        recipient.value = res.recipient || recipient.value
        sender.value = res.sender_name || ''
        message.value = res.message || ''
      }
    } catch (e) {
      console.warn('failed to load valentine', e)
    }
  }

  // Show heart drawing animation
  setTimeout(() => {
    showHeartDrawing.value = true
  }, 500)

  // Hearts - NOW FALLING DOWNWARDS
  for (let i = 0; i < 25; i++) {
    const left = Math.random() * 100
    const delay = Math.random() * 5
    const duration = 5 + Math.random() * 4
    hearts.value.push({
      id: i,
      style: {
        left: `${left}%`,
        animation: `fallDown ${duration}s linear ${delay}s infinite`
      }
    })
  }

  // Flowers - FALLING DOWNWARDS
  for (let i = 0; i < 30; i++) {
    const left = Math.random() * 100
    const delay = Math.random() * 8
    const duration = 6 + Math.random() * 6
    flowers.value.push({
      id: i,
      emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
      style: {
        left: `${left}%`,
        animation: `fallDown ${duration}s linear ${delay}s infinite`
      }
    })
  }

  // Rose petals (smaller and more delicate) - FALLING DOWNWARDS
  for (let i = 0; i < 40; i++) {
    const left = Math.random() * 100
    const delay = Math.random() * 10
    const duration = 8 + Math.random() * 8
    petals.value.push({
      id: i,
      style: {
        left: `${left}%`,
        fontSize: `${12 + Math.random() * 8}px`,
        animation: `driftDown ${duration}s ease-in-out ${delay}s infinite`
      }
    })
  }

  // Sparkles
  for (let i = 0; i < 20; i++) {
    const left = Math.random() * 100
    const top = Math.random() * 100
    const delay = Math.random() * 3
    const duration = 2 + Math.random() * 2
    sparkles.value.push({
      id: i,
      style: {
        left: `${left}%`,
        top: `${top}%`,
        animation: `twinkle ${duration}s ease-in-out ${delay}s infinite`
      }
    })
  }

  // Butterflies
  for (let i = 0; i < 8; i++) {
    const startLeft = Math.random() * 100
    const delay = Math.random() * 5
    const duration = 15 + Math.random() * 10
    butterflies.value.push({
      id: i,
      style: {
        left: `${startLeft}%`,
        animation: `flutter ${duration}s ease-in-out ${delay}s infinite`
      }
    })
  }
})

const openLetter = () => {
  isOpening.value = true
  showHeartDrawing.value = false
  setTimeout(() => {
    letterOpened.value = true
  }, 1000)
}

const closeAndReplay = () => {
  letterOpened.value = false
  isOpening.value = false
  setTimeout(() => {
    showHeartDrawing.value = true
  }, 500)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');

.font-script {
  font-family: 'Dancing Script', cursive;
}

/* Heart drawing animation */
.heart-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-heart 3s ease-in-out forwards, pulse-heart 2s ease-in-out 3s infinite;
}

@keyframes draw-heart {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes pulse-heart {
  0%, 100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.3;
  }
}

/* UPDATED: Hearts and flowers now fall downwards continuously */
@keyframes fallDown {
  0% {
    transform: translateY(-10vh) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: 0.8;
  }
  95% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0;
  }
}

/* UPDATED: Petals drift down with gentle sway */
@keyframes driftDown {
  0% {
    transform: translateY(-10vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: 0.8;
  }
  25% {
    transform: translateY(25vh) translateX(30px) rotate(90deg);
  }
  50% {
    transform: translateY(50vh) translateX(-20px) rotate(180deg);
  }
  75% {
    transform: translateY(75vh) translateX(40px) rotate(270deg);
  }
  95% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(110vh) translateX(10px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes flutter {
  0% {
    transform: translateY(110vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  25% {
    transform: translateY(75vh) translateX(50px) rotate(15deg);
  }
  50% {
    transform: translateY(50vh) translateX(-30px) rotate(-10deg);
  }
  75% {
    transform: translateY(25vh) translateX(70px) rotate(20deg);
  }
  100% {
    transform: translateY(-20vh) translateX(20px) rotate(0deg);
    opacity: 0;
  }
}

@keyframes unfold {
  0% {
    transform: scale(0.8) rotateX(-90deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotateX(0deg);
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes rotate-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.3);
    opacity: 0;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.heart,
.flower,
.petal,
.sparkle,
.butterfly {
  will-change: transform, opacity;
  pointer-events: none;
}

.envelope-wrapper {
  width: 320px;
  height: 208px;
}

.envelope-flap {
  top: 0;
  left: 0;
  z-index: 3;
  transform-origin: top center;
}

.flap-open {
  transform: rotateX(-180deg);
}

.envelope-front {
  z-index: 2;
  top: 30px;
}

.envelope-back {
  z-index: 1;
  top: 30px;
}

.wax-seal {
  position: relative;
  overflow: hidden;
}

.shine-effect {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.animate-unfold {
  animation: unfold 0.8s ease-out;
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out backwards;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}

.animate-rotate-slow {
  animation: rotate-slow 20s linear infinite;
}

.animate-ping-slow {
  animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Scrollbar styling */
.letter-content::-webkit-scrollbar {
  width: 8px;
}

.letter-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.letter-content::-webkit-scrollbar-thumb {
  background: #f87171;
  border-radius: 4px;
}

.letter-content::-webkit-scrollbar-thumb:hover {
  background: #ef4444;
}

/* Dark mode scrollbar */
.dark .letter-content::-webkit-scrollbar-track {
  background: #374151;
}
</style>