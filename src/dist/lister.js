import{getJson as e,getLanguage as t,orderScores as n}from"./common.js";const o=new URLSearchParams(document.location.search);let c=o.get("lang")??"en";c=t(c).lang??c;const a=(o.get("score")??"50,50,50,50,50,50").split(",").map((e=>parseFloat(e))),m=e("ideologies-"+c),r=[1,.6,.8,1,.4,.3],s=n(a,r,m),l=document.getElementById("abs");function d(e,t=!1){const n=a.map((e=>Math.max(e,100-e)));let o=0;for(let e=0;e<n.length;e++)o+=r[e]*Math.pow(n[e]/100,3);o/=n.length;const c=Math.max(...e.map((e=>e.score))),m=e.map((e=>{const n=e.score/(t?c:o),a={};return a.score=100*(1-n),a.name=e.name,a})),s=document.getElementById("matchholder");s.innerHTML="",m.forEach(((e,t)=>{const n=document.createElement("p");n.textContent=`${t+1}: ${e.name} : ${e.score?.toFixed(1)}%`,s.appendChild(n)}))}l.addEventListener("click",(()=>{d(s,l.checked)})),d(s,l.checked);
//# sourceMappingURL=lister.js.map