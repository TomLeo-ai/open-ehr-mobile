<template>
  <section v-if="kind === 'section'" class="section-block">
    <header class="section-block__header">
      <div>
        <h2 class="demo-section-title">{{ title }}</h2>
        <p v-if="desc" class="demo-section-desc">{{ desc }}</p>
      </div>
      <slot name="extra" />
    </header>
    <slot />
  </section>

  <article v-else class="section-block demo-muted-card">
    <slot />
  </article>
</template>

<script setup lang="ts">
defineOptions({ name: 'SectionBlock' });

defineProps({
  kind: {
    type: String,
    default: 'section',
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.section-block {
  min-width: 0;
}

.section-block__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ehr-space-3);
  margin-bottom: var(--ehr-space-3);
}

.section-block__header > div {
  min-width: 0;
}
</style>
