import{getJson as e,getLanguage as t,Canvas as n,orderScores as o}from"./common.js";const s=new URLSearchParams(document.location.search);let a=s.get("lang")??"en";const l=t(a);a=l.lang??a;const c=(s.get("score")??"50,50,50,50,50,50").split(",").map((e=>parseFloat(e))),d=(s.get("send"),document.getElementById("results1")),r=window.matchMedia?.("(prefers-color-scheme: dark)").matches,[m,i]=r?["#202020","#fff"]:["#e0e0e0","#000"],u=new n(d,800,880,"textfont",i,m),g=l.resultstext.version_name+": "+window.VERSION,x=e("ideologies-"+a),h=o(c,[1,.6,.8,1,.4,.3],x);for(const e of Object.keys(l.resultstext.text)){console.log(e);const t=document.getElementById(e);t&&(t.textContent=l.resultstext.text[e])}document.getElementById("score1").textContent=`${l.resultstext.closest_match}: ${h[0].name}`;const w=document.getElementById("score2");w.textContent=l.resultstext.next_matches+": ";let E=Array();for(let e=1;e<5;e++)E.push(h[e].name);w.textContent+=E.join(", ");document.getElementById("back_button").addEventListener("click",(()=>window.location.href="index.html?lang="+a));document.getElementById("full_list").addEventListener("click",(()=>window.location.href="lister.html?lang="+a+"&score="+c.map((e=>e.toFixed(1))).join(",")));document.getElementById("axisholder");const f=l.axes.map((e=>e.axisname+" axis"));document.getElementById("download1").addEventListener("click",(()=>{const e=document.createElement("a");e.download="EconValues Results.png";const t=document.getElementById("results1");e.href=t.toDataURL("image/png"),e.click()})),window.onload=()=>{u.drawHeader("EconValues","quark88.github.io/econvalues/",g,h[0].name),l.axes.forEach(((e,t)=>{const n=[e.leftvalue.icon,e.rightvalue.icon];u.drawImages(n,t);const o=[e.leftvalue.color,e.rightvalue.color];u.drawBar(t,o,c[t],f[t])}))};
//# sourceMappingURL=results.js.map