import * as engine from "../../../engine/.build/mod"
import * as three from "three"

class Spin extends engine.Behavior {
	 	onUpdate(delta: number) {
		this.gameObject.transform.rotation.y += delta
	}
}

class Cube extends engine.GameObject {
 	mesh = this.addComponent(
		 new three.Mesh(
			new three.BoxGeometry(1, 1, 1),
			new three.MeshBasicMaterial({ color: 0xff0000 })
		 )
	)
}