<script lang='ts'>
  import { ICONS, type IconType } from "./icons";

  export let size = 33
  export let icon: IconType
</script>

{@html ICONS[icon](size)}