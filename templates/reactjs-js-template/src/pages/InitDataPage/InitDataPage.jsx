import { useMemo } from 'react';
import { useInitData, useLaunchParams } from '@tma.js/sdk-react';

import { DisplayData } from '@/components/DisplayData/DisplayData.jsx';
import { Link } from '@/components/Link/Link.jsx';
import { Page } from '@/components/Page/Page.jsx';

import './InitDataPage.css';

/**
 * @param {import('@tma.js/sdk-react').User} user
 * @returns {DisplayDataRow[]}
 */
function getUserRows(user) {
  return [
    { title: 'id', value: user.id.toString() },
    { title: 'last_name', value: user.lastName },
    { title: 'first_name', value: user.firstName },
    { title: 'is_bot', value: user.isBot },
    { title: 'is_premium', value: user.isPremium },
    { title: 'language_code', value: user.languageCode },
  ];
}

/**
 * @returns {JSX.Element}
 */
export function InitDataPage() {
  const initDataRaw = useLaunchParams().initDataRaw;
  const initData = useInitData();

  const initDataRows = useMemo(() => {
    if (!initData || !initDataRaw) {
      return;
    }
    const {
      hash,
      queryId,
      chatType,
      chatInstance,
      authDate,
      startParam,
      canSendAfter,
      canSendAfterDate,
    } = initData;
    return [
      { title: 'raw', value: initDataRaw },
      { title: 'auth_date', value: authDate.toLocaleString() },
      { title: 'auth_date (raw)', value: authDate.getTime() / 1000 },
      { title: 'hash', value: hash },
      { title: 'can_send_after', value: canSendAfterDate?.toISOString() },
      { title: 'can_send_after (raw)', value: canSendAfter },
      { title: 'query_id', value: queryId },
      { title: 'start_param', value: startParam },
      { title: 'chat_type', value: chatType },
      { title: 'chat_instance', value: chatInstance },
    ];
  }, [initData, initDataRaw]);

  const userRows = useMemo(() => {
    return initData && initData.user ? getUserRows(initData.user) : undefined;
  }, [initData]);

  const receiverRows = useMemo(() => {
    return initData && initData.receiver ? getUserRows(initData.receiver) : undefined;
  }, [initData]);

  const chatRows = useMemo(() => {
    if (!initData?.chat) {
      return;
    }
    const { id, title, type, username, photoUrl } = initData.chat;

    return [
      { title: 'id', value: id.toString() },
      { title: 'title', value: title },
      { title: 'type', value: type },
      { title: 'username', value: username },
      { title: 'photo_url', value: photoUrl },
    ];
  }, [initData]);

  let contentNode;

  if (!initDataRows) {
    contentNode = <i>Application was launched with missing init data</i>;
  } else {
    contentNode = (
      <>
        <div className="init-data-page__section">
          <h2 className="init-data-page__section-title">Init data</h2>
          <DisplayData rows={initDataRows} />
        </div>

        <div className="init-data-page__section">
          <h2 className="init-data-page__section-title">User</h2>
          {userRows
            ? <DisplayData rows={userRows} />
            : <i>User information missing</i>}
        </div>

        <div className="init-data-page__section">
          <h2 className="init-data-page__section-title">Receiver</h2>
          {receiverRows
            ? <DisplayData rows={receiverRows} />
            : <i>Receiver information missing</i>}
        </div>

        <div className="init-data-page__section">
          <h2 className="init-data-page__section-title">Chat</h2>
          {chatRows
            ? <DisplayData rows={chatRows} />
            : <i>Chat information missing</i>}
        </div>
      </>
    );
  }

  return (
    <Page
      title="Init Data"
      disclaimer={(
        <>
          This page displays application
          {' '}
          <Link to="https://docs.telegram-mini-apps.com/platform/launch-parameters">
            init data
          </Link>
          .
        </>
      )}
    >
      {contentNode}
    </Page>
  );
}
