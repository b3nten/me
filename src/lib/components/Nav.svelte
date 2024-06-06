<script>
	import Github from "$lib/icons/Github.svelte";
	import Artstation from "$lib/icons/Artstation.svelte";
	import Gear from "$lib/icons/Gear.svelte";
	import { Popover, Label } from "bits-ui";
	import globals from "$lib/globals.svelte.js"
	import {cubicInOut} from "svelte/easing"
	import {slide} from "svelte/transition";
	import Switch from "$lib/components/ui/Switch.svelte";
    import ColorPicker from "svelte-awesome-color-picker";

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
	const toggleMobileNav = () => {
		mobileNavOpen = !mobileNavOpen
	}
	
	const normalizeRgb = (val) => val / 255;

</script>

<nav class="relative z-50 bg-gray-500/50 font-display backdrop-blur-md border border-primary-100/50 rounded-full flex justify-between items-center p-x-8 py-2">
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
			<Popover.Root>
				<Popover.Trigger>
					<Gear size={30} />
				</Popover.Trigger>
				<Popover.Content
						transition={slide}
						transitionConfig={{duration: 100}}
						class="mt-6 z-50 text-white font-display space-y-8 p-4 bg-gray-500/50 backdrop-blur-lg rounded-md border border-primary-100/50 overflow-hidde"
				>
					<div class="">SETTINGS</div>
					<div class="flex items-center space-x-2">
						<Switch bind:value={globals.showUi} />
						<Label.Root for="marketing" class="text-sm font-medium">SHOW UI</Label.Root>
					</div>
					<div>
						<ColorPicker
							isTextInput={false}
							label='COLOR'
							isAlpha={false}
							on:input={e => globals.bgColor = [
								normalizeRgb(e.detail.rgb.r),
								normalizeRgb(e.detail.rgb.g),
								normalizeRgb(e.detail.rgb.b),
								1
							]}
							--cp-bg-color="rgb(107 114 128 / 0.5)"
							--cp-border-color="color-mix(in srgb, var(--primary-100), transparent 50%)"
						/>	
					</div>
				</Popover.Content>
			</Popover.Root>
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
		<div transition:flipUp class="fixed inset-4 rounded-xl bg-gray/70 backdrop-blur-lg border border-primary-100/50 p-8">
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
	.text {
		color:  var(--primary-300);
		fill:   var(--primary-300);
		stroke: var(--primary-300);
		transition: all 0.2s;
		&:hover {
			color: var(--primary-400);
			fill:  var(--primary-400);
			stroke: var(--primary-400);
		}
	}
	.flip {
		display: inline-block;
		transform: scaleX(-1);
	}
</style>