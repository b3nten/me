import { Renderer, Geometry, Program, Mesh } from 'ogl';

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

            uniform float uTime;
            uniform vec2 uResolution;
            varying vec2 vUv;

            void main()
            {
    			// Normalize coordinates
    			vec2 resolution = uResolution.xy;
    			vec2 uv = vUv;
   		 		uv = 0.2 * (uv + uv - resolution) / resolution.y;

    			// Initialize output color
    			gl_FragColor = vec4(1, 2, 3, 0);

    			// Temporary variables
    			vec2 tempUv = uv;
    			vec2 w;
    			float time = uTime;

    			// Loop to calculate color
    			for (float a = 0.5, i = 0.0; i < 19.0; i++) {
        			// Update color
        			gl_FragColor += (1.0 + cos(vec4(0, 1, 3, 0) + time)) /
                    	length((1.0 + i * dot(resolution, resolution)) * sin(w * 3.0 - 9.0 * tempUv.yx + time));

        			// Update time and tempUv
        			time += 1.0;
        			a += 0.03;
        			resolution = cos(time - 7.0 * tempUv * pow(a, i)) - 5.0 * tempUv;
        			tempUv *= mat2(cos(i + time * 0.02 - vec4(0, 11, 33, 0)));
        			tempUv += 0.005 * tanh(40.0 * dot(tempUv, tempUv) * cos(100.0 * tempUv.yx + time))
                		+ 0.2 * a * tempUv
                		+ 0.003 * cos(time + 4.0 * exp(-0.01 * dot(gl_FragColor, gl_FragColor)));
        			w = tempUv / (1.0 - 2.0 * dot(tempUv, tempUv));
    			}

    			// Final color adjustment
    			gl_FragColor = pow(1.0 - sqrt(exp(-gl_FragColor * gl_FragColor * gl_FragColor / 200.0)), 0.3 * gl_FragColor / gl_FragColor)
                	- dot(uv -= tempUv, uv) / 250.0;
			}
		`,
		uniforms: {
			uTime: { value: 0.0 },
			uResolution: { value: {x: gl.canvas.width, y: gl.canvas.height } }
		},
	});

	const mesh = new Mesh(gl, { geometry, program });

	function update(t) {
		requestAnimationFrame(update);
		program.uniforms.uTime.value = t * 0.001;
		program.uniforms.uResolution.value = {x: gl.canvas.width, y: gl.canvas.height };
		renderer.render({ scene: mesh });
	}

	requestAnimationFrame(update);
}