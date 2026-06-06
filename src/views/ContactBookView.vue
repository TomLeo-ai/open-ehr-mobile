<template>
  <DemoShell title="后台联系人" subtitle="HR 联系簿" show-back :with-tabbar="false">
    <section class="contact-book__search demo-card">
      <label>
        <span>搜索联系人</span>
        <input v-model.trim="keyword" type="search" placeholder="输入姓名、职责或邮箱" />
      </label>
    </section>

    <DemoBlocks title="HR 服务联系人" desc="点击联系人可查看电话、邮箱与联系信息。">
      <div class="contact-book__list">
        <button
          v-for="item in filteredContacts"
          :key="item.email"
          class="contact-book__item"
          type="button"
          @click="selectedContact = item"
        >
          <span class="contact-book__avatar">{{ item.name.slice(0, 1) }}</span>
          <span class="contact-book__main">
            <strong>{{ item.name }}</strong>
            <small>{{ item.role }}</small>
          </span>
          <b>›</b>
        </button>
        <p v-if="filteredContacts.length === 0" class="contact-book__empty">未找到匹配联系人</p>
      </div>
    </DemoBlocks>

    <div v-if="selectedContact" class="contact-book__dialog" role="dialog" aria-modal="true">
      <article class="contact-book__dialog-card demo-card">
        <span class="contact-book__avatar contact-book__avatar--large">{{ selectedContact.name.slice(0, 1) }}</span>
        <h2>{{ selectedContact.name }}</h2>
        <p>{{ selectedContact.role }}</p>
        <dl>
          <div>
            <dt>电话</dt>
            <dd>{{ selectedContact.phone }}</dd>
          </div>
          <div>
            <dt>邮箱</dt>
            <dd>{{ selectedContact.email }}</dd>
          </div>
        </dl>
        <div class="contact-book__dialog-actions">
          <button class="demo-secondary-button" type="button" @click="selectedContact = null">关闭</button>
          <button class="demo-primary-button" type="button" @click="copyContact">复制信息</button>
        </div>
      </article>
    </div>

    <DemoToast :message="toastMessage" />
  </DemoShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DemoBlocks from '@/components/DemoBlocks.vue';
import DemoShell from '@/components/DemoShell.vue';
import DemoToast from '@/components/DemoToast.vue';
import { contactBook } from '@/data/mock';

type ContactItem = (typeof contactBook)[number];

const keyword = ref('');
const selectedContact = ref<ContactItem | null>(null);
const toastMessage = ref('');
let timer: number | undefined;

const filteredContacts = computed(() => {
  const text = keyword.value.toLowerCase();
  if (!text) return contactBook;
  return contactBook.filter((item) => {
    return [item.name, item.role, item.phone, item.email].some((value) => value.toLowerCase().includes(text));
  });
});

const showToast = (message: string) => {
  toastMessage.value = message;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    toastMessage.value = '';
  }, 2200);
};

const copyContact = () => {
  if (!selectedContact.value) return;
  const message = `${selectedContact.value.name} ${selectedContact.value.phone} ${selectedContact.value.email}`;
  void navigator.clipboard?.writeText(message);
  selectedContact.value = null;
  showToast('联系人信息已复制');
};
</script>

<style scoped>
.contact-book__search {
  padding: var(--demo-space-4);
}

.contact-book__search label {
  display: grid;
  gap: var(--demo-space-2);
}

.contact-book__search span {
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.contact-book__search input {
  width: 100%;
  min-height: 44px;
  border: 0;
  border-radius: var(--demo-radius-md);
  outline: 0;
  color: var(--demo-color-text);
  background: var(--demo-color-surface-inset);
  padding: 0 14px;
  font-size: 14px;
}

.contact-book__list {
  display: grid;
  gap: var(--demo-space-3);
}

.contact-book__item {
  display: grid;
  width: 100%;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
  text-align: left;
}

.contact-book__avatar {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-md);
  color: rgba(255, 255, 255, 0.96);
  background: var(--demo-color-primary);
  font-size: 17px;
  font-weight: 700;
}

.contact-book__avatar--large {
  width: 64px;
  height: 64px;
  justify-self: center;
  border-radius: var(--demo-radius-xl);
  font-size: 24px;
}

.contact-book__main {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.contact-book__main strong,
.contact-book__dialog-card h2 {
  color: var(--demo-color-text);
  font-size: 16px;
}

.contact-book__main small,
.contact-book__empty,
.contact-book__dialog-card p,
dt {
  color: var(--demo-color-text-tertiary);
  font-size: 13px;
}

.contact-book__item b {
  color: var(--demo-color-text-quaternary);
  font-size: 22px;
}

.contact-book__empty {
  margin: 0;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-4);
  text-align: center;
}

.contact-book__dialog {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(32, 50, 65, 0.28);
  padding: var(--demo-space-4);
}

.contact-book__dialog-card {
  display: grid;
  width: min(398px, 100%);
  gap: var(--demo-space-3);
  padding: var(--demo-space-5);
  text-align: center;
}

.contact-book__dialog-card h2,
.contact-book__dialog-card p {
  margin: 0;
}

dl {
  display: grid;
  gap: var(--demo-space-2);
  margin: 0;
}

dl div {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: var(--demo-space-3);
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 10px 12px;
  text-align: left;
}

dd {
  min-width: 0;
  margin: 0;
  color: var(--demo-color-text);
  font-size: 14px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.contact-book__dialog-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--demo-space-3);
}

@media (max-width: 360px) {
  .contact-book__dialog-actions,
  dl div {
    grid-template-columns: 1fr;
  }
}
</style>
