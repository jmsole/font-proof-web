<script lang="ts">
  let { html }: { html: string } = $props();

  // Range inputs in the content set a CSS property on their target elements:
  // <input type="range" data-target=".sel" data-prop="font-size" data-format="{v}px" data-label="#id">
  function sliders(node: HTMLElement) {
    const onInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const { target, prop, format, label } = input.dataset;
      if (!target || !prop || !format) return;
      const value = format.replace("{v}", input.value);
      node.querySelectorAll<HTMLElement>(target).forEach((el) => el.style.setProperty(prop, value));
      if (label) node.querySelector(label)!.textContent = input.value;
    };
    node.addEventListener("input", onInput);
    return () => node.removeEventListener("input", onInput);
  }
</script>

<div {@attach sliders}>{@html html}</div>
