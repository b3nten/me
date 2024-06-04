<script>
	import Github from "$lib/icons/Github.svelte";
	import Artstation from "$lib/icons/Artstation.svelte";
	import Gear from "$lib/icons/Gear.svelte";
	import Tooltip from "$lib/components/Tooltip.svelte";
	import {cubicInOut} from "svelte/easing"

	let settingTooltipOpen = $state(false)

	let mobileNavOpen = $state(false)

	function flipUp() {
		return {
			duration: 300,
			easing: cubicInOut,
			css: t => `
				transform: rotateX(${90 - (90*t)}deg) translateZ(${-400 + (400*t)}px);
				opacity: ${t};
			`
		}
	}

	$effect(() => {
		const handler = () => {
			if (window.innerWidth > 768) {
				closeMobileNav()
			}
		}
		window.addEventListener('resize', handler)
		return () => window.removeEventListener('resize', handler)
	})

	const closeMobileNav = () => {
		mobileNavOpen = false
	}
	const openMobileNav = () => {
		mobileNavOpen = true
	}
	const toggleMobileNav = () => {
		mobileNavOpen = !mobileNavOpen
	}

</script>

<nav class="z-40 bg-gray/40 font-display backdrop-blur-md border border-blue-300/50 rounded-full flex justify-between items-center p-x-8 py-2">
	<ul class="hidden md:flex">
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
			<button onclick={() => settingTooltipOpen = !settingTooltipOpen} aria-label="settings">
				<Gear size={30} />
			</button>
			<Tooltip {settingTooltipOpen}>
				<div class="tooltip absolute p-4 rounded-md border border-blue-300/80 overflow-hidden">
					Hello!
					<button onclick={() => settingTooltipOpen = false}>close</button>
				</div>
			</Tooltip>
		</li>
	</ul>
	<a href="/" class="text text-3xl" aria-label="home">
		B<span class="flip">E</span>NT<span class="flip">E</span>N
	</a>
	<ul class="hidden md:flex text text-lg">
		<li><a href="/thoughts" aria-label="thoughts">TH0UGHTS</a></li>
		<li><a href="/bio" aria-label="bio">BI0</a></li>
	</ul>
	<button
			class="text md:hidden"
			onclick={toggleMobileNav}
	>
		M<span class="flip">E</span>NU
	</button>

</nav>

{#if mobileNavOpen}
	<div class="perspective-1000 fixed inset-0 z-50">
		<div transition:flipUp class="fixed inset-4 rounded-xl bg-gray/70 backdrop-blur-lg border border-blue-200/80 p-8">
			<div class="flex items-center justify-between">
				<a href="/" class="text text-3xl" aria-label="home" onclick={closeMobileNav}>
					B<span class="flip">E</span>NT<span class="flip">E</span>N
				</a>
				<button class="text text-2xl font-bold font-display" onclick={closeMobileNav}>
					CLOS<span class="flip">E</span>
				</button>
			</div>
			<ul class="flex flex-col items-start gap-4 text text-2xl mt-12">
				<li><a href="/thoughts" aria-label="thoughts" onclick={closeMobileNav}>TH0UGHTS</a></li>
				<li><a href="/bio" aria-label="bio" onclick={closeMobileNav}>BI0</a></li>
				<li>
					<a href="https://github.com/b3nten" target="_blank" aria-label="github">
						GITHUB
					</a>
				</li>
				<li>
					<a href="https://www.artstation.com/benten28" target="_blank" aria-label="artstation">
						ARTSTATION
					</a>
				</li>
			</ul>
		</div>
	</div>
{/if}

<style>
	ul {
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
	.flip {
		display: inline-block;
		transform: scaleX(-1);
	}
</style>