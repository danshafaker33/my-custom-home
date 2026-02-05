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
  
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' }
  dateStr.value = now.toLocaleDateString('zh-CN', options).replace(/\//g, ' 年 ').replace(',', ' 日 ')
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
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
}

.digital-time {
  font-family: 'Digital-7 Mono', monospace;
  font-size: 2.5rem;
  color: #fff;
  text-shadow: 0 0 10px rgba(var(--v-theme-primary), 0.8);
  letter-spacing: 2px;
}

.date-str {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0px;
}

.orbit-container {
  height: 100px;
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
  width: 80px;
  height: 80px;
  border-top-color: #00f2fe;
  animation-duration: 8s;
}

.orbit-2 {
  width: 60px;
  height: 60px;
  border-right-color: #4facfe;
  animation-duration: 5s;
  animation-direction: reverse;
}

.orbit-3 {
  width: 40px;
  height: 40px;
  border-bottom-color: #a6c1ee;
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
