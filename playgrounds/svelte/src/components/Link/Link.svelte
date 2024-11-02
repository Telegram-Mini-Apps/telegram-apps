<script lang="ts">
  interface IProps {
    title: string;
    path: string;
    className: string;
  }

  import './Link.css';
  import { Link } from 'svelte-routing';

  const { title, path, className }: IProps = $props();
</script>

<Link class={`${className} index-link__item`} to={path}>
  {title}
</Link>
