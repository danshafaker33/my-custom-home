<template>
  <div class="music-player-fixed" :class="{ 'is-collapsed': isCollapsed }">
    <!-- Collapse Toggle -->
    <div class="player-toggle" @click="isCollapsed = !isCollapsed">
      <v-icon color="white" size="small">
        {{ isCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
      </v-icon>
    </div>

    <!-- Main Player Body -->
    <div class="player-body">
      <!-- Cover/Disc -->
      <div class="player-cover" :class="{ 'is-playing': musicStore.isPlaying }" @click="togglePlay">
        <v-avatar size="50" class="w-100 h-100" color="grey-darken-3">
          <v-img 
            v-if="currentSong && currentSong.cover" 
            :key="currentSong.url"
            :src="currentSong.cover" 
            cover
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon size="24" color="white">mdi-music</v-icon>
              </div>
            </template>
            <template v-slot:error>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon size="24" color="white">mdi-music</v-icon>
              </div>
            </template>
          </v-img>
          <v-icon v-else size="24" color="white">mdi-music</v-icon>
        </v-avatar>
      </div>

      <!-- Info & Controls -->
      <div class="player-content" v-show="!isCollapsed">
        <div class="song-info">
          <div class="song-title text-truncate">{{ currentSong.title }}</div>
          <div class="song-artist text-truncate">{{ currentSong.artist }}</div>
        </div>

        <div class="player-controls">
          <v-btn icon="mdi-skip-previous" variant="text" size="x-small" color="white" @click="musicStore.prev()"></v-btn>
          <v-btn 
            :icon="musicStore.isPlaying ? 'mdi-pause' : 'mdi-play'" 
            variant="text" 
            size="small" 
            color="white" 
            @click="togglePlay"
          ></v-btn>
          <v-btn icon="mdi-skip-next" variant="text" size="x-small" color="white" @click="musicStore.next()"></v-btn>
          
          <!-- Volume Slider -->
          <v-menu :close-on-content-click="false" location="top" offset="10">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-volume-high" variant="text" size="x-small" color="white" v-bind="props"></v-btn>
            </template>
            <v-card width="40" height="120" class="d-flex flex-column align-center py-2 bg-grey-darken-4">
              <v-slider
                v-model="musicStore.volume"
                direction="vertical"
                min="0"
                max="1"
                step="0.01"
                hide-details
                color="white"
                @update:model-value="musicStore.setVolume"
              ></v-slider>
            </v-card>
          </v-menu>

          <!-- Mode Toggle -->
          <v-btn 
            :icon="modeIcon" 
            variant="text" 
            size="x-small" 
            color="white" 
            @click="musicStore.toggleMode"
            :title="modeTitle"
          ></v-btn>

          <!-- Playlist Toggle -->
          <v-btn 
            icon="mdi-playlist-music" 
            variant="text" 
            size="x-small" 
            color="white" 
            @click.stop="showPlaylist = !showPlaylist"
            :color="showPlaylist ? 'primary' : 'white'"
          ></v-btn>
        </div>

        <!-- Progress Bar -->
        <div class="player-progress-container">
          <div class="d-flex align-center gap-1 mb-1">
            <span class="text-tiny text-grey">{{ formatTime(musicStore.currentTime) }}</span>
            <v-progress-linear
              :model-value="(musicStore.currentTime / musicStore.duration) * 100"
              color="white"
              height="2"
              class="player-progress flex-grow-1"
              @click="handleSeek"
            ></v-progress-linear>
            <span class="text-tiny text-grey">{{ formatTime(musicStore.duration) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Playlist Drawer -->
    <v-expand-transition>
      <div v-if="showPlaylist && !isCollapsed" class="playlist-drawer">
        <div class="playlist-header d-flex align-center justify-space-between px-4 py-2">
          <div class="d-flex gap-4">
            <span 
              class="text-caption font-weight-bold cursor-pointer" 
              :class="activeTab === 'playlist' ? 'text-primary' : 'text-grey'"
              @click="activeTab = 'playlist'"
            >播放列表</span>
            <span 
              class="text-caption font-weight-bold cursor-pointer ml-4"
              :class="activeTab === 'lyrics' ? 'text-primary' : 'text-grey'"
              @click="activeTab = 'lyrics'"
            >歌词</span>
          </div>
          <span v-if="activeTab === 'playlist'" class="text-caption text-grey">{{ musicStore.playlist.length }}首</span>
        </div>
        
        <v-divider color="white" class="opacity-20"></v-divider>

        <v-list v-if="activeTab === 'playlist'" density="compact" bg-color="transparent" class="playlist-content">
          <v-list-item
            v-for="(song, index) in musicStore.playlist"
            :key="index"
            :value="index"
            :active="musicStore.currentSongIndex === index"
            color="primary"
            variant="text"
            class="playlist-item"
            @click="playSong(index)"
          >
            <template v-slot:prepend>
              <div class="d-flex align-center mr-2">
                <span class="text-tiny text-grey mr-2 index-num" style="width: 12px">{{ index + 1 }}</span>
                <v-avatar size="24" rounded="sm" color="grey-darken-3">
                  <v-img v-if="song.cover" :src="song.cover" cover></v-img>
                  <v-icon v-else size="14">mdi-music</v-icon>
                </v-avatar>
              </div>
            </template>
            <v-list-item-title class="text-caption text-white song-item-title">
              {{ song.title }}
            </v-list-item-title>
            <template v-slot:append>
               <v-icon v-if="musicStore.currentSongIndex === index && musicStore.isPlaying" size="x-small" color="primary">mdi-volume-high</v-icon>
            </template>
          </v-list-item>
        </v-list>

        <div v-else class="lyrics-container">
          <div v-if="musicStore.parsedLyrics.length === 0" class="d-flex align-center justify-center fill-height text-caption text-grey">
            暂无歌词
          </div>
          <div v-else class="lyrics-scroll" ref="lyricsScrollRef">
            <div 
              v-for="(line, index) in musicStore.parsedLyrics" 
              :key="index"
              class="lyric-line text-caption text-center py-2 px-2"
              :class="{ 'active': musicStore.currentLyricIndex === index }"
            >
              {{ line.text }}
            </div>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { musicStore } from '../store/music.js'

const isCollapsed = ref(true)
const showPlaylist = ref(false)
const activeTab = ref('playlist')
const lyricsScrollRef = ref(null)

const modeIcon = computed(() => {
  switch (musicStore.mode) {
    case 'loop': return 'mdi-repeat-once'
    case 'random': return 'mdi-shuffle'
    default: return 'mdi-repeat'
  }
})

const modeTitle = computed(() => {
  switch (musicStore.mode) {
    case 'loop': return '单曲循环'
    case 'random': return '随机播放'
    default: return '列表循环'
  }
})

const currentSong = computed(() => {
  return musicStore.playlist[musicStore.currentSongIndex] || {
    title: '未知曲目',
    artist: '未知歌手',
    cover: ''
  }
})

const togglePlay = () => {
  musicStore.play()
}

const playSong = (index) => {
  musicStore.play(index)
}

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

const handleSeek = (e) => {
  const container = e.currentTarget
  const rect = container.getBoundingClientRect()
  const percent = (e.clientX - rect.left) / rect.width
  musicStore.seek(percent * musicStore.duration)
}

const scrollToCurrentLyric = () => {
  if (!lyricsScrollRef.value) return
  const activeLine = lyricsScrollRef.value.querySelector('.active')
  if (activeLine) {
    lyricsScrollRef.value.scrollTo({
      top: activeLine.offsetTop - lyricsScrollRef.value.offsetHeight / 2 + activeLine.offsetHeight / 2,
      behavior: 'smooth'
    })
  }
}

watch(() => musicStore.currentLyricIndex, () => {
  if (activeTab.value === 'lyrics') {
    scrollToCurrentLyric()
  }
})

watch(activeTab, (newVal) => {
  if (newVal === 'lyrics') {
    nextTick(() => {
      scrollToCurrentLyric()
    })
  }
})
</script>

<style scoped>
.music-player-fixed {
  position: fixed;
  left: 0;
  bottom: 10%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(15px);
  border-radius: 0 40px 40px 0;
  padding: 8px 15px 8px 8px;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: none;
  min-width: 66px;
}

.music-player-fixed.is-collapsed {
  transform: translateX(-194px);
  border-radius: 0 50% 50% 0;
}

.player-body {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
}

/* ... existing styles ... */
.player-cover {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.player-cover.is-playing {
  animation: rotate 10s linear infinite;
}

.player-content {
  width: 150px;
  overflow: hidden;
}

.song-info {
  margin-bottom: 4px;
}

.song-title {
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.2;
}

.song-artist {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.7rem;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: -5px;
}

.player-toggle {
  position: absolute;
  right: -2px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s;
  z-index: 3;
}

.player-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

.player-progress-container {
  margin-top: 4px;
  cursor: pointer;
}

.text-tiny {
  font-size: 0.6rem;
  font-family: monospace;
}

.gap-1 {
  gap: 4px;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Playlist Drawer Styles */
.playlist-drawer {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 12px 12px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-bottom: -1px; /* Overlap border */
}

.playlist-header {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.playlist-content {
  overflow-y: auto;
  max-height: 260px;
}

.playlist-content::-webkit-scrollbar {
  width: 4px;
}
.playlist-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.lyrics-container {
  height: 260px;
  overflow: hidden;
  position: relative;
}

.lyrics-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 20px 0;
  scroll-behavior: smooth;
}

.lyrics-scroll::-webkit-scrollbar {
  width: 4px;
}
.lyrics-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.lyric-line {
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  min-height: 24px;
}

.lyric-line.active {
  color: #fff;
  font-weight: bold;
  transform: scale(1.05);
  text-shadow: 0 0 10px rgba(var(--v-theme-primary), 0.5);
}

.playlist-item {
  min-height: 40px !important;
  padding-left: 12px !important;
  padding-right: 12px !important;
  transition: background 0.2s;
}

.playlist-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.song-item-title {
  font-size: 0.75rem !important;
}

.index-num {
  font-size: 0.7rem !important;
  min-width: 15px;
}

/* 隐藏 slider 细节 */
.music-player-fixed :deep(.v-slider__container) {
  margin-bottom: 0;
}
</style>
