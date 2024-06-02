import {GameObject} from "~/internal/engine";
import * as three from "three";
import {Sky as SkyImpl} from "three-stdlib"
import GUI from "lil-gui";

export function calcPosFromAngles(inclination: number, azimuth: number, vector: three.Vector3 = new three.Vector3()) {
	const theta = Math.PI * (inclination - 0.5)
	const phi = 2 * Math.PI * (azimuth - 0.5)

	vector.x = Math.cos(phi)
	vector.y = Math.sin(theta)
	vector.z = Math.sin(phi)

	return vector
}

interface SkyAttributes {
	sunPosition: three.Vector3;
	inclination: number;
	azimuth: number;
	mieCoefficient: number;
	mieDirectionalG: number;
	rayleigh: number;
	turbidity: number;
}

export class Sky extends GameObject implements SkyAttributes {
	mieCoefficient = 0.005;
	mieDirectionalG = 0.7;
	rayleigh = 3;
	turbidity = 10;
	inclination = 2;
	azimuth = 180;
	#sky = new SkyImpl()

	#uniforms = {
		mieCoefficient: {value: this.mieCoefficient},
		mieDirectionalG: {value: this.mieDirectionalG},
		rayleigh: {value: this.rayleigh},
		turbidity: {value: this.turbidity},
		sunPosition: {value: this.sunPosition}
	}

	get sunPosition() {
		return calcPosFromAngles(this.inclination, this.azimuth)
	}

	override onCreate() {
		const ui = new GUI()
		ui.add( this, 'turbidity', 0.0, 20.0, 0.1 )
		ui.add( this, 'rayleigh', 0.0, 4, 0.001 )
		ui.add( this, 'mieCoefficient', 0.0, 0.1, 0.001 )
		ui.add( this, 'mieDirectionalG', 0.0, 1, 0.001 )
		ui.add( this, 'inclination', 0, 90, 0.1 )
		ui.add( this, 'azimuth', - 180, 180, 0.1 )
		this.#sky.scale.setScalar(450000);
		(this.#sky.material as three.ShaderMaterial).uniforms = this.#uniforms
		this.addComponent(this.#sky)
	}


	override onUpdate() {
		this.#uniforms.sunPosition.value.copy(this.sunPosition)
		this.#uniforms.mieCoefficient.value = this.mieCoefficient
		this.#uniforms.mieDirectionalG.value = this.mieDirectionalG
		this.#uniforms.rayleigh.value = this.rayleigh
		this.#uniforms.turbidity.value = this.turbidity
	}
}