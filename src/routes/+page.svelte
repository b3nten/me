<div class="fixed inset-0">
	<p
		class="benten ben left-3vw leading-[.8] font-sans"
	>
		BƎN
	</p>
	<p
		class="benten ten bottom-5vw right-3vw leading-[.8] font-sans"
	>
		TƎN
	</p>
	<p class="blurb absolute bottom-94 left-8 sm:left-12 xl:left-48 text-xl sm:text-2xl font-bold">
		Software developer and 3d artist.
		<br />
		Building experences for the modern web.
		<br />
	</p>
</div>

<style>
	.benten {
		position: absolute;
		pointer-events: none;
		cursor: default;
		font-size: min(max(25vw, 50px), 400px);
		color: transparent;
		font-weight: 900;
		user-select: none;
	}
	.ben {
		top: max(5vw, 10rem);
		background: linear-gradient(90deg, color-mix(in srgb, var(--primary-300), transparent 75%), rgba(255, 255, 255, 0.85));
		background-clip: text;
	}
	.ten {
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.85), color-mix(in srgb, var(--primary-300), transparent 75%));
		background-clip: text;
	}
	.blurb {
		color: transparent;
		background: linear-gradient(90deg, color-mix(in srgb, var(--primary-600), transparent 20%), rgba(255, 255, 255, 0.96));
		background-clip: text;
	}
</style>