<script lang="ts">
  import EditionView from "#lib/components/EditionView.svelte";

  let { data } = $props();
</script>

<!-- A fresh view per edition, so tab selection and edits don't carry over -->
{#key data.edition.slug}
  <EditionView edition={data.edition} tabs={data.tabs} />
{/key}
