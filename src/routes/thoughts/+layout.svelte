<script>
	import NormalPage from "$lib/components/BasePageLayout.svelte";
	import PageTransition from "$lib/components/PageTransition.svelte";

	let {children, data } = $props();

	let url = $derived(data.url.split('/')[2])
</script>

<NormalPage>
	<PageTransition key={url}>
		{@render children()}
	</PageTransition>
</NormalPage>

<div class="-z-10 fixed inset-0 bg-primary-900/60 backdrop-blur-lg"></div>