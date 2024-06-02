<script>
	export let data;
</script>

{#each data.posts as post}
	<a href={`/posts/p/${post.slug}`}>{post.title}</a>
{/each}
