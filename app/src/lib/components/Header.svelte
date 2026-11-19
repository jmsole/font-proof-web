<script lang="ts">
  import { asset } from "$app/paths";
  import { fonts } from "#lib/fonts/fonts.svelte.ts";
</script>

<section id="top">
  <header>
    <a href="https://dograytype.com" id="logo" title="Dogray Type Foundry">
      <img src={asset("images/dogray_logo.svg")} alt="Dogray" />
    </a>
    <h1 id="wordmark">Font Proof</h1>
    <p id="dropprompt">
      Drag font files here, or
      <label for="upload" id="fileup">Load fonts</label>
      <input
        type="file"
        id="upload"
        multiple
        accept=".ttf,.otf,.woff,.woff2"
        onchange={(event) => {
          const input = event.currentTarget;
          if (input.files) fonts.addFiles([...input.files]).then(() => (input.value = ""));
        }}
      />
      <button type="button" id="clearfonts" title="Remove all loaded fonts" onclick={() => fonts.clear()}>Clear</button>
    </p>
  </header>
</section>
