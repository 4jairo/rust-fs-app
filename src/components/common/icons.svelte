<script lang='ts'>
  import { ICONS, type IconsType } from "./icons";

  export let size = 33
  export let icon: IconsType
</script>

{@html ICONS[icon](size)}