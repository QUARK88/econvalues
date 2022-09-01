import { getJson, getLanguage, orderScores } from "./common.js"
import type { Ui, Ideology, Axis } from "./types"

const params: URLSearchParams = new URLSearchParams(document.location.search)
let lang: string = params.get("lang") ?? "en"
const ui: Ui = getLanguage(lang)
lang = ui.lang ?? lang
const rawScores: string = params.get("score") ?? "50,50,50,50,50,50"
const scores: Array<number> = rawScores.split(",").map(v => parseFloat(v))
const ideologies: Array<Ideology> = getJson("ideologies-" + lang)
const weights: Array<number> = [1, 0.9, 1, 0.6, 0.6, 0.7]
const matches: Array<Ideology> = orderScores(scores, weights, ideologies)

const abscheck = <HTMLInputElement> document.getElementById("abs")
abscheck.addEventListener("click", () => {

    displayMatches(matches,abscheck.checked)
})

displayMatches(matches,abscheck.checked)

function displayMatches(matches: Ideology[], absolute: boolean=false) {
    const maximum = scores.map(x => Math.max(x,100-x))
    let max = 0
    for(let i=0;i<maximum.length;i++){
        max += weights[i] * Math.pow(maximum[i] / 100, 3)
    }
    max /= maximum.length
    const maxValue = Math.max(...matches.map(x => x.score!))
    const weighedMatches = matches.map(x => {
        const weighedScore = x.score!/(absolute? maxValue : max)
        const obj = {} as Ideology
        obj.score =  100*(1-weighedScore)
        obj.name = x.name
        return obj
    })
    const matchholder = <HTMLDivElement> document.getElementById("matchholder")!
    matchholder.innerHTML = ""
    weighedMatches.forEach( (v,i) => {
        const elm = document.createElement("p")
        elm.textContent = `${i+1}: ${v.name} : ${v.score?.toFixed(1)}%`
        matchholder.appendChild(elm)
    })
}