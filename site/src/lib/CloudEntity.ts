import * as three from "three";
import {AssetLoader, GameObject} from "~/internal/engine";
import {invariant} from "~/internal/assert"

const DEFAULT_TEXTURE_URL = "https://rawcdn.githack.com/pmndrs/drei-assets/9225a9f1fbd449d9411125c2f419b843d0308c9f/cloud.png"

class CloudMaterial extends three.MeshLambertMaterial {
	constructor(texture: three.Texture) {
		super();
		this.map = texture;
		this.depthTest = false;
		this.transparent = true;
		const opaque_fragment =
			parseInt(three.REVISION.replace(/\D+/g, "")) >= 154
				? "opaque_fragment"
				: "output_fragment";

		this.onBeforeCompile = (shader) => {
			shader.vertexShader =
				`attribute float opacity;
         varying float vOpacity;
        ` +
				shader.vertexShader.replace(
					"#include <fog_vertex>",
					`#include <fog_vertex>
           vOpacity = opacity;
          `
				);
			shader.fragmentShader =
				`varying float vOpacity;
        ` +
				shader.fragmentShader.replace(
					`#include <${opaque_fragment}>`,
					`#include <${opaque_fragment}>
           gl_FragColor = vec4(outgoingLight, diffuseColor.a * vOpacity);
          `
				);
		};
	}
}

type CloudState = {
	uuid: string;
	index: number;
	segments: number;
	dist: number;
	matrix: three.Matrix4;
	bounds: three.Vector3;
	position: three.Vector3;
	volume: number;
	length: number;
	speed: number;
	growth: number;
	opacity: number;
	fade: number;
	density: number;
	rotation: number;
	rotationFactor: number;
	color: three.Color;
};

export const setUpdateRange = (
	attribute: three.BufferAttribute,
	updateRange: { offset: number; count: number }
): void => {
	if ("updateRanges" in attribute) {
		// r159
		// @ts-ignore
		attribute.updateRanges[0] = updateRange;
	} else {
		// @ts-ignore
		attribute.updateRange = updateRange;
	}
};

const parentMatrix = /* @__PURE__ */ new three.Matrix4();
const translation = /* @__PURE__ */ new three.Vector3();
const rotation = /* @__PURE__ */ new three.Quaternion();
const cpos = /* @__PURE__ */ new three.Vector3();
const cquat = /* @__PURE__ */ new three.Quaternion();
const scale = /* @__PURE__ */ new three.Vector3();

AssetLoader.preload(
	three.TextureLoader,
	DEFAULT_TEXTURE_URL,
);

export class Clouds extends GameObject {
	texture?: three.Texture;
	instance?: three.InstancedMesh;
	material?: three.Material;

	limit = 200;
	range = undefined;
	frustumCulled = false;
	opacities = new Float32Array(Array.from({length: this.limit}, () => 1));
	colors = new Float32Array(
		Array.from({length: this.limit}, () => [1, 1, 1]).flat()
	);

	qat = new three.Quaternion();
	dir = new three.Vector3(0, 0, 1);
	pos = new three.Vector3();

	camera: three.Camera;

	clouds: Cloud[] = [];

	constructor() {
		super();
		this.camera = this.scene.activeCamera
	}

	loaded = false;

	addCloud(cloud: Cloud) {
		this.clouds.push(cloud);
		return this;
	}

	removeCloud(cloud: Cloud) {
		this.clouds = this.clouds.filter((c) => c !== cloud);
		return this;
	}

	async load() {
		this.texture = await AssetLoader.loadTexture(DEFAULT_TEXTURE_URL);

		invariant(!!this.texture, "Texture not loaded");

		let imageBounds = [
			this.texture?.image.width ?? 1,
			this.texture?.image.height ?? 1,
		];

		let max = Math.max(imageBounds[0], imageBounds[1]);

		imageBounds = [imageBounds[0] / max, imageBounds[1] / max];

		const plane = new three.PlaneGeometry(...imageBounds);
		this.material = new CloudMaterial(this.texture);
		this.instance = new three.InstancedMesh(plane, this.material, this.limit);

		this.instance.matrixAutoUpdate = false;
		this.instance.frustumCulled = this.frustumCulled;

		this.instance.instanceColor = new three.InstancedBufferAttribute(
			this.colors,
			3
		);
		this.instance.instanceColor.setUsage(three.DynamicDrawUsage);

		plane.attributes.opacity = new three.BufferAttribute(this.opacities, 1);
		plane.attributes.opacity.setUsage(three.DynamicDrawUsage);

		const count = Math.min(
			this.limit,
			this.range !== undefined ? this.range : this.limit,
			10
		);

		this.instance.count = count;

		setUpdateRange(this.instance.instanceMatrix, {
			offset: 0,
			count: count * 16,
		});

		if (this.instance.instanceColor) {
			setUpdateRange(this.instance.instanceColor, {
				offset: 0,
				count: count * 3,
			});
		}

		setUpdateRange(
			this.instance.geometry.attributes.opacity as three.BufferAttribute,
			{offset: 0, count: count}
		);

		this.addComponent(this.instance);
	}

	onCreate(){
		this.load().then(() => {
			this.loaded = true;
		})
	}

	override onUpdate(delta: number, t: number) {
		if(!this.loaded) return;

		parentMatrix.copy(this.instance!.matrixWorld).invert();
		this.camera.matrixWorld.decompose(cpos, cquat, scale);

		for (const cloudInstance of this.clouds) {
			for (const cloudSegment of cloudInstance.segments) {
				translation.copy(cloudInstance.position);
				rotation.copy(cloudInstance.rotation);
				scale.copy(cloudInstance.scale);

				translation.add(
					this.pos
						.copy(cloudSegment.position)
						.applyQuaternion(rotation)
						.multiply(scale)
				);

				rotation
					.copy(cquat)
					.multiply(
						this.qat.setFromAxisAngle(
							this.dir,
							(cloudSegment.rotation += delta * cloudSegment.rotationFactor)
						)
					);

				scale.multiplyScalar(
					cloudSegment.volume +
					((1 + Math.sin(t * cloudSegment.density * cloudSegment.speed)) /
						2) *
					cloudSegment.growth
				);

				cloudSegment.matrix
					.compose(translation, rotation, scale)
					.premultiply(parentMatrix);
				cloudSegment.dist = translation.distanceTo(cpos);
			}
		}

		// TODO: OPTIMIZE
		const sorted = this.clouds.flatMap((c) => c.segments);

		for (let index = 0; index < sorted.length; index++) {
			const config = sorted[index];
			this.opacities[index] =
				config.opacity *
				(config.dist < config.fade - 1 ? config.dist / config.fade : 1);

			this.instance!.setMatrixAt(index, config.matrix);
			this.instance!.setColorAt(index, config.color);
		}

		this.instance!.geometry.attributes.opacity.needsUpdate = true;
		this.instance!.instanceMatrix.needsUpdate = true;
		if (this.instance!.instanceColor) this.instance!.instanceColor.needsUpdate = true;
	}
}

type CloudAttributes = {
	/** A seeded random will show the same cloud consistently, default: Math.random() */
	seed: number;
	/** How many segments or particles the cloud will have, default: 20 */
	segments: number;
	/** The box3 bounds of the cloud, default: [5, 1, 1] */
	bounds: three.Vector3;
	/** How to arrange segment volume inside the bounds, default: inside (cloud are smaller at the edges) */
	concentrate: "random" | "inside" | "outside";
	/** The general scale of the segments */
	scale: three.Vector3;
	/** The volume/thickness of the segments, default: 6 */
	volume: number;
	/** The smallest volume when distributing clouds, default: 0.25 */
	smallestVolume: number;
	/** An optional function that allows you to distribute points and volumes (overriding all settings), default: null
	 *  Both point and volume are factors, point x/y/z can be between -1 and 1, volume between 0 and 1 */
	distribute?: (
		cloud: CloudState,
		index: number
	) => { point: three.Vector3; volume?: number };
	/** Growth factor for animated clouds (speed > 0), default: 4 */
	growth: number;
	/** Animation factor, default: 0 */
	speed: number;
	/** Camera distance until the segments will fade, default: 10 */
	fade: number;
	/** Opacity, default: 1 */
	opacity: number;
	/** Color, default: white */
	color: three.Color | string;
};

export class Cloud {
	settings: CloudAttributes;
	uuid = three.MathUtils.generateUUID();
	segments: CloudState[] = [];

	position = new three.Vector3(.1, .1, .1);
	rotation = new three.Quaternion();
	scale = new three.Vector3(1, 1, 1);

	constructor(settings: Partial<CloudAttributes> = {}) {
		this.settings = {
			opacity: 0.8,
			speed: 0.8,
			bounds: new three.Vector3(5, 1, 1),
			segments: 10,
			color: "#ffffff",
			fade: 10,
			volume: 6,
			smallestVolume: 0.25,
			growth: 4,
			concentrate: "inside",
			seed: Math.random(),
			scale: new three.Vector3(1, 1, 1),
			...settings,
		}
		this.createSegments()
	}

	createSegments() {
		this.segments.length = 0;
		for (let i = 0; i < this.settings.segments; i++) {
			const segment = {
				segments: this.settings.segments,
				bounds: this.settings.bounds,
				position: new three.Vector3(),
				uuid: this.uuid,
				index: i,
				dist: 0,
				matrix: new three.Matrix4(),
				color: new three.Color(this.settings.color),
				rotation: i * (Math.PI / this.settings.segments),
				density: Math.max(0.5, this.random()),
				fade: this.settings.fade,
				opacity: this.settings.opacity,
				growth: this.settings.growth,
				speed: this.settings.speed,
				volume: this.settings.volume,
				length: 1,
				rotationFactor:
					Math.max(0.2, 0.5 * this.random()) * this.settings.speed,
			}

			const distributed = this.settings.distribute?.(segment, i);

			if (distributed || this.settings.segments > 1) {
				segment.position.copy(segment.bounds).multiply(
					distributed?.point ??
					({
						x: this.random() * 2 - 1,
						y: this.random() * 2 - 1,
						z: this.random() * 2 - 1,
					} satisfies three.Vector3Like)
				);
			}

			const xDiff = Math.abs(segment.position.x);
			const yDiff = Math.abs(segment.position.y);
			const zDiff = Math.abs(segment.position.z);
			const max = Math.max(xDiff, yDiff, zDiff);
			segment.length = 1;
			if (xDiff === max) segment.length -= xDiff / segment.bounds.x;
			if (yDiff === max) segment.length -= yDiff / segment.bounds.y;
			if (zDiff === max) segment.length -= zDiff / segment.bounds.z;
			segment.volume =
				(distributed?.volume !== undefined
					? distributed.volume
					: Math.max(
						Math.max(0, this.settings.smallestVolume),
						this.settings.concentrate === "random"
							? this.random()
							: this.settings.concentrate === "inside"
								? segment.length
								: 1 - segment.length
					)) * this.settings.volume;

			this.segments.push(segment)
		}
	}

	private random() {
		const x = Math.sin(this.settings.seed++) * 10000;
		return x - Math.floor(x);
	}
}
