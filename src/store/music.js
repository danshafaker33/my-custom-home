import { reactive } from 'vue'
import { initialPlaylist } from '../data.js'

export const musicStore = reactive({
  isPlaying: false,
  currentSongIndex: 0,
  volume: 0.5,
  currentTime: 0,
  duration: 0,
  playlist: [...initialPlaylist],
  audio: null,
  error: null,
  mode: 'sequence', // sequence, loop, random
  parsedLyrics: [],
  currentLyricIndex: -1,
  _storageKey: 'customPlaylist',
  isAdmin: false,
  adminPassword: localStorage.getItem('music_admin_password') || '',

  init() {
    // 检查本地是否已经解锁过
    const savedSession = sessionStorage.getItem('music_admin_active')
    if (savedSession === 'true') {
      this.isAdmin = true
    }
    
    if (!this.audio) {
      this.audio = new Audio()
      this.audio.volume = this.volume
      
      this.audio.addEventListener('timeupdate', () => {
        this.currentTime = this.audio.currentTime
        this.updateLyricIndex()
      })
      
      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio.duration
        this.error = null
      })

      this.audio.addEventListener('error', (e) => {
        const error = this.audio.error
        let message = "无法加载音频文件"
        if (error) {
          switch (error.code) {
            case 1: message = "播放被终止"; break
            case 2: message = "网络错误，音频下载失败"; break
            case 3: message = "音频解码错误"; break
            case 4: message = "不支持的音频格式或链接无效"; break
          }
        }
        console.error("Audio error detail:", error)
        this.error = message
        this.isPlaying = false
      })
      
      this.audio.addEventListener('ended', () => {
        this.next()
      })
    }
  },

  play(index) {
    this.init()
    
    // 如果指定了索引且与当前不同，或者是第一次播放（src为空）
    if ((index !== undefined && index !== this.currentSongIndex) || !this.audio.src) {
      if (index !== undefined) this.currentSongIndex = index
      
      // Parse lyrics for the new song
      const song = this.playlist[this.currentSongIndex]
      this.parsedLyrics = this.parseLrc(song.lrc || '')
      this.currentLyricIndex = -1

      this.audio.src = song.url
      this.audio.load()
      
      this.audio.play().then(() => {
        this.isPlaying = true
        this.error = null
      }).catch(err => {
        console.error("Playback failed:", err)
        this.error = "播放失败，浏览器可能拦截了自动播放或链接无效"
        this.isPlaying = false
      })
      return
    }

    // 如果是点击当前正在播放的歌曲，则切换播放/暂停
    if (this.isPlaying) {
      this.audio.pause()
      this.isPlaying = false
    } else {
      this.audio.play().then(() => {
        this.isPlaying = true
        this.error = null
      }).catch(err => {
        this.error = "播放失败"
        this.isPlaying = false
      })
    }
  },

  pause() {
    if (this.audio) {
      this.audio.pause()
      this.isPlaying = false
    }
  },

  next() {
    let nextIndex
    if (this.mode === 'random') {
      nextIndex = Math.floor(Math.random() * this.playlist.length)
    } else if (this.mode === 'loop') {
      nextIndex = this.currentSongIndex
      this.audio.currentTime = 0
      this.play(nextIndex) // Force replay
      return
    } else {
      nextIndex = (this.currentSongIndex + 1) % this.playlist.length
    }
    this.play(nextIndex)
  },

  toggleMode() {
    const modes = ['sequence', 'loop', 'random']
    const index = modes.indexOf(this.mode)
    this.mode = modes[(index + 1) % modes.length]
  },

  prev() {
    let prevIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length
    this.play(prevIndex)
  },

  setVolume(val) {
    this.volume = val
    if (this.audio) {
      this.audio.volume = val
    }
  },

  seek(time) {
    this.init()
    if (this.audio) {
      this.audio.currentTime = time
      this.currentTime = time
    }
  },

  addSong(song) {
    this.playlist.push(song)
    this.savePlaylist()
  },

  removeSong(index) {
    if (this.playlist.length > 1) {
      this.playlist.splice(index, 1)
      if (this.currentSongIndex >= index && this.currentSongIndex > 0) {
        this.currentSongIndex--
      }
      this.savePlaylist()
    }
  },

  parseLrc(lrc) {
    if (!lrc) return []
    const lines = lrc.split('\n')
    const result = []
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
    
    lines.forEach(line => {
      const match = timeReg.exec(line)
      if (match) {
        const min = parseInt(match[1])
        const sec = parseInt(match[2])
        const ms = parseInt(match[3])
        const time = min * 60 + sec + ms / (match[3].length === 3 ? 1000 : 100)
        const text = line.replace(timeReg, '').trim()
        if (text) {
          result.push({ time, text })
        }
      }
    })
    return result
  },

  updateLyricIndex() {
    if (this.parsedLyrics.length === 0) return
    
    // Find the index of the lyric that matches the current time
    let index = this.parsedLyrics.findIndex(item => item.time > this.currentTime)
    
    if (index === -1) {
      // If not found (e.g., time is greater than last lyric), it's the last one
      this.currentLyricIndex = this.parsedLyrics.length - 1
    } else {
      // The current lyric is the one before the found index
      this.currentLyricIndex = index - 1
    }
  },

  savePlaylist() {
    try {
      localStorage.setItem(this._storageKey, JSON.stringify(this.playlist))
    } catch (e) {
      console.warn('保存播放列表失败', e)
    }
  },

  loadPlaylist() {
    try {
      const raw = localStorage.getItem(this._storageKey)
      if (raw !== null) {
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) {
          this.playlist = arr
        }
      }
    } catch (e) {
      console.warn('读取播放列表失败', e)
    }
  },

  verifyAdmin(password) {
    if (!this.adminPassword) {
      // 首次设置密码
      this.adminPassword = password
      localStorage.setItem('music_admin_password', password)
      this.isAdmin = true
      sessionStorage.setItem('music_admin_active', 'true')
      return { success: true, message: '管理密码设置成功' }
    } else if (this.adminPassword === password) {
      this.isAdmin = true
      sessionStorage.setItem('music_admin_active', 'true')
      return { success: true, message: '解锁成功' }
    }
    return { success: false, message: '密码错误' }
  },

  logoutAdmin() {
    this.isAdmin = false
    sessionStorage.removeItem('music_admin_active')
  }
})

// 初始加载（优先使用本地存储的播放列表，即使为空也不回退到示例数据）
try {
  const raw = typeof window !== 'undefined' ? window.localStorage.getItem('customPlaylist') : null
  if (raw !== null) {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) {
      musicStore.playlist = arr
    }
  }
} catch (e) {
  console.warn('初始化播放列表失败', e)
}
