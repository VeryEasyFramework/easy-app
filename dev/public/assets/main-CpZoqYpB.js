const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomeView-DdV4qQEN.js","assets/logo-C62CV3B5.js","assets/logo-CthPLfTH.css","assets/EntityView-DvC8HA5d.js","assets/CardWidget-BFzG0_qg.js","assets/Button.vue_vue_type_script_setup_true_lang-D3cZiOsp.js","assets/EntityListView-CfvXpygX.js","assets/InputData.vue_vue_type_script_setup_true_lang-sdGTyYUO.js","assets/EntityListView-BdiHfZ3C.css","assets/EntityRecordView-D3O8qoWg.js","assets/ApiExplorerView-B18v4VTg.js","assets/RealtimeView-CscRT8qo.js"])))=>i.map(i=>d[i]);
var Pt=Object.defineProperty;var St=(e,t,n)=>t in e?Pt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var ve=(e,t,n)=>St(e,typeof t!="symbol"?t+"":t,n);import{n as Se,d as bt,a as B,r as tt,o as V,c as z,w as $,b as T,e as kt,T as nt,_ as st,u as Ct,f as N,g as ue,C as se,h as At,i as H,j as Ot,k as Tt,l as $t,t as ot,m as xt,p as Ae,q as Lt,s as Q,v as It,x as Nt,y as Mt,z as Bt,A as Vt,B as oe,D as rt,E as _e,F as jt,G as zt,H as Ht,I as Dt}from"./logo-C62CV3B5.js";class qt{constructor(t){ve(this,"host");ve(this,"notify",t=>{console.error(t)});this.host=t||"/api"}async call(t,n,s){const o=`${this.host}?group=${t}&action=${n}`,i=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}).catch(m=>(this.notify({message:m.message,title:"Network Error",type:"error"}),new Response(null,{status:500})));if(!i.ok){i.status===302&&(window.location.href=i.headers.get("Location")||"/");const m=await i.text(),a=this.parseError(i,m),h=`${a.title||"API Error"} - ${a.statusCode}`;return t==="auth"&&n==="check"&&a.statusCode===401?{}:(this.notify({message:a.message,title:h,type:"error"}),{})}return await i.json()}async getList(t,n){const s={...n,entity:t};return await this.call("entity","getList",s)}parseError(t,n){const s={};s.statusCode=t.status;let o;try{o=JSON.parse(n??""),"error"in o&&(o=o.error),s.message=o}catch{o=n}return s.message=o,s}onNotify(t){this.notify=t}}const le=new qt("/api");le.onNotify(e=>{Se({title:e.title,message:e.message,type:e.type})});const Ut={entities:[]},at=bt("app",{state:()=>({session:{},isMobile:!1,initialized:!1,booted:!1,theme:"light",userThemePref:null,localTheme:null,isAuthenticated:!1}),actions:{async init(){this.initialized||(this.initTheme(),await this.boot(),this.initialized=!0)},async boot(){Ut.entities=await le.call("app","entities"),this.booted=!0},initTheme(){this.loadLocalTheme(),this.loadUserThemePref(),this.setTheme(this.localTheme||this.userThemePref||"light")},loadUserThemePref(){this.userThemePref=window!=null&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"},loadLocalTheme(){this.localTheme=localStorage.getItem("theme")},setTheme(e){localStorage.setItem("theme",e),this.theme=e,document.body.dataset.theme=this.theme},toggleTheme(){this.theme=="light"?this.theme="dark":this.theme="light",this.setTheme(this.theme)},async login(e,t){if((await le.call("auth","login",{user:e,password:t})).session_id==null){Se({message:"Login failed",title:"Login failed",type:"error"});return}this.isAuthenticated=this.session.session_id!=null,this.isAuthenticated&&(await this.boot(),Se({message:"Login successful",title:"Logged in",type:"success"}))},async logout(){await le.call("auth","logout"),this.$reset(),window.location.reload()}}}),Gt=B({__name:"TransitionRouterView",props:{transitionKey:{},fast:{type:Boolean}},setup(e){return(t,n)=>{const s=tt("RouterView");return V(),z(s,null,{default:$(({Component:o})=>[T(nt,{appear:"",mode:"out-in",name:t.fast?"fast":"simple-fade"},{default:$(()=>[(V(),z(kt(o),{key:t.transitionKey}))]),_:2},1032,["name"])]),_:1})}}}),Kt=st(Gt,[["__scopeId","data-v-5f69fd9a"]]),Wt=B({__name:"TransitionFade",props:{mode:{},type:{},speed:{},appear:{type:Boolean}},setup(e){Ct(s=>({"3732d50f":n.value}));const t=e,n=N(()=>{switch(t.speed){case"slow":return"0.7s";case"fast":return"0.1s";default:return"0.3s"}});return(s,o)=>(V(),z(nt,{appear:s.appear,mode:s.mode||"out-in",name:s.type||"fade"},{default:$(()=>[ue(s.$slots,"default")]),_:3},8,["appear","mode","name"]))}}),Ft=H("div",{class:"loader"},[H("div",{class:"loader__spinner"})],-1),Qt=B({__name:"LoaderOverlay",props:{loaded:{type:Boolean}},emits:["close","update:modelValue"],setup(e,{emit:t}){return(n,s)=>n.loaded?At("",!0):(V(),z(Wt,{key:0},{default:$(()=>[T(se,{class:"position-absolute top left vw-100 vh-100 center-items loader-overlay"},{default:$(()=>[Ft]),_:1})]),_:1}))}}),Yt={class:"side-bar"},Xt={class:"content"},Jt=B({__name:"SidebarNavLayout",setup(e){return(t,n)=>(V(),z(se,{class:"side-nav-layout grid-gap-4"},{default:$(()=>[H("div",Yt,[ue(t.$slots,"sidebar")]),H("div",Xt,[ue(t.$slots,"content")])]),_:3}))}}),Zt=H("div",{class:"header-logo"},[H("img",{alt:"EasyApp",src:Tt})],-1),en=B({__name:"HeaderBrand",setup(e){return(t,n)=>(V(),z(se,{class:"col fit max-content align-items-center"},{default:$(()=>[Zt,H("div",null,[ue(t.$slots,"default",{},()=>[Ot(" Easy App ")])])]),_:3}))}}),tn=B({__name:"MaterialIcon",props:{icon:{},size:{},color:{}},setup(e){return(t,n)=>(V(),$t("div",{class:"icon-font",style:xt({fontSize:`${t.size||1}rem`,"--color-icon":`var(--color-${t.color||"icon"})`})},ot(t.icon),5))}}),nn=st(tn,[["__scopeId","data-v-c0b5eda6"]]),sn={class:"nav-label outline"},on={class:"outline justify-content-between"},Ee=B({__name:"NavItem",props:{to:{},icon:{},text:{}},setup(e){return(t,n)=>{const s=tt("RouterLink");return V(),z(s,{to:t.to,class:"nav-item"},{default:$(()=>[T(Ae,{class:"container"},{default:$(()=>[H("div",sn,ot(t.text),1),H("div",on,[T(nn,{icon:t.icon,class:"icon"},null,8,["icon"])])]),_:1})]),_:1},8,["to"])}}}),rn=B({__name:"NavigatorSide",setup(e){return(t,n)=>(V(),z(Ae,{class:"navigator-side shadow-small"},{default:$(()=>[T(en,{class:"brand"}),T(se,{class:"nav row fit"},{default:$(()=>[T(Ee,{icon:"person",to:"/entity",text:"Entities"}),T(Ee,{icon:"code",to:"/api-explorer",text:"API Explorer"}),T(Ee,{icon:"network_ping",to:"/realtime",text:"Realtime Explorer"})]),_:1}),T(se,{class:"bottom"})]),_:1}))}}),an=B({__name:"App",setup(e){const t=at();return Lt(async()=>{await new Promise(n=>setTimeout(n,1e3))}),(n,s)=>(V(),z(It,null,{default:$(()=>[T(Ae,null,{default:$(()=>[T(Jt,null,{sidebar:$(()=>[T(rn)]),content:$(()=>[T(Kt)]),_:1}),T(Qt,{loaded:Q(t).booted},null,8,["loaded"])]),_:1})]),_:1}))}}),cn="modulepreload",ln=function(e){return"/"+e},Ve={},W=function(t,n,s){let o=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),p=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));o=Promise.all(n.map(m=>{if(m=ln(m),m in Ve)return;Ve[m]=!0;const a=m.endsWith(".css"),h=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${h}`))return;const u=document.createElement("link");if(u.rel=a?"stylesheet":cn,a||(u.as="script",u.crossOrigin=""),u.href=m,p&&u.setAttribute("nonce",p),document.head.appendChild(u),a)return new Promise((c,l)=>{u.addEventListener("load",c),u.addEventListener("error",()=>l(new Error(`Unable to preload CSS for ${m}`)))})}))}return o.then(()=>t()).catch(i=>{const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=i,window.dispatchEvent(p),!p.defaultPrevented)throw i})};/*!
  * vue-router v4.4.3
  * (c) 2024 Eduardo San Martin Morote
  * @license MIT
  */const F=typeof document<"u";function un(e){return e.__esModule||e[Symbol.toStringTag]==="Module"}const w=Object.assign;function Re(e,t){const n={};for(const s in t){const o=t[s];n[s]=M(o)?o.map(e):e(o)}return n}const te=()=>{},M=Array.isArray,it=/#/g,fn=/&/g,hn=/\//g,pn=/=/g,dn=/\?/g,ct=/\+/g,mn=/%5B/g,gn=/%5D/g,lt=/%5E/g,yn=/%60/g,ut=/%7B/g,vn=/%7C/g,ft=/%7D/g,_n=/%20/g;function Oe(e){return encodeURI(""+e).replace(vn,"|").replace(mn,"[").replace(gn,"]")}function En(e){return Oe(e).replace(ut,"{").replace(ft,"}").replace(lt,"^")}function be(e){return Oe(e).replace(ct,"%2B").replace(_n,"+").replace(it,"%23").replace(fn,"%26").replace(yn,"`").replace(ut,"{").replace(ft,"}").replace(lt,"^")}function Rn(e){return be(e).replace(pn,"%3D")}function wn(e){return Oe(e).replace(it,"%23").replace(dn,"%3F")}function Pn(e){return e==null?"":wn(e).replace(hn,"%2F")}function re(e){try{return decodeURIComponent(""+e)}catch{}return""+e}const Sn=/\/$/,bn=e=>e.replace(Sn,"");function we(e,t,n="/"){let s,o={},i="",p="";const m=t.indexOf("#");let a=t.indexOf("?");return m<a&&m>=0&&(a=-1),a>-1&&(s=t.slice(0,a),i=t.slice(a+1,m>-1?m:t.length),o=e(i)),m>-1&&(s=s||t.slice(0,m),p=t.slice(m,t.length)),s=On(s??t,n),{fullPath:s+(i&&"?")+i+p,path:s,query:o,hash:re(p)}}function kn(e,t){const n=t.query?e(t.query):"";return t.path+(n&&"?")+n+(t.hash||"")}function je(e,t){return!t||!e.toLowerCase().startsWith(t.toLowerCase())?e:e.slice(t.length)||"/"}function Cn(e,t,n){const s=t.matched.length-1,o=n.matched.length-1;return s>-1&&s===o&&Y(t.matched[s],n.matched[o])&&ht(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}function Y(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function ht(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!An(e[n],t[n]))return!1;return!0}function An(e,t){return M(e)?ze(e,t):M(t)?ze(t,e):e===t}function ze(e,t){return M(t)?e.length===t.length&&e.every((n,s)=>n===t[s]):e.length===1&&e[0]===t}function On(e,t){if(e.startsWith("/"))return e;if(!e)return t;const n=t.split("/"),s=e.split("/"),o=s[s.length-1];(o===".."||o===".")&&s.push("");let i=n.length-1,p,m;for(p=0;p<s.length;p++)if(m=s[p],m!==".")if(m==="..")i>1&&i--;else break;return n.slice(0,i).join("/")+"/"+s.slice(p).join("/")}const q={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};var ae;(function(e){e.pop="pop",e.push="push"})(ae||(ae={}));var ne;(function(e){e.back="back",e.forward="forward",e.unknown=""})(ne||(ne={}));function Tn(e){if(!e)if(F){const t=document.querySelector("base");e=t&&t.getAttribute("href")||"/",e=e.replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return e[0]!=="/"&&e[0]!=="#"&&(e="/"+e),bn(e)}const $n=/^[^#]+#/;function xn(e,t){return e.replace($n,"#")+t}function Ln(e,t){const n=document.documentElement.getBoundingClientRect(),s=e.getBoundingClientRect();return{behavior:t.behavior,left:s.left-n.left-(t.left||0),top:s.top-n.top-(t.top||0)}}const fe=()=>({left:window.scrollX,top:window.scrollY});function In(e){let t;if("el"in e){const n=e.el,s=typeof n=="string"&&n.startsWith("#"),o=typeof n=="string"?s?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!o)return;t=Ln(o,e)}else t=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(t):window.scrollTo(t.left!=null?t.left:window.scrollX,t.top!=null?t.top:window.scrollY)}function He(e,t){return(history.state?history.state.position-t:-1)+e}const ke=new Map;function Nn(e,t){ke.set(e,t)}function Mn(e){const t=ke.get(e);return ke.delete(e),t}let Bn=()=>location.protocol+"//"+location.host;function pt(e,t){const{pathname:n,search:s,hash:o}=t,i=e.indexOf("#");if(i>-1){let m=o.includes(e.slice(i))?e.slice(i).length:1,a=o.slice(m);return a[0]!=="/"&&(a="/"+a),je(a,"")}return je(n,e)+s+o}function Vn(e,t,n,s){let o=[],i=[],p=null;const m=({state:l})=>{const f=pt(e,location),R=n.value,P=t.value;let k=0;if(l){if(n.value=f,t.value=l,p&&p===R){p=null;return}k=P?l.position-P.position:0}else s(f);o.forEach(C=>{C(n.value,R,{delta:k,type:ae.pop,direction:k?k>0?ne.forward:ne.back:ne.unknown})})};function a(){p=n.value}function h(l){o.push(l);const f=()=>{const R=o.indexOf(l);R>-1&&o.splice(R,1)};return i.push(f),f}function u(){const{history:l}=window;l.state&&l.replaceState(w({},l.state,{scroll:fe()}),"")}function c(){for(const l of i)l();i=[],window.removeEventListener("popstate",m),window.removeEventListener("beforeunload",u)}return window.addEventListener("popstate",m),window.addEventListener("beforeunload",u,{passive:!0}),{pauseListeners:a,listen:h,destroy:c}}function De(e,t,n,s=!1,o=!1){return{back:e,current:t,forward:n,replaced:s,position:window.history.length,scroll:o?fe():null}}function jn(e){const{history:t,location:n}=window,s={value:pt(e,n)},o={value:t.state};o.value||i(s.value,{back:null,current:s.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0);function i(a,h,u){const c=e.indexOf("#"),l=c>-1?(n.host&&document.querySelector("base")?e:e.slice(c))+a:Bn()+e+a;try{t[u?"replaceState":"pushState"](h,"",l),o.value=h}catch(f){console.error(f),n[u?"replace":"assign"](l)}}function p(a,h){const u=w({},t.state,De(o.value.back,a,o.value.forward,!0),h,{position:o.value.position});i(a,u,!0),s.value=a}function m(a,h){const u=w({},o.value,t.state,{forward:a,scroll:fe()});i(u.current,u,!0);const c=w({},De(s.value,a,null),{position:u.position+1},h);i(a,c,!1),s.value=a}return{location:s,state:o,push:m,replace:p}}function zn(e){e=Tn(e);const t=jn(e),n=Vn(e,t.state,t.location,t.replace);function s(i,p=!0){p||n.pauseListeners(),history.go(i)}const o=w({location:"",base:e,go:s,createHref:xn.bind(null,e)},t,n);return Object.defineProperty(o,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(o,"state",{enumerable:!0,get:()=>t.state.value}),o}function Hn(e){return e=location.host?e||location.pathname+location.search:"",e.includes("#")||(e+="#"),zn(e)}function Dn(e){return typeof e=="string"||e&&typeof e=="object"}function dt(e){return typeof e=="string"||typeof e=="symbol"}const mt=Symbol("");var qe;(function(e){e[e.aborted=4]="aborted",e[e.cancelled=8]="cancelled",e[e.duplicated=16]="duplicated"})(qe||(qe={}));function X(e,t){return w(new Error,{type:e,[mt]:!0},t)}function j(e,t){return e instanceof Error&&mt in e&&(t==null||!!(e.type&t))}const Ue="[^/]+?",qn={sensitive:!1,strict:!1,start:!0,end:!0},Un=/[.+*?^${}()[\]/\\]/g;function Gn(e,t){const n=w({},qn,t),s=[];let o=n.start?"^":"";const i=[];for(const h of e){const u=h.length?[]:[90];n.strict&&!h.length&&(o+="/");for(let c=0;c<h.length;c++){const l=h[c];let f=40+(n.sensitive?.25:0);if(l.type===0)c||(o+="/"),o+=l.value.replace(Un,"\\$&"),f+=40;else if(l.type===1){const{value:R,repeatable:P,optional:k,regexp:C}=l;i.push({name:R,repeatable:P,optional:k});const E=C||Ue;if(E!==Ue){f+=10;try{new RegExp(`(${E})`)}catch(I){throw new Error(`Invalid custom RegExp for param "${R}" (${E}): `+I.message)}}let S=P?`((?:${E})(?:/(?:${E}))*)`:`(${E})`;c||(S=k&&h.length<2?`(?:/${S})`:"/"+S),k&&(S+="?"),o+=S,f+=20,k&&(f+=-8),P&&(f+=-20),E===".*"&&(f+=-50)}u.push(f)}s.push(u)}if(n.strict&&n.end){const h=s.length-1;s[h][s[h].length-1]+=.7000000000000001}n.strict||(o+="/?"),n.end?o+="$":n.strict&&(o+="(?:/|$)");const p=new RegExp(o,n.sensitive?"":"i");function m(h){const u=h.match(p),c={};if(!u)return null;for(let l=1;l<u.length;l++){const f=u[l]||"",R=i[l-1];c[R.name]=f&&R.repeatable?f.split("/"):f}return c}function a(h){let u="",c=!1;for(const l of e){(!c||!u.endsWith("/"))&&(u+="/"),c=!1;for(const f of l)if(f.type===0)u+=f.value;else if(f.type===1){const{value:R,repeatable:P,optional:k}=f,C=R in h?h[R]:"";if(M(C)&&!P)throw new Error(`Provided param "${R}" is an array but it is not repeatable (* or + modifiers)`);const E=M(C)?C.join("/"):C;if(!E)if(k)l.length<2&&(u.endsWith("/")?u=u.slice(0,-1):c=!0);else throw new Error(`Missing required param "${R}"`);u+=E}}return u||"/"}return{re:p,score:s,keys:i,parse:m,stringify:a}}function Kn(e,t){let n=0;for(;n<e.length&&n<t.length;){const s=t[n]-e[n];if(s)return s;n++}return e.length<t.length?e.length===1&&e[0]===80?-1:1:e.length>t.length?t.length===1&&t[0]===80?1:-1:0}function gt(e,t){let n=0;const s=e.score,o=t.score;for(;n<s.length&&n<o.length;){const i=Kn(s[n],o[n]);if(i)return i;n++}if(Math.abs(o.length-s.length)===1){if(Ge(s))return 1;if(Ge(o))return-1}return o.length-s.length}function Ge(e){const t=e[e.length-1];return e.length>0&&t[t.length-1]<0}const Wn={type:0,value:""},Fn=/[a-zA-Z0-9_]/;function Qn(e){if(!e)return[[]];if(e==="/")return[[Wn]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function t(f){throw new Error(`ERR (${n})/"${h}": ${f}`)}let n=0,s=n;const o=[];let i;function p(){i&&o.push(i),i=[]}let m=0,a,h="",u="";function c(){h&&(n===0?i.push({type:0,value:h}):n===1||n===2||n===3?(i.length>1&&(a==="*"||a==="+")&&t(`A repeatable param (${h}) must be alone in its segment. eg: '/:ids+.`),i.push({type:1,value:h,regexp:u,repeatable:a==="*"||a==="+",optional:a==="*"||a==="?"})):t("Invalid state to consume buffer"),h="")}function l(){h+=a}for(;m<e.length;){if(a=e[m++],a==="\\"&&n!==2){s=n,n=4;continue}switch(n){case 0:a==="/"?(h&&c(),p()):a===":"?(c(),n=1):l();break;case 4:l(),n=s;break;case 1:a==="("?n=2:Fn.test(a)?l():(c(),n=0,a!=="*"&&a!=="?"&&a!=="+"&&m--);break;case 2:a===")"?u[u.length-1]=="\\"?u=u.slice(0,-1)+a:n=3:u+=a;break;case 3:c(),n=0,a!=="*"&&a!=="?"&&a!=="+"&&m--,u="";break;default:t("Unknown state");break}}return n===2&&t(`Unfinished custom RegExp for param "${h}"`),c(),p(),o}function Yn(e,t,n){const s=Gn(Qn(e.path),n),o=w(s,{record:e,parent:t,children:[],alias:[]});return t&&!o.record.aliasOf==!t.record.aliasOf&&t.children.push(o),o}function Xn(e,t){const n=[],s=new Map;t=Fe({strict:!1,end:!0,sensitive:!1},t);function o(c){return s.get(c)}function i(c,l,f){const R=!f,P=Jn(c);P.aliasOf=f&&f.record;const k=Fe(t,c),C=[P];if("alias"in c){const I=typeof c.alias=="string"?[c.alias]:c.alias;for(const G of I)C.push(w({},P,{components:f?f.record.components:P.components,path:G,aliasOf:f?f.record:P}))}let E,S;for(const I of C){const{path:G}=I;if(l&&G[0]!=="/"){const D=l.record.path,L=D[D.length-1]==="/"?"":"/";I.path=l.record.path+(G&&L+G)}if(E=Yn(I,l,k),f?f.alias.push(E):(S=S||E,S!==E&&S.alias.push(E),R&&c.name&&!We(E)&&p(c.name)),yt(E)&&a(E),P.children){const D=P.children;for(let L=0;L<D.length;L++)i(D[L],E,f&&f.children[L])}f=f||E}return S?()=>{p(S)}:te}function p(c){if(dt(c)){const l=s.get(c);l&&(s.delete(c),n.splice(n.indexOf(l),1),l.children.forEach(p),l.alias.forEach(p))}else{const l=n.indexOf(c);l>-1&&(n.splice(l,1),c.record.name&&s.delete(c.record.name),c.children.forEach(p),c.alias.forEach(p))}}function m(){return n}function a(c){const l=ts(c,n);n.splice(l,0,c),c.record.name&&!We(c)&&s.set(c.record.name,c)}function h(c,l){let f,R={},P,k;if("name"in c&&c.name){if(f=s.get(c.name),!f)throw X(1,{location:c});k=f.record.name,R=w(Ke(l.params,f.keys.filter(S=>!S.optional).concat(f.parent?f.parent.keys.filter(S=>S.optional):[]).map(S=>S.name)),c.params&&Ke(c.params,f.keys.map(S=>S.name))),P=f.stringify(R)}else if(c.path!=null)P=c.path,f=n.find(S=>S.re.test(P)),f&&(R=f.parse(P),k=f.record.name);else{if(f=l.name?s.get(l.name):n.find(S=>S.re.test(l.path)),!f)throw X(1,{location:c,currentLocation:l});k=f.record.name,R=w({},l.params,c.params),P=f.stringify(R)}const C=[];let E=f;for(;E;)C.unshift(E.record),E=E.parent;return{name:k,path:P,params:R,matched:C,meta:es(C)}}e.forEach(c=>i(c));function u(){n.length=0,s.clear()}return{addRoute:i,resolve:h,removeRoute:p,clearRoutes:u,getRoutes:m,getRecordMatcher:o}}function Ke(e,t){const n={};for(const s of t)s in e&&(n[s]=e[s]);return n}function Jn(e){return{path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:void 0,beforeEnter:e.beforeEnter,props:Zn(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||null:e.component&&{default:e.component}}}function Zn(e){const t={},n=e.props||!1;if("component"in e)t.default=n;else for(const s in e.components)t[s]=typeof n=="object"?n[s]:n;return t}function We(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function es(e){return e.reduce((t,n)=>w(t,n.meta),{})}function Fe(e,t){const n={};for(const s in e)n[s]=s in t?t[s]:e[s];return n}function ts(e,t){let n=0,s=t.length;for(;n!==s;){const i=n+s>>1;gt(e,t[i])<0?s=i:n=i+1}const o=ns(e);return o&&(s=t.lastIndexOf(o,s-1)),s}function ns(e){let t=e;for(;t=t.parent;)if(yt(t)&&gt(e,t)===0)return t}function yt({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function ss(e){const t={};if(e===""||e==="?")return t;const s=(e[0]==="?"?e.slice(1):e).split("&");for(let o=0;o<s.length;++o){const i=s[o].replace(ct," "),p=i.indexOf("="),m=re(p<0?i:i.slice(0,p)),a=p<0?null:re(i.slice(p+1));if(m in t){let h=t[m];M(h)||(h=t[m]=[h]),h.push(a)}else t[m]=a}return t}function Qe(e){let t="";for(let n in e){const s=e[n];if(n=Rn(n),s==null){s!==void 0&&(t+=(t.length?"&":"")+n);continue}(M(s)?s.map(i=>i&&be(i)):[s&&be(s)]).forEach(i=>{i!==void 0&&(t+=(t.length?"&":"")+n,i!=null&&(t+="="+i))})}return t}function os(e){const t={};for(const n in e){const s=e[n];s!==void 0&&(t[n]=M(s)?s.map(o=>o==null?null:""+o):s==null?s:""+s)}return t}const rs=Symbol(""),Ye=Symbol(""),Te=Symbol(""),vt=Symbol(""),Ce=Symbol("");function ee(){let e=[];function t(s){return e.push(s),()=>{const o=e.indexOf(s);o>-1&&e.splice(o,1)}}function n(){e=[]}return{add:t,list:()=>e.slice(),reset:n}}function U(e,t,n,s,o,i=p=>p()){const p=s&&(s.enterCallbacks[o]=s.enterCallbacks[o]||[]);return()=>new Promise((m,a)=>{const h=l=>{l===!1?a(X(4,{from:n,to:t})):l instanceof Error?a(l):Dn(l)?a(X(2,{from:t,to:l})):(p&&s.enterCallbacks[o]===p&&typeof l=="function"&&p.push(l),m())},u=i(()=>e.call(s&&s.instances[o],t,n,h));let c=Promise.resolve(u);e.length<3&&(c=c.then(h)),c.catch(l=>a(l))})}function Pe(e,t,n,s,o=i=>i()){const i=[];for(const p of e)for(const m in p.components){let a=p.components[m];if(!(t!=="beforeRouteEnter"&&!p.instances[m]))if(as(a)){const u=(a.__vccOpts||a)[t];u&&i.push(U(u,n,s,p,m,o))}else{let h=a();i.push(()=>h.then(u=>{if(!u)return Promise.reject(new Error(`Couldn't resolve component "${m}" at "${p.path}"`));const c=un(u)?u.default:u;p.components[m]=c;const f=(c.__vccOpts||c)[t];return f&&U(f,n,s,p,m,o)()}))}}return i}function as(e){return typeof e=="object"||"displayName"in e||"props"in e||"__vccOpts"in e}function Xe(e){const t=oe(Te),n=oe(vt),s=N(()=>{const a=Q(e.to);return t.resolve(a)}),o=N(()=>{const{matched:a}=s.value,{length:h}=a,u=a[h-1],c=n.matched;if(!u||!c.length)return-1;const l=c.findIndex(Y.bind(null,u));if(l>-1)return l;const f=Je(a[h-2]);return h>1&&Je(u)===f&&c[c.length-1].path!==f?c.findIndex(Y.bind(null,a[h-2])):l}),i=N(()=>o.value>-1&&us(n.params,s.value.params)),p=N(()=>o.value>-1&&o.value===n.matched.length-1&&ht(n.params,s.value.params));function m(a={}){return ls(a)?t[Q(e.replace)?"replace":"push"](Q(e.to)).catch(te):Promise.resolve()}return{route:s,href:N(()=>s.value.href),isActive:i,isExactActive:p,navigate:m}}const is=B({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"}},useLink:Xe,setup(e,{slots:t}){const n=Vt(Xe(e)),{options:s}=oe(Te),o=N(()=>({[Ze(e.activeClass,s.linkActiveClass,"router-link-active")]:n.isActive,[Ze(e.exactActiveClass,s.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const i=t.default&&t.default(n);return e.custom?i:rt("a",{"aria-current":n.isExactActive?e.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:o.value},i)}}}),cs=is;function ls(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&!(e.button!==void 0&&e.button!==0)){if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function us(e,t){for(const n in t){const s=t[n],o=e[n];if(typeof s=="string"){if(s!==o)return!1}else if(!M(o)||o.length!==s.length||s.some((i,p)=>i!==o[p]))return!1}return!0}function Je(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const Ze=(e,t,n)=>e??t??n,fs=B({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(e,{attrs:t,slots:n}){const s=oe(Ce),o=N(()=>e.route||s.value),i=oe(Ye,0),p=N(()=>{let h=Q(i);const{matched:u}=o.value;let c;for(;(c=u[h])&&!c.components;)h++;return h}),m=N(()=>o.value.matched[p.value]);_e(Ye,N(()=>p.value+1)),_e(rs,m),_e(Ce,o);const a=jt();return zt(()=>[a.value,m.value,e.name],([h,u,c],[l,f,R])=>{u&&(u.instances[c]=h,f&&f!==u&&h&&h===l&&(u.leaveGuards.size||(u.leaveGuards=f.leaveGuards),u.updateGuards.size||(u.updateGuards=f.updateGuards))),h&&u&&(!f||!Y(u,f)||!l)&&(u.enterCallbacks[c]||[]).forEach(P=>P(h))},{flush:"post"}),()=>{const h=o.value,u=e.name,c=m.value,l=c&&c.components[u];if(!l)return et(n.default,{Component:l,route:h});const f=c.props[u],R=f?f===!0?h.params:typeof f=="function"?f(h):f:null,k=rt(l,w({},R,t,{onVnodeUnmounted:C=>{C.component.isUnmounted&&(c.instances[u]=null)},ref:a}));return et(n.default,{Component:k,route:h})||k}}});function et(e,t){if(!e)return null;const n=e(t);return n.length===1?n[0]:n}const hs=fs;function ps(e){const t=Xn(e.routes,e),n=e.parseQuery||ss,s=e.stringifyQuery||Qe,o=e.history,i=ee(),p=ee(),m=ee(),a=Nt(q);let h=q;F&&e.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const u=Re.bind(null,r=>""+r),c=Re.bind(null,Pn),l=Re.bind(null,re);function f(r,g){let d,y;return dt(r)?(d=t.getRecordMatcher(r),y=g):y=r,t.addRoute(y,d)}function R(r){const g=t.getRecordMatcher(r);g&&t.removeRoute(g)}function P(){return t.getRoutes().map(r=>r.record)}function k(r){return!!t.getRecordMatcher(r)}function C(r,g){if(g=w({},g||a.value),typeof r=="string"){const v=we(n,r,g.path),O=t.resolve({path:v.path},g),Z=o.createHref(v.fullPath);return w(v,O,{params:l(O.params),hash:re(v.hash),redirectedFrom:void 0,href:Z})}let d;if(r.path!=null)d=w({},r,{path:we(n,r.path,g.path).path});else{const v=w({},r.params);for(const O in v)v[O]==null&&delete v[O];d=w({},r,{params:c(v)}),g.params=c(g.params)}const y=t.resolve(d,g),b=r.hash||"";y.params=u(l(y.params));const A=kn(s,w({},r,{hash:En(b),path:y.path})),_=o.createHref(A);return w({fullPath:A,hash:b,query:s===Qe?os(r.query):r.query||{}},y,{redirectedFrom:void 0,href:_})}function E(r){return typeof r=="string"?we(n,r,a.value.path):w({},r)}function S(r,g){if(h!==r)return X(8,{from:g,to:r})}function I(r){return L(r)}function G(r){return I(w(E(r),{replace:!0}))}function D(r){const g=r.matched[r.matched.length-1];if(g&&g.redirect){const{redirect:d}=g;let y=typeof d=="function"?d(r):d;return typeof y=="string"&&(y=y.includes("?")||y.includes("#")?y=E(y):{path:y},y.params={}),w({query:r.query,hash:r.hash,params:y.path!=null?{}:r.params},y)}}function L(r,g){const d=h=C(r),y=a.value,b=r.state,A=r.force,_=r.replace===!0,v=D(d);if(v)return L(w(E(v),{state:typeof v=="object"?w({},b,v.state):b,force:A,replace:_}),g||d);const O=d;O.redirectedFrom=g;let Z;return!A&&Cn(s,y,d)&&(Z=X(16,{to:O,from:y}),Me(y,y,!0,!1)),(Z?Promise.resolve(Z):xe(O,y)).catch(x=>j(x)?j(x,2)?x:me(x):de(x,O,y)).then(x=>{if(x){if(j(x,2))return L(w({replace:_},E(x.to),{state:typeof x.to=="object"?w({},b,x.to.state):b,force:A}),g||O)}else x=Ie(O,y,!0,_,b);return Le(O,y,x),x})}function Et(r,g){const d=S(r,g);return d?Promise.reject(d):Promise.resolve()}function he(r){const g=ce.values().next().value;return g&&typeof g.runWithContext=="function"?g.runWithContext(r):r()}function xe(r,g){let d;const[y,b,A]=ds(r,g);d=Pe(y.reverse(),"beforeRouteLeave",r,g);for(const v of y)v.leaveGuards.forEach(O=>{d.push(U(O,r,g))});const _=Et.bind(null,r,g);return d.push(_),K(d).then(()=>{d=[];for(const v of i.list())d.push(U(v,r,g));return d.push(_),K(d)}).then(()=>{d=Pe(b,"beforeRouteUpdate",r,g);for(const v of b)v.updateGuards.forEach(O=>{d.push(U(O,r,g))});return d.push(_),K(d)}).then(()=>{d=[];for(const v of A)if(v.beforeEnter)if(M(v.beforeEnter))for(const O of v.beforeEnter)d.push(U(O,r,g));else d.push(U(v.beforeEnter,r,g));return d.push(_),K(d)}).then(()=>(r.matched.forEach(v=>v.enterCallbacks={}),d=Pe(A,"beforeRouteEnter",r,g,he),d.push(_),K(d))).then(()=>{d=[];for(const v of p.list())d.push(U(v,r,g));return d.push(_),K(d)}).catch(v=>j(v,8)?v:Promise.reject(v))}function Le(r,g,d){m.list().forEach(y=>he(()=>y(r,g,d)))}function Ie(r,g,d,y,b){const A=S(r,g);if(A)return A;const _=g===q,v=F?history.state:{};d&&(y||_?o.replace(r.fullPath,w({scroll:_&&v&&v.scroll},b)):o.push(r.fullPath,b)),a.value=r,Me(r,g,d,_),me()}let J;function Rt(){J||(J=o.listen((r,g,d)=>{if(!Be.listening)return;const y=C(r),b=D(y);if(b){L(w(b,{replace:!0}),y).catch(te);return}h=y;const A=a.value;F&&Nn(He(A.fullPath,d.delta),fe()),xe(y,A).catch(_=>j(_,12)?_:j(_,2)?(L(_.to,y).then(v=>{j(v,20)&&!d.delta&&d.type===ae.pop&&o.go(-1,!1)}).catch(te),Promise.reject()):(d.delta&&o.go(-d.delta,!1),de(_,y,A))).then(_=>{_=_||Ie(y,A,!1),_&&(d.delta&&!j(_,8)?o.go(-d.delta,!1):d.type===ae.pop&&j(_,20)&&o.go(-1,!1)),Le(y,A,_)}).catch(te)}))}let pe=ee(),Ne=ee(),ie;function de(r,g,d){me(r);const y=Ne.list();return y.length?y.forEach(b=>b(r,g,d)):console.error(r),Promise.reject(r)}function wt(){return ie&&a.value!==q?Promise.resolve():new Promise((r,g)=>{pe.add([r,g])})}function me(r){return ie||(ie=!r,Rt(),pe.list().forEach(([g,d])=>r?d(r):g()),pe.reset()),r}function Me(r,g,d,y){const{scrollBehavior:b}=e;if(!F||!b)return Promise.resolve();const A=!d&&Mn(He(r.fullPath,0))||(y||!d)&&history.state&&history.state.scroll||null;return Bt().then(()=>b(r,g,A)).then(_=>_&&In(_)).catch(_=>de(_,r,g))}const ge=r=>o.go(r);let ye;const ce=new Set,Be={currentRoute:a,listening:!0,addRoute:f,removeRoute:R,clearRoutes:t.clearRoutes,hasRoute:k,getRoutes:P,resolve:C,options:e,push:I,replace:G,go:ge,back:()=>ge(-1),forward:()=>ge(1),beforeEach:i.add,beforeResolve:p.add,afterEach:m.add,onError:Ne.add,isReady:wt,install(r){const g=this;r.component("RouterLink",cs),r.component("RouterView",hs),r.config.globalProperties.$router=g,Object.defineProperty(r.config.globalProperties,"$route",{enumerable:!0,get:()=>Q(a)}),F&&!ye&&a.value===q&&(ye=!0,I(o.location).catch(b=>{}));const d={};for(const b in q)Object.defineProperty(d,b,{get:()=>a.value[b],enumerable:!0});r.provide(Te,g),r.provide(vt,Mt(d)),r.provide(Ce,a);const y=r.unmount;ce.add(r),r.unmount=function(){ce.delete(r),ce.size<1&&(h=q,J&&J(),J=null,a.value=q,ye=!1,ie=!1),y()}}};function K(r){return r.reduce((g,d)=>g.then(()=>he(d)),Promise.resolve())}return Be}function ds(e,t){const n=[],s=[],o=[],i=Math.max(t.matched.length,e.matched.length);for(let p=0;p<i;p++){const m=t.matched[p];m&&(e.matched.find(h=>Y(h,m))?s.push(m):n.push(m));const a=e.matched[p];a&&(t.matched.find(h=>Y(h,a))||o.push(a))}return[n,s,o]}const _t=ps({history:Hn(),routes:[{name:"home",path:"/",component:()=>W(()=>import("./HomeView-DdV4qQEN.js"),__vite__mapDeps([0,1,2]))},{name:"entity",path:"/entity",children:[{name:"entities",path:"",component:()=>W(()=>import("./EntityView-DvC8HA5d.js"),__vite__mapDeps([3,1,2,4,5]))},{name:"entityList",path:"/entity/:entity",component:()=>W(()=>import("./EntityListView-CfvXpygX.js"),__vite__mapDeps([6,1,2,4,7,8])),props:!0,children:[{name:"entityRecord",path:":id",component:()=>W(()=>import("./EntityRecordView-D3O8qoWg.js"),__vite__mapDeps([9,4,1,2])),props:!0}]}]},{name:"api-explorer",path:"/api-explorer",component:()=>W(()=>import("./ApiExplorerView-B18v4VTg.js"),__vite__mapDeps([10,1,2]))},{name:"realtime",path:"/realtime",component:()=>W(()=>import("./RealtimeView-CscRT8qo.js"),__vite__mapDeps([11,1,2]))}]});_t.beforeResolve(async(e,t,n)=>{await at().init(),n()});const $e=Ht(an);$e.use(Dt());$e.use(_t);$e.mount("#app");export{nn as M,Kt as T,le as a,Ut as e,_t as r};