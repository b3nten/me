import {Renderer, Geometry, Program, Mesh, Vec2} from 'ogl';
import frag from "./bg.frag?raw"
import vert from "./bg.vert?raw"
import {Flowmap} from "./flow.js";

function update(callback){
	let alive = true
	const handler = (delta) => {
		if(!alive) return;
		requestAnimationFrame(handler)
		callback(delta)
	}
	requestAnimationFrame(handler)
	return () => alive = false
}

function fixedUpdate(callback, fps = 50){
	let t = performance.now();
	const update = () => {
		const delta = performance.now() - t
		t = performance.now()
		callback(delta)
	}
	const interval = setInterval(update, 1000/fps)
	return () => clearInterval(interval)
}

function createDisposable(){
	const disposables = []
	return {
		dispose(){
			for(const disposable of disposables){
				try { disposable() } catch {}
			}
		},
		cleanup(...disposables){
			disposables.push(disposables)
		},
		disposableEvent(target, type, listener, options){
			target.addEventListener(type, listener, options)
			disposables.push(() => target.removeEventListener(type, listener, options))
		}
	}
}

export function createBackgroundEffect(){

	const {dispose, cleanup, disposableEvent} = createDisposable()

	const renderer = new Renderer({
		width: window.innerWidth,
		height: window.innerHeight,
		dpr: Math.min(window.devicePixelRatio, 2),
		antialias: true,
	});

	const flow = new Flowmap(renderer.gl)

	let lastTime;
	const mousePosition = new Vec2();
	const mouseVelocity = new Vec2();
	const lastMouse = new Vec2();

	disposableEvent(window, 'mousemove', (e) => {

		mousePosition.set(e.x / gl.renderer.width, 1 - e.y / gl.renderer.height);

		if (!lastTime) {
			lastTime = performance.now();
			lastMouse.set(e.x, e.y);
		}

		const deltaX = e.x - lastMouse.x;
		const deltaY = e.y - lastMouse.y;

		lastMouse.set(e.x, e.y);

		let time = performance.now();

		let delta = Math.max(14, time - lastTime);
		lastTime = time;

		mouseVelocity.x = deltaX / delta;
		mouseVelocity.y = deltaY / delta;

		mouseVelocity.needsUpdate = true;
	})

	const gl = renderer.gl;

	const geometry = new Geometry(gl, {
		position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
		uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
	});

	const program = new Program(gl, {
		vertex: vert,
		fragment: frag,
		uniforms: {
			u_time: { value: 0.0 },
			u_resolution: { value: new Vec2(gl.canvas.width, gl.canvas.height) },
			t_flow : flow.uniform,
		},
	});

	const mesh = new Mesh(gl, { geometry, program });

	disposableEvent(window, 'resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		program.uniforms.u_resolution.value.x = gl.canvas.width;
		program.uniforms.u_resolution.value.y = gl.canvas.height;
	})

	cleanup(

		update((t) => {
			program.uniforms.u_time.value = t * 0.001;
			program.uniforms.u_resolution.value.x = gl.canvas.width;
			program.uniforms.u_resolution.value.y = gl.canvas.height;
			renderer.render({ scene: mesh });
		}),

		fixedUpdate((t) => {
			if (!mouseVelocity.needsUpdate) {
				mousePosition.set(-1);
				mouseVelocity.set(0);
			}
			mouseVelocity.needsUpdate = false;
			// Update flowmap inputs
			flow.aspect = gl.renderer.width / gl.renderer.height;
			flow.mouse.copy(mousePosition);
			// Ease velocity input, slower when fading out
			flow.velocity.lerp(mouseVelocity, mouseVelocity.len() ? 0.5 : 0.1);
			flow.update();
		}, 60)

	)

	document.body.appendChild(gl.canvas);

	return dispose
}