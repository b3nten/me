import chroma from "chroma-js"

const baseBgColor = [-1.5,-1,-.5,0]

export default new class Globals {
	showCursorEffects = $state(true)
	timeFactor = $state(1.0)
	showUi = $state(true)
	bgColor = $state(baseBgColor)

	start(){
		if(localStorage.getItem('bgColor')){
			this.bgColor = JSON.parse(localStorage.getItem('bgColor'))
		}

		$effect(() => {
			try{
				if(this.bgColor.every((x, i) => x === baseBgColor[i])){
					return
				}
				localStorage.setItem('bgColor', JSON.stringify(this.bgColor))
				// need to set root css vars
				const color = chroma.scale([chroma.rgb(255,255,255), chroma.rgb(...this.bgColor.map(c => c*255)), chroma.rgb(0,0,0)]).gamma(2).colors(11)
				console.log(color)
				for(let i = 0; i < color.length; i++){
					document.documentElement.style.setProperty(
						`--primary-${i === 0 ? '50' : i === 10 ? "950" : i + '00'}`, 
						color[i]
					)
				}
			} catch(e){
				console.error(e)
			}
		})
	}

	constructor(){
		this.bgColor
	}
}