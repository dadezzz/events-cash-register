<script lang="ts">
  import PageWithSidebar from "#components/layouts/PageWithSidebar.svelte";
  import { requireAdmin } from "#lib/auth/index.remote.ts";

  await requireAdmin();
</script>

<PageWithSidebar>
  hello
  <!--
- productsLoop:
    - needs to have 1 or more lines as child
- productOptionsLoop:
    - needs to have 1 or more lines as child
- line:
    - vertical padding
    - items-align
- text:
    - horizontal padding
    - font-size
    - font-weight
    - text-align
- placeholder (inherits from text but has ComboboxInput with):
    - product name
    - product price
    - product priceAdjustment
    - productOption name
    - productOption price
    - productOption value
    - totalPrice
    - receipt number
    - date
    - time
- image?
-->
</PageWithSidebar>
