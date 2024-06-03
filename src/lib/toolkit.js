export function update(callback){
	let alive = true
	const handler = (delta) => {
		if(!alive) return;
		requestAnimationFrame(handler)
		callback(delta)
	}
	requestAnimationFrame(handler)
	return () => alive = false
}

export function fixedUpdate(callback, fps = 50){
	let t = performance.now();
	const update = () => {
		const delta = performance.now() - t
		t = performance.now()
		callback(delta)
	}
	const interval = setInterval(update, 1000/fps)
	return () => clearInterval(interval)
}

export function createDisposable(){
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