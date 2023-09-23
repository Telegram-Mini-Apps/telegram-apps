import { Button, Typography, View } from '../../package-ui/index.js';
import { useNavigate } from '@solidjs/router';

import styles from './styles.module.scss';
import logoUrl from './logo.png';

export function Home() {
  const navigate = useNavigate();

  return (
    <View class={styles.root}>
      <img class={styles.image} alt={'Logo'} src={logoUrl}/>
      <Typography class={styles.title} variant="title2" bold>
        Add your application
      </Typography>
      <Typography class={styles.subtitle} align="center">
        Here, all your applications that you add to the store will be displayed
      </Typography>
      <Button class={styles.button} onClick={() => navigate('/add-application')}>
        Add application
      </Button>
    </View>
  );
}