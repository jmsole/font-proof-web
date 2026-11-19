<script lang="ts">
  import EditionView from "#lib/components/EditionView.svelte";

  let { data } = $props();
</script>

<EditionView edition={data.edition} tabs={data.tabs} />
