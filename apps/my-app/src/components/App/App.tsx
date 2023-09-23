import { Route, Router, hashIntegration, Routes, Navigate } from '@solidjs/router';
import { Transition } from 'solid-transition-group';

import { AddApplication } from '../../pages/AddApplication/index.js';
import { Home } from '../../pages/Home/index.js';

import styles from './style.module.scss';

const ANIMATION_DURATION = 300;

export function App() {
  const animate = (_el: any, done: () => void) => setTimeout(done, ANIMATION_DURATION);

  return (
    <Transition
      enterActiveClass={styles.enter}
      enterToClass={styles.enterActive}
      onEnter={animate}
      onExit={animate}
    >
      <Router source={hashIntegration()}>
        <Routes>
          <Route path={'/'} element={<Home/>}/>
          <Route path={'/add-application'} element={<AddApplication/>}/>
          <Route path={'*'} element={<Navigate href={'/'}/>}/>
        </Routes>
      </Router>
    </Transition>
  );
}
