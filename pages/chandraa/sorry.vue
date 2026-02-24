<template>
  <section class="root">
    <!-- Stars -->
    <div class="stars-layer">
      <div
        v-for="star in stars"
        :key="'star-' + star.id"
        class="star"
        :style="star.style"
      ></div>
    </div>

    <!-- Teardrops -->
    <div class="teardrops-layer">
      <div
        v-for="drop in drops"
        :key="'drop-' + drop.id"
        class="drop"
        :style="drop.style"
      >{{ drop.emoji }}</div>
    </div>

    <!-- Floating sorry notes -->
    <div
      v-for="note in sorryNotes"
      :key="'note-' + note.id"
      class="note"
      :style="note.style"
    >{{ note.text }}</div>

    <!-- Scene -->
    <div class="scene">

      <!-- Envelope -->
      <div
        v-if="!letterOpened"
        class="envelope-wrap"
        @click="openLetter"
      >
        <div class="seal">💙</div>
        <div class="env-back"></div>
        <div class="env-flap" :class="{ open: isOpening }">
          <div class="env-flap-inner"></div>
        </div>
        <div class="env-front">
          <span class="env-icon">📩</span>
          <span class="env-label">Something I need<br>you to read, My Love</span>
          <span class="env-label" style="font-size:11px;opacity:0.6;">✨ Tap to open ✨</span>
        </div>
      </div>

      <!-- Letter -->
      <div v-else class="letter animate-unfold">
        <span class="letter-corner corner-tl">🌙</span>
        <span class="letter-corner corner-tr">💫</span>
        <span class="letter-corner corner-bl">🌊</span>
        <span class="letter-corner corner-br">💙</span>

        <h1 class="letter-title">I'm So Sorry, My Love</h1>
        <div class="letter-sub">💙🌊💙</div>
        <div class="letter-divider"></div>

        <p class="greeting">My Dearest Love,</p>

        <div class="letter-body">
          <p>
            I owe you a genuine apology, and I need you to know that I mean every word of this from the bottom of my heart.
          </p>
          <p>
            When you asked me about your hair and nails, <strong>I was wrong to dismiss you the way I did.</strong> I hid behind the idea that "it's too soon" but that wasn't really the issue, was it? The truth is, I let my own selfishness speak louder than your feelings. And that hurt you. I see that now.
          </p>
          <p>
            What made it worse is that I didn't let it go. I dragged that conversation on and on, when what you needed was for me to simply <strong>listen, understand, and apologize</strong>. Instead I made you feel unheard, and pushed you to a point where you felt blocking me was the only way to get peace. That breaks my heart.
          </p>
          <p>
            You deserve to be cared for. You deserve to be heard. You deserve a partner who makes you feel valued; especially in the very first days of something new and beautiful. I failed at that, and I'm genuinely, deeply sorry.
          </p>
          <p>
            I don't want to lose what we've just started. <strong>You matter to me</strong>, and I promise to do better: to lead with patience, with kindness, and with a heart that puts you first even as a friend.
          </p>
          <p>
            If you find it in your heart to forgive me, I won't take it for granted. Not for a single day but.
          </p>
        </div>

        <div class="closing">
          Forever sorry and forever yours,<br>
          <strong>Lawi 💙</strong>
        </div>

        <div class="btn-row">
          <button class="btn-replay" @click="replayEnvelope">↩ Close &amp; Replay</button>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface AnimatedElement {
  id: number
  style: Record<string, string>
  emoji?: string
  text?: string
}

const stars = ref<AnimatedElement[]>([])
const drops = ref<AnimatedElement[]>([])
const sorryNotes = ref<AnimatedElement[]>([])

const letterOpened = ref(false)
const isOpening = ref(false)

const dropEmojis = ['💧', '🌊', '💙', '🫧']
const sorryWords = ["I'm sorry...", 'Forgive me', 'My love...', 'I was wrong', 'Please...']

onMounted(() => {
  // Stars
  for (let i = 0; i < 120; i++) {
    const size = Math.random() * 2.5 + 0.5
    stars.value.push({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        '--dur': `${2 + Math.random() * 4}s`,
        '--delay': `${Math.random() * 5}s`,
      }
    })
  }

  // Teardrops
  for (let i = 0; i < 28; i++) {
    drops.value.push({
      id: i,
      emoji: dropEmojis[Math.floor(Math.random() * dropEmojis.length)],
      style: {
        left: `${Math.random() * 100}%`,
        '--size': `${14 + Math.random() * 14}px`,
        '--dur': `${5 + Math.random() * 6}s`,
        '--delay': `${Math.random() * 8}s`,
      }
    })
  }

  // Sorry notes
  for (let i = 0; i < 12; i++) {
    sorryNotes.value.push({
      id: i,
      text: sorryWords[Math.floor(Math.random() * sorryWords.length)],
      style: {
        left: `${Math.random() * 90}%`,
        top: `${10 + Math.random() * 80}%`,
        '--dur': `${6 + Math.random() * 6}s`,
        '--delay': `${Math.random() * 6}s`,
        '--rot': `${-15 + Math.random() * 30}deg`,
        fontSize: `${10 + Math.random() * 8}px`,
      }
    })
  }
})

const openLetter = () => {
  isOpening.value = true
  setTimeout(() => {
    letterOpened.value = true
  }, 1000)
}

const replayEnvelope = () => {
  letterOpened.value = false
  isOpening.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

:root {
  --blue: #4f86c6;
  --blue-light: #a8c8f0;
  --blue-dark: #1a3a5c;
  --cream: #fdf9f3;
  --gold: #c9a84c;
}

.root {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #0f2240 0%, #1a3a5c 40%, #0d3060 70%, #091830 100%);
  font-family: 'Lora', serif;
}

/* ── Stars ── */
.stars-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.star {
  position: absolute;
  border-radius: 50%;
  background: white;
  animation: twinkle var(--dur) ease-in-out var(--delay) infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.4); }
}

/* ── Teardrops ── */
.teardrops-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.drop {
  position: absolute;
  font-size: var(--size);
  animation: fallDrop var(--dur) linear var(--delay) infinite;
  opacity: 0;
}
@keyframes fallDrop {
  0%   { transform: translateY(-8vh);  opacity: 0; }
  5%   { opacity: 0.7; }
  95%  { opacity: 0.5; }
  100% { transform: translateY(108vh); opacity: 0; }
}

/* ── Sorry notes ── */
.note {
  position: absolute;
  color: rgba(168, 200, 240, 0.3);
  font-family: 'Dancing Script', cursive;
  pointer-events: none;
  z-index: 1;
  animation: floatNote var(--dur) ease-in-out var(--delay) infinite;
}
@keyframes floatNote {
  0%, 100% { transform: translateY(0) rotate(var(--rot));              opacity: 0; }
  20%, 80%  {                                                            opacity: 1; }
  50%       { transform: translateY(-30px) rotate(calc(var(--rot) + 5deg)); }
}

/* ── Scene ── */
.scene {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* ── Envelope ── */
.envelope-wrap {
  position: relative;
  width: 280px;
  height: 190px;
  cursor: pointer;
  transition: transform 0.3s;
}
.envelope-wrap:hover { transform: scale(1.05); }

.env-back {
  position: absolute;
  inset: 28px 0 0;
  background: linear-gradient(160deg, #1e4a7a, #0f2d52);
  border-radius: 4px 4px 10px 10px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(79,134,198,0.15);
}
.env-flap {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 120px;
  overflow: hidden;
  transform-origin: top center;
  transition: transform 1.1s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
}
.env-flap.open { transform: rotateX(-185deg); }
.env-flap-inner {
  width: 0; height: 0;
  border-left: 140px solid transparent;
  border-right: 140px solid transparent;
  border-top: 110px solid #163d6e;
}
.env-front {
  position: absolute;
  inset: 28px 0 0;
  background: linear-gradient(180deg, #1a4070 0%, #0e2a4a 100%);
  border-radius: 4px 4px 10px 10px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  border: 1px solid rgba(79,134,198,0.2);
}
.env-label {
  color: #a8c8f0;
  font-family: 'Dancing Script', cursive;
  font-size: 13px;
  text-align: center;
  padding: 0 16px;
}
.env-icon {
  font-size: 28px;
  animation: pulse 2s ease-in-out infinite;
}

.seal {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  width: 52px; height: 52px;
  background: radial-gradient(circle at 35% 35%, #5a9fd4, #1a4a7a);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  z-index: 10;
  box-shadow: 0 0 20px rgba(79,134,198,0.5), 0 4px 12px rgba(0,0,0,0.4);
  animation: sealGlow 3s ease-in-out infinite;
}
@keyframes sealGlow {
  0%,100% { box-shadow: 0 0 20px rgba(79,134,198,0.5), 0 4px 12px rgba(0,0,0,0.4); }
  50%      { box-shadow: 0 0 35px rgba(79,134,198,0.9), 0 4px 12px rgba(0,0,0,0.4); }
}
@keyframes pulse {
  0%,100% { transform: scale(1);    }
  50%      { transform: scale(1.15); }
}

/* ── Letter ── */
.letter {
  position: relative;
  width: 92vw;
  max-width: 580px;
  max-height: 85vh;
  background: #fdf9f3;
  border-radius: 12px;
  padding: 40px 36px 32px;
  overflow-y: auto;
  box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(79,134,198,0.2);
}
.animate-unfold {
  animation: unfold 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes unfold {
  0%   { transform: scale(0.5) rotateX(-40deg); opacity: 0; }
  100% { transform: scale(1)   rotateX(0deg);   opacity: 1; }
}

/* Paper lines */
.letter::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    transparent,
    transparent 31px,
    rgba(79,134,198,0.08) 31px,
    rgba(79,134,198,0.08) 32px
  );
  border-radius: 12px;
  pointer-events: none;
}

.letter-corner {
  position: absolute;
  font-size: 18px;
  opacity: 0.2;
}
.corner-tl { top: 10px;    left: 12px;  }
.corner-tr { top: 10px;    right: 12px; }
.corner-bl { bottom: 10px; left: 12px;  }
.corner-br { bottom: 10px; right: 12px; }

.letter-title {
  font-family: 'Dancing Script', cursive;
  font-size: clamp(28px, 6vw, 42px);
  color: #1a3a5c;
  text-align: center;
  margin-bottom: 6px;
  line-height: 1.2;
}
.letter-sub {
  text-align: center;
  font-size: 22px;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}
.letter-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #4f86c6, transparent);
  margin: 0 auto 20px;
  width: 60%;
}
.greeting {
  font-family: 'Dancing Script', cursive;
  font-size: clamp(18px, 4vw, 24px);
  color: #4f86c6;
  margin-bottom: 14px;
}
.letter-body p {
  font-size: clamp(13px, 3vw, 15px);
  line-height: 1.85;
  color: #2c3e50;
  margin-bottom: 14px;
}
.letter-body p strong {
  color: #1a3a5c;
  font-weight: 600;
}
.closing {
  font-family: 'Dancing Script', cursive;
  font-size: clamp(16px, 4vw, 22px);
  color: #4f86c6;
  text-align: right;
  margin-top: 10px;
  line-height: 1.7;
}
.btn-row {
  display: flex;
  justify-content: center;
  margin-top: 22px;
}
.btn-replay {
  padding: 10px 28px;
  background: transparent;
  border: 1.5px solid #4f86c6;
  border-radius: 50px;
  color: #1a3a5c;
  font-family: 'Lora', serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-replay:hover {
  background: #4f86c6;
  color: white;
  transform: scale(1.05);
}

/* Scrollbar */
.letter::-webkit-scrollbar       { width: 6px; }
.letter::-webkit-scrollbar-track { background: #e8e0d5; border-radius: 4px; }
.letter::-webkit-scrollbar-thumb { background: #a8c8f0; border-radius: 4px; }

/* Mobile */
@media (max-width: 480px) {
  .envelope-wrap { width: 230px; height: 160px; }
  .env-flap-inner {
    border-left-width: 115px;
    border-right-width: 115px;
    border-top-width: 90px;
  }
  .letter { padding: 30px 20px 24px; }
}
</style>