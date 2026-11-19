<script lang="ts">
  import { page } from "$app/state";
  import { fonts } from "#lib/fonts/fonts.svelte.ts";
  import { settings, DEFAULT_ON, CASING, OTHER, NUMERALS, STYLISTIC_SETS } from "#lib/settings.svelte.ts";

  // Stylistic set names from the active font, for this page's script
  const ssNames = $derived(fonts.active?.info?.ssNames(page.data.edition?.scripts ?? ["DFLT"]) ?? {});
  const ssColumns = [0, 5, 10, 15].map((start) => STYLISTIC_SETS.slice(start, start + 5));
</script>

{#snippet checkboxes(list: [string, string][])}
  {#each list as [tag, label] (tag)}
    <label><input type="checkbox" bind:checked={settings.features[tag]} />{label}</label><br />
  {/each}
{/snippet}

<table width="100%">
  <tbody>
    <tr>
      <td valign="top" width="25%">
        <span class="featitles">Always-on</span><br />
        {@render checkboxes(DEFAULT_ON)}
      </td>
      <td valign="top" width="25%">
        <span class="featitles">Casing features</span><br />
        <label><input type="radio" bind:group={settings.smallCaps} value="off" />SmallCaps Off</label><br />
        <label><input type="radio" bind:group={settings.smallCaps} value="fake" />Fake SmallCaps</label><br />
        <label><input type="radio" bind:group={settings.smallCaps} value="smcp" />Real SmallCaps</label><br />
        {@render checkboxes(CASING)}
        <br />
        <span class="featitles">Other manual features</span><br />
        {@render checkboxes(OTHER)}
      </td>
      {#each ssColumns as column, i (i)}
        <td valign="top" width="12.5%">
          {#if i === 0}<span class="featitles">Stylistic Sets</span>{/if}<br />
          {#each column as tag (tag)}
            <label><input type="checkbox" bind:checked={settings.features[tag]} />{ssNames[tag] ?? tag}</label><br />
          {/each}
        </td>
      {/each}
    </tr>
    <tr>
      <td valign="top" width="25%">
        <span class="featitles">Numeral features</span><br />
        <label><input type="radio" bind:group={settings.figureStyle} value="" />Default Figures Style</label><br />
        <label><input type="radio" bind:group={settings.figureStyle} value="lnum" />Lining Figures</label><br />
        <label><input type="radio" bind:group={settings.figureStyle} value="onum" />Oldstyle Figures</label><br />
        <br />
        <label><input type="radio" bind:group={settings.figureWidth} value="" />Default Figures Width</label><br />
        <label><input type="radio" bind:group={settings.figureWidth} value="pnum" />Proportional Figures</label><br />
        <label><input type="radio" bind:group={settings.figureWidth} value="tnum" />Tabular Figures</label>
      </td>
      <td valign="top" width="25%">
        <br />
        {@render checkboxes(NUMERALS)}
      </td>
      <td valign="top" width="25%" colspan="2">
        <span class="featitles">CSS transforms</span><br />
        <label><input type="checkbox" bind:checked={settings.rtl} /><span style="direction: rtl">Right-to-left</span></label><br />
        <label
          ><input type="checkbox" bind:checked={settings.allCaps} /><span style="text-transform: uppercase"
            >Transform to all caps</span
          ></label
        ><br />
        <br />
        <span class="featitles">Fallback Font</span><br />
        <label><input type="radio" bind:group={settings.fallback} value="system" />System Fallback</label><br />
        <label><input type="radio" bind:group={settings.fallback} value="blank" />Adobe Blank</label>
      </td>
      <td valign="top" width="25%" colspan="2">
        <br />
        <label
          ><input type="checkbox" bind:checked={settings.underline} /><span style="text-decoration: underline"
            >Underline</span
          ></label
        ><br />
        <label
          ><input type="checkbox" bind:checked={settings.strikethrough} /><span style="text-decoration: line-through"
            >Strikethrough</span
          ></label
        >
      </td>
    </tr>
  </tbody>
</table>
