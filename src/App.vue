<template>
  <v-app>
    <v-main class="fill-height app-background" :style="bgStyle">
      <v-container fluid class="pa-0 main-container">
        <v-row no-gutters class="main-row">
          <v-col cols="12" md="4" lg="3" class="profile-section d-flex justify-center">
            <ProfileCard />
          </v-col>

          <v-col cols="12" md="8" lg="9" class="content-section pa-4 pa-md-8 pa-lg-10">
            <div class="content-header">
              <div class="header-search d-flex justify-center">
                <SearchBar />
              </div>

              <div class="header-top d-flex justify-center justify-md-end">
                <TimeWidget />
              </div>
            </div>

            <div class="projects-section">
              <ProjectGrid />
            </div>
          </v-col>
        </v-row>
      </v-container>

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
  min-height: 100vh;
}

.main-container,
.main-row {
  min-height: 100vh;
}

.profile-section {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  align-items: flex-start;
  padding: 20px 16px;
}

.content-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: clamp(1.75rem, 4vh, 3.25rem);
}

.content-header {
  display: grid;
  gap: clamp(1rem, 3vh, 1.75rem);
}

.header-top,
.header-search {
  min-height: 0;
}

.projects-section {
  flex: 1 1 auto;
  min-height: 0;
}

@media (min-width: 960px) {
  .profile-section {
    height: 100vh;
    position: sticky;
    top: 0;
    overflow-y: auto;
    padding: 28px 16px 36px;
  }

  .content-header {
    position: sticky;
    top: 0;
    z-index: 20;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas: "search time";
    align-items: center;
    column-gap: clamp(1rem, 2vw, 2rem);
    padding-top: 12px;
  }

  .header-search {
    grid-area: search;
    justify-self: center;
    width: min(100%, 720px);
    padding-left: clamp(1rem, 3vw, 2.5rem);
  }

  .header-top {
    grid-area: time;
    justify-self: end;
  }
}

@media (max-width: 959px) {
  .app-background {
    background-attachment: scroll !important;
  }

  .main-container,
  .main-row,
  .content-section {
    min-height: auto;
  }

  .profile-section {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    min-height: auto;
    padding: clamp(1rem, 5vw, 2rem) 1rem;
  }

  .content-section {
    padding: clamp(1rem, 5vw, 2rem) 1rem !important;
    gap: 1.25rem;
  }

  .content-header {
    gap: 1rem;
  }
}

@media (max-height: 760px) and (min-width: 960px) {
  .content-section {
    gap: 1.5rem;
  }
}

.profile-section::-webkit-scrollbar {
  display: none;
}

.profile-section {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
