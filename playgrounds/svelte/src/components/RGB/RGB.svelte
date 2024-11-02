<script lang="ts">
  import './RGB.css';

  interface IProps {
    color: string;
  }

  const { color }: IProps = $props();
</script>

<span class="rgb">
  <i class="rgb__icon" style="--link-color: {color}"></i>
  {color}
</span>

<style>
  .rgb__icon {
    background-color: var(--link-color);
  }
</style>
