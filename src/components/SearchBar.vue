<template>
  <div class="search-bar-container">
    <div class="search-bar-wrapper">
      <v-menu offset-y transition="slide-y-transition">
        <template v-slot:activator="{ props }">
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
            @click="currentEngine = engine"
            :active="currentEngine.name === engine.name"
            class="hover-bg"
          >
            <v-list-item-title>{{ engine.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <div class="divider"></div>

      <input
        type="text"
        v-model="searchQuery"
        :placeholder="$t('search.placeholder') || '搜索...'"
        @keyup.enter="handleSearch"
        class="search-input"
      />

      <v-btn
        icon="mdi-magnify"
        variant="text"
        color="white"
        @click="handleSearch"
        class="search-btn"
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
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.search-bar-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 5px 15px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.search-bar-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(var(--v-theme-primary), 0.5);
  box-shadow: 0 8px 32px rgba(var(--v-theme-primary), 0.2);
}

.engine-select-btn {
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
  min-width: 100px;
  border-radius: 40px;
}

.divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 10px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1.1rem;
  padding: 10px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-btn {
  transition: transform 0.2s ease;
}

.search-btn:hover {
  transform: scale(1.1);
}

.hover-bg:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
