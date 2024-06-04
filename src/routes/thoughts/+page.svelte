<script>
	import NormalPage from "$lib/components/BasePageLayout.svelte";
	let { data } = $props();
	let posts = [...data.posts].sort((a, b) => new Date(b.date).getMilliseconds() - new Date(a.date).getMilliseconds())
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	function formatDate(date) {
		const d = new Date(date);
		return `${months[d.getMonth()]} ${d.getDate()}`;
	}
</script>

<h1 class="text-8xl font-display text-white">Thoughts</h1>
<div class="py-4"></div>

<div class="griddy">
	{#each posts as post}
		<div class="text-white/60">{formatDate(post.date)}</div>
		<a class="text-2xl text-white" href={`/thoughts/t/${post.slug}`}>{post.title}</a>
	{/each}
</div>

<style>
	.griddy {
		display: grid;
		grid-template-columns: 100px 1fr;
		grid-column-end: auto;
		grid-gap: .5rem;
		align-items: center;
	}
</style>
