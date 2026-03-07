<template>
  <div class="search-bar-container">
    <div class="search-bar-wrapper">
      <v-menu offset-y transition="slide-y-transition">
        <template #activator="{ props }">
          <v-btn
            variant="text"
            color="white"
            class="engine-select-btn"
            v-bind="props"
          >
            {{ currentEngine.name }}
            <v-icon end>mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list class="bg-grey-darken-4 text-white">
          <v-list-item
            v-for="engine in engines"
            :key="engine.name"
            :active="currentEngine.name === engine.name"
            class="hover-bg"
            @click="currentEngine = engine"
          >
            <v-list-item-title>{{ engine.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <div class="divider"></div>

      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('search.placeholder') || '搜索...'"
        class="search-input"
        @keyup.enter="handleSearch"
      />

      <v-btn
        icon="mdi-magnify"
        variant="text"
        color="white"
        class="search-btn"
        @click="handleSearch"
      ></v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const engines = [
  { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { name: 'Google', url: 'https://www.google.com/search?q=' }
]

const currentEngine = ref(engines[0])
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    window.open(`${currentEngine.value.url}${encodeURIComponent(searchQuery.value.trim())}`, '_blank')
    searchQuery.value = ''
  }
}
</script>

<style scoped>
.search-bar-container {
  width: min(100%, 660px);
  margin: 0 auto;
}

.search-bar-wrapper {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, rgba(59, 78, 95, 0.7), rgba(80, 98, 113, 0.52));
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  transition: all 0.25s ease;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.22);
}

.search-bar-wrapper:focus-within {
  transform: translateY(-1px);
  background: linear-gradient(90deg, rgba(66, 88, 107, 0.78), rgba(94, 112, 126, 0.62));
  border-color: rgba(var(--v-theme-primary), 0.45);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.26);
}

.engine-select-btn {
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
  min-width: 88px;
  border-radius: 999px;
  padding: 0 10px;
}

.divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.18);
  margin: 0 12px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  padding: 0.8rem 0.25rem;
  font-size: clamp(0.95rem, 1.1vw, 1.08rem);
  width: 100%;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.58);
}

.search-btn {
  margin-left: 0.35rem;
  transition: transform 0.2s ease;
}

.search-btn:hover {
  transform: scale(1.08);
}

.hover-bg:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 600px) {
  .search-bar-container {
    width: 100%;
  }

  .search-bar-wrapper {
    padding: 0.2rem 0.7rem;
  }

  .engine-select-btn {
    min-width: 64px;
    font-size: 0.8rem;
  }

  .divider {
    margin: 0 8px;
  }

  .search-input {
    font-size: 0.92rem;
    padding: 0.7rem 0.1rem;
  }
}
</style>
