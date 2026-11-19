<script lang="ts">
  import { slide } from "svelte/transition";
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import { EDITIONS, ROOT_EDITION } from "#lib/editions/index.ts";
  import { fonts, SORT_KEYS, type SortKey } from "#lib/fonts/fonts.svelte.ts";
  import { reorder } from "#lib/reorder.ts";
  import FeaturesPanel from "./FeaturesPanel.svelte";
  import VariationsPanel from "./VariationsPanel.svelte";

  let { top = 0 } = $props();
  let showFeatures = $state(false);
  let showVariations = $state(false);

  const unusedKeys = $derived(
    (Object.keys(SORT_KEYS) as SortKey[]).filter((key) => !fonts.sort.some((c) => c.key === key)),
  );

  // Dragging a chip reorders a working copy; it's applied on drop
  let chips = $derived(fonts.sort);
  function moveChip(key: string, index: number) {
    const chip = chips.find((c) => c.key === key)!;
    const rest = chips.filter((c) => c !== chip);
    rest.splice(index, 0, chip);
    chips = rest;
  }
</script>

<div id="controlcontainer" style:top="{top}px">
  <div id="toggleotfeatures">
    <button type="button" onclick={() => (showFeatures = !showFeatures)}>
      {showFeatures ? "Hide OpenType Features" : "OpenType Features"}
    </button> |
    <button type="button" onclick={() => (showVariations = !showVariations)}>
      {showVariations ? "Hide Variable" : "Variable"}
    </button>
    <span id="editions">
      {#each EDITIONS as edition (edition.slug)}
        {" | "}<a
          href={edition.slug === ROOT_EDITION ? resolve("/") : resolve("/[edition]", { edition: edition.slug })}
          aria-current={page.data.edition?.slug === edition.slug ? "page" : undefined}>{edition.label}</a
        >
      {/each}
    </span>
    <span id="sortbar">
      {" | Sort: "}
      <span id="sortchips" {@attach reorder(moveChip, () => fonts.setSort(chips))}>
        {#each chips as criterion (criterion.key)}
          <span class="sortchip" draggable="true" data-key={criterion.key}>
            {SORT_KEYS[criterion.key]}
            <button
              type="button"
              class="sortdir"
              title={criterion.ascending ? "Ascending" : "Descending"}
              onclick={() =>
                fonts.setSort(fonts.sort.map((c) => (c.key === criterion.key ? { ...c, ascending: !c.ascending } : c)))}
              >{criterion.ascending ? "▲" : "▼"}</button
            ><button
              type="button"
              class="sortremove"
              title="Remove"
              onclick={() => fonts.setSort(fonts.sort.filter((c) => c.key !== criterion.key))}>×</button
            >
          </span>
        {/each}
      </span>
      {#if unusedKeys.length}
        <span id="sortaddchip" title="Add a sort criterion"
          >+<select
            id="sortadd"
            value=""
            onchange={(event) => {
              const key = event.currentTarget.value as SortKey;
              event.currentTarget.value = "";
              fonts.setSort([...fonts.sort, { key, ascending: true }]);
            }}
          >
            <option value="">+</option>
            {#each unusedKeys as key (key)}
              <option value={key}>{SORT_KEYS[key]}</option>
            {/each}
          </select></span
        >
      {/if}
    </span>
  </div>
  {#if showFeatures}
    <div id="otfeatures" transition:slide={{ duration: 200 }}><FeaturesPanel /></div>
  {/if}
  {#if showVariations}
    <div id="otvariations" transition:slide={{ duration: 200 }}><VariationsPanel /></div>
  {/if}
</div>
