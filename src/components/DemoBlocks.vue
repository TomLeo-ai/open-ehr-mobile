<template>
  <section v-if="kind === 'section'" class="demo-block demo-card">
    <header class="demo-block__header">
      <div>
        <h2 class="demo-section-title">{{ title }}</h2>
        <p v-if="desc" class="demo-section-desc">{{ desc }}</p>
      </div>
      <slot name="extra" />
    </header>
    <slot />
  </section>

  <article v-else class="demo-block demo-muted-card">
    <slot />
  </article>
</template>

<script setup lang="ts">
defineOptions({ name: 'DemoBlocks' });

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
.demo-block {
  padding: var(--demo-space-4);
}

.demo-block__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--demo-space-3);
  margin-bottom: var(--demo-space-3);
}
</style>
