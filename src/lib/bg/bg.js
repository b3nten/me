import {Renderer, Geometry, Program, Mesh, Vec2} from 'ogl';

export function createBackgroundEffect(){
	const renderer = new Renderer({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const gl = renderer.gl;
	document.body.appendChild(gl.canvas);

	const geometry = new Geometry(gl, {
		position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
		uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
	});

	const program = new Program(gl, {
		vertex: /* glsl */ `
			precision highp float;
            attribute vec2 uv;
            attribute vec2 position;

            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = vec4(position, 0, 1);
            }
        `,
		fragment: /* glsl */ `
			precision highp float;

			uniform float iTime;
			uniform vec2 iResolution;
			varying vec2 vUv;

			float tanh(float x) {
    			float e_pos = exp(x);
    			float e_neg = exp(-x);
    			return (e_pos - e_neg) / (e_pos + e_neg);
			}
			vec2 tanh(vec2 v) {
    			return vec2(tanh(v.x), tanh(v.y));
			}
			vec3 tanh(vec3 v) {
    			return vec3(tanh(v.x), tanh(v.y), tanh(v.z));
			}

			void main()
			{
    			// Normalize coordinates
    			vec2 resolution = iResolution.xy;
    			vec2 uv = vUv * resolution;
    			uv = 0.2 * (uv + uv - resolution) / resolution.y;

    			// Initialize output color
    			gl_FragColor = vec4(-1.5,-1,-.5,0);

    			// Temporary variables
    			vec2 tempUv = uv;
    			vec2 w;
    			float time = iTime;
				float a = 0.5;
				
    			// Loop to calculate color
    			for (float i = 0.0; i < 19.0; i++) {
        			gl_FragColor += (1.0 + cos(vec4(0.0, 1.0, 3.0, 0.0) + time)) /
        				length((1.0 + i * dot(resolution, resolution)) * sin(w * 3.0 - 9.0 * tempUv.yx + time));
			
        			// Update time and tempUv
        			time += 1.0;
        			a += 0.03;
        			resolution = cos(time - 7.0 * tempUv * pow(a, i)) - 5.0 * tempUv;
        			tempUv *= mat2(cos(i + time * 0.02 - vec4(0., 11., 33., 0.)));
        			tempUv += 0.005 * tanh(40.0 * dot(tempUv, tempUv) * cos(100.0 * tempUv.yx + time))
        				+ 0.2 * a * tempUv + 0.003 * cos(time + 4.0 * exp(-0.01 * dot(gl_FragColor, gl_FragColor)));
        			w = tempUv / (1.0 - 2.0 * dot(tempUv, tempUv));
    			}

    			// Final color adjustment
    			gl_FragColor = pow(1.0 - sqrt(exp(-gl_FragColor * gl_FragColor * gl_FragColor / 200.0)), 0.3 * gl_FragColor / gl_FragColor)
    				- dot(uv -= tempUv, uv) / 250.0;
			}
		`,
		uniforms: {
			iTime: { value: 0.0 },
			iResolution: { value: new Vec2(gl.canvas.width, gl.canvas.height) }
		},
	});

	const mesh = new Mesh(gl, { geometry, program });

	function update(t) {
		requestAnimationFrame(update);
		program.uniforms.iTime.value = t * 0.001;
		program.uniforms.iResolution.value.x = gl.canvas.width;
		program.uniforms.iResolution.value.y = gl.canvas.height;

		console.log(program.uniforms.iResolution.value.x, program.uniforms.iResolution.value.y)
		renderer.render({ scene: mesh });
	}

	function resize() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		program.uniforms.iResolution.value.x = gl.canvas.width;
		program.uniforms.iResolution.value.y = gl.canvas.height;
	}

	window.addEventListener('resize', resize, false);

	resize()
	requestAnimationFrame(update);
}