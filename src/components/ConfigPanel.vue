<template>
  <v-dialog v-model="dialog" max-width="800">
    <template v-slot:activator="{ props }">
      <v-btn
        icon="mdi-cog"
        variant="text"
        color="white"
        v-bind="props"
        class="settings-btn"
      ></v-btn>
    </template>

    <v-card class="music-config-card bg-grey-darken-4">
      <v-tabs v-model="tab" bg-color="transparent" color="white" grow>
        <v-tab value="style">{{ $t('settings.style') }}</v-tab>
        <v-tab value="background">{{ $t('settings.background') }}</v-tab>
        <v-tab value="music">{{ $t('settings.music') }}</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="pa-4">
        <v-window-item value="style">
          <div class="pa-4 text-center text-grey">
            <div class="text-caption mb-2">Language / 语言</div>
            <v-btn-toggle v-model="$i18n.locale" mandatory density="compact">
              <v-btn value="en-US" size="small">EN</v-btn>
              <v-btn value="zh-CN" size="small">中文</v-btn>
            </v-btn-toggle>
          </div>
        </v-window-item>

        <v-window-item value="background">
          <div class="pa-4 text-center text-grey">
            <!-- 背景预览内容 -->
            暂无背景设置
          </div>
        </v-window-item>

        <v-window-item value="music">
          <!-- Error Alert -->
          <v-alert
            v-if="musicStore.error"
            type="error"
            density="compact"
            variant="tonal"
            class="mb-4 text-caption"
            closable
            @click:close="musicStore.error = null"
          >
            {{ musicStore.error }}
          </v-alert>

          <!-- Music Player Section -->
          <div class="music-player-container">
            <!-- Admin Unlock Section -->
            <div v-if="!musicStore.isAdmin" class="mb-6 pa-4 rounded-lg bg-grey-darken-3 border-thin">
              <div class="text-caption text-grey mb-2">
                {{ musicStore.adminPassword ? '管理模式已锁定' : '首次使用请设置管理密码' }}
              </div>
              <div class="d-flex gap-2">
                <v-text-field
                  v-model="passwordInput"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="musicStore.adminPassword ? '输入管理密码解锁' : '设置管理密码'"
                  density="compact"
                  variant="outlined"
                  hide-details
                  class="flex-grow-1"
                  @keyup.enter="handleVerifyAdmin"
                >
                  <template v-slot:append-inner>
                    <v-icon
                      :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      size="small"
                      @click="showPassword = !showPassword"
                    ></v-icon>
                  </template>
                </v-text-field>
                <v-btn color="primary" @click="handleVerifyAdmin">解锁</v-btn>
              </div>
            </div>

            <div v-else class="mb-6 pa-3 rounded-lg bg-blue-grey-darken-4 d-flex align-center justify-space-between border-thin">
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-shield-check</v-icon>
                <span class="text-caption text-primary font-weight-bold">管理模式已启用</span>
              </div>
              <div class="d-flex gap-2">
                <v-btn size="x-small" variant="text" color="grey" @click="copyPlaylistCode">导出代码</v-btn>
                <v-btn size="x-small" variant="text" color="error" @click="handleLogout">退出管理</v-btn>
              </div>
            </div>

            <!-- Music Player Mini Summary -->
            <div class="music-player-preview mb-6 pa-4 rounded-lg bg-grey-darken-3 border-thin">
              <div class="d-flex align-center mb-2">
                <v-icon size="32" color="white" class="mr-4">mdi-music-circle-outline</v-icon>
                <div class="flex-grow-1">
                  <div class="text-subtitle-1 font-weight-bold text-white">{{ currentSong.title }}</div>
                  <div class="text-caption text-grey">{{ currentSong.artist }}</div>
                </div>
                <div class="d-flex align-center">
                  <v-btn
                    icon="mdi-skip-previous"
                    variant="text"
                    color="white"
                    class="mr-1"
                    @click="musicStore.prev()"
                  ></v-btn>
                  <v-btn
                    :icon="musicStore.isPlaying ? 'mdi-pause' : 'mdi-play'"
                    variant="text"
                    color="white"
                    class="mx-1"
                    @click="musicStore.play()"
                  ></v-btn>
                  <v-btn
                    icon="mdi-skip-next"
                    variant="text"
                    color="white"
                    class="ml-1"
                    @click="musicStore.next()"
                  ></v-btn>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="d-flex align-center gap-2 px-1">
                <span class="text-caption text-grey mono-font">{{ formatTime(musicStore.currentTime) }}</span>
                <v-slider
                  v-model="currentTime"
                  :max="musicStore.duration"
                  min="0"
                  step="1"
                  hide-details
                  density="compact"
                  color="primary"
                  class="music-slider flex-grow-1"
                ></v-slider>
                <span class="text-caption text-grey mono-font">{{ formatTime(musicStore.duration) }}</span>
              </div>
            </div>

            <div class="d-flex align-center justify-space-between mb-4">
              <div class="text-subtitle-2 text-grey">{{ $t('music.playlist') }}</div>
              <v-btn
                v-if="musicStore.isAdmin"
                prepend-icon="mdi-plus"
                variant="tonal"
                color="white"
                size="small"
                @click="showAddForm = !showAddForm"
              >
                {{ $t('music.add_music') }}
              </v-btn>
            </div>

            <!-- Add Music Form -->
            <v-expand-transition>
              <div v-if="showAddForm" class="mb-6 pa-4 rounded-lg border-thin">
                <v-text-field
                  v-model="newSong.title"
                  :label="$t('music.title')"
                  density="compact"
                  variant="outlined"
                  class="mb-2"
                ></v-text-field>
                <v-text-field
                  v-model="newSong.artist"
                  :label="$t('music.artist')"
                  density="compact"
                  variant="outlined"
                  class="mb-2"
                ></v-text-field>
                <v-text-field
                  v-model="newSong.url"
                  :label="$t('music.url')"
                  placeholder="https://... or /music/xxx.mp3"
                  density="compact"
                  variant="outlined"
                  class="mb-2"
                ></v-text-field>
                <v-text-field
                  v-model="newSong.cover"
                  :label="$t('music.cover')"
                  placeholder="https://... or /covers/xxx.jpg"
                  density="compact"
                  variant="outlined"
                  class="mb-1"
                  hide-details
                ></v-text-field>
                <div class="text-tiny text-grey mb-4 px-1">建议：使用网络图片链接或放在 public/covers 下</div>
                <v-btn block color="primary" @click="handleAddSong">{{ $t('music.submit') }}</v-btn>
              </div>
            </v-expand-transition>

            <v-divider class="mb-4 opacity-20"></v-divider>

            <!-- Playlist Section -->
            <v-list bg-color="transparent" class="playlist-list">
              <v-list-item
                v-for="(song, index) in musicStore.playlist"
                :key="index"
                :value="index"
                :active="musicStore.currentSongIndex === index"
                color="white"
                class="rounded-lg mb-1 hover-bg"
                @click="musicStore.play(index)"
              >
                <template v-slot:prepend>
                  <div class="d-flex align-center mr-4">
                    <span class="text-caption text-grey mr-3" style="width: 20px">{{ index + 1 }}</span>
                    <v-avatar size="32" rounded="sm" color="grey-darken-3">
                      <v-img v-if="song.cover" :src="song.cover" cover></v-img>
                      <v-icon v-else size="20">mdi-music</v-icon>
                    </v-avatar>
                  </div>
                </template>
                <v-list-item-title class="text-body-2">{{ song.title }}</v-list-item-title>
                <template v-slot:append>
                  <div class="d-flex align-center">
                    <span class="text-caption text-grey mr-4">{{ song.artist }}</span>
                    <v-btn
                      v-if="musicStore.isAdmin"
                      icon="mdi-delete-outline"
                      size="x-small"
                      variant="text"
                      color="error"
                      @click.stop="musicStore.removeSong(index)"
                    ></v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="snackbar"
    timeout="3000"
    color="success"
    location="top"
  >
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="snackbar = false"
      >
        关闭
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { musicStore } from '../store/music.js'

const dialog = ref(false)
const tab = ref('music')
const showAddForm = ref(false)
const snackbar = ref(false)
const snackbarText = ref('添加成功并开始播放')
const passwordInput = ref('')
const showPassword = ref(false)
const newSong = ref({
  title: '',
  artist: '',
  url: '',
  cover: ''
})

// 当退出管理模式时，自动关闭添加表单
watch(() => musicStore.isAdmin, (isAdmin) => {
  if (!isAdmin) {
    showAddForm.value = false
  }
})

const currentSong = computed(() => musicStore.playlist[musicStore.currentSongIndex] || {})

const handleVerifyAdmin = () => {
  if (!passwordInput.value) return
  const result = musicStore.verifyAdmin(passwordInput.value)
  if (result.success) {
    passwordInput.value = ''
    snackbarText.value = result.message
    snackbar.value = true
  } else {
    // 这里可以直接用 musicStore.error 或者本地 ref
    musicStore.error = result.message
  }
}

const handleLogout = () => {
  musicStore.logoutAdmin()
  showAddForm.value = false
  snackbarText.value = '已退出管理模式'
  snackbar.value = true
}

const copyPlaylistCode = () => {
  const code = `export const initialPlaylist = ${JSON.stringify(musicStore.playlist, null, 2)}`
  navigator.clipboard.writeText(code).then(() => {
    snackbarText.value = '代码已复制到剪贴板，请更新 data.js 以永久保存'
    snackbar.value = true
  })
}

const currentTime = computed({
  get: () => musicStore.currentTime,
  set: (val) => musicStore.seek(val)
})

const handleAddSong = () => {
  // 预处理路径
  const normalizedUrl = normalizePublicPath(newSong.value.url)
  const normalizedCover = normalizePublicPath(newSong.value.cover)
  
  // 如果是磁盘路径（返回 null），则报错提示
  if (newSong.value.url && normalizedUrl === null) {
    musicStore.error = "不支持本地磁盘路径。请将音频复制到项目 public/music 下，并使用 /music/文件名.mp3 访问。"
    return
  }
  if (newSong.value.cover && normalizedCover === null) {
    musicStore.error = "不支持本地磁盘封面。请将封面复制到项目 public/covers 下，并使用 /covers/文件名.jpg 访问。"
    return
  }

  if (newSong.value.title && newSong.value.url) {
    const songData = { 
      ...newSong.value,
      url: normalizedUrl,
      cover: normalizedCover
    }
    musicStore.addSong(songData)
    // 自动播放新添加的歌
    const newIndex = musicStore.playlist.length - 1
    musicStore.play(newIndex)
    
    newSong.value = { title: '', artist: '', url: '', cover: '' }
    showAddForm.value = false
    snackbarText.value = '添加成功并开始播放'
    snackbar.value = true
  }
}

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

// 规范化本地绝对路径到 public 下的相对路径（/xxx）
// 例如：D:\Trae_code\my-custom-home\public\music\song.mp3 -> /music/song.mp3
const normalizePublicPath = (p) => {
  if (!p) return ''
  const isHttp = /^https?:\/\//i.test(p)
  const isLeadingSlash = /^\//.test(p)
  if (isHttp || isLeadingSlash) return p
  const withForward = p.replace(/\\/g, '/')
  const idx = withForward.toLowerCase().indexOf('/public/')
  if (idx >= 0) {
    const rel = withForward.slice(idx + '/public/'.length)
    return '/' + rel.replace(/^\/+/, '')
  }
  return null
}
</script>

<style scoped>
.music-config-card {
  border-radius: 16px;
  backdrop-filter: blur(20px);
  background: rgba(33, 33, 33, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.music-slider {
  margin: 0;
  height: 24px;
}

/* 进度条背景轨道：极细且半透明 */
.music-slider :deep(.v-slider-track__background) {
  background: rgba(255, 255, 255, 0.1) !important;
  height: 2px !important;
}

/* 已播放进度：纯白色 */
.music-slider :deep(.v-slider-track__fill) {
  background: white !important;
  height: 2px !important;
  border-radius: 2px !important;
}

/* 滑块小球：默认隐藏，悬浮显示 */
.music-slider :deep(.v-slider-thumb) {
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  --v-slider-thumb-size: 8px;
}

.music-slider:hover :deep(.v-slider-thumb) {
  opacity: 1;
}

.music-slider :deep(.v-slider-thumb__surface) {
  background: white !important;
  width: 8px !important;
  height: 8px !important;
  border-radius: 50% !important;
  box-shadow: 0 0 10px rgba(0,0,0,0.5) !important;
}

.music-slider :deep(.v-slider-thumb__ripple) {
  display: none;
}

.music-slider :deep(.v-slider-track) {
  --v-slider-track-size: 2px;
}

.mono-font {
  font-family: monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  min-width: 35px;
}
.text-tiny {
  font-size: 0.7rem;
  opacity: 0.7;
}
.playlist-list {
  max-height: 300px;
  overflow-y: auto;
}

/* Custom scrollbar for playlist */
.playlist-list::-webkit-scrollbar {
  width: 4px;
}
.playlist-list::-webkit-scrollbar-track {
  background: transparent;
}
.playlist-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.hover-bg:hover {
  background: rgba(255, 255, 255, 0.05);
}

.settings-btn {
  transition: transform 0.3s ease;
}
.settings-btn:hover {
  transform: rotate(90deg);
}
</style>
