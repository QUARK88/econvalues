import { getJson } from "./common.js"
import type { Indextext, Lang, Axis, Ui, Value, Textelm } from "./types"

(function (): void {
    //grabs languages list and assigns language element
    const langs: Array<Lang> = getJson("langs")
    const langDropdown = <HTMLSelectElement>document.getElementById("langDropdown")!
    //Creates language mutable array
    let langList: Array<string> = new Array()
    //For each language creates element, appends it and adds id to list
    for (const lang of langs) {
        const opt = <HTMLOptionElement>document.createElement("option")
        opt.value = lang.id
        opt.textContent = lang.name
        langDropdown.appendChild(opt)
        langList.push(lang.id)
    }
    //Grabs parameters and sets language
    const params: URLSearchParams = new URLSearchParams(document.location.search)
    const lang: string = params.get("lang") ?? "en"
    const changeLang = (lang: string): void => {
        try {
            //tries to load language's UI
            const ui: Ui = getJson("ui-" + lang)
            loadUI(ui, lang)
            //Sets lang parameter and changes URL accordingly
            params.set("lang", lang)
            const newPath: string = document.location.origin + 
            window.location.pathname + "?" + params.toString()
            window.history.replaceState(null, document.title, newPath)
            //Changes selected index
            langDropdown.selectedIndex = langList.indexOf(lang, 0)
        } catch (e) {
            console.error(e)
            alert(lang + " is not a valid language")
            changeLang("en")
        }
    }
    //Loads language UI and adds event listeners to elements
    changeLang(lang)
    langDropdown.addEventListener<"change">("change", () =>
        changeLang(langDropdown.value)
    )
})()

function loadUI(ui: Ui, lang: string): void {
    //Assigning elements to constants
    const 
    collumn_holder = <HTMLDivElement>document.getElementById("column-holder")!,
    valuesExplaination = <HTMLDivElement>document.getElementById("values-explaination")!,
    creditsList = <HTMLParagraphElement>document.getElementById("credits-list")!
    //Function to clear all elements for clean language changes
    const clearElm = (elm: HTMLElement): void => {
        while (elm.firstChild) {
            elm.removeChild(elm.firstChild)
        }
    }
    //Clearing the elements
    clearElm(collumn_holder)
    clearElm(valuesExplaination)
    clearElm(creditsList)

    //Adds onClick events for the buttons
    document.getElementById("start_button")!.addEventListener<"click">("click", () =>
        window.location.href = "instructions.html?lang=" + lang
    )
    document.getElementById("matches_button")!.addEventListener<"click">("click", () =>
        window.location.href = "matches.html?lang=" + lang
    )

    //Creates icons boxes and explaination blocks
    for (const axis of ui.axes) {
        //creates base column node div
        const column = document.createElement("div")
        column.className = "column"
        //creates axis name div
        const axis_name = document.createElement("div")
        axis_name.className = "block"
        const label_elm = document.createElement("div")
        label_elm.className = "axis_label"
        label_elm.textContent = axis.axisname.toUpperCase()
        axis_name.appendChild(label_elm)
        //Function to create anchor elements
        const createAnchor = (value: Value): HTMLAnchorElement => {
            const elm = <HTMLAnchorElement>document.createElement("a")
            elm.href = "#anchor-" + axis.axisname.toLowerCase()
            const img = new Image()
            img.src = value.icon
            img.className = "quadcolumn"
            elm.appendChild(img)
            return elm
        }
        //creates and appends 2 anchor elements
        axis_name.appendChild(createAnchor(axis.leftvalue))
        axis_name.appendChild(createAnchor(axis.rightvalue))
        collumn_holder.appendChild(axis_name)

        //creates spacer element
        const spacer = document.createElement("div")
        spacer.className = "spacer"
        //Function to create explaination-blurbs
        const createBlurb = (side: string, val: Value): HTMLDivElement => {
            const baseElm = document.createElement("div")
            baseElm.className = "explanation_blurb_" + side
            const valdiv = document.createElement("p")
            valdiv.className = "value"
            const valname = document.createElement("b")
            valname.textContent = val.name.toUpperCase()
            valname.style.color = val.color
            valdiv.appendChild(valname)
            const blurbText = document.createElement("p")
            blurbText.textContent = val.blurb
            blurbText.className = "blurb-text"
            baseElm.appendChild(valdiv)
            baseElm.appendChild(blurbText)
            return baseElm
        }
        spacer.appendChild(createBlurb("left", axis.leftvalue))
        //add value name and arrow
        const expAxis = document.createElement("div")
        const axisName = document.createElement("p")
        axisName.textContent = axis.axisname.toUpperCase()
        axisName.className = "axis_name"
        const expAnchor = document.createElement("a")
        expAnchor.id = "anchor-" + axis.axisname.toLowerCase()
        expAxis.appendChild(axisName)
        expAxis.appendChild(expAnchor)
        expAxis.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="71.2522" height="21.8695" viewBox="0 0 406.4 135.46666667" class="arrow"><path fill="none" stroke="#404040" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m338.66666 101.6 50.8-33.866668-50.8-33.866666m-270.933328 0L16.933333 67.73333 67.733332 101.6M16.933333 67.73333H389.46666"></path></svg>'
        //Appends axis to spacer and spacer to values
        spacer.appendChild(expAxis)
        spacer.appendChild(createBlurb("right", axis.rightvalue))

        valuesExplaination.appendChild(spacer)

    }
    //changes text constent of text and button elements
    for (const i of Object.keys(ui.indextext.rawtext)) {
        document.getElementById(i)!.textContent = ui.indextext.rawtext[i]
    }
    for (const i of Object.keys(ui.indextext.htmltext)) {
        document.getElementById(i)!.innerHTML = ui.indextext.htmltext[i]
    }
    //Sets document title
    document.title = ui.indextext.rawtext.title

    //Renders credits
    for (const credit of ui.indextext.creditslist) {
        const creditSpan = document.createElement("div")
        creditSpan.textContent = credit.role
        const link = document.createElement("a")
        link.textContent = credit.tag
        link.href = "./results.html?lang=" + lang + "&score=" +
            credit.score.map(x => x.toFixed(1)).join(",") + "&send=no"
        creditSpan.appendChild(link)
        creditsList.appendChild(creditSpan)
    }
}
