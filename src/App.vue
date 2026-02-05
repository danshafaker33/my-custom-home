<template>
  <v-app>
    <v-main class="fill-height app-background" :style="bgStyle">
      <v-container fluid class="fill-height pa-0">
        <v-row no-gutters class="fill-height">
          <!-- Left Sidebar / Profile Card -->
          <v-col cols="12" md="4" lg="3" class="profile-section d-flex align-center justify-center overflow-y-auto">
            <ProfileCard />
          </v-col>

          <!-- Right Content Area -->
          <v-col cols="12" md="8" lg="9" class="content-section pa-6 d-flex flex-column position-relative">
            <div class="d-flex justify-end align-start mb-4">
              <TimeWidget />
            </div>
            
            <div class="search-container-absolute">
              <SearchBar />
            </div>

            <div class="mt-auto">
              <ProjectGrid />
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- Fixed Music Player (Leleo Style) -->
      <MusicPlayerFixed />
    </v-main>
  </v-app>
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue'
import ProfileCard from './components/ProfileCard.vue'
import TimeWidget from './components/TimeWidget.vue'
import SearchBar from './components/SearchBar.vue'
import { profile } from './data.js'

const ProjectGrid = defineAsyncComponent(() => import('./components/ProjectGrid.vue'))
const MusicPlayerFixed = defineAsyncComponent(() => import('./components/MusicPlayerFixed.vue'))

const bgStyle = computed(() => ({
  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${profile.wallpaper})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed'
}))
</script>

<style>
.app-background {
  transition: background 0.5s ease;
}
.profile-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255,255,255,0.1);
  min-height: 100vh;
  scrollbar-width: none;
}
.profile-section::-webkit-scrollbar {
  display: none;
}
.content-section {
  height: 100vh;
}
.content-section::-webkit-scrollbar {
  display: none;
}
.content-section {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.search-container-absolute {
  position: absolute;
  top: 15%;
  left: 45%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 800px;
  z-index: 10;
}
</style>
