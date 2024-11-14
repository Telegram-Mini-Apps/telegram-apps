<script lang="ts">
  import {
    initData as sdkInitData,
    useSignal,
    type User,
  } from '@telegram-apps/sdk-svelte';
  import Page from '@/components/Page/Page.svelte';
  import DisplayData, {
    type IRow,
  } from '@/components/DisplayData/DisplayData.svelte';
  import { derived } from 'svelte/store';

  import './InitDataPage.css';

  const initData = useSignal(sdkInitData.state);
  const initDataRaw = useSignal(sdkInitData.raw);
  const canSendAfterDate = useSignal(sdkInitData.canSendAfterDate);

  const initDataRows = derived(
    [initData, initDataRaw, canSendAfterDate],
    ([$initData, $initDataRaw, $canSendAfterDate]) => {
      return (
        $initDataRaw &&
        $initData && [
          { title: 'raw', value: $initDataRaw },
          { title: 'auth_date', value: $initData.authDate.toLocaleString() },
          {
            title: 'auth_date (raw)',
            value: $initData.authDate.getTime() / 1000,
          },
          { title: 'hash', value: $initData.hash },
          { title: 'can_send_after', value: $canSendAfterDate?.toISOString() },
          { title: 'can_send_after (raw)', value: $initData.canSendAfter },
          { title: 'query_id', value: $initData.queryId },
          { title: 'start_param', value: $initData.startParam },
          { title: 'chat_type', value: $initData.chatType },
          { title: 'chat_instance', value: $initData.chatInstance },
        ]
      );
    }
  );

  const userRows = derived([initData], ([$initData]) => {
    const user = $initData?.user;
    return user && getUserRows(user);
  });

  const receiverRows = derived([initData], ([$initData]) => {
    const receiver = $initData?.receiver;
    return receiver && getUserRows(receiver);
  });

  const chatRows = derived([initData], ([$initData]) => {
    const chat = $initData?.chat;

    return chat
      ? [
          { title: 'id', value: chat.id.toString() },
          { title: 'title', value: chat.title },
          { title: 'type', value: chat.type },
          { title: 'username', value: chat.username },
          { title: 'photo_url', value: chat.photoUrl },
        ]
      : undefined;
  });

  function getUserRows(user: User): IRow[] {
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

<Page title="Init Data">
  {#snippet disclaimer()}
    This page displays application init data.
  {/snippet}

  {#if !$initDataRows}
    <i>Application was launched with missing init data</i>
  {:else}
    <div class="init-data-page__section">
      <h2 class="init-data-page__section-title">Init data</h2>
      <DisplayData rows={$initDataRows} />
    </div>

    <div class="init-data-page__section">
      <h2 class="init-data-page__section-title">User</h2>
      {#if !$userRows}
        <i>User information missing</i>
      {:else}
        <DisplayData rows={$userRows} />
      {/if}
    </div>

    <div class="init-data-page__section">
      <h2 class="init-data-page__section-title">Receiver</h2>
      {#if !$receiverRows}
        <i>Receiver information missing</i>
      {:else}
        <DisplayData rows={$receiverRows} />
      {/if}
    </div>

    <div class="init-data-page__section">
      <h2 class="init-data-page__section-title">Chat</h2>
      {#if !$chatRows}
        <i>Chat information missing</i>
      {:else}
        <DisplayData rows={$chatRows} />
      {/if}
    </div>
  {/if}
</Page>
