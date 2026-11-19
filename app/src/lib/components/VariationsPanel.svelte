<script lang="ts">
  import { fonts } from "#lib/fonts/fonts.svelte.ts";
  import { settings } from "#lib/settings.svelte.ts";

  const info = $derived(fonts.active?.info);

  function selectInstance(name: string) {
    const instance = info?.instances.find((i) => i.name === name);
    settings.instance = name;
    if (instance) settings.axes = { ...instance.coordinates };
  }
</script>

<div class="vartitle">Variable axes</div>
<div id="varaxes">
  {#if info?.axes.length}
    {#each info.axes as axis (axis.tag)}
      <div>
        <div class="labeldiv">
          <label for="{axis.tag}-slider"
            >{axis.name} ({axis.tag}) -
            <span style="font-weight: normal; color: var(--accent-300);"
              >min: {axis.min} | max: {axis.max} | dflt: {axis.default}</span
            ></label
          >
        </div>
        <div class="sliderdiv">
          <input
            type="range"
            id="{axis.tag}-slider"
            min={axis.min}
            max={axis.max}
            step="1"
            bind:value={settings.axes[axis.tag]}
          />
          <input type="text" bind:value={settings.axes[axis.tag]} />
        </div>
        <div class="sliderlabels"><span>{axis.min}</span><span>{axis.max}</span></div>
      </div>
    {/each}
    {#if info.instances.length}
      <div id="instancediv">
        <div class="vartitle">Instance Selection</div>
        <select id="instances" value={settings.instance} onchange={(event) => selectInstance(event.currentTarget.value)}>
          {#if !settings.instance}
            <!-- The default instance has no name in the font -->
            <option value="" disabled>Default (unnamed)</option>
          {/if}
          {#each info.instances as instance, i (i)}
            <option value={instance.name}>{instance.name}</option>
          {/each}
        </select>
      </div>
    {/if}
  {:else}
    <h3>Not a variable font!</h3>
  {/if}
</div>
