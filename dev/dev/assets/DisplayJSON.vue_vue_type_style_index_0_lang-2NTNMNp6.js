import{a as f,f as g,o as m,c as j,w as i,h as u,b as x,C as p}from"./RootLayout.vue_vue_type_style_index_0_lang-Be9ADJki.js";const $='<span class="json-colon">: </span>';function w(n){let e=n;const o=/"([^"]+)":/g,r=/:\s+(.*$)/g,s=o.exec(e);if(!s)return`<div class="json-row">${d(e)}</div>`;const t=r.exec(e);if(!s||!t)return e;const a=`<span class="json-key">"${s[1]}"</span>`,c=t[1],l=e.match(/^\s+/);return`<div class="json-row">${l?l[0]:""}${a}${$}${d(c)}</div>`}function d(n){const e=/"([^"]+)"/g,o=/(\d+)/g,r=/(true|false)/g,s=e.exec(n);if(s){const c=R(s[1]);return n.replace(e,`<span class="json-string">"${c}"</span>`)}const t=o.exec(n);if(t)return n.replace(o,`<span class="json-number">${t[1]}</span>`);const a=r.exec(n);return a?n.replace(r,`<span class="json-boolean">${a[1]}</span>`):n==="null"?'<span class="json-null">null</span>':n==="undefined"?'<span class="json-undefined">undefined</span>':n}function R(n){return n.replace(/[&<>"']/g,e=>{switch(e){case"&":return"&amp;";case"<":return"&lt;";case">":return"&gt;";case'"':return"&quot;";default:return""}})}const _=["innerHTML"],k=f({__name:"DisplayJSON",props:{value:{},field:{}},setup(n){const e=n,o=g(()=>e.value?JSON.stringify(e.value,null,2).split(`
`).map(t=>`${w(t)}`).join(""):'<div class="italic">no content</div>');return(r,s)=>(m(),j(p,{class:"json-wrapper"},{default:i(()=>[s[0]||(s[0]=u("div",{class:"gutter"},null,-1)),x(p,{class:"json-content-wrapper position-relative"},{default:i(()=>[u("div",{class:"json-content",innerHTML:o.value},null,8,_)]),_:1})]),_:1}))}});export{k as _};
