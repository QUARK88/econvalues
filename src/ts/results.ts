import { getJson, getLanguage, Canvas, matchAxisTier, orderScores } from "./common.js"
import type { Ui, Ideology, Axis } from "./types"

class Canvas2 {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private font: string
    private bgColor: string
    private fgColor: string
    private images = ["econ", "stat", "cult"]
    constructor(element: HTMLCanvasElement, x: number, y: number, font: string, fg: string, bg: string) {
        //Assigns canvas property to class
        this.canvas = element
        this.canvas.width = x
        this.canvas.height = y
        this.ctx = this.canvas.getContext("2d")!
        this.font = font
        this.fgColor = fg
        this.bgColor = bg
        //Draws background
        this.ctx.fillStyle = this.bgColor
        this.ctx.fillRect(0, 0, x, y)
    }
    drawImages(): void {
        //Draws compass backgrounds
        this.images.forEach((v, i) => {
            const img = new Image()
            img.src = "./assets/" + v + "compass.svg"
            img.addEventListener<"load">("load", () =>
                this.ctx.drawImage(img, ((i+1)&2)*250, ((i+1)&1)*500, 500, 500)
            )
        })
    }
    private setFontsize(size: number): void {
        this.ctx.font = size.toFixed(0) + "px " + this.font
    }
    drawBorders(): void {
        this.ctx.fillStyle = "black"
        for(let i=0;i<3;i++) {
            this.ctx.fillRect(0,496*i,1000,8)
            this.ctx.fillRect(496*i,0,8,1000)
        }
    }
    drawheader(title:string, matches: Array<Ideology>): void {
        this.ctx.fillStyle = this.fgColor
        this.ctx.font = "64px titlefont"
        this.ctx.fillText(title,16,64,480)
        this.setFontsize(32)
        for(let i=0;i<3;i++) {
            const text = `${i+1}. ${matches[i].name}`
            this.ctx.fillText(text,16,112+i*40)
        }
    }
    drawAxis(index: number, value: number ,axis: Axis, tier: string): void {
        this.ctx.fillStyle = this.fgColor
        this.setFontsize(24)
        let text: string = "";
        if(value>=50) {
            text += value.toFixed(1) + " " + axis.leftvalue.name
        } else {
            text += (100-value).toFixed(1) + " " + axis.rightvalue.name
        }
        text += ` (${tier})`
        this.ctx.fillText(text,16,240+48*index)
    }
    drawDot(postion:number,x:number,y:number): void {
        //Sets x and y positions
        x = 4.64*(100-x) + 18
        y = 4.64*(100-y) + 18
        x += (postion & 2)*250 
        y += (postion & 1)*500
        this.ctx.fillStyle = "white"
        this.ctx.lineWidth = 4
        this.ctx.beginPath()
        this.ctx.arc(x,y,12,0,Math.PI*2)
        this.ctx.fill()
        this.ctx.stroke()
    }
}

//Grabs parameters and parses scores
const params: URLSearchParams = new URLSearchParams(document.location.search)
let lang: string = params.get("lang") ?? "en"
const ui: Ui = getLanguage(lang); lang = ui.lang ?? lang
const rawScores: string = params.get("score") ?? "50,50,50,50,50,50"
const scores: Array<number> = rawScores.split(",").map(v =>  {
    const score = parseFloat(v)
    if(Number.isNaN(score) || !Number.isFinite(score)) {
        return 50
    }
    return Math.max(Math.min(score,100),0)
})
if(scores.length < 6) {
    alert("Invalid result")
    throw new Error("Missing scores")
}
const send: boolean = !(params.get("send") === "no")
//Assigns canvas elements to constants
const canvasElm = <HTMLCanvasElement>document.getElementById("results1")!
const canvasElm2 = <HTMLCanvasElement>document.getElementById("results2")!
//Finfs color theme and sets colors accordingly 
const dark: boolean = window.matchMedia?.("(prefers-color-scheme: dark)").matches
const [bg, fg] = dark ? ["#202020", "#fff"] : ["#e0e0e0", "#000"]
//Create canvas objects and draws canvas 2 images (set here to avoid async functions)
const canvas: Canvas = new Canvas(canvasElm, 800, 880, "textfont", fg, bg)
const canvas2: Canvas2 = new Canvas2(canvasElm2, 1000, 1000, "textfont", fg, bg)
canvas2.drawImages()
//Grabs test version from window object
const version: string = ui.resultstext.version_name + ": " + window.VERSION
//Grabs ideologies list from json and parses their matches
const ideologies: Array<Ideology> = getJson("ideologies-" + lang)
const weights: Array<number> = [1, 0.6, 0.8, 1, 0.4, 0.3]
const matches: Array<Ideology> = orderScores(scores, weights, ideologies)
//Adds the name to text only elements
for (const elm of Object.keys(ui.resultstext.text)) {
    document.getElementById(elm)!.textContent = ui.resultstext.text[elm]
}

document.title = ui.resultstext.text.title

//Adds match to div
const score1 = document.getElementById("score1")!
score1.textContent = `${ui.resultstext.closest_match}: ${matches[0].name}`
//Adds next cclosest scores
const score2 = document.getElementById("score2")!
score2.textContent = ui.resultstext.next_matches + ": "
let nextLabels: Array<string> = Array()
for (let i = 1; i < 5; i++) {
    nextLabels.push(matches[i].name)
}
score2.textContent += nextLabels.join(", ")
//Adds description
const desc = document.getElementById("desc")!
desc.textContent = matches[0].desc

//Button to index
const backButton = document.getElementById("back_button")!
backButton.addEventListener<"click">("click",() =>
    window.location.href = "index.html?lang=" + lang
)
//Button to lister.hmtl
const fullList = document.getElementById("full_list")!
fullList.addEventListener<"click">("click", () =>
    window.location.href = "lister.html?lang=" + lang + 
    "&score=" + scores.map(x => x.toFixed(1)).join(",")
)
//Enable download buttons
for (let i = 1; i < 3; i++) {
    const button = document.getElementById("download" + i.toFixed())!
    button.addEventListener<"click">("click", () => {
        const link = document.createElement("a")
        link.download = "dv.png"
        const canvas = <HTMLCanvasElement>document.getElementById("results" + i.toFixed())!
        link.href = canvas.toDataURL("image/png")
        link.click()
    })
}

const axisHolder = <HTMLDivElement>document.getElementById("axisholder")
let axisLabels: Array<string> = Array()
ui.axes.forEach((v, i) => {
    //Finds axis label and composes result string, pushes to array
    const tier = matchAxisTier(scores[i], v.tiers)
    let axisLabel: string
    if (ui.resultstext.axis_name_before) {
        axisLabel = `${ui.resultstext.axis_name} ${v.axisname}: ${tier}`
    } else {
        axisLabel = `${v.axisname} ${ui.resultstext.axis_name}: ${tier}`
    }
    axisLabels.push(axisLabel)
    //Pushes string to label
    const labelelm = document.createElement("h2")
    labelelm.textContent = axisLabel
    axisHolder.appendChild(labelelm)
    //Creates axis div
    const axis_elm = document.createElement("div")
    axis_elm.className = "axis"
    //Generates value images
    const lft_img = new Image()
    lft_img.src = v.leftvalue.icon
    const rgt_img = new Image()
    rgt_img.src = v.rightvalue.icon
    //Generates result divs
    const divgen = (
        right: boolean,
        color: string,
        value: number): HTMLDivElement => {
        //Creates parent div
        const parentDiv = document.createElement("div")
        parentDiv.className = "bar"
        parentDiv.style.backgroundColor = color
        parentDiv.style.width = value.toFixed(1) + "%"
        if (right) {
            parentDiv.style.borderLeftStyle = "solid"
            parentDiv.style.textAlign = "right"
        } else {
            parentDiv.style.borderRightStyle = "solid"
            parentDiv.style.textAlign = "left"
        }
        if (value > 20) {
            const childDiv = document.createElement("div")
            childDiv.className = "text-wrapper"
            childDiv.textContent = value.toFixed(1) + "%"
            parentDiv.appendChild(childDiv)
        }
        return parentDiv
    }
    //Appends all created elements to the axis element and axis elm to axisholder
    axis_elm.appendChild(lft_img)
    axis_elm.appendChild(divgen(false, v.leftvalue.color, scores[i]))
    axis_elm.appendChild(divgen(true, v.rightvalue.color, (100 - scores[i])))
    axis_elm.appendChild(rgt_img)
    axisHolder.appendChild(axis_elm)
})

window.onload = () => {
    //Draws canvas 1 header
    canvas.drawHeader(
        ui.resultstext.text.title, 
        "quark88.github.io/dozenvalues/", 
        version, matches[0].name)
    //Draws canvas 2 borders and header
    canvas2.drawBorders()
    canvas2.drawheader(ui.resultstext.text.title,matches)

    //For each axis draw axis (both canvas), images (canvas 1) and dots (canvas 2)
    ui.axes.forEach((v, i) => {
        canvas2.drawAxis(i,scores[i],ui.axes[i],axisLabels[i].split(": ")[1])
        if(i % 2 === 0){ //Only draws dot ever 2 passes since dot needs x and y coord
            const postion = Math.floor(i/2) + 1
            const [x,y] = postion === 2 ? [scores[i+1],scores[i]] : [scores[i],scores[i+1]] //PCMoid brainworms
            canvas2.drawDot(postion,x,y)
        }
        const icons = [v.leftvalue.icon, v.rightvalue.icon]
        canvas.drawImages(icons, i)
        const colors = [v.leftvalue.color, v.rightvalue.color]
        canvas.drawBar(i, colors, scores[i], axisLabels[i])
    })
}