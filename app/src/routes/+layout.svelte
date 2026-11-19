<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { fonts } from "#lib/fonts/fonts.svelte.ts";
  import { settings, resetAxes, specimenStyle } from "#lib/settings.svelte.ts";
  import FontBar from "#lib/components/FontBar.svelte";
  import Header from "#lib/components/Header.svelte";
  import ControlBar from "#lib/components/ControlBar.svelte";

  let { children } = $props();
  let fontBarHeight = $state(0);

  onMount(() => {
    fonts.restore();
  });

  // New active font: its axes start at its first named instance
  $effect(() => {
    resetAxes(fonts.active);
  });

  $effect(() => {
    document.body.classList.toggle("hasfonts", fonts.list.length > 0);
    document.documentElement.classList.toggle("restoring", fonts.restoring.length > 0);
  });

  function isFileDrag(event: DragEvent) {
    return event.dataTransfer?.types.includes("Files") ?? false;
  }

  // Number keys 1-9, 0 and left/right arrows switch fonts when not typing
  function onKeydown(event: KeyboardEvent) {
    const digit = /^Digit(\d)$/.exec(event.code);
    const arrow = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
    const target = event.target as HTMLElement;
    if ((!digit && !arrow) || event.ctrlKey || event.metaKey || event.altKey) return;
    if (arrow && event.shiftKey) return;
    if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.nodeName)) return;
    if (!window.getSelection()?.isCollapsed) return;

    if (digit) {
      const font = fonts.list[digit[1] === "0" ? 9 : Number(digit[1]) - 1];
      if (!font) return;
      fonts.activate(font.name);
    } else {
      fonts.step(arrow);
    }
    event.preventDefault();
  }
</script>

<!-- Font files can be dropped anywhere on the page -->
<svelte:window
  onkeydown={onKeydown}
  ondragover={(event) => isFileDrag(event) && event.preventDefault()}
  ondrop={(event) => {
    if (!isFileDrag(event)) return;
    event.preventDefault();
    fonts.addFiles([...event.dataTransfer!.files]);
  }}
/>

<FontBar bind:height={fontBarHeight} />
<Header />
<ControlBar top={fontBarHeight} />

<section id="custom" style={specimenStyle(fonts.active)} data-fallback={settings.fallback}>
  {@render children()}
</section>

<section id="footer">
  <p>The Font Testing Page is made possible by a long list of wonderful people contributing together.</p>
</section>
