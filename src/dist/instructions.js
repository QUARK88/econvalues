import{getLanguage as t}from"./common.js";let e=new URLSearchParams(document.location.search).get("lang")??"en";const n=t(e);e=n.lang??e;for(const t of Object.keys(n.instructiontext))document.getElementById(t).textContent=n.instructiontext[t];document.title=n.instructiontext.title,document.getElementById("quiz_button").addEventListener("click",(()=>window.location.href="quiz.html?lang="+e)),document.getElementById("quiz_random_button").addEventListener("click",(()=>window.location.href="quiz.html?lang="+e+"&rand=true")),document.getElementById("back_button").addEventListener("click",(()=>window.location.href="index.html?lang="+e));
//# sourceMappingURL=instructions.js.map