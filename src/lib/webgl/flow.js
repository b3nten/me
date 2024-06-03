import {RenderTarget, Program, Mesh, Vec2, Triangle} from "ogl";
import fragment from "./flow.frag?raw";
import vertex from "./flow.vert?raw";

export class Flowmap {
	constructor(
		gl,
		{
			size = 128, // default size of the render targets
			falloff = 0.3, // size of the stamp, percentage of the size
			alpha = 1, // opacity of the stamp
			dissipation = 0.98, // affects the speed that the stamp fades. Closer to 1 is slower
			type, // Pass in gl.FLOAT to force it, defaults to gl.HALF_FLOAT
		} = {}
	) {
		const self = this;
		this.gl = gl;

		// output uniform containing render target textures
		this.uniform = { value: null };

		this.mask = {
			read: null,
			write: null,

			// Helper function to ping pong the render targets and update the uniform
			swap: () => {
				let temp = self.mask.read;
				self.mask.read = self.mask.write;
				self.mask.write = temp;
				self.uniform.value = self.mask.read.texture;
			},
		};

		{
			createFBOs();

			this.aspect = 1;
			this.mouse = new Vec2();
			this.velocity = new Vec2();

			this.mesh = initProgram();
		}

		function createFBOs() {
			// Requested type not supported, fall back to half float
			if (!type) type = gl.HALF_FLOAT || gl.renderer.extensions['OES_texture_half_float'].HALF_FLOAT_OES;

			let minFilter = (() => {
				if (gl.renderer.isWebgl2) return gl.LINEAR;
				if (gl.renderer.extensions[`OES_texture_${type === gl.FLOAT ? '' : 'half_'}float_linear`]) return gl.LINEAR;
				return gl.NEAREST;
			})();

			const options = {
				width: size,
				height: size,
				type,
				format: gl.RGBA,
				internalFormat: gl.renderer.isWebgl2 ? (type === gl.FLOAT ? gl.RGBA32F : gl.RGBA16F) : gl.RGBA,
				minFilter,
				depth: false,
			};

			self.mask.read = new RenderTarget(gl, options);
			self.mask.write = new RenderTarget(gl, options);
			self.mask.swap();
		}

		function initProgram() {
			return new Mesh(gl, {
				// Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
				geometry: new Triangle(gl),

				program: new Program(gl, {
					vertex,
					fragment,
					uniforms: {
						tMap: self.uniform,

						uFalloff: { value: falloff * 0.5 },
						uAlpha: { value: alpha },
						uDissipation: { value: dissipation },

						// User needs to update these
						uAspect: { value: 1 },
						uMouse: { value: self.mouse },
						uVelocity: { value: self.velocity },
					},
					depthTest: false,
				}),
			});
		}
	}

	update() {
		this.mesh.program.uniforms.uAspect.value = this.aspect;

		this.gl.renderer.render({
			scene: this.mesh,
			target: this.mask.write,
			clear: false,
		});
		this.mask.swap();
	}
}