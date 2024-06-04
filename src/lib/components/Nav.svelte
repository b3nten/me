<script>
	import Github from "$lib/icons/Github.svelte";
	import Artstation from "$lib/icons/Artstation.svelte";
	import Gear from "$lib/icons/Gear.svelte";
	import {fade} from "svelte/transition";
	import Tooltip from "$lib/components/Tooltip.svelte";

	let open = $state(false)

	let tooltip;

	$effect(() => {
		if (!open) return
		const handler = (e) => {
			if (!open || !tooltip || tooltip.contains(e.target)) return;
			open = false
		}
		window.addEventListener("click", handler)
		return () => window.removeEventListener("click", handler)
	})
</script>

<nav class="z-40 bg-gray/40 font-display backdrop-blur-md border border-blue-300/50 rounded-full flex justify-between items-center p-x-8 py-2">
	<ul>
		<li class="text flex items-center">
			<a href="https://github.com/b3nten" target="_blank" aria-label="github">
				<Github size={30} />
			</a>
		</li>
		<li class="text flex items-center">
			<a href="https://www.artstation.com/benten28" target="_blank" aria-label="artstation">
				<Artstation />
			</a>
		</li>
		<li class="text flex items-center">
			<button onclick={() => open = !open} aria-label="settings">
				<Gear size={30} />
			</button>
			<Tooltip {open}>
				<div class="tooltip absolute p-4 rounded-md border border-blue-300/80 overflow-hidden">
					Hello!
					<button onclick={() => open = false}>close</button>
				</div>
			</Tooltip>
		</li>
	</ul>
	<a href="/" class="text text-3xl" aria-label="home">BƎNTƎN</a>
	<ul class="text text-lg">
		<li><a href="/blog" aria-label="blog">BL0G</a></li>
		<li><a href="/bio" aria-label="bio">BI0</a></li>
	</ul>
</nav>

<style>
	ul {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	nav {
		font-weight: 900;
		position: absolute;
		top: 1rem;
		height: 4rem;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: min(80%, 1500px);
	}
	.tooltip::before {
		content: "";
		z-index: -10;
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(10px);
	}
	.text {
		color: rgb(219 234 254 / 0.8);
		fill: rgb(219 234 254 / 0.8);
		stroke: rgb(219 234 254 / 0.8);
		transition: all 0.2s;
		&:hover {
			color: rgb(219 234 254 / 1);
			fill: rgb(219 234 254 / 1);
			stroke: rgb(219 234 254 / 1);
		}
	}
</style>