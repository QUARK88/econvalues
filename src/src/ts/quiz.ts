import { getJson, getLanguage } from "./common.js"
import type { Question, Ui } from "./types"
//Grabs url parameters
const params: URLSearchParams = new URLSearchParams(document.location.search)
let lang: string = params.get("lang") ?? "en"
const ui: Ui = getLanguage(lang)
lang = ui.lang ?? lang
const random: boolean = params.get("rand") === "true"
//Loads questions
const questions: Array<Question> = getJson("questions-" + lang)
//Loads text elements
for (const elm of Object.keys(ui.quiztext.text)) {
    console.log(elm)
    document.getElementById(elm)!.textContent = ui.quiztext.text[elm]
}

document.title = ui.quiztext.text.title

//Loads back button, button and text divs into constants
const buttonHolder = <HTMLDivElement>document.getElementById("buttonholder")!
const questiontext = <HTMLDivElement>document.getElementById("questiontext")!
const questionnumber = <HTMLDivElement>document.getElementById("question_number")!
//Sets quiz buttons
for (const [index, button] of ui.quiztext.buttons.entries()) {
    const quizbutton = document.createElement("button")
    quizbutton.textContent = button.text
    quizbutton.style.backgroundColor = button.color
    quizbutton.addEventListener<"click">("click", () => nextQuestion(index))
    buttonHolder.appendChild(quizbutton)
}
//Maps back button to last question function
document.getElementById("back_button")!.addEventListener<"click">("click", () => lastQuestion())
//Creates empty arrays for answers and maximum values
const answers: Array<number> = new Array(questions.length)
const maxvalues: Array<number> = new Array(questions[0].effect.length).fill(0)
//Adds absolute maximum value of each question to the maximum values array
for (const question of questions) {
    question.effect.forEach((element, i) => maxvalues[i] += Math.abs(element));
}
//Randomizes questions if random is true
if (random) {
    questions.forEach((v, i) => v.ogIndex = i)
    questions.sort(() => 0.5 - Math.random())
}
//Sets current number to 0 and loads first question
let curr: number = 0
loadQuestion()
//Adds answer to answers array, increments counter and calls load/calc
function nextQuestion(ansIndex: number): void {
    answers[curr] = ansIndex
    curr++
    if (questions[curr])
        loadQuestion()
    else
        calcScores()
}
//Loads current question content
function loadQuestion(): void {
    questiontext.textContent = questions[curr].text
    questionnumber.textContent = `${ui.quiztext.question} ${(curr + 1)} ${ui.quiztext.of} ${questions.length}`
}
//Decrements question counter and loads question or rewinds
function lastQuestion(): void {
    curr--
    if (questions[curr])
        loadQuestion()
    else
        window.history.back()
}
//Calculates final score
function calcScores(): void {
    //creates 2 empty arrays and an array with the button weights
    const score: Array<number> = new Array(questions[0].effect.length).fill(0)
    const weighedScore: Array<number> = new Array(questions[0].effect.length).fill(0)
    const weights: Array<number> = [1, 0.5, 0, -0.5, -1]
    //creates mutable array for placing sorted answers
    let sortedAnswers = new Array(answers.length)
    //checks if questions were randomized
    if (questions[0]?.ogIndex !== undefined) {
        //sorts answers based on ogindex
        questions.forEach((v, i) => sortedAnswers[v.ogIndex!] = answers[i])
    } else {
        sortedAnswers = answers
    }
    //for each sorted answer caculates the actual score
    sortedAnswers.forEach((value, index) =>
        questions[index].effect.forEach((v, i) =>
            score[i] += weights[value] * v
        )
    )
    //Calculates weighted score from formula
    maxvalues.forEach((v, i) =>
        weighedScore[i] = Math.round((v + score[i]) / (2 * v) * 1000) / 10
    )
    //Goes to results page
    window.location.href = "results.html?lang=" + lang + "&score=" +
        weighedScore.map(x => x.toFixed(1)).join(",")
}