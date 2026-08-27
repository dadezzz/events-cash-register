<script lang="ts">
  import { CaretLeftIcon, CaretRightIcon } from "phosphor-svelte";
  import { ProductCategoryClient } from "#lib/entities/products/category/client/index.ts";

  interface Props {
    selectedCategory?: ProductCategoryClient;
  }

  const { selectedCategory }: Props = $props();

  const categories = $derived(await ProductCategoryClient.getAll());

  let ulElement: HTMLElement | undefined = $state();

  function scroll(direction: "left" | "right") {
    if (!ulElement) return;
    ulElement.scrollBy({
      behavior: "smooth",
      left: direction === "left" ? -150 : 150,
    });
  }

  let showLeftArrow = $state(false);
  let showRightArrow = $state(false);
</script>

<div class="relative">
  {#if showLeftArrow}
    <div class="scroll-button-wrapper left-0 bg-linear-to-r pr-4">
      <button type="button" tabindex={-1} class="scroll-button" onclick={() => scroll("left")}>
        <CaretLeftIcon class="size-5" />
      </button>
    </div>
  {/if}

  <nav class="contents">
    <ul
      bind:this={ulElement}
      class="outline-emerald-default flex scrollbar-none gap-1 overflow-x-auto rounded-md p-1 focus:outline md:block"
      {@attach (node) => {
        function checkScroll() {
          showLeftArrow = node.scrollLeft > 1;
          showRightArrow = node.scrollLeft + node.clientWidth < node.scrollWidth - 1;
        }

        node.addEventListener("scroll", checkScroll);

        const observer = new ResizeObserver(checkScroll);
        observer.observe(node);

        return () => {
          node.removeEventListener("scroll", checkScroll);
          observer.disconnect();
        };
      }}
    >
      {#each categories as category (category.data.id)}
        <li>
          <a
            href="/products/{category.data.id}"
            aria-current={category.data.id === selectedCategory?.data.id ? "page" : false}
            class="outline-emerald-default ml-1 rounded-md px-2 py-1 text-nowrap group-focus:outline-2 hover:bg-mist-200 aria-[current=page]:bg-mist-100 dark:hover:bg-mist-800 dark:aria-[current=page]:bg-mist-900"
          >
            {category.data.name}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  {#if showRightArrow}
    <div class="scroll-button-wrapper right-0 bg-linear-to-l pl-4">
      <button type="button" tabindex={-1} class="scroll-button" onclick={() => scroll("right")}>
        <CaretRightIcon class="size-5" />
      </button>
    </div>
  {/if}
</div>

<style>
  @reference "#assets/tailwind.css";

  .scroll-button-wrapper {
    @apply absolute top-1/2 flex h-14 -translate-y-1/2 items-center from-mist-50 from-80% to-transparent dark:from-mist-950;
  }

  .scroll-button {
    @apply rounded-md bg-mist-100 p-2 shadow hover:bg-mist-200 dark:bg-mist-900 dark:hover:bg-mist-800;
  }
</style>
