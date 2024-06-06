<script>
import { Switch } from "bits-ui";
let {value = $bindable(), thumb} = $props();
</script>

<Switch.Root
	checked={value}
	onCheckedChange={checked => value = checked}
	class="switch-root"
>
	<Switch.Thumb
		{...thumb}
		class="switch-thumb"
	/>
</Switch.Root>

<style>
	:global(.switch-root) {
		display: inline-flex;
		align-items: center;
		height: 24px;
		width: 40px;
		flex-shrink: 0;
		cursor: pointer;
		border-radius: 999px;
		padding-left: 3px;
		padding-right: 3px;
		transition: color;
		border: 1px solid color-mix(in srgb, rgb(var(--primary-100)), transparent 50%);
	}

	:global(.switch-thumb) {
		display: block;
		pointer-events: none;
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		border-radius: 999px;
		background-color: rgb(var(--primary-500));
		transition: transform 0.2s;
		:global(&[data-state=checked]) {
			transform: translateX(12px);
		}
		:global(&[data-state=unchecked]) {
			transform: translateX(-4px);
		}
	}
</style>