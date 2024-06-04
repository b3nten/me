<script context="module">
	import Post from "$lib/posts/post.svelte"

	export const meta = {
		title: 'A blog post',
		description: 'Posts page',
		date: '2021-01-01',
		tags: ['posts']
	}
</script>

<Post meta={meta}>

	<h1>Hello World</h1>
	<p>This is a post</p>

</Post>