import * as three from "three";
import {EffectComposer, EffectPass, FXAAEffect, RenderPass, ToneMappingEffect, ToneMappingMode} from "postprocessing";

/***********************************************************
    Generic Types
 ************************************************************/

type ConstructorOf<T, Args extends any[] = any[]> = (new (
	...args: Args
) => T)

type Component = any

const ActiveCameraTag = Symbol();
const RendererTag = Symbol();
const ClockTag = Symbol();
const PostProcessingTag = Symbol();

interface ILifecycle {
	onCreate?(): void | Promise<void>;

	onUpdate?(delta: number, elapsed: number): void;

	onDestroy?(): void;
}

/***********************************************************
    GameObject Container
 ************************************************************/

interface IWorld {
	addComponentToGameObject<T extends Component | Promise<Component>>(gameObject: GameObject, component: T): T;

	removeComponentFromGameObject<T extends Component>(gameObject: GameObject, component: T): T;

	enableGameObject<T extends GameObject>(gameObject: T): T;

	disableGameObject<T extends GameObject>(gameObject: T): T;

	addChildToGameObject<T extends GameObject, U extends GameObject>(gameObject: T, child: U): U;

	removeChildFromGameObject<T extends GameObject, U extends GameObject>(gameObject: T, child: U): U;

	addBehaviorToGameObject<T extends Behavior, Args extends any[]>
	(gameObject: GameObject, behavior: ConstructorOf<T, [GameObject, ...Args]>, ...args: Args): T;

	destroyBehavior<T extends Behavior>(behavior: T): T;

	enableBehavior<T extends Behavior>(behavior: T): T;

	disableBehavior<T extends Behavior>(behavior: T): T;
}

class World implements IWorld {

	constructor() {
		this.#camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.#renderer = new three.WebGLRenderer({
			antialias: true,
			alpha: true,
		});
		this.#renderer.shadowMap.enabled = true;
		this.#renderer.domElement.style.width = "100%";
		this.#renderer.domElement.style.height = "100%";
		this.#postprocessing = new EffectComposer(this.#renderer, {
			frameBufferType: three.HalfFloatType,
		});
		this.#passes = [
			new RenderPass(this.#root, this.#camera),
			new EffectPass(this.#camera, new FXAAEffect()),
			new EffectPass(
				this.#camera,
				new ToneMappingEffect({
					mode: ToneMappingMode.ACES_FILMIC,
				})
			)
		]
	}

	#root = new three.Scene
	#camera: three.Camera;
	#clock = new three.Clock;
	#renderer: three.WebGLRenderer;

	#postprocessing: EffectComposer;
	#passes: Array<EffectPass | RenderPass> = []
	public setRenderPasses(value: Array<EffectPass | RenderPass>) {
		this.#passes = value;
		this.#postprocessing.removeAllPasses();
		for (const pass of this.#passes) {
			this.#postprocessing.addPass(pass);
		}
	}

	private gameObjects: Set<GameObject> = new Set;

	public start(): void {
		// initialize all game objects
	}

	public tick(delta: number, elapsed: number): void {
		// update all game objects
	}

	public destroy(): void {
		// destroy all game objects
	}

	addGameObject<T extends GameObject, Args extends any[]>(gameObject: ConstructorOf<T, Args>, ...args: Args): T {
		const instance = GameObject.Create(this, gameObject, ...args);

		return instance;
	}

	destroyGameObject<T extends GameObject>(gameObject: T): T {

	}

	enableGameObject<T extends GameObject>(gameObject: T): T {
		console.log("LOL")
	}

	disableGameObject<T extends GameObject>(gameObject: T): T {

	}

	addComponentToGameObject<T extends Component>(gameObject: GameObject, component: T): T {

	}

	removeComponentFromGameObject<T extends Component>(gameObject: GameObject, component: T): T {

	}

	addChildToGameObject<T extends GameObject, U extends GameObject>(gameObject: T, child: U): U {
		throw Error("Method not implemented.");
	}

	removeChildFromGameObject<T extends GameObject, U extends GameObject>(gameObject: T, child: U): U {
		throw new Error("Method not implemented.");
	}

	addBehaviorToGameObject<T extends Behavior, Args extends any[]>(gameObject: GameObject, behavior: ConstructorOf<T, [GameObject, ...Args]>, ...args: Args): T {

	}

	destroyBehavior<T extends Behavior>(behavior: T): T {

	}

	enableBehavior<T extends Behavior>(behavior: T): T {

	}

	disableBehavior<T extends Behavior>(behavior: T): T {

	}

	onCreate?(): void;
	onUpdate?(delta: number, elapsed: number): void;
	onDestroy?(): void;
}

/***************************************************************************************
 GAME OBJECT
 ***************************************************************************************/

let currentScene: IWorld | null = null;
const setCurrentScene = (scene: IWorld | null) => currentScene = scene;
const getCurrentScene = () => {
	if(!currentScene) throw new Error("GameObject created without a provided IScene instance. If you encounter this through normal usage it's a bug.");
	return currentScene;
}

class GameObject implements ILifecycle {

	static Create<T extends GameObject, Args extends any[]>(scene: IWorld, gameObject: ConstructorOf<T, Args>, ...args: Args): T {
		setCurrentScene(scene);
		const instance = new gameObject(...args);
		setCurrentScene(null);
		return instance;
	}

	scene: IWorld = getCurrentScene();

	/***************************************************************************************
	 PROPERTIES
	 ***************************************************************************************/
	group: three.Group = new three.Group();
	components: Component[] = [];
	behaviors: Behavior[] = [];
	children: GameObject[] = [];

	enabled: boolean = true;

	tag: symbol | null = null;
	name: string = "GameObject";

	/**************************************************************************************
	 LIFE CYCLE
	 **************************************************************************************/

	onCreate?(): void;

	/*
	 * The update method is called every frame after the GameObject has been started.
	 * The delta parameter is the time in seconds since the last frame.
	 * The elapsed parameter is the total time in seconds since the world started.
	 */
	onUpdate?(delta: number, elapsed: number): void;

	/*
	 * The destroy method is called once when the GameObject is destroyed.
	 * This method is called after the GameObject is removed from the world.
	 */
	onDestroy?(): void;

	onEnable?(): void;

	onDisable?(): void;

	/***************************************************************************************
	 METHODS
	 ***************************************************************************************/

	public enable(): void {
		this.scene.enableGameObject(this);
	}

	public disable(): void {
		this.scene.disableGameObject(this);
	}

	public addComponent<T extends Component>(component: T): T {
		return this.scene.addComponentToGameObject(this, component);
	}

	public removeComponent<T extends Component>(component: T): T {
		return this.scene.removeComponentFromGameObject(this, component);
	}

	public addChild<T extends GameObject>(child: T): T {
		return this.scene.addChildToGameObject(this, child);
	}

	public removeChild<T extends GameObject>(child: T): T {
		return this.scene.removeChildFromGameObject(this, child);
	}

	public addBehavior<T extends Behavior, Args extends any[]>(behavior: ConstructorOf<T, [GameObject, ...Args]>, ...args: Args): T {
		return this.scene.addBehaviorToGameObject(this, behavior, ...args);
	}

	public removeBehavior<T extends Behavior>(behavior: T): T {
		return this.scene.destroyBehavior(behavior);
	}

	/***************************************************************************************
	 EVENTS
	 ***************************************************************************************/

	onClick?(): void;

	onMouseEnter?(): void;

	onMouseOver?(): void;

	onMouseLeave?(): void;

	onMouseDown?(): void;

	onMouseUp?(): void;

	onWheel?(): void;

	onKeyPress?(): void;

	onKeyDown?(): void;

	onKeyUp?(): void;
}

/***************************************************************************************
 BEHAVIOR
 ***************************************************************************************/

let currentGameObject: GameObject | null = null;
const setCurrentGameObject = (scene: GameObject | null) => currentGameObject = scene;
const getCurrentGameObject = () => currentGameObject;

abstract class Behavior implements ILifecycle {
	static Create<T extends Behavior, Args extends any[]>(gameObject: GameObject, behavior: ConstructorOf<T, [GameObject, ...Args]>, ...args: Args): T {
		setCurrentGameObject(gameObject);
		const instance = new behavior(gameObject, ...args);
		setCurrentGameObject(null);
		return instance;
	}

	gameObject: GameObject = getCurrentGameObject()!;

	/***************************************************************************************
	 PROPERTIES
	 ***************************************************************************************/
	enabled: boolean = true;

	tag?: symbol;
	name: string = "Behavior";

	/**************************************************************************************
	 LIFE CYCLE
	 **************************************************************************************/

	onCreate?(): void;

	onUpdate?(delta: number, elapsed: number): void;

	onDestroy?(): void;

	onEnable?(): void;

	onDisable?(): void;

	/***************************************************************************************
	 METHODS
	 ***************************************************************************************/

	public enable() {
		this.gameObject.scene.enableBehavior(this);
	}

	public disable() {
		this.gameObject.scene.disableBehavior(this);
	}

	/***************************************************************************************
	 EVENTS
	 ***************************************************************************************/

	onClick?(): void;

	onMouseEnter?(): void;

	onMouseOver?(): void;

	onMouseLeave?(): void;

	onMouseDown?(): void;

	onMouseUp?(): void;

	onWheel?(): void;

	onKeyPress?(): void;

	onKeyDown?(): void;

	onKeyUp?(): void;
}

/***************************************************************************************
 ASSET LOADER
 ***************************************************************************************/

class AssetLoader {
	#loaders = new Map<new () => three.Loader<any>, three.Loader<any>>();

	#cache = new Map<string, any>();
	#asyncCache = new Map<string, Promise<any>>();

	#loaded = false;

	get Ready() {
		return Promise.all(Array.from(this.#asyncCache.values()));
	}

	get loaded() {
		return this.#loaded;
	}

	async load<T>(
		loader: new () => three.Loader<T>,
		url: string
	): Promise<T | undefined> {
		if (typeof window === "undefined") return;

		if (this.#asyncCache.has(url)) {
			return this.#asyncCache.get(url);
		}

		const l =
			this.#loaders.get(loader) ??
			(() => {
				const l = new loader();
				this.#loaders.set(loader, l);
				return l;
			})();

		const promise = l.loadAsync(url).then((result) => {
			this.#cache.set(url, result);
			return result;
		});

		this.#asyncCache.set(url, promise);

		return promise;
	}

	async preload<T>(loader: new () => three.Loader<T>, url: string) {
		this.load(loader, url);
	}
}

export {
	GameObject,
	Behavior,
	AssetLoader,
	World,
	ActiveCameraTag,
	RendererTag,
	ClockTag,
	PostProcessingTag,
	type Component,
	type IWorld,
	type ILifecycle
}