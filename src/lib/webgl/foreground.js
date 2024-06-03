import { createDisposable, update, fixedUpdate } from "$lib/toolkit.js";
import {Renderer, Geometry, Program, Mesh, Vec2} from 'ogl';

export function createForeground(target = document.body){

	const {dispose, cleanup, disposableEvent} = createDisposable()

	const renderer = new Renderer({
		width: window.innerWidth,
		height: window.innerHeight,
		dpr: Math.min(window.devicePixelRatio, 2),
		antialias: true,
	});

	const mousePosition = new Vec2();

	disposableEvent(window, 'mousemove', (e) => {
		mousePosition.set(e.x / renderer.gl.renderer.width, 1 - e.y / renderer.gl.renderer.height);
	})

	disposableEvent(window, 'resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
	})

	cleanup(

		update((t) => {
			renderer.render({ scene: mesh });
		}),

		fixedUpdate((t) => {

		}, 50)

	)

	target.appendChild(renderer.gl.canvas);

	return dispose
}