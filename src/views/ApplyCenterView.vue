<template>
  <DemoShell title="流程申请" subtitle="员工流程服务">
    <section class="apply-center__hero demo-card">
      <p>流程申请中心</p>
      <h1>常用申请集中办理</h1>
      <span>支持新增申请、查看详情和重新发起，移动端按业务场景分组展示。</span>
    </section>

    <DemoBlocks title="常用流程" desc="覆盖证明、推荐奖励、居住证和户籍办理等高频申请。">
      <div class="apply-center__list">
        <article v-for="item in primaryEntries" :key="item.title" class="apply-center__item">
          <span>{{ item.icon }}</span>
          <div>
            <strong>{{ item.title }}</strong>
            <small>{{ item.desc }}</small>
            <nav>
              <RouterLink :to="item.path">新增</RouterLink>
              <RouterLink :to="item.detailPath">详情</RouterLink>
              <RouterLink :to="item.reissuePath">重发起</RouterLink>
            </nav>
          </div>
        </article>
      </div>
    </DemoBlocks>

    <DemoBlocks title="其他流程" desc="覆盖考勤异常、离职等员工服务场景。">
      <div class="apply-center__list">
        <article v-for="item in laterEntries" :key="item.title" class="apply-center__item">
          <span>{{ item.icon }}</span>
          <div>
            <strong>{{ item.title }}</strong>
            <small>{{ item.desc }}</small>
            <nav>
              <RouterLink :to="item.path">新增</RouterLink>
              <RouterLink :to="item.detailPath">详情</RouterLink>
              <RouterLink :to="item.reissuePath">重发起</RouterLink>
            </nav>
          </div>
        </article>
      </div>
    </DemoBlocks>
  </DemoShell>
</template>

<script setup lang="ts">
import DemoBlocks from '@/components/DemoBlocks.vue';
import DemoShell from '@/components/DemoShell.vue';

const primaryEntries = [
  { title: '在职/收入证明申请', desc: '员工信息、证明用途、收取类型、模板、签收与附件。', path: '/apply/on-job', detailPath: '/apply/on-job/detail/CERT-20260601-001', reissuePath: '/apply/on-job/reissue/CERT-20260601-001', icon: '证' },
  { title: '内部推荐奖励申请', desc: '推荐人、被推荐人、岗位入职、奖励说明与附件。', path: '/apply/recommend-reward', detailPath: '/apply/recommend-reward/detail/REF-20260601-001', reissuePath: '/apply/recommend-reward/reissue/REF-20260601-001', icon: '荐' },
  { title: '居住证/户籍办理申请', desc: '申请类别、事项、工作业绩、学历与材料附件。', path: '/apply/settle', detailPath: '/apply/settle/detail/RESIDE-20260601-001', reissuePath: '/apply/settle/reissue/RESIDE-20260601-001', icon: '居' },
];

const laterEntries = [
  { title: '考勤异常申请', desc: '异常类别、日期、时长、事由、附件与审批状态。', path: '/apply/attendance-exception', detailPath: '/apply/attendance-exception/detail/ATT-20260601-001', reissuePath: '/apply/attendance-exception/reissue/ATT-20260601-001', icon: '勤' },
  { title: '离职申请', desc: '离职原因、领取方式、调研问卷、竞业和文书材料。', path: '/apply/resignation', detailPath: '/apply/resignation/detail/OFFBOARD-20260601-001', reissuePath: '/apply/resignation/reissue/OFFBOARD-20260601-001', icon: '离' },
];
</script>

<style scoped>
.apply-center__hero {
  padding: var(--demo-space-5);
  background: linear-gradient(180deg, rgba(236, 244, 255, 0.92), #fff);
}

.apply-center__hero p {
  margin: 0;
  color: var(--demo-color-primary-dark);
  font-size: 12px;
  font-weight: 700;
}

.apply-center__hero h1 {
  margin: 4px 0;
  font-size: 24px;
  line-height: 1.25;
}

.apply-center__hero span {
  color: var(--demo-color-text-secondary);
  font-size: 13px;
}

.apply-center__list {
  display: grid;
  gap: var(--demo-space-3);
}

.apply-center__item {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: var(--demo-space-3);
  align-items: center;
  border-radius: var(--demo-radius-md);
  background: var(--demo-color-surface-muted);
  padding: var(--demo-space-3);
}

.apply-center__item span {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-md);
  color: var(--demo-color-primary-dark);
  background: var(--demo-color-primary-soft);
  font-weight: 700;
}

.apply-center__item strong,
.apply-center__item small {
  display: block;
}

.apply-center__item strong {
  color: var(--demo-color-text);
  font-size: 15px;
}

.apply-center__item small {
  color: var(--demo-color-text-tertiary);
  font-size: 12px;
}

.apply-center__item nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--demo-space-2);
  margin-top: var(--demo-space-2);
}

.apply-center__item nav a {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  justify-content: center;
  border-radius: var(--demo-radius-full);
  color: var(--demo-color-primary-dark);
  background: #fff;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 600;
}
</style>
