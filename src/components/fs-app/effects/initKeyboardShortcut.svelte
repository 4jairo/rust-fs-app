<script lang="ts">
  import { onMount } from "svelte";
  import { ShortcutKeysContext } from "../../../context/shortcutKey";
  import { findKeyCombination } from "../../../context/shortcutKeyFunctions";

  // keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLocaleLowerCase()

    //if(key === 'F12') return
    if(
      e.altKey || 
      (e.ctrlKey && ['f', 'r', 'u'].includes(key)) ||
      ['f5', 'f3'].includes(key)
    ) e.preventDefault()

    ShortcutKeysContext.addKey(key)

    const shortcutData = findKeyCombination($ShortcutKeysContext.keys)
    if (shortcutData) shortcutData.fn()
  }

  const handleKeyUp = (ev: KeyboardEvent) => {
    ShortcutKeysContext.removeKey(ev.key.toLowerCase())
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  })
</script>

<!-- <p style="position: absolute; z-index: 1000">
  {$ShortcutKeysContext.keys}
</p> -->
