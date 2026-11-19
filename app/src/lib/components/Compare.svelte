<script lang="ts">
  import { fonts } from "#lib/fonts/fonts.svelte.ts";
  import { fontFamily } from "#lib/settings.svelte.ts";

  let { text: initialText }: { text: string } = $props();

  // svelte-ignore state_referenced_locally
  let text = $state(initialText);
  let layout = $state<"columns" | "rows">("columns");
  let size = $state(32);
  // Fonts left out; newly loaded fonts are included by default
  let unchecked = $state<string[]>([]);

  const shown = $derived(fonts.list.filter((font) => !unchecked.includes(font.name)));
  const lines = $derived(text.split("\n"));

  function toggle(name: string, checked: boolean) {
    unchecked = checked ? unchecked.filter((n) => n !== name) : [...unchecked, name];
  }
</script>

{#snippet sample(name: string, line: string)}
  <div class="comparesample" dir="auto" style:font-family={fontFamily(name)}>{line || " "}</div>
{/snippet}

<div id="comparecontrols">
  <div id="comparefonts">
    {#each fonts.list as font (font.name)}
      <label
        ><input
          type="checkbox"
          checked={!unchecked.includes(font.name)}
          onchange={(event) => toggle(font.name, event.currentTarget.checked)}
        />
        {font.name}</label
      >
    {:else}
      Load two or more fonts to compare them.
    {/each}
  </div>
  <div>
    <label><input type="radio" bind:group={layout} value="columns" /> Columns</label>
    <label><input type="radio" bind:group={layout} value="rows" /> Rows</label>
    &nbsp; <label>Size <input type="number" id="comparesize" bind:value={size} min="6" max="300" />px</label>
  </div>
  <textarea id="comparetext" rows="3" dir="auto" bind:value={text}></textarea>
</div>

<div id="compareoutput" class={layout} style:font-size="{size}px">
  {#if layout === "columns"}
    {#each shown as font (font.name)}
      <div class="comparecolumn">
        <div class="comparelabel">{font.name}</div>
        {#each lines as line, i (i)}{@render sample(font.name, line)}{/each}
      </div>
    {/each}
  {:else}
    {#each lines as line, i (i)}
      <div class="comparegroup">
        {#each shown as font (font.name)}
          <div class="comparerow">
            <div class="comparelabel">{font.name}</div>
            {@render sample(font.name, line)}
          </div>
        {/each}
      </div>
    {/each}
  {/if}
</div>
