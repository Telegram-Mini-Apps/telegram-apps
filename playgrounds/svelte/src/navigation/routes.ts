import { type SvelteComponent } from 'svelte';
import InitDataPage from '@/pages/InitDataPage/InitDataPage.svelte';
import ThemeParamsPage from '@/pages/ThemeParamsPage/ThemeParamsPage.svelte';
import LaunchParamsPage from '@/pages/LaunchParamsPage/LaunchParamsPage.svelte';

interface Route {
  id: string;
  path: string;
  Component?: typeof SvelteComponent;
  title: string;
}
  
const ROOT = '/svelte-template';

const routes: Route[] = [  
  { id: 'home', path: ROOT, title: 'Main Page'},
  { id: 'initData', path: ROOT + '/init-data', Component: InitDataPage, title: 'Init Data' },
  { id: 'theme', path: ROOT + '/theme-params', Component: ThemeParamsPage, title: 'Theme Params' },
  { id: 'launch', path: ROOT + '/launch-params', Component: LaunchParamsPage, title: 'Launch Params' }
]

export default routes;