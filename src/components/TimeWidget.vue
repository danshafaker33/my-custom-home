<template>
  <div class="time-widget pa-4 text-center">
    <div class="clock-display mb-2">
      <div class="digital-time">{{ timeStr }}</div>
      <div class="date-str">{{ dateStr }}</div>
    </div>

    <div class="orbit-container">
      <div class="orbit-circle orbit-1"></div>
      <div class="orbit-circle orbit-2"></div>
      <div class="orbit-circle orbit-3"></div>
      <div class="orbit-center">
        <v-icon color="primary" size="small">mdi-atom</v-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const timeStr = ref('')
const dateStr = ref('')

const updateTime = () => {
  const now = new Date()
  timeStr.value = now.toLocaleTimeString('zh-CN', { hour12: false })

  const datePart = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  const weekdayPart = now.toLocaleDateString('zh-CN', { weekday: 'long' })
  dateStr.value = `${datePart} ${weekdayPart}`
}

let timer

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/digital-7-mono');

.time-widget {
  background: linear-gradient(180deg, rgba(93, 114, 112, 0.24), rgba(70, 80, 90, 0.2));
  backdrop-filter: blur(14px);
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
  position: relative;
  width: min(100%, 300px);
  padding-inline: 1.75rem !important;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
}

.digital-time {
  font-family: 'Digital-7 Mono', monospace;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  color: #fff;
  text-shadow: 0 0 10px rgba(var(--v-theme-primary), 0.8);
  letter-spacing: 2px;
}

.date-str {
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0;
  overflow-wrap: anywhere;
}

.orbit-container {
  height: clamp(60px, 15vw, 100px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.orbit-circle {
  position: absolute;
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
  border-radius: 50%;
  animation: rotate linear infinite;
}

.orbit-1 {
  width: clamp(50px, 12vw, 80px);
  height: clamp(50px, 12vw, 80px);
  border-top-color: #00f2fe;
  animation-duration: 8s;
}

.orbit-2 {
  width: clamp(40px, 9vw, 60px);
  height: clamp(40px, 9vw, 60px);
  border-right-color: #4facfe;
  animation-duration: 5s;
  animation-direction: reverse;
}

.orbit-3 {
  width: clamp(30px, 6vw, 40px);
  height: clamp(30px, 6vw, 40px);
  border-bottom-color: #00f2fe;
  animation-duration: 3s;
}

.orbit-center {
  z-index: 1;
}

@keyframes rotate {
  from { transform: rotate(0deg) rotateX(60deg); }
  to { transform: rotate(360deg) rotateX(60deg); }
}
</style>
