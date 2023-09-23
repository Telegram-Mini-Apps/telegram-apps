import styles from './styles.module.scss';
import logoUrl from './logo.png';

export function Home() {
  return (
    <div class={styles.root}>
      <img class={styles.image} alt={'Logo'} src={logoUrl}/>
      <p class={styles.title}>Add your application</p>
      <p class={styles.subtitle}>
        Here, all your applications that you add to the store will be displayed
      </p>
      <p class={styles.button}>Add application</p>
    </div>
  );
}