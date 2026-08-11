<template>
  <AppShell title="HR 联系人" subtitle="员工服务联系簿" show-back :with-tabbar="false">
    <section class="contact-book__search demo-card">
      <div class="contact-book__search-head">
        <div>
          <p class="contact-book__eyebrow">服务触达</p>
          <h2>查找 HR 支持人</h2>
          <p>联系人数据来自公开 mock 样例，适合演示员工自助服务路径。</p>
        </div>
        <span class="contact-book__tag">Mock 数据</span>
      </div>

      <label class="contact-book__field">
        <span>搜索联系人</span>
        <div class="contact-book__input-shell">
          <Search class="contact-book__input-icon" :size="18" :stroke-width="1.9" aria-hidden="true" />
          <input
            v-model.trim="keyword"
            type="search"
            placeholder="输入姓名、职责或邮箱"
            aria-describedby="contact-book-search-hint"
          />
          <button
            v-if="keyword"
            class="contact-book__clear"
            type="button"
            aria-label="清空搜索关键词"
            @click="clearKeyword"
          >
            <X :size="17" :stroke-width="2" aria-hidden="true" />
          </button>
        </div>
      </label>
      <p id="contact-book-search-hint" class="contact-book__hint">{{ contactStatusText }}</p>
    </section>

    <SectionBlock title="HR 服务联系人" desc="点击联系人可查看电话、邮箱与联系信息。">
      <div class="contact-book__list">
        <button
          v-for="item in filteredContacts"
          :key="item.email"
          class="contact-book__item"
          type="button"
          :aria-label="`查看${item.name}，${item.role}联系方式`"
          @click="openContact(item)"
        >
          <span class="contact-book__avatar" aria-hidden="true">
            <UsersRound :size="21" :stroke-width="1.9" aria-hidden="true" />
          </span>
          <span class="contact-book__main">
            <strong>{{ item.name }}</strong>
            <small>{{ item.role }}</small>
            <em>{{ item.email }}</em>
          </span>
          <ChevronRight class="contact-book__chevron" :size="20" :stroke-width="2" aria-hidden="true" />
        </button>
        <div v-if="filteredContacts.length === 0" class="contact-book__empty" role="status">
          <span class="contact-book__empty-icon" aria-hidden="true">
            <UserRoundSearch :size="26" :stroke-width="1.8" aria-hidden="true" />
          </span>
          <strong>未找到匹配联系人</strong>
          <p>请尝试更换姓名、职责或邮箱关键词。</p>
        </div>
      </div>
    </SectionBlock>

    <div
      v-if="selectedContact"
      class="contact-book__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-book-dialog-title"
      aria-describedby="contact-book-dialog-desc"
      @click.self="closeContact"
    >
      <article class="contact-book__dialog-card demo-card">
        <button
          class="contact-book__dialog-close"
          type="button"
          aria-label="收起联系人详情"
          @click="closeContact"
        >
          <X :size="18" :stroke-width="2" aria-hidden="true" />
        </button>
        <span class="contact-book__avatar contact-book__avatar--large" aria-hidden="true">
          <UsersRound :size="28" :stroke-width="1.8" aria-hidden="true" />
        </span>
        <h2 id="contact-book-dialog-title">{{ selectedContact.name }}</h2>
        <p id="contact-book-dialog-desc">{{ selectedContact.role }}，可用于演示 HR 自助服务联系链路。</p>
        <dl>
          <div>
            <dt>
              <Phone :size="16" :stroke-width="1.9" aria-hidden="true" />
              电话
            </dt>
            <dd>{{ selectedContact.phone }}</dd>
          </div>
          <div>
            <dt>
              <Mail :size="16" :stroke-width="1.9" aria-hidden="true" />
              邮箱
            </dt>
            <dd>{{ selectedContact.email }}</dd>
          </div>
        </dl>
        <div class="contact-book__dialog-actions">
          <button class="demo-secondary-button" type="button" @click="closeContact">关闭</button>
          <button class="demo-primary-button" type="button" @click="copyContact">复制信息</button>
        </div>
        <p class="contact-book__dialog-note">
          <Info :size="15" :stroke-width="1.9" aria-hidden="true" />
          本页不连接真实企业通讯录或外部消息系统。
        </p>
      </article>
    </div>

    <ToastMessage :message="toastMessage" />
  </AppShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronRight, Info, Mail, Phone, Search, UserRoundSearch, UsersRound, X } from '@lucide/vue';
import SectionBlock from '@/components/SectionBlock.vue';
import AppShell from '@/components/AppShell.vue';
import ToastMessage from '@/components/ToastMessage.vue';
import { useToastMessage } from '@/composables/useToastMessage';
import { contactBook } from '@/data/mock';

defineOptions({ name: 'ContactBookView' });

type ContactItem = (typeof contactBook)[number];

const keyword = ref('');
const selectedContact = ref<ContactItem | null>(null);
const { toastMessage, showToast } = useToastMessage();

const filteredContacts = computed(() => {
  const text = keyword.value.toLowerCase();
  if (!text) return contactBook;
  return contactBook.filter((item) => {
    return [item.name, item.role, item.phone, item.email].some((value) => value.toLowerCase().includes(text));
  });
});

const contactStatusText = computed(() => {
  if (keyword.value) return `已筛选出 ${filteredContacts.value.length} 位联系人`;
  return `共 ${contactBook.length} 位公开示例联系人`;
});

const clearKeyword = () => {
  keyword.value = '';
};

const openContact = (item: ContactItem) => {
  selectedContact.value = item;
};

const closeContact = () => {
  selectedContact.value = null;
};

const copyContact = () => {
  if (!selectedContact.value) return;
  const message = `${selectedContact.value.name} ${selectedContact.value.phone} ${selectedContact.value.email}`;
  void navigator.clipboard?.writeText(message).catch(() => undefined);
  closeContact();
  showToast('联系人信息已复制');
};
</script>

<style scoped>
.contact-book__search {
  display: grid;
  gap: var(--demo-space-4);
  padding: var(--demo-space-4);
}

.contact-book__search-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--demo-space-3);
}

.contact-book__search-head h2,
.contact-book__search-head p,
.contact-book__dialog-card h2,
.contact-book__dialog-card p,
.contact-book__empty p,
.contact-book__dialog-note {
  margin: 0;
}

.contact-book__eyebrow {
  color: var(--demo-color-primary-dark);
  font-size: 12px;
  font-weight: 700;
}

.contact-book__search-head h2 {
  margin: 2px 0 4px;
  color: var(--demo-color-text);
  font-size: 18px;
  line-height: 1.35;
}

.contact-book__search-head p,
.contact-book__hint,
.contact-book__dialog-note,
.contact-book__empty p {
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  line-height: 1.55;
}

.contact-book__tag {
  flex: 0 0 auto;
  border: 1px solid var(--demo-color-border);
  border-radius: var(--demo-radius-full);
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.contact-book__field {
  display: grid;
  gap: var(--demo-space-2);
}

.contact-book__field > span {
  color: var(--demo-color-text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.contact-book__input-shell {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  min-height: 48px;
  border: 1px solid transparent;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-text-secondary);
  background: var(--demo-color-surface-inset);
  padding: 0 6px 0 13px;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.contact-book__input-shell:focus-within {
  border-color: var(--demo-color-primary-light);
  background: var(--demo-color-surface);
  box-shadow: 0 0 0 3px rgba(107, 140, 174, 0.14);
}

.contact-book__input-icon {
  flex: 0 0 auto;
}

.contact-book__search input {
  width: 100%;
  min-width: 0;
  min-height: 46px;
  border: 0;
  outline: 0;
  color: var(--demo-color-text);
  background: transparent;
  padding: 0 10px;
  font-size: 16px;
}

.contact-book__search input::placeholder {
  color: var(--demo-color-text-tertiary);
}

.contact-book__clear,
.contact-book__dialog-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: var(--demo-radius-full);
  color: var(--demo-color-text-secondary);
  background: transparent;
  touch-action: manipulation;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.16s ease;
}

.contact-book__clear {
  width: 38px;
  min-width: 38px;
  height: 38px;
}

.contact-book__hint {
  margin: calc(var(--demo-space-2) * -1) 0 0;
}

.contact-book__list {
  display: grid;
  gap: var(--demo-space-3);
}

.contact-book__item {
  display: grid;
  width: 100%;
  min-height: 76px;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  gap: var(--demo-space-3);
  align-items: center;
  border: 1px solid transparent;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
  text-align: left;
  touch-action: manipulation;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease, transform 0.16s ease;
}

.contact-book__avatar {
  display: inline-flex;
  width: 46px;
  height: 46px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.contact-book__avatar--large {
  width: 64px;
  height: 64px;
  justify-self: center;
  border-radius: var(--demo-radius-xl);
  color: rgba(255, 255, 255, 0.96);
  background: var(--demo-color-primary);
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
  line-height: 1.35;
}

.contact-book__main small,
.contact-book__dialog-card p,
dt {
  color: var(--demo-color-text-tertiary);
  font-size: 13px;
  line-height: 1.45;
}

.contact-book__main em {
  min-width: 0;
  overflow: hidden;
  color: var(--demo-color-text-secondary);
  font-size: 12px;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact-book__chevron {
  color: var(--demo-color-text-quaternary);
}

.contact-book__clear:hover,
.contact-book__dialog-close:hover,
.contact-book__clear:focus-visible,
.contact-book__dialog-close:focus-visible {
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-surface-strong);
}

.contact-book__item:hover,
.contact-book__item:focus-visible {
  border-color: var(--demo-color-primary-light);
  background: var(--demo-color-surface);
  box-shadow: var(--demo-shadow-sm);
}

.contact-book__item:focus-visible,
.contact-book__clear:focus-visible,
.contact-book__dialog-close:focus-visible {
  outline: 2px solid var(--demo-color-primary);
  outline-offset: 2px;
}

.contact-book__item:active,
.contact-book__clear:active,
.contact-book__dialog-close:active {
  transform: scale(0.98);
}

.contact-book__empty {
  display: grid;
  justify-items: center;
  gap: var(--demo-space-2);
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-5) var(--demo-space-4);
  text-align: center;
}

.contact-book__empty-icon {
  display: inline-flex;
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-lg);
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
}

.contact-book__empty strong {
  color: var(--demo-color-text);
  font-size: 15px;
}

.contact-book__dialog {
  position: fixed;
  z-index: 60;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(32, 50, 65, 0.42);
  padding: var(--demo-space-4) var(--demo-space-4) calc(var(--demo-safe-bottom) + var(--demo-space-4));
}

.contact-book__dialog-card {
  position: relative;
  display: grid;
  width: min(398px, 100%);
  gap: var(--demo-space-3);
  padding: var(--demo-space-6) var(--demo-space-5) var(--demo-space-5);
  text-align: center;
  animation: contact-book-sheet-in 0.22s ease-out;
}

.contact-book__dialog-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  background: var(--demo-color-surface-muted);
}

dl {
  display: grid;
  gap: var(--demo-space-2);
  margin: 0;
}

dl div {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: var(--demo-space-3);
  align-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: 10px 12px;
  text-align: left;
}

dt {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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

.contact-book__dialog-actions button {
  min-height: 46px;
  touch-action: manipulation;
}

.contact-book__dialog-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

@keyframes contact-book-sheet-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-book__dialog-card {
    animation: none;
  }

  .contact-book__item,
  .contact-book__clear,
  .contact-book__dialog-close,
  .contact-book__input-shell {
    transition: none;
  }
}

@media (max-width: 360px) {
  .contact-book__dialog-actions,
  dl div {
    grid-template-columns: 1fr;
  }

  .contact-book__search-head {
    display: grid;
  }
}
</style>
