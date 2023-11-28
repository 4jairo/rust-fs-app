<script lang="ts">
  import { onMount } from "svelte";
  import { ShortcutKeysContext } from "../../../context/shortcutKey";
  import { findKeyCombination } from "../../../context/shortcutKeyFunctions";
  import { WindowLocationContext } from "../../../context/currentWindowContext";

  $: windowContext = $WindowLocationContext

  // keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    //console.log(e.key)

    if(e.key === 'F12') return
    if(e.altKey || (e.ctrlKey && e.key === 'f')) e.preventDefault() 

    ShortcutKeysContext.addKey(e.key.toLowerCase())

    const shortcutData = findKeyCombination($ShortcutKeysContext.keys, windowContext)
    if (shortcutData) shortcutData.fn()
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    ShortcutKeysContext.removeKey(e.key.toLowerCase())
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
