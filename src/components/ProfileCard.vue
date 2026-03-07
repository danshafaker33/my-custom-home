<template>
  <v-card class="mx-auto pa-4 pa-md-6 bg-transparent profile-card" max-width="400" flat>
    <div class="text-center profile-card-inner">
      <div class="avatar-container mb-4" @click="musicStore.play()">
        <v-avatar :size="avatarSize" class="elevation-10 avatar-main" :class="{ 'is-playing': musicStore.isPlaying }" color="grey-darken-3">
          <v-img :src="profile.avatar" alt="Avatar">
            <template #placeholder>
              <v-icon :size="avatarIconSize" color="grey">mdi-account</v-icon>
            </template>
          </v-img>

          <div class="play-overlay d-flex align-center justify-center">
            <v-icon :size="playIconSize" color="white">
              {{ musicStore.isPlaying ? 'mdi-pause' : 'mdi-play' }}
            </v-icon>
          </div>
        </v-avatar>
      </div>

      <h2 class="text-h4 font-weight-bold text-white mb-2 profile-name">{{ $t('profile.name') }}</h2>
      <div class="text-h6 text-primary mb-4 typewriter profile-title">
        {{ $t('profile.title') }}
      </div>

      <p class="text-body-1 text-grey-lighten-1 mb-6 profile-bio">
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

      <div class="mt-6 mt-md-8 settings-entry">
        <ConfigPanel />
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { profile } from '../data.js'
import SkillChart from './SkillChart.vue'
import ConfigPanel from './ConfigPanel.vue'
import { musicStore } from '../store/music.js'

const { smAndDown, mdAndDown } = useDisplay()

const avatarSize = computed(() => {
  if (smAndDown.value) return 100
  if (mdAndDown.value) return 120
  return 150
})

const avatarIconSize = computed(() => avatarSize.value * 0.5)
const playIconSize = computed(() => avatarSize.value * 0.3)
</script>

<style scoped>
.profile-card {
  width: 100%;
}

.profile-card-inner {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.profile-name {
  font-size: clamp(1.5rem, 4vw, 2.125rem) !important;
}

.profile-title {
  font-size: clamp(1rem, 2.5vw, 1.25rem) !important;
  max-width: 100%;
}

.profile-bio {
  font-size: clamp(0.85rem, 2vw, 1rem) !important;
}

.avatar-container {
  display: inline-block;
  position: relative;
  margin-top: 0.25rem;
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
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.avatar-main:hover .play-overlay {
  opacity: 1;
}

.hover-scale {
  transition: transform 0.2s;
}

.hover-scale:hover {
  transform: scale(1.2);
}

.settings-entry {
  margin-top: auto;
  padding-top: 1.5rem;
}

.typewriter {
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
  border-right: 2px solid orange;
  animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: orange; }
}

@media (max-width: 600px) {
  .typewriter {
    white-space: normal;
    border-right: none;
    animation: none;
  }
}
</style>
