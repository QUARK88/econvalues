import { getJson, getLanguage, Canvas, matchAxisTier, orderScores } from "./common.js"
import type { Ui, Ideology, Axis } from "./types"


//Grabs parameters and parses scores
const params: URLSearchParams = new URLSearchParams(document.location.search)
let lang: string = params.get("lang") ?? "en"
const ui: Ui = getLanguage(lang); lang = ui.lang ?? lang
const rawScores: string = params.get("score") ?? "50,50,50,50,50,50"
const scores: Array<number> = rawScores.split(",").map(v => parseFloat(v))
const send: boolean = !(params.get("send") === "no")
//Assigns canvas elements to constants
const canvasElm = <HTMLCanvasElement>document.getElementById("results1")!
//Finfs color theme and sets colors accordingly 
const dark: boolean = window.matchMedia?.("(prefers-color-scheme: dark)").matches
const [bg, fg] = dark ? ["#202020", "#fff"] : ["#e0e0e0", "#000"]
//Create canvas objects and draws canvas 2 images (set here to avoid async functions)
const canvas: Canvas = new Canvas(canvasElm, 800, 880, "textfont", fg, bg)
//Grabs test version from window object
const version: string = ui.resultstext.version_name + ": " + window.VERSION
//Grabs ideologies list from json and parses their matches
const ideologies: Array<Ideology> = getJson("ideologies-" + lang)
const weights: Array<number> = [1, 0.6, 0.8, 1, 0.4, 0.3]
const matches: Array<Ideology> = orderScores(scores, weights, ideologies)
//Adds the name to text only elements
for (const elm of Object.keys(ui.resultstext.text)) {
    console.log(elm)
    const element = document.getElementById(elm)
    if(element) {
        element.textContent = ui.resultstext.text[elm]
    }
}
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

const axisHolder = <HTMLDivElement>document.getElementById("axisholder")
const axisLabels = ui.axes.map(x => x.axisname + " axis")

//Enable download buttons

const button = document.getElementById("download1")!
button.addEventListener<"click">("click", () => {
    const link = document.createElement("a")
    link.download = "EconValues Results.png"
    const canvas = <HTMLCanvasElement>document.getElementById("results1")!
    link.href = canvas.toDataURL("image/png")
    link.click()
})


window.onload = () => {
    //Draws canvas 1 header
    canvas.drawHeader("EconValues", "quark88.github.io/econvalues/", version, matches[0].name)
    //For each axis draw axis (both canvas), images (canvas 1) and dots (canvas 2)
    ui.axes.forEach((v, i) => {
        const icons = [v.leftvalue.icon, v.rightvalue.icon]
        canvas.drawImages(icons, i)
        const colors = [v.leftvalue.color, v.rightvalue.color]
        canvas.drawBar(i, colors, scores[i], axisLabels[i])
    })
}