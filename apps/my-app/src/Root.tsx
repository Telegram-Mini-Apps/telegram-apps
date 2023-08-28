import { Component, createEffect, createSignal, onMount, Show } from 'solid-js';
import { retrieveLaunchParams, isColorDark } from '@twa.js/sdk';

import {
  AirplaneMode,
  Cellular,
  Sound,
  Check,
  safePostEvent,
} from './package-ui/index.js';
import {
  Alert,
  AlertItem,
  TableViewCell,
  Switch,
  TableView,
  TextField,
  DetailedTableViewCell,
  DetailedTableView,
} from './package-ui/index.js';

import styles from './styles.module.scss';

type ColorScheme = 'dark' | 'light';

function getColorScheme(): ColorScheme {
  try {
    const { themeParams: { backgroundColor } } = retrieveLaunchParams();

    return backgroundColor && isColorDark(backgroundColor) ? 'dark' : 'light';
  } catch (e) {
    return 'dark';
  }
}

function ColorSchemeTable() {
  const [colorScheme, setColorScheme] = createSignal(getColorScheme());

  createEffect(() => {
    const scheme = colorScheme();
    document.documentElement.setAttribute('color-scheme', scheme);
    safePostEvent('web_app_set_background_color', { color: scheme === 'dark' ? '#000' : '#F2F2F7' });
  });

  return (
    <TableView
      class={styles.table}
      title="Color scheme"
      description="Changing color scheme will lead to applying new CSS variables updating all colors"
    >
      <TableViewCell title="Dark" onClick={() => setColorScheme('dark')}>
        <Show when={colorScheme() === 'dark'}>
          <Check/>
        </Show>
      </TableViewCell>
      <TableViewCell title="Light" onClick={() => setColorScheme('light')}>
        <Show when={colorScheme() === 'light'}>
          <Check/>
        </Show>
      </TableViewCell>
    </TableView>
  );
}

function ItemsWithIconsTable() {
  const [sound, setSound] = createSignal(false);

  return (
    <TableView
      class={styles.table}
      title="Items with icons"
      description="According to Apple styleguides, it is required for icon to be 30px width"
    >
      <TableViewCell
        icon={<Cellular/>}
        title="Mobile Data"
        elevation={2}
        chevron
        clickable
      />
      <TableViewCell icon={<AirplaneMode/>} title="Airplane Mode">
        <Switch/>
      </TableViewCell>
      <TableViewCell icon={<Sound/>} title="Sound" label={sound() ? 'On' : 'Off'}>
        <Switch checked={sound()} onChange={e => setSound(e.target.checked)}/>
      </TableViewCell>
    </TableView>
  );
}

function DetailedTableSmall() {
  const [sound, setSound] = createSignal(false);

  return (
    <DetailedTableView class={styles.table} title="Detailed table (small cells)">
      <DetailedTableViewCell
        icon={<AirplaneMode/>}
        title="Airplane Mode"
        description="Disables all signals"
      >
        <Switch/>
      </DetailedTableViewCell>
      <DetailedTableViewCell icon={<Sound/>} title="Sound" label={sound() ? 'On' : 'Off'}>
        <Switch checked={sound()} onChange={e => setSound(e.target.checked)}/>
      </DetailedTableViewCell>
    </DetailedTableView>
  );
}

function DetailedTableLarge() {
  return (
    <DetailedTableView class={styles.table} title="Detailed table (big cells)" large>
      <DetailedTableViewCell
        icon={<Cellular/>}
        title="Mobile Data"
        description="Summary information about rouming"
        elevation={2}
        chevron
        clickable
      />
    </DetailedTableView>
  );
}

export const Root: Component = () => {
  const [showAlert, setShowAlert] = createSignal(false);

  onMount(() => {
    safePostEvent('web_app_expand');
    safePostEvent('web_app_open_popup', {
      title: 'Hello',
      message: 'there',
      buttons: [{type: 'ok', id: 'ok'}],
    })
  });

  return (
    <div class={styles.root}>
      <Alert title="Warning" show={showAlert()}>
        Here’s some alert text. It can span multiple lines if needed!
        <AlertItem title="Apply" variant="primary" onClick={() => setShowAlert(false)}/>
        <AlertItem title="Cancel"/>
      </Alert>

      <ColorSchemeTable/>
      <ItemsWithIconsTable/>
      <TableView class={styles.table} title="Cells with children">
        <TableViewCell title="Name">
          <TextField placeholder="Your full name"/>
        </TableViewCell>
        <TableViewCell title="Show alert" onClick={() => setShowAlert(true)} clickable/>
      </TableView>
      <DetailedTableSmall/>
      <DetailedTableLarge/>
    </div>
  );
};
