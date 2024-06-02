const modules = await import.meta.glob(
	'./p/**/+page.svelte', {eager: true, import: "meta"}
)

export async function load() {
	const posts = Object.entries(modules).map(([path, content]) => ({
			...content,
			slug: path.replace("./p/", "").replace("/+page.svelte", "")
	})).sort((a, b) => a.date > b.date ? -1 : 1)

	return {
		posts
	}
}