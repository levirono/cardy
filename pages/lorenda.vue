<template>
  <div class="stage" @mousemove="handleMouseMove">
    <!-- ambient sky -->
    <div class="sky" :style="skyStyle"></div>

    <!-- continuous falling flowers, present on every stage -->
    <div class="petals-layer" aria-hidden="true">
      <span v-for="p in petals" :key="'petal-' + p.id" class="petal" :style="p.style">{{ p.emoji }}</span>
    </div>

    <!-- ============ SCENE 1 : ENVELOPE ============ -->
    <transition name="scene-fade">
      <div v-if="stage === 'envelope'" class="envelope-scene">
        <div
          class="envelope"
          :class="{ opened: envelopeOpening }"
          @click="openEnvelope"
          role="button"
          tabindex="0"
          aria-label="Open envelope"
          @keyup.enter="openEnvelope"
        >
          <div class="envelope-back"></div>
          <div class="letter" :class="{ rise: envelopeOpening }">
            <p class="letter-line">For&nbsp;Lorenda</p>
          </div>
          <div class="envelope-front"></div>
          <div class="envelope-flap" :class="{ open: envelopeOpening }"></div>
          <div class="wax-seal">L</div>
        </div>
        <p class="hint" :class="{ hide: envelopeOpening }">tap the envelope to open your surprise</p>
      </div>
    </transition>

    <!-- ============ SCENE 2 : MAIN CELEBRATION ============ -->
    <transition name="scene-fade">
      <div v-if="stage === 'main'" class="main-scene">
        <header class="hero">
          <p class="eyebrow">a little something made for you, by Lawi</p>
          <h1 class="title" aria-label="Happy Birthday">
            <span
              v-for="(letter, i) in titleLetters"
              :key="'t-' + i"
              class="letter-anim"
              :style="{ animationDelay: i * 0.05 + 's' }"
              >{{ letter === ' ' ? '\u00A0' : letter }}</span
            >
          </h1>
          <p class="name-reveal">
            Happy Birthday, <span class="script-name">Lorenda</span> <span class="cake">🎂</span>
          </p>
        </header>

        <section class="card-section">
          <p class="section-label"> tap the card to open your message </p>
          <div
            class="flip-card"
            :class="{ flipped: card.flipped }"
            @click="flipCard"
            role="button"
            tabindex="0"
            @keyup.enter="flipCard"
          >
            <div class="flip-inner">
              <div class="flip-front">
                <span class="card-emoji">💌</span>
                <span class="card-label">Open Me</span>
                <span class="card-tap">tap</span>
              </div>
              <div class="flip-back">
                <span class="card-back-icon">🌷</span>
                <p>{{ card.message }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="finale-section">
          <transition name="pop-fade">
            <button
              v-if="!surpriseTriggered"
              class="surprise-btn"
              :class="{ ready: card.flipped }"
              @click="triggerSurprise"
            >
              <span class="btn-icon">🎁</span>
              <span>{{ card.flipped ? 'open your final surprise' : 'open the card first…' }}</span>
            </button>
          </transition>

          <transition name="finale-fade">
            <div v-if="surpriseTriggered" class="finale">
              <div class="balloons" aria-hidden="true">
                <span v-for="b in balloons" :key="'b-' + b.id" class="balloon" :style="b.style">🎈</span>
              </div>
              <div class="confetti-layer" aria-hidden="true">
                <span v-for="c in confetti" :key="'c-' + c.id" class="confetti-piece" :style="c.style"></span>
              </div>

              <h2 class="finale-title">
                <span>🎉</span> Happy Birthday, Lorenda <span>🎉</span>
              </h2>
              <p class="signature">
                with all my love, always 
                <span class="script-name small">Lawi</span>
                <span class="heart">💛</span>
              </p>
            </div>
          </transition>
        </section>

        <footer class="page-footer">
          <span>made with 🌷 for the most wonderful Lorenda</span>
        </footer>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

/* ---------------------------------------------------------
   STAGE CONTROL
--------------------------------------------------------- */
const stage = ref('envelope') // 'envelope' -> 'main'
const envelopeOpening = ref(false)

function openEnvelope() {
  if (envelopeOpening.value) return
  envelopeOpening.value = true
  setTimeout(() => {
    stage.value = 'main'
  }, 1100)
}

/* ---------------------------------------------------------
   TITLE LETTER-BY-LETTER REVEAL
--------------------------------------------------------- */
const titleLetters = 'Happy Birthday'.split('')

/* ---------------------------------------------------------
   RANDOM HELPERS
--------------------------------------------------------- */
function rand(min, max) {
  return Math.random() * (max - min) + min
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/* ---------------------------------------------------------
   FALLING FLOWERS (continuous ambient layer)
--------------------------------------------------------- */
const petalEmojis = ['🌸', '🌺', '🌷', '🌼', '💮', '🏵️', '🌹']

const petals = Array.from({ length: 30 }).map((_, i) => {
  const duration = rand(9, 18)
  const delay = rand(0, 18)
  const left = rand(0, 100)
  const size = rand(14, 28)
  const sway = rand(-70, 70)
  const rotate = rand(-360, 360)
  return {
    id: i,
    emoji: pick(petalEmojis),
    style: {
      left: left + '%',
      fontSize: size + 'px',
      animationDuration: duration + 's',
      animationDelay: -delay + 's',
      '--sway': sway + 'px',
      '--rotate': rotate + 'deg',
    },
  }
})

/* ---------------------------------------------------------
   SUBTLE MOUSE PARALLAX ON THE SKY
--------------------------------------------------------- */
const mouse = reactive({ x: 50, y: 50 })
function handleMouseMove(e) {
  const w = window.innerWidth || 1
  const h = window.innerHeight || 1
  mouse.x = (e.clientX / w) * 100
  mouse.y = (e.clientY / h) * 100
}
const skyStyle = computed(() => ({
  backgroundPosition: `${50 + (mouse.x - 50) * 0.08}% ${50 + (mouse.y - 50) * 0.08}%`,
}))

/* ---------------------------------------------------------
   THE ONE MAIN MESSAGE CARD
--------------------------------------------------------- */
const card = reactive({
  flipped: false,
  message:
    "Today is all about you, Lorenda. I hope it's filled with laughter, love, and every little thing that makes you happy. Thank you for being exactly who you are  I'm endlessly grateful to know you. Here's to another beautiful year ahead!",
})

function flipCard() {
  card.flipped = !card.flipped
}

/* ---------------------------------------------------------
   FINAL SURPRISE: CONFETTI + BALLOONS
--------------------------------------------------------- */
const surpriseTriggered = ref(false)
const balloons = ref([])
const confetti = ref([])

const confettiColors = ['#E8607A', '#D9A441', '#F2A6B7', '#5FA085', '#FFFFFF', '#9B6FCE']

function triggerSurprise() {
  if (!card.flipped || surpriseTriggered.value) return

  balloons.value = Array.from({ length: 10 }).map((_, i) => {
    const left = rand(4, 92)
    const duration = rand(7, 12)
    const delay = rand(0, 2.5)
    const size = rand(34, 54)
    return {
      id: i,
      style: {
        left: left + '%',
        fontSize: size + 'px',
        animationDuration: duration + 's',
        animationDelay: delay + 's',
      },
    }
  })

  confetti.value = Array.from({ length: 70 }).map((_, i) => {
    const left = rand(0, 100)
    const duration = rand(3, 6)
    const delay = rand(0, 2)
    const size = rand(6, 12)
    const color = pick(confettiColors)
    const rotate = rand(0, 360)
    return {
      id: i,
      style: {
        left: left + '%',
        width: size + 'px',
        height: size * 0.4 + 'px',
        background: color,
        animationDuration: duration + 's',
        animationDelay: delay + 's',
        transform: `rotate(${rotate}deg)`,
      },
    }
  })

  surpriseTriggered.value = true
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Dancing+Script:wght@600;700&family=Nunito+Sans:wght@400;600;700&display=swap');

:root {
  --cream: #fff8f0;
  --cream-deep: #fdeee0;
  --plum: #3a2233;
  --gold: #c98a2c;
  --rose: #e8607a;
  --rose-deep: #c94f68;
  --sage: #4d8a72;
  --ink: #3a2233;
}

* {
  box-sizing: border-box;
}

.stage {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  font-family: 'Nunito Sans', sans-serif;
  color: var(--ink);
  background: var(--cream);
}

/* ---------- ambient sky : light, warm, airy ---------- */
.sky {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: radial-gradient(circle at 30% 20%, #fff2e4 0%, #ffe4ee 40%, #ffe9d6 75%, #fff8f0 100%);
  background-size: 140% 140%;
  transition: background-position 0.4s ease-out;
}

/* ---------- falling flowers ---------- */
.petals-layer {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
}
.petal {
  position: absolute;
  top: -8%;
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform, opacity;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.12));
}
@keyframes fall {
  0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
  8% { opacity: 0.95; }
  100% { transform: translateY(112vh) translateX(var(--sway)) rotate(var(--rotate)); opacity: 0.85; }
}

/* ---------- shared scene layout ---------- */
.envelope-scene,
.main-scene {
  position: relative;
  z-index: 5;
}

.scene-fade-enter-active,
.scene-fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.scene-fade-enter-from,
.scene-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* ============ ENVELOPE SCENE ============ */
.envelope-scene {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 24px;
}

.envelope {
  position: relative;
  width: min(300px, 80vw);
  height: 190px;
  cursor: pointer;
  perspective: 1200px;
}
.envelope:hover .envelope-flap:not(.open) {
  transform: rotateX(-8deg);
}
.envelope-back {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--rose), var(--rose-deep));
  box-shadow: 0 25px 55px rgba(201, 79, 104, 0.35);
}
.letter {
  position: absolute;
  left: 8%;
  top: -6px;
  width: 84%;
  height: 92%;
  border-radius: 6px;
  background: var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(14%);
  transition: transform 1s cubic-bezier(0.22, 0.85, 0.25, 1);
  box-shadow: 0 12px 26px rgba(58, 34, 51, 0.2);
  z-index: 1;
}
.letter.rise {
  transform: translateY(-78%) scale(1.02);
}
.letter-line {
  font-family: 'Dancing Script', cursive;
  font-size: clamp(22px, 5vw, 30px);
  color: var(--plum);
  text-align: center;
  padding: 0 12px;
}
.envelope-flap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 52%;
  background: linear-gradient(135deg, var(--rose-deep), #b23f57);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top center;
  transition: transform 1s cubic-bezier(0.22, 0.85, 0.25, 1);
  z-index: 3;
}
.envelope-flap.open {
  transform: rotateX(180deg);
}
.envelope-front {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 62%;
  background: linear-gradient(135deg, var(--rose), var(--rose-deep));
  clip-path: polygon(0 100%, 100% 100%, 100% 28%, 50% 66%, 0 28%);
  z-index: 2;
  border-radius: 0 0 10px 10px;
}
.wax-seal {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, var(--gold), #a5691a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cream);
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: 22px;
  z-index: 4;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
}
.envelope.opened .wax-seal {
  animation: seal-pop 0.5s ease forwards;
}
@keyframes seal-pop {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
}

.hint {
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rose-deep);
  opacity: 0.85;
  animation: pulse 2s ease-in-out infinite;
  transition: opacity 0.4s ease;
}
.hint.hide {
  opacity: 0;
}
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* ============ MAIN SCENE ============ */
.main-scene {
  min-height: 100vh;
  padding: 90px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 70px;
}

.hero {
  text-align: center;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.eyebrow {
  font-size: 13px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 700;
}
.title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(38px, 9vw, 84px);
  line-height: 1.05;
  margin: 0;
  color: var(--plum);
}
.letter-anim {
  display: inline-block;
  opacity: 0;
  transform: translateY(24px) rotate(6deg);
  animation: letter-in 0.6s cubic-bezier(0.2, 0.9, 0.25, 1) forwards;
}
@keyframes letter-in {
  to { opacity: 1; transform: translateY(0) rotate(0deg); }
}
.name-reveal {
  font-size: clamp(18px, 3.4vw, 26px);
  color: var(--rose-deep);
  font-weight: 600;
}
.script-name {
  font-family: 'Dancing Script', cursive;
  font-size: 1.5em;
  color: var(--gold);
  font-weight: 700;
}
.script-name.small {
  font-size: 1.3em;
}
.cake {
  display: inline-block;
  animation: sway 2.2s ease-in-out infinite;
}
@keyframes sway {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}

/* ---------- the one message card ---------- */
.card-section {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.section-label {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-size: 18px;
  color: var(--sage);
  letter-spacing: 0.03em;
}
.flip-card {
  width: 100%;
  height: 260px;
  perspective: 1200px;
  cursor: pointer;
}
.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.7s cubic-bezier(0.2, 0.85, 0.25, 1);
  transform-style: preserve-3d;
}
.flip-card:hover .flip-inner {
  transform: translateY(-4px) scale(1.02);
}
.flip-card.flipped .flip-inner {
  transform: rotateY(180deg);
}
.flip-front,
.flip-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 26px;
  text-align: center;
}
.flip-front {
  background: linear-gradient(150deg, #ffffff, var(--cream-deep));
  border: 1px solid rgba(201, 138, 44, 0.35);
  box-shadow: 0 18px 40px rgba(58, 34, 51, 0.12);
  gap: 10px;
}
.card-emoji {
  font-size: 46px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.12));
}
.card-label {
  font-family: 'Fraunces', serif;
  font-size: 20px;
  color: var(--rose-deep);
}
.card-tap {
  margin-top: 6px;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.8;
}
.flip-back {
  background: linear-gradient(150deg, var(--rose), var(--rose-deep));
  transform: rotateY(180deg);
  color: var(--plum);
  gap: 12px;
  box-shadow: 0 18px 40px rgba(201, 79, 104, 0.3);
}
.card-back-icon {
  font-size: 26px;
}
.flip-back p {
  font-size: 16px;
  line-height: 1.55;
  font-weight: 600;
  margin: 0;
}

/* ---------- finale ---------- */
.finale-section {
  position: relative;
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 160px;
}
.surprise-btn {
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.02em;
  color: var(--ink);
  background: linear-gradient(135deg, var(--gold), #e0a83f);
  border: none;
  padding: 16px 30px;
  border-radius: 999px;
  cursor: not-allowed;
  opacity: 0.55;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 26px rgba(201, 138, 44, 0.25);
  transition: all 0.35s ease;
}
.surprise-btn.ready {
  cursor: pointer;
  opacity: 1;
  animation: btn-glow 1.8s ease-in-out infinite;
}
.surprise-btn.ready:hover {
  transform: translateY(-3px) scale(1.03);
}
@keyframes btn-glow {
  0%, 100% { box-shadow: 0 10px 26px rgba(201, 138, 44, 0.35); }
  50% { box-shadow: 0 14px 40px rgba(201, 138, 44, 0.6); }
}
.btn-icon {
  font-size: 20px;
}

.pop-fade-enter-active { transition: all 0.4s ease; }
.pop-fade-leave-active { transition: all 0.3s ease; }
.pop-fade-enter-from { opacity: 0; transform: scale(0.9); }
.pop-fade-leave-to { opacity: 0; transform: scale(0.9); }

.finale-fade-enter-active { transition: all 0.8s cubic-bezier(0.2, 0.85, 0.25, 1); }
.finale-fade-enter-from { opacity: 0; transform: scale(0.92) translateY(20px); }

.finale {
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 20px;
}
.finale-title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  font-size: clamp(26px, 5vw, 40px);
  color: var(--plum);
}
.signature {
  margin-top: 6px;
  font-size: 16px;
  color: var(--gold);
}
.heart {
  display: inline-block;
  animation: heartbeat 1.3s ease-in-out infinite;
}
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.25); }
}

/* balloons */
.balloons {
  position: absolute;
  inset: -40px 0 auto 0;
  height: 0;
  pointer-events: none;
}
.balloon {
  position: absolute;
  bottom: -60px;
  animation-name: rise;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
  filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.15));
}
@keyframes rise {
  0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  50% { transform: translateY(-55vh) translateX(20px) rotate(6deg); }
  100% { transform: translateY(-110vh) translateX(-15px) rotate(-6deg); opacity: 0; }
}

/* confetti */
.confetti-layer {
  position: fixed;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  overflow: hidden;
}
.confetti-piece {
  position: absolute;
  top: -5%;
  border-radius: 2px;
  animation-name: confetti-fall;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
}
@keyframes confetti-fall {
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(110vh) rotate(540deg); opacity: 0.9; }
}

.page-footer {
  font-size: 12px;
  opacity: 0.55;
  letter-spacing: 0.05em;
  padding-bottom: 10px;
  color: var(--plum);
}

/* ---------- reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .petal,
  .letter-anim,
  .cake,
  .heart,
  .balloon,
  .confetti-piece,
  .hint,
  .surprise-btn.ready {
    animation: none !important;
  }
  .flip-inner,
  .letter,
  .envelope-flap {
    transition: none !important;
  }
}

/* ---------- responsive ---------- */
@media (max-width: 480px) {
  .main-scene {
    padding-top: 60px;
    gap: 50px;
  }
  .flip-card {
    height: 300px;
  }
}
</style>