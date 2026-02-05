<template>
  <v-row>
    <v-col
      v-for="(project, index) in projects"
      :key="index"
      cols="12"
      sm="6"
      lg="4"
    >
      <v-hover v-slot="{ isHovering, props }">
        <v-card
          v-bind="props"
          class="project-card mx-auto"
          :class="{ 'on-hover': isHovering }"
          :elevation="isHovering ? 16 : 2"
        >
          <v-img
            :src="project.image"
            height="200px"
            cover
          ></v-img>
          
          <v-card-title class="text-white">{{ project.title }}</v-card-title>
          
          <v-card-text class="text-grey-lighten-1">
            {{ project.description }}
          </v-card-text>
          
          <div class="px-4 pb-4">
            <v-chip
              v-for="tag in project.tags"
              :key="tag"
              size="small"
              class="mr-2 mb-2"
              color="primary"
              variant="outlined"
            >
              {{ tag }}
            </v-chip>
          </div>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="text"
              :href="project.link"
              target="_blank"
            >
              {{ $t('projects.view_project') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { projects as projectsData } from '../data.js'

const { tm } = useI18n()

const projects = computed(() => {
  const items = tm('projects.items')
  return projectsData.map((p, i) => ({
    ...p,
    title: items[i]?.title,
    description: items[i]?.description
  }))
})
</script>

<style scoped>
.project-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.on-hover {
  transform: translateY(-10px) rotateX(2deg);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>
