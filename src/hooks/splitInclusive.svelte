<script lang="ts">
  export let txt: string
  export let splitter: string

  const splitInclusive = () => {
    if(splitter.length === 0) {
      return txt.split('')
    }

    const result: string[] = []
    let startIndex = 0

    while (true) {
      const index = txt.indexOf(splitter, startIndex)

      if (index === -1) {
        result.push(txt.slice(startIndex))
        break
      }

      result.push(txt.slice(startIndex, index))
      result.push(splitter)
      startIndex = index + splitter.length
    }

    return result.filter(s => s !== '')
  }
</script>

{#each splitInclusive() as str}
  <span class={str === splitter ? 'highlight': ''}>{str}</span>
{/each}

<style>
  .highlight {
    background-color: rgba(161, 86, 0, .4);
    border-radius: 3px;
  }
</style>