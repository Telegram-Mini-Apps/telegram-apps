<script setup lang="ts">
import { computed } from 'vue';
import { initData as $initData, useSignal, type User } from '@telegram-apps/sdk-vue';
import UiLink from '@/components/UiLink.vue';
import UiPage from '@/components/UiPage.vue';
import UiDisplayData, { type DisplayDataRow } from '@/components/UiDisplayData.vue';

const initData = useSignal($initData.state);
const initDataRaw = useSignal($initData.raw);
const canSendAfterDate = useSignal($initData.canSendAfterDate);

const initDataRows = computed<DisplayDataRow[] | undefined>(() => {
  const complete = initData.value;

  return complete && initDataRaw.value
    ? [
      { title: 'raw', value: initDataRaw.value },
      { title: 'auth_date', value: complete.authDate.toLocaleString() },
      { title: 'auth_date (raw)', value: complete.authDate.getTime() / 1000 },
      { title: 'hash', value: complete.hash },
      { title: 'can_send_after', value: canSendAfterDate.value?.toISOString() },
      { title: 'can_send_after (raw)', value: complete.canSendAfter },
      { title: 'query_id', value: complete.queryId },
      { title: 'start_param', value: complete.startParam },
      { title: 'chat_type', value: complete.chatType },
      { title: 'chat_instance', value: complete.chatInstance },
    ]
    : undefined;
});

const userRows = computed<DisplayDataRow[] | undefined>(() => {
  const user = initData.value?.user;

  return user ? getUserRows(user) : undefined;
})

const receiverRows = computed<DisplayDataRow[] | undefined>(() => {
  const receiver = initData.value?.receiver;

  return receiver ? getUserRows(receiver) : undefined;
})

const chatRows = computed<DisplayDataRow[] | undefined>(() => {
  const chat = initData.value?.chat;

  return chat
    ? [
      { title: 'id', value: chat.id.toString() },
      { title: 'title', value: chat.title },
      { title: 'type', value: chat.type },
      { title: 'username', value: chat.username },
      { title: 'photo_url', value: chat.photoUrl },
    ]
    : undefined;
})

function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: 'id', value: user.id.toString() },
    { title: 'username', value: user.username },
    { title: 'photo_url', value: user.photoUrl },
    { title: 'last_name', value: user.lastName },
    { title: 'first_name', value: user.firstName },
    { title: 'is_bot', value: user.isBot },
    { title: 'is_premium', value: user.isPremium },
    { title: 'language_code', value: user.languageCode },
    { title: 'allows_to_write_to_pm', value: user.allowsWriteToPm },
    { title: 'added_to_attachment_menu', value: user.addedToAttachmentMenu },
  ];
}
</script>

<template>
  <UiPage title="Init Data">
    <template #disclaimer>
      This page displays application
      <UiLink to="https://docs.telegram-mini-apps.com/platform/init-data">init data</UiLink>.
    </template>
    <i v-if="!initDataRows">Application was launched with missing init data</i>
    <template v-else>
      <div class="init-data-page__section">
        <h2 class="init-data-page__section-title">Init data</h2>
        <UiDisplayData :rows="initDataRows" />
      </div>

      <div class="init-data-page__section">
        <h2 class="init-data-page__section-title">User</h2>
        <i v-if="!userRows">User information missing</i>
        <UiDisplayData v-else :rows="userRows" />
      </div>

      <div class="init-data-page__section">
        <h2 class="init-data-page__section-title">Receiver</h2>
        <i v-if="!receiverRows">Receiver information missing</i>
        <UiDisplayData v-else :rows="receiverRows" />
      </div>

      <div class="init-data-page__section">
        <h2 class="init-data-page__section-title">Chat</h2>
        <i v-if="!chatRows">Chat information missing</i>
        <UiDisplayData v-else :rows="chatRows" />
      </div>
    </template>
  </UiPage>
</template>

<style scoped>
.init-data-page__section+.init-data-page__section {
  margin-top: 12px;
}

.init-data-page__section-title {
  margin-bottom: 4px;
}
</style>