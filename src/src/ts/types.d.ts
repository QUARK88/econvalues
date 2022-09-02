export type Lang = {
    id: string;
    name: string;
}

export type Value = {
    name: string;
    color: string;
    icon: string;
    blurb: string;
}

export type Axis = {
    axisname: string;
    tiers: Array<string>;
    leftvalue: Value;
    rightvalue: Value;
}

export type Credit = {
    tag: string;
    role: string
    score: Array<number>;
}

export type Textelm = {
    [key: string]: string
}

export type Indextext = {
    rawtext: Textelm
    htmltext: Textelm
    creditslist: Array<Credit>
}

export type Question = {
    text: string;
    effect: Array<number>;
    ogIndex?: number;
}

export type Quizbuttons = {
    text: string;
    color: string;
    weight: number;
}

export type Quiztext = {
    buttons: Array<Quizbuttons>;
    of: string;
    question: string;
    text: Textelm;
}

export type Resultstext = {
    axis_name: string;
    axis_name_before: boolean;
    version_name: string;
    closest_match: string;
    next_matches: string;
    text: Textelm;
}


export type Ui = {
    lang: string;
    axes: Array<Axis>;
    indextext: Indextext;
    instructiontext: Textelm;
    quiztext: Quiztext;
    resultstext: Resultstext;
}

export type Ideology = {
    name: string;
    stats: Array<number>;
    desc: string;
    score?: number;
}

declare global {
    interface Window {
        VERSION: string;
    }
}