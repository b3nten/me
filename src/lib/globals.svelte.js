import chroma from "chroma-js"

const baseBgColor = [-1.5,-1,-.5,0]

export default new class Globals {
	showCursorEffects = $state(true)
	timeFactor = $state(1.0)
	showUi = $state(true)

	primaryColor = $state({r: -1.5*255, g: -1*255, b: -.5*255})

	start(){

		if(localStorage.getItem('primaryColor')){
			this.primaryColor = JSON.parse(localStorage.getItem('primaryColor'))
		}

		$effect(() => {
			try{
				if(
					this.primaryColor.r === baseBgColor[0] && 
					this.primaryColor.g === baseBgColor[1] && 
					this.primaryColor.b === baseBgColor[2]
				){
					return
				}
				localStorage.setItem('primaryColor', JSON.stringify(this.primaryColor))
				const p = chroma.rgb(this.primaryColor.r, this.primaryColor.g, this.primaryColor.b)
				const color = chroma.scale([chroma.rgb(255,255,255), p, chroma.rgb(0,0,0)]).gamma(2).colors(11, "rgb")
				for(let i = 0; i < color.length; i++){
					document.documentElement.style.setProperty(
						`--primary-${i === 0 ? '50' : i === 10 ? "950" : i + '00'}`, 
						`${color[i]}`
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