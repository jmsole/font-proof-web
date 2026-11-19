<script lang="ts">
  import type { EditionMeta, Tab } from "#lib/editions/types.ts";
  import { fonts } from "#lib/fonts/fonts.svelte.ts";
  import Waterfall from "./Waterfall.svelte";
  import HtmlTab from "./HtmlTab.svelte";
  import Hinting from "./Hinting.svelte";
  import Compare from "./Compare.svelte";

  let { edition, tabs }: { edition: EditionMeta; tabs: Tab[] } = $props();

  // The view is recreated per edition, so the first tab is read once
  // svelte-ignore state_referenced_locally
  let selected = $state(tabs[0].id);
</script>

<svelte:head>
  <title>{fonts.activeName ?? edition.title}</title>
</svelte:head>

<div class="tabs">
  <ul class="tabNavigation">
    {#each tabs as tab (tab.id)}
      <li>
        <a
          href="#{tab.id}"
          class:selected={tab.id === selected}
          onclick={(event) => {
            event.preventDefault();
            selected = tab.id;
          }}>{tab.label}</a
        >
      </li>
    {/each}
  </ul>

  <!-- Every tab stays in the page, so text typed into one survives switching tabs -->
  {#each tabs as tab (tab.id)}
    <div id={tab.id} lang={tab.lang} style={tab.style} hidden={tab.id !== selected}>
      {#if tab.kind === "waterfalls"}
        {#each tab.items as spec, i (i)}
          {#if i > 0}<p>&nbsp;</p><p>&nbsp;</p>{/if}
          <Waterfall {spec} />
        {/each}
      {:else if tab.kind === "html"}
        <HtmlTab html={tab.html} />
      {:else if tab.kind === "hinting"}
        <Hinting />
      {:else}
        <Compare text={tab.text} />
      {/if}
    </div>
  {/each}
</div>
