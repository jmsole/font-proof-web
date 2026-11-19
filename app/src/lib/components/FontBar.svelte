<script lang="ts">
  import { fonts } from "#lib/fonts/fonts.svelte.ts";
  import { fontFamily } from "#lib/settings.svelte.ts";
  import { reorder } from "#lib/reorder.ts";

  // Height of the bar, so the controls below can stick just under it
  let { height = $bindable(0) } = $props();
</script>

<ul
  id="fonts"
  bind:offsetHeight={height}
  {@attach reorder((name, index) => fonts.move(name, index))}
>
  {#each fonts.restoring as name (name)}
    <li class="placeholder"><span>{name}</span></li>
  {/each}
  {#each fonts.list as font (font.name)}
    <!-- Keyboard users switch fonts with the number and arrow keys -->
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
    <li
      class:active={font.name === fonts.activeName}
      title={font.name}
      data-key={font.name}
      draggable="true"
      style:font-family={fontFamily(font.name)}
      onclick={() => fonts.activate(font.name)}
    >
      <span>{font.name}</span><span>{` (${font.size})`}</span>
    </li>
  {/each}
</ul>
