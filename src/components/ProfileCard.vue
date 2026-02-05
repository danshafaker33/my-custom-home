<template>
  <v-card class="mx-auto pa-6 bg-transparent" max-width="400" flat>
    <div class="text-center">
      <!-- Profile Image -->
      <div class="avatar-container mb-4" @click="musicStore.play()">
        <v-avatar size="150" class="elevation-10 avatar-main" :class="{ 'is-playing': musicStore.isPlaying }" color="grey-darken-3">
          <v-img :src="profile.avatar" alt="Avatar">
            <template v-slot:placeholder>
              <v-icon size="80" color="grey">mdi-account</v-icon>
            </template>
          </v-img>
          
          <!-- Play/Pause Overlay on Hover -->
          <div class="play-overlay d-flex align-center justify-center">
            <v-icon size="50" color="white">
              {{ musicStore.isPlaying ? 'mdi-pause' : 'mdi-play' }}
            </v-icon>
          </div>
        </v-avatar>
      </div>
      
      <h2 class="text-h4 font-weight-bold text-white mb-2">{{ $t('profile.name') }}</h2>
      <div class="text-h6 text-primary mb-4 typewriter">
        {{ $t('profile.title') }}
      </div>
      
      <p class="text-body-1 text-grey-lighten-1 mb-6">
        {{ $t('profile.bio') }}
      </p>
      
      <div class="d-flex justify-center gap-4 mb-6">
        <v-btn
          v-for="(social, index) in profile.socials"
          :key="index"
          :href="social.link"
          target="_blank"
          icon
          variant="text"
          color="white"
          class="mx-2 hover-scale"
        >
          <v-icon size="large">{{ social.icon }}</v-icon>
        </v-btn>
      </div>

      <v-divider class="mb-6 opacity-20"></v-divider>
      
      <SkillChart />

      <div class="mt-8">
        <ConfigPanel />
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { profile } from '../data.js'
import SkillChart from './SkillChart.vue'
import ConfigPanel from './ConfigPanel.vue'
import { musicStore } from '../store/music.js'

const currentSong = computed(() => musicStore.playlist[musicStore.currentSongIndex])
</script>

<style scoped>
.avatar-container {
  display: inline-block;
  position: relative;
}

.avatar-main {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-main.is-playing {
  animation: rotate 20s linear infinite;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.avatar-main:hover .play-overlay {
  opacity: 1;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hover-scale {
  transition: transform 0.2s;
}
.hover-scale:hover {
  transform: scale(1.2);
}
.typewriter {
  overflow: hidden; 
  white-space: nowrap;
  margin: 0 auto;
  border-right: 2px solid orange; 
  animation: typing 3.5s steps(40, end), blink-caret .75s step-end infinite;
}
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: orange; }
}
</style>
