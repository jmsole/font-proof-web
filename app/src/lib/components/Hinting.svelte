<script lang="ts">
  const lower = "abcdefghijklmnopqrstuvwxyz.:;,";
  const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "1234567890 @ &!?#$€%";
  const sizes = Array.from({ length: 16 }, (_, i) => 24 - i); // 24px down to 9px

  // Which browser rendered the proof (shown on screen and in prints)
  let userAgent = $state("");
  $effect(() => {
    userAgent = navigator.userAgent;
  });
</script>

<div style="width: 96vw;" contenteditable="true">
  <p class="sizelabel">{userAgent}</p>
  <p>&nbsp;</p>

  <p class="sizelabel">48px</p>
  <p style="font-size: 48px;">{lower}</p>
  <p style="font-size: 48px;">{caps}</p>
  <p style="font-size: 48px;">{numbers}</p>
  <p>&nbsp;</p>

  {#each [28, ...sizes] as size (size)}
    <p class="sizelabel">{size}px</p>
    <p style:font-size="{size}px">{lower}</p>
    <p style:font-size="{size}px">{caps} {numbers}</p>
    <p>&nbsp;</p>
  {/each}
</div>
