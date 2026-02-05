<template>
  <div class="skill-chart-container pa-4">
    <h3 class="text-h6 text-white text-center mb-6">{{ $t('profile.skills_title') }}</h3>
    <div class="chart-wrapper">
      <svg viewBox="0 0 200 200" class="radar-chart">
        <!-- Background Circles -->
        <circle v-for="i in 4" :key="i" cx="100" cy="100" :r="i * 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        
        <!-- Axis Lines -->
        <line v-for="(skill, index) in skills" :key="'line-'+index" 
          x1="100" y1="100" 
          :x2="100 + 80 * Math.cos(index * 2 * Math.PI / skills.length - Math.PI/2)" 
          :y2="100 + 80 * Math.sin(index * 2 * Math.PI / skills.length - Math.PI/2)" 
          stroke="rgba(255,255,255,0.1)" stroke-width="1" />

        <!-- Data Polygon -->
        <polygon :points="points" fill="rgba(var(--v-theme-primary), 0.3)" stroke="rgb(var(--v-theme-primary))" stroke-width="2" />
        
        <!-- Data Points & Tooltips -->
        <g v-for="(skill, index) in skills" :key="'point-'+index">
          <circle 
            :cx="100 + (skill.value * 0.8) * Math.cos(index * 2 * Math.PI / skills.length - Math.PI/2)" 
            :cy="100 + (skill.value * 0.8) * Math.sin(index * 2 * Math.PI / skills.length - Math.PI/2)" 
            r="4" 
            :fill="skill.color"
            class="skill-point"
          >
            <title>{{ skill.name }}: {{ skill.value }}%</title>
          </circle>
          <text 
            :x="100 + 95 * Math.cos(index * 2 * Math.PI / skills.length - Math.PI/2)" 
            :y="100 + 95 * Math.sin(index * 2 * Math.PI / skills.length - Math.PI/2)" 
            fill="white" font-size="10" font-weight="bold" text-anchor="middle" alignment-baseline="middle"
          >
            {{ skill.name }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const skills = [
  { name: 'Vue', value: 85, color: '#42b883' },
  { name: 'React', value: 75, color: '#61dafb' },
  { name: 'Node', value: 70, color: '#339933' },
  { name: 'Python', value: 65, color: '#3776ab' },
  { name: 'Design', value: 80, color: '#ff4081' },
  { name: 'DevOps', value: 60, color: '#2496ed' }
]

const points = computed(() => {
  return skills.map((skill, index) => {
    const angle = index * 2 * Math.PI / skills.length - Math.PI / 2
    const x = 100 + (skill.value * 0.8) * Math.cos(angle)
    const y = 100 + (skill.value * 0.8) * Math.sin(angle)
    return `${x},${y}`
  }).join(' ')
})
</script>

<style scoped>
.skill-chart-container {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.chart-wrapper {
  display: flex;
  justify-content: center;
}
.radar-chart {
  max-width: 200px;
}
.skill-point {
  cursor: pointer;
  transition: r 0.2s;
}
.skill-point:hover {
  r: 6;
}
</style>
