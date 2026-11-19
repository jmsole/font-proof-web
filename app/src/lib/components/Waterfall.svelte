<script lang="ts">
  import type { Waterfall } from "#lib/editions/types.ts";

  let { spec }: { spec: Waterfall } = $props();

  // All samples in the block show the same text; typing in one updates the rest
  // svelte-ignore state_referenced_locally
  let text = $state(spec.text);
  // svelte-ignore state_referenced_locally
  const initial = spec.text;

  function sync(node: HTMLElement) {
    const value = text;
    if (document.activeElement !== node && node.textContent !== value) node.textContent = value;
  }
</script>

{#snippet column(sizes: number[])}
  {#each sizes as size, i (i)}
    <p class="sizelabel">{size}px</p>
    <p
      class="textline"
      style:font-size="{size}px"
      contenteditable="true"
      oninput={(event) => (text = event.currentTarget.textContent ?? "")}
      {@attach sync}>{initial}</p>
    {#if spec.spaced}<p>&nbsp;</p>{/if}
  {/each}
{/snippet}

{#if spec.columns.length === 1}
  <div style={spec.style}>{@render column(spec.columns[0])}</div>
{:else}
  <div class="columns" style={spec.style}>
    {#each spec.columns as sizes, k (k)}
      <div class="textsettingCol{k + 1}">{@render column(sizes)}</div>
    {/each}
  </div>
{/if}

<style>
  /* Contain the floated columns */
  .columns {
    display: flow-root;
  }
</style>
