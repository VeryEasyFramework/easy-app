const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomeView-Pp2jRp34.js","assets/Container-DH2J1Vin.js","assets/Container-r2HM58co.css","assets/EntityView-CAhR72z2.js","assets/CardWidget-t1ohyxJS.js","assets/EntityView-YTQ5J2ZX.css","assets/EntityListView-D7XhS-cc.js","assets/InputPassword.vue_vue_type_script_setup_true_lang-CrvKFhcI.js","assets/EasyInput.vue_vue_type_script_setup_true_lang-CTnaj6NF.js","assets/EntityListView-B0lIw6GU.css","assets/EntityRecordView-DlxcsM1n.js","assets/EntityRecordView-DyIs-NN_.css","assets/ApiExplorerView-B67IDX4E.js","assets/RealtimeView-Be4rv9eq.js"])))=>i.map(i=>d[i]);
var Ct=Object.defineProperty;var At=(e,t,n)=>t in e?Ct(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var V=(e,t,n)=>At(e,typeof t!="symbol"?t+"":t,n);import{n as Pe,d as Lt,a as I,r as ot,o as N,c as z,w as $,b as O,e as Ot,T as rt,_ as Le,f as B,u as $t,g as he,C as re,h as Tt,i as K,j as It,k as Oe,l as it,t as at,m as xt,p as Nt,q as D,s as ct,v as Mt,x as Bt,y as jt,z as zt,A as Vt,B as Ht,D as ie,E as lt,F as Ee,G as Dt,H as qt,I as Ut,J as Gt}from"./Container-DH2J1Vin.js";class Kt{constructor(t){V(this,"host");V(this,"notify",t=>{console.error(t)});this.host=t||"/api"}async call(t,n,s){const o=`${this.host}?group=${t}&action=${n}`,a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}).catch(l=>(this.notify({message:l.message,title:"Network Error",type:"error"}),new Response(null,{status:500})));if(!a.ok){a.status===302&&(window.location.href=a.headers.get("Location")||"/");const l=await a.text(),p=this.parseError(a,l),i=`${p.title||"API Error"} - ${p.statusCode}`;return t==="auth"&&n==="check"&&p.statusCode===401?{}:(this.notify({message:p.message,title:i,type:"error"}),{})}return await a.json()}async getList(t,n){const s={...n,entity:t};return await this.call("entity","getList",s)}async createEntity(t,n){return await this.call("entity","createEntity",{entity:t,data:n})}async getEntity(t,n){return await this.call("entity","getEntity",{entity:t,id:n})}async updateEntity(t,n,s){return await this.call("entity","updateEntity",{entity:t,id:n,data:s})}async deleteEntity(t,n){await this.call("entity","deleteEntity",{entity:t,id:n})}parseError(t,n){const s={};s.statusCode=t.status;let o;try{o=JSON.parse(n??""),"error"in o&&(o=o.error),s.message=o}catch{o=n}return s.message=o,s}onNotify(t){this.notify=t}}const fe=new Kt("/api");fe.onNotify(e=>{Pe({title:e.title,message:e.message,type:e.type})});const Wt={entities:[],getDef(e){return this.entities.find(t=>t.entityId===e)}},$e=Lt("app",{state:()=>({session:{},isMobile:!1,initialized:!1,booted:!1,theme:"light",userThemePref:null,localTheme:null,isAuthenticated:!1}),actions:{async init(){this.initialized||(this.initTheme(),await this.boot(),this.initialized=!0)},async boot(){Wt.entities=await fe.call("app","entities"),this.booted=!0},initTheme(){this.loadLocalTheme(),this.loadUserThemePref(),this.setTheme(this.localTheme||this.userThemePref||"light")},loadUserThemePref(){this.userThemePref=window!=null&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"},loadLocalTheme(){this.localTheme=localStorage.getItem("theme")},setTheme(e){localStorage.setItem("theme",e),this.theme=e,document.body.dataset.theme=this.theme},toggleTheme(){this.theme=="light"?this.theme="dark":this.theme="light",this.setTheme(this.theme)},async login(e,t){if((await fe.call("auth","login",{user:e,password:t})).session_id==null){Pe({message:"Login failed",title:"Login failed",type:"error"});return}this.isAuthenticated=this.session.session_id!=null,this.isAuthenticated&&(await this.boot(),Pe({message:"Login successful",title:"Logged in",type:"success"}))},async logout(){await fe.call("auth","logout"),this.$reset(),window.location.reload()}}}),Ft=I({__name:"TransitionRouterView",props:{transitionKey:{},fast:{type:Boolean}},setup(e){return(t,n)=>{const s=ot("RouterView");return N(),z(s,null,{default:$(({Component:o})=>[O(rt,{appear:"",mode:"out-in",name:t.fast?"fast":"simple-fade"},{default:$(()=>[(N(),z(Ot(o),{key:t.transitionKey}))]),_:2},1032,["name"])]),_:1})}}}),Qt=Le(Ft,[["__scopeId","data-v-5f69fd9a"]]),Jt=I({__name:"TransitionFade",props:{mode:{},type:{},speed:{},appear:{type:Boolean}},setup(e){$t(s=>({"3732d50f":n.value}));const t=e,n=B(()=>{switch(t.speed){case"slow":return"0.7s";case"fast":return"0.1s";default:return"0.3s"}});return(s,o)=>(N(),z(rt,{appear:s.appear,mode:s.mode||"out-in",name:s.type||"fade"},{default:$(()=>[he(s.$slots,"default")]),_:3},8,["appear","mode","name"]))}}),Yt=K("div",{class:"loader"},[K("div",{class:"loader__spinner"})],-1),Xt=I({__name:"LoaderOverlay",props:{loaded:{type:Boolean}},emits:["close","update:modelValue"],setup(e,{emit:t}){return(n,s)=>n.loaded?Tt("",!0):(N(),z(Jt,{key:0},{default:$(()=>[O(re,{class:"position-absolute top left w-100 h-100 horizontal-align-center vertical-align-center loader-overlay"},{default:$(()=>[Yt]),_:1})]),_:1}))}}),Zt={class:"side-bar"},en={class:"content p-2"},tn=I({__name:"SidebarNavLayout",setup(e){return(t,n)=>(N(),z(re,{class:"side-nav-layout gap-0"},{default:$(()=>[K("div",Zt,[he(t.$slots,"sidebar")]),K("div",en,[he(t.$slots,"content")])]),_:3}))}}),nn=K("div",{class:"header-logo"},null,-1),sn={class:"title-5"},on=I({__name:"HeaderBrand",setup(e){return(t,n)=>(N(),z(Oe,{class:"col shrink vertical-align-center cursor-pointer"},{default:$(()=>[nn,K("div",sn,[he(t.$slots,"default",{},()=>[It(" Easy App ")])])]),_:3}))}}),rn=I({__name:"MaterialIcon",props:{icon:{},size:{},color:{}},setup(e){return(t,n)=>(N(),it("div",{class:"icon-font",style:xt({fontSize:`${t.size||1}rem`,"--color-icon":`var(--color-${t.color||"icon"})`})},at(t.icon),5))}}),ut=Le(rn,[["__scopeId","data-v-c0b5eda6"]]),an={class:"nav-label pe-3"},Re=I({__name:"NavItem",props:{to:{},icon:{},text:{}},setup(e){return(t,n)=>{const s=ot("RouterLink");return N(),z(s,{to:t.to,class:"nav-item px-1"},{default:$(()=>[O(Oe,{class:"col shrink horizontal-align-between"},{default:$(()=>[K("div",an,at(t.text),1),K("div",null,[O(ut,{icon:t.icon,class:"icon"},null,8,["icon"])])]),_:1})]),_:1},8,["to"])}}}),cn=["title","type"],ln=I({__name:"ButtonIcon",props:{type:{},disabled:{type:Boolean},icon:{},label:{},size:{},color:{}},setup(e){return(t,n)=>(N(),it("button",{title:t.label,class:Nt(["button icon",{[t.color??"primary"]:t.color}]),type:t.type||"button"},[O(ut,{icon:t.icon,size:t.size??1.4},null,8,["icon","size"])],10,cn))}}),un=I({__name:"ThemeSwitcher",setup(e){const t=$e();return(n,s)=>(N(),z(re,null,{default:$(()=>[O(ln,{onClick:D(t).toggleTheme,icon:D(t).theme=="dark"?"light_mode":"dark_mode",color:D(t).theme=="dark"?"warning":"info",class:"flat"},null,8,["onClick","icon","color"])]),_:1}))}}),fn=Le(un,[["__scopeId","data-v-63e969c4"]]),hn=I({__name:"NavigatorSide",setup(e){return(t,n)=>(N(),z(Oe,{class:"vh-100 navigator-side shadow-small"},{default:$(()=>[O(on,{class:"brand"}),O(re,{class:"nav row shrink"},{default:$(()=>[O(Re,{icon:"person",to:"/entity",text:"Entities"}),O(Re,{icon:"code",to:"/api-explorer",text:"API Explorer"}),O(Re,{icon:"network_ping",to:"/realtime",text:"Realtime Explorer"})]),_:1}),O(re,{class:"bottom"},{default:$(()=>[O(fn)]),_:1})]),_:1}))}});class dn{constructor(t){V(this,"socket");V(this,"host");V(this,"rooms",[]);V(this,"messageListeners",[]);V(this,"statusListeners",[]);V(this,"manualClose",!1);const n=window.location.protocol==="https:"?"wss":"ws";this.host=t||`${n}://${window.location.host}/ws`}get connected(){var t;return((t=this.socket)==null?void 0:t.readyState)===WebSocket.OPEN}get connecting(){var t;return((t=this.socket)==null?void 0:t.readyState)===WebSocket.CONNECTING}get closed(){var t;return((t=this.socket)==null?void 0:t.readyState)===WebSocket.CLOSED}onMessage(t){this.messageListeners.push(t)}removeMessageListener(t){this.messageListeners=this.messageListeners.filter(n=>n!==t)}onStatusChange(t){this.statusListeners.push(t)}removeStatusListener(t){this.statusListeners=this.statusListeners.filter(n=>n!==t)}connect(){this.socket=new WebSocket(this.host),this.manualClose=!1,this.notifyStatus("connecting"),this.socket.addEventListener("open",t=>{this.notifyStatus("open"),this.rejoinRooms(),this.socket.addEventListener("close",async n=>{this.notifyStatus("closed"),this.manualClose||this.retryReconnect(1e3)}),this.socket.addEventListener("message",n=>{let s;try{s=JSON.parse(n.data)}catch{s={data:n.data}}if("room"in s&&"event"in s&&"data"in s)for(const o of this.messageListeners)o(s.room,s.event,s.data)})}),this.socket.addEventListener("error",t=>{this.notifyStatus("error")})}notifyStatus(t){for(const n of this.statusListeners)n(t)}retryReconnect(t){let n=0;const s=setInterval(()=>{if(n>=t){clearInterval(s);return}if(this.connected){clearInterval(s);return}this.closed&&(n++,console.log(`Reconnecting... ${n}/${t}`),this.reconnect())},1e3)}reconnect(){this.closed&&this.connect()}rejoinRooms(){for(const t of this.rooms){if(t.events.length===0){this.send({type:"join",room:t.name});return}for(const n of t.events)this.send({type:"join",room:t.name,event:n})}}join(t,n){this.rooms.find(s=>s.name===t)?this.rooms=this.rooms.map(s=>(s.name===t&&s.events.push(n),s)):this.rooms.push({name:t,events:[n]}),this.send({type:"join",room:t,event:n})}leave(t,n){n?this.rooms=this.rooms.map(s=>(s.name===t&&(s.events=s.events.filter(o=>o!==n)),s)):this.rooms=this.rooms.filter(s=>s.name!==t),this.send({type:"leave",room:t,event:n})}disconnect(){this.manualClose=!0,this.socket.close()}send(t){this.connected&&this.socket.send(JSON.stringify(t))}}const pn=void 0,ne=new dn(pn);function Ps(e,t,n){const s=(o,a,l)=>{o===`entity:${e}`&&a===t&&n(l.data)};ct(()=>{ne.onMessage(s),ne.join(`entity:${e}`,t)}),Mt(()=>{ne.removeMessageListener(s),ne.leave(`entity:${e}`,t)})}const mn=I({__name:"App",setup(e){const t=$e();return ct(async()=>{await new Promise(n=>setTimeout(n,1e3)),ne.connect()}),(n,s)=>(N(),z(Bt,null,{default:$(()=>[O(tn,null,{sidebar:$(()=>[O(hn)]),content:$(()=>[O(Qt)]),_:1}),O(Xt,{loaded:D(t).booted},null,8,["loaded"])]),_:1}))}}),gn="modulepreload",yn=function(e){return"/"+e},He={},Q=function(t,n,s){let o=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),l=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));o=Promise.all(n.map(p=>{if(p=yn(p),p in He)return;He[p]=!0;const i=p.endsWith(".css"),d=i?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${d}`))return;const f=document.createElement("link");if(f.rel=i?"stylesheet":gn,i||(f.as="script",f.crossOrigin=""),f.href=p,l&&f.setAttribute("nonce",l),document.head.appendChild(f),i)return new Promise((c,u)=>{f.addEventListener("load",c),f.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${p}`)))})}))}return o.then(()=>t()).catch(a=>{const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a})};/*!
  * vue-router v4.4.3
  * (c) 2024 Eduardo San Martin Morote
  * @license MIT
  */const J=typeof document<"u";function vn(e){return e.__esModule||e[Symbol.toStringTag]==="Module"}const w=Object.assign;function we(e,t){const n={};for(const s in t){const o=t[s];n[s]=j(o)?o.map(e):e(o)}return n}const se=()=>{},j=Array.isArray,ft=/#/g,_n=/&/g,En=/\//g,Rn=/=/g,wn=/\?/g,ht=/\+/g,Sn=/%5B/g,kn=/%5D/g,dt=/%5E/g,Pn=/%60/g,pt=/%7B/g,bn=/%7C/g,mt=/%7D/g,Cn=/%20/g;function Te(e){return encodeURI(""+e).replace(bn,"|").replace(Sn,"[").replace(kn,"]")}function An(e){return Te(e).replace(pt,"{").replace(mt,"}").replace(dt,"^")}function be(e){return Te(e).replace(ht,"%2B").replace(Cn,"+").replace(ft,"%23").replace(_n,"%26").replace(Pn,"`").replace(pt,"{").replace(mt,"}").replace(dt,"^")}function Ln(e){return be(e).replace(Rn,"%3D")}function On(e){return Te(e).replace(ft,"%23").replace(wn,"%3F")}function $n(e){return e==null?"":On(e).replace(En,"%2F")}function ae(e){try{return decodeURIComponent(""+e)}catch{}return""+e}const Tn=/\/$/,In=e=>e.replace(Tn,"");function Se(e,t,n="/"){let s,o={},a="",l="";const p=t.indexOf("#");let i=t.indexOf("?");return p<i&&p>=0&&(i=-1),i>-1&&(s=t.slice(0,i),a=t.slice(i+1,p>-1?p:t.length),o=e(a)),p>-1&&(s=s||t.slice(0,p),l=t.slice(p,t.length)),s=Bn(s??t,n),{fullPath:s+(a&&"?")+a+l,path:s,query:o,hash:ae(l)}}function xn(e,t){const n=t.query?e(t.query):"";return t.path+(n&&"?")+n+(t.hash||"")}function De(e,t){return!t||!e.toLowerCase().startsWith(t.toLowerCase())?e:e.slice(t.length)||"/"}function Nn(e,t,n){const s=t.matched.length-1,o=n.matched.length-1;return s>-1&&s===o&&Y(t.matched[s],n.matched[o])&&gt(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}function Y(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function gt(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!Mn(e[n],t[n]))return!1;return!0}function Mn(e,t){return j(e)?qe(e,t):j(t)?qe(t,e):e===t}function qe(e,t){return j(t)?e.length===t.length&&e.every((n,s)=>n===t[s]):e.length===1&&e[0]===t}function Bn(e,t){if(e.startsWith("/"))return e;if(!e)return t;const n=t.split("/"),s=e.split("/"),o=s[s.length-1];(o===".."||o===".")&&s.push("");let a=n.length-1,l,p;for(l=0;l<s.length;l++)if(p=s[l],p!==".")if(p==="..")a>1&&a--;else break;return n.slice(0,a).join("/")+"/"+s.slice(l).join("/")}const U={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};var ce;(function(e){e.pop="pop",e.push="push"})(ce||(ce={}));var oe;(function(e){e.back="back",e.forward="forward",e.unknown=""})(oe||(oe={}));function jn(e){if(!e)if(J){const t=document.querySelector("base");e=t&&t.getAttribute("href")||"/",e=e.replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return e[0]!=="/"&&e[0]!=="#"&&(e="/"+e),In(e)}const zn=/^[^#]+#/;function Vn(e,t){return e.replace(zn,"#")+t}function Hn(e,t){const n=document.documentElement.getBoundingClientRect(),s=e.getBoundingClientRect();return{behavior:t.behavior,left:s.left-n.left-(t.left||0),top:s.top-n.top-(t.top||0)}}const de=()=>({left:window.scrollX,top:window.scrollY});function Dn(e){let t;if("el"in e){const n=e.el,s=typeof n=="string"&&n.startsWith("#"),o=typeof n=="string"?s?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!o)return;t=Hn(o,e)}else t=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(t):window.scrollTo(t.left!=null?t.left:window.scrollX,t.top!=null?t.top:window.scrollY)}function Ue(e,t){return(history.state?history.state.position-t:-1)+e}const Ce=new Map;function qn(e,t){Ce.set(e,t)}function Un(e){const t=Ce.get(e);return Ce.delete(e),t}let Gn=()=>location.protocol+"//"+location.host;function yt(e,t){const{pathname:n,search:s,hash:o}=t,a=e.indexOf("#");if(a>-1){let p=o.includes(e.slice(a))?e.slice(a).length:1,i=o.slice(p);return i[0]!=="/"&&(i="/"+i),De(i,"")}return De(n,e)+s+o}function Kn(e,t,n,s){let o=[],a=[],l=null;const p=({state:u})=>{const h=yt(e,location),R=n.value,S=t.value;let b=0;if(u){if(n.value=h,t.value=u,l&&l===R){l=null;return}b=S?u.position-S.position:0}else s(h);o.forEach(C=>{C(n.value,R,{delta:b,type:ce.pop,direction:b?b>0?oe.forward:oe.back:oe.unknown})})};function i(){l=n.value}function d(u){o.push(u);const h=()=>{const R=o.indexOf(u);R>-1&&o.splice(R,1)};return a.push(h),h}function f(){const{history:u}=window;u.state&&u.replaceState(w({},u.state,{scroll:de()}),"")}function c(){for(const u of a)u();a=[],window.removeEventListener("popstate",p),window.removeEventListener("beforeunload",f)}return window.addEventListener("popstate",p),window.addEventListener("beforeunload",f,{passive:!0}),{pauseListeners:i,listen:d,destroy:c}}function Ge(e,t,n,s=!1,o=!1){return{back:e,current:t,forward:n,replaced:s,position:window.history.length,scroll:o?de():null}}function Wn(e){const{history:t,location:n}=window,s={value:yt(e,n)},o={value:t.state};o.value||a(s.value,{back:null,current:s.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0);function a(i,d,f){const c=e.indexOf("#"),u=c>-1?(n.host&&document.querySelector("base")?e:e.slice(c))+i:Gn()+e+i;try{t[f?"replaceState":"pushState"](d,"",u),o.value=d}catch(h){console.error(h),n[f?"replace":"assign"](u)}}function l(i,d){const f=w({},t.state,Ge(o.value.back,i,o.value.forward,!0),d,{position:o.value.position});a(i,f,!0),s.value=i}function p(i,d){const f=w({},o.value,t.state,{forward:i,scroll:de()});a(f.current,f,!0);const c=w({},Ge(s.value,i,null),{position:f.position+1},d);a(i,c,!1),s.value=i}return{location:s,state:o,push:p,replace:l}}function Fn(e){e=jn(e);const t=Wn(e),n=Kn(e,t.state,t.location,t.replace);function s(a,l=!0){l||n.pauseListeners(),history.go(a)}const o=w({location:"",base:e,go:s,createHref:Vn.bind(null,e)},t,n);return Object.defineProperty(o,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(o,"state",{enumerable:!0,get:()=>t.state.value}),o}function Qn(e){return e=location.host?e||location.pathname+location.search:"",e.includes("#")||(e+="#"),Fn(e)}function Jn(e){return typeof e=="string"||e&&typeof e=="object"}function vt(e){return typeof e=="string"||typeof e=="symbol"}const _t=Symbol("");var Ke;(function(e){e[e.aborted=4]="aborted",e[e.cancelled=8]="cancelled",e[e.duplicated=16]="duplicated"})(Ke||(Ke={}));function X(e,t){return w(new Error,{type:e,[_t]:!0},t)}function H(e,t){return e instanceof Error&&_t in e&&(t==null||!!(e.type&t))}const We="[^/]+?",Yn={sensitive:!1,strict:!1,start:!0,end:!0},Xn=/[.+*?^${}()[\]/\\]/g;function Zn(e,t){const n=w({},Yn,t),s=[];let o=n.start?"^":"";const a=[];for(const d of e){const f=d.length?[]:[90];n.strict&&!d.length&&(o+="/");for(let c=0;c<d.length;c++){const u=d[c];let h=40+(n.sensitive?.25:0);if(u.type===0)c||(o+="/"),o+=u.value.replace(Xn,"\\$&"),h+=40;else if(u.type===1){const{value:R,repeatable:S,optional:b,regexp:C}=u;a.push({name:R,repeatable:S,optional:b});const E=C||We;if(E!==We){h+=10;try{new RegExp(`(${E})`)}catch(M){throw new Error(`Invalid custom RegExp for param "${R}" (${E}): `+M.message)}}let k=S?`((?:${E})(?:/(?:${E}))*)`:`(${E})`;c||(k=b&&d.length<2?`(?:/${k})`:"/"+k),b&&(k+="?"),o+=k,h+=20,b&&(h+=-8),S&&(h+=-20),E===".*"&&(h+=-50)}f.push(h)}s.push(f)}if(n.strict&&n.end){const d=s.length-1;s[d][s[d].length-1]+=.7000000000000001}n.strict||(o+="/?"),n.end?o+="$":n.strict&&(o+="(?:/|$)");const l=new RegExp(o,n.sensitive?"":"i");function p(d){const f=d.match(l),c={};if(!f)return null;for(let u=1;u<f.length;u++){const h=f[u]||"",R=a[u-1];c[R.name]=h&&R.repeatable?h.split("/"):h}return c}function i(d){let f="",c=!1;for(const u of e){(!c||!f.endsWith("/"))&&(f+="/"),c=!1;for(const h of u)if(h.type===0)f+=h.value;else if(h.type===1){const{value:R,repeatable:S,optional:b}=h,C=R in d?d[R]:"";if(j(C)&&!S)throw new Error(`Provided param "${R}" is an array but it is not repeatable (* or + modifiers)`);const E=j(C)?C.join("/"):C;if(!E)if(b)u.length<2&&(f.endsWith("/")?f=f.slice(0,-1):c=!0);else throw new Error(`Missing required param "${R}"`);f+=E}}return f||"/"}return{re:l,score:s,keys:a,parse:p,stringify:i}}function es(e,t){let n=0;for(;n<e.length&&n<t.length;){const s=t[n]-e[n];if(s)return s;n++}return e.length<t.length?e.length===1&&e[0]===80?-1:1:e.length>t.length?t.length===1&&t[0]===80?1:-1:0}function Et(e,t){let n=0;const s=e.score,o=t.score;for(;n<s.length&&n<o.length;){const a=es(s[n],o[n]);if(a)return a;n++}if(Math.abs(o.length-s.length)===1){if(Fe(s))return 1;if(Fe(o))return-1}return o.length-s.length}function Fe(e){const t=e[e.length-1];return e.length>0&&t[t.length-1]<0}const ts={type:0,value:""},ns=/[a-zA-Z0-9_]/;function ss(e){if(!e)return[[]];if(e==="/")return[[ts]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function t(h){throw new Error(`ERR (${n})/"${d}": ${h}`)}let n=0,s=n;const o=[];let a;function l(){a&&o.push(a),a=[]}let p=0,i,d="",f="";function c(){d&&(n===0?a.push({type:0,value:d}):n===1||n===2||n===3?(a.length>1&&(i==="*"||i==="+")&&t(`A repeatable param (${d}) must be alone in its segment. eg: '/:ids+.`),a.push({type:1,value:d,regexp:f,repeatable:i==="*"||i==="+",optional:i==="*"||i==="?"})):t("Invalid state to consume buffer"),d="")}function u(){d+=i}for(;p<e.length;){if(i=e[p++],i==="\\"&&n!==2){s=n,n=4;continue}switch(n){case 0:i==="/"?(d&&c(),l()):i===":"?(c(),n=1):u();break;case 4:u(),n=s;break;case 1:i==="("?n=2:ns.test(i)?u():(c(),n=0,i!=="*"&&i!=="?"&&i!=="+"&&p--);break;case 2:i===")"?f[f.length-1]=="\\"?f=f.slice(0,-1)+i:n=3:f+=i;break;case 3:c(),n=0,i!=="*"&&i!=="?"&&i!=="+"&&p--,f="";break;default:t("Unknown state");break}}return n===2&&t(`Unfinished custom RegExp for param "${d}"`),c(),l(),o}function os(e,t,n){const s=Zn(ss(e.path),n),o=w(s,{record:e,parent:t,children:[],alias:[]});return t&&!o.record.aliasOf==!t.record.aliasOf&&t.children.push(o),o}function rs(e,t){const n=[],s=new Map;t=Ye({strict:!1,end:!0,sensitive:!1},t);function o(c){return s.get(c)}function a(c,u,h){const R=!h,S=is(c);S.aliasOf=h&&h.record;const b=Ye(t,c),C=[S];if("alias"in c){const M=typeof c.alias=="string"?[c.alias]:c.alias;for(const W of M)C.push(w({},S,{components:h?h.record.components:S.components,path:W,aliasOf:h?h.record:S}))}let E,k;for(const M of C){const{path:W}=M;if(u&&W[0]!=="/"){const q=u.record.path,x=q[q.length-1]==="/"?"":"/";M.path=u.record.path+(W&&x+W)}if(E=os(M,u,b),h?h.alias.push(E):(k=k||E,k!==E&&k.alias.push(E),R&&c.name&&!Je(E)&&l(c.name)),Rt(E)&&i(E),S.children){const q=S.children;for(let x=0;x<q.length;x++)a(q[x],E,h&&h.children[x])}h=h||E}return k?()=>{l(k)}:se}function l(c){if(vt(c)){const u=s.get(c);u&&(s.delete(c),n.splice(n.indexOf(u),1),u.children.forEach(l),u.alias.forEach(l))}else{const u=n.indexOf(c);u>-1&&(n.splice(u,1),c.record.name&&s.delete(c.record.name),c.children.forEach(l),c.alias.forEach(l))}}function p(){return n}function i(c){const u=ls(c,n);n.splice(u,0,c),c.record.name&&!Je(c)&&s.set(c.record.name,c)}function d(c,u){let h,R={},S,b;if("name"in c&&c.name){if(h=s.get(c.name),!h)throw X(1,{location:c});b=h.record.name,R=w(Qe(u.params,h.keys.filter(k=>!k.optional).concat(h.parent?h.parent.keys.filter(k=>k.optional):[]).map(k=>k.name)),c.params&&Qe(c.params,h.keys.map(k=>k.name))),S=h.stringify(R)}else if(c.path!=null)S=c.path,h=n.find(k=>k.re.test(S)),h&&(R=h.parse(S),b=h.record.name);else{if(h=u.name?s.get(u.name):n.find(k=>k.re.test(u.path)),!h)throw X(1,{location:c,currentLocation:u});b=h.record.name,R=w({},u.params,c.params),S=h.stringify(R)}const C=[];let E=h;for(;E;)C.unshift(E.record),E=E.parent;return{name:b,path:S,params:R,matched:C,meta:cs(C)}}e.forEach(c=>a(c));function f(){n.length=0,s.clear()}return{addRoute:a,resolve:d,removeRoute:l,clearRoutes:f,getRoutes:p,getRecordMatcher:o}}function Qe(e,t){const n={};for(const s of t)s in e&&(n[s]=e[s]);return n}function is(e){return{path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:void 0,beforeEnter:e.beforeEnter,props:as(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||null:e.component&&{default:e.component}}}function as(e){const t={},n=e.props||!1;if("component"in e)t.default=n;else for(const s in e.components)t[s]=typeof n=="object"?n[s]:n;return t}function Je(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function cs(e){return e.reduce((t,n)=>w(t,n.meta),{})}function Ye(e,t){const n={};for(const s in e)n[s]=s in t?t[s]:e[s];return n}function ls(e,t){let n=0,s=t.length;for(;n!==s;){const a=n+s>>1;Et(e,t[a])<0?s=a:n=a+1}const o=us(e);return o&&(s=t.lastIndexOf(o,s-1)),s}function us(e){let t=e;for(;t=t.parent;)if(Rt(t)&&Et(e,t)===0)return t}function Rt({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function fs(e){const t={};if(e===""||e==="?")return t;const s=(e[0]==="?"?e.slice(1):e).split("&");for(let o=0;o<s.length;++o){const a=s[o].replace(ht," "),l=a.indexOf("="),p=ae(l<0?a:a.slice(0,l)),i=l<0?null:ae(a.slice(l+1));if(p in t){let d=t[p];j(d)||(d=t[p]=[d]),d.push(i)}else t[p]=i}return t}function Xe(e){let t="";for(let n in e){const s=e[n];if(n=Ln(n),s==null){s!==void 0&&(t+=(t.length?"&":"")+n);continue}(j(s)?s.map(a=>a&&be(a)):[s&&be(s)]).forEach(a=>{a!==void 0&&(t+=(t.length?"&":"")+n,a!=null&&(t+="="+a))})}return t}function hs(e){const t={};for(const n in e){const s=e[n];s!==void 0&&(t[n]=j(s)?s.map(o=>o==null?null:""+o):s==null?s:""+s)}return t}const ds=Symbol(""),Ze=Symbol(""),Ie=Symbol(""),wt=Symbol(""),Ae=Symbol("");function te(){let e=[];function t(s){return e.push(s),()=>{const o=e.indexOf(s);o>-1&&e.splice(o,1)}}function n(){e=[]}return{add:t,list:()=>e.slice(),reset:n}}function G(e,t,n,s,o,a=l=>l()){const l=s&&(s.enterCallbacks[o]=s.enterCallbacks[o]||[]);return()=>new Promise((p,i)=>{const d=u=>{u===!1?i(X(4,{from:n,to:t})):u instanceof Error?i(u):Jn(u)?i(X(2,{from:t,to:u})):(l&&s.enterCallbacks[o]===l&&typeof u=="function"&&l.push(u),p())},f=a(()=>e.call(s&&s.instances[o],t,n,d));let c=Promise.resolve(f);e.length<3&&(c=c.then(d)),c.catch(u=>i(u))})}function ke(e,t,n,s,o=a=>a()){const a=[];for(const l of e)for(const p in l.components){let i=l.components[p];if(!(t!=="beforeRouteEnter"&&!l.instances[p]))if(ps(i)){const f=(i.__vccOpts||i)[t];f&&a.push(G(f,n,s,l,p,o))}else{let d=i();a.push(()=>d.then(f=>{if(!f)return Promise.reject(new Error(`Couldn't resolve component "${p}" at "${l.path}"`));const c=vn(f)?f.default:f;l.components[p]=c;const h=(c.__vccOpts||c)[t];return h&&G(h,n,s,l,p,o)()}))}}return a}function ps(e){return typeof e=="object"||"displayName"in e||"props"in e||"__vccOpts"in e}function et(e){const t=ie(Ie),n=ie(wt),s=B(()=>{const i=D(e.to);return t.resolve(i)}),o=B(()=>{const{matched:i}=s.value,{length:d}=i,f=i[d-1],c=n.matched;if(!f||!c.length)return-1;const u=c.findIndex(Y.bind(null,f));if(u>-1)return u;const h=tt(i[d-2]);return d>1&&tt(f)===h&&c[c.length-1].path!==h?c.findIndex(Y.bind(null,i[d-2])):u}),a=B(()=>o.value>-1&&vs(n.params,s.value.params)),l=B(()=>o.value>-1&&o.value===n.matched.length-1&&gt(n.params,s.value.params));function p(i={}){return ys(i)?t[D(e.replace)?"replace":"push"](D(e.to)).catch(se):Promise.resolve()}return{route:s,href:B(()=>s.value.href),isActive:a,isExactActive:l,navigate:p}}const ms=I({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"}},useLink:et,setup(e,{slots:t}){const n=Ht(et(e)),{options:s}=ie(Ie),o=B(()=>({[nt(e.activeClass,s.linkActiveClass,"router-link-active")]:n.isActive,[nt(e.exactActiveClass,s.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const a=t.default&&t.default(n);return e.custom?a:lt("a",{"aria-current":n.isExactActive?e.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:o.value},a)}}}),gs=ms;function ys(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&!(e.button!==void 0&&e.button!==0)){if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function vs(e,t){for(const n in t){const s=t[n],o=e[n];if(typeof s=="string"){if(s!==o)return!1}else if(!j(o)||o.length!==s.length||s.some((a,l)=>a!==o[l]))return!1}return!0}function tt(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const nt=(e,t,n)=>e??t??n,_s=I({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(e,{attrs:t,slots:n}){const s=ie(Ae),o=B(()=>e.route||s.value),a=ie(Ze,0),l=B(()=>{let d=D(a);const{matched:f}=o.value;let c;for(;(c=f[d])&&!c.components;)d++;return d}),p=B(()=>o.value.matched[l.value]);Ee(Ze,B(()=>l.value+1)),Ee(ds,p),Ee(Ae,o);const i=Dt();return qt(()=>[i.value,p.value,e.name],([d,f,c],[u,h,R])=>{f&&(f.instances[c]=d,h&&h!==f&&d&&d===u&&(f.leaveGuards.size||(f.leaveGuards=h.leaveGuards),f.updateGuards.size||(f.updateGuards=h.updateGuards))),d&&f&&(!h||!Y(f,h)||!u)&&(f.enterCallbacks[c]||[]).forEach(S=>S(d))},{flush:"post"}),()=>{const d=o.value,f=e.name,c=p.value,u=c&&c.components[f];if(!u)return st(n.default,{Component:u,route:d});const h=c.props[f],R=h?h===!0?d.params:typeof h=="function"?h(d):h:null,b=lt(u,w({},R,t,{onVnodeUnmounted:C=>{C.component.isUnmounted&&(c.instances[f]=null)},ref:i}));return st(n.default,{Component:b,route:d})||b}}});function st(e,t){if(!e)return null;const n=e(t);return n.length===1?n[0]:n}const Es=_s;function Rs(e){const t=rs(e.routes,e),n=e.parseQuery||fs,s=e.stringifyQuery||Xe,o=e.history,a=te(),l=te(),p=te(),i=jt(U);let d=U;J&&e.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const f=we.bind(null,r=>""+r),c=we.bind(null,$n),u=we.bind(null,ae);function h(r,g){let m,y;return vt(r)?(m=t.getRecordMatcher(r),y=g):y=r,t.addRoute(y,m)}function R(r){const g=t.getRecordMatcher(r);g&&t.removeRoute(g)}function S(){return t.getRoutes().map(r=>r.record)}function b(r){return!!t.getRecordMatcher(r)}function C(r,g){if(g=w({},g||i.value),typeof r=="string"){const v=Se(n,r,g.path),L=t.resolve({path:v.path},g),ee=o.createHref(v.fullPath);return w(v,L,{params:u(L.params),hash:ae(v.hash),redirectedFrom:void 0,href:ee})}let m;if(r.path!=null)m=w({},r,{path:Se(n,r.path,g.path).path});else{const v=w({},r.params);for(const L in v)v[L]==null&&delete v[L];m=w({},r,{params:c(v)}),g.params=c(g.params)}const y=t.resolve(m,g),P=r.hash||"";y.params=f(u(y.params));const A=xn(s,w({},r,{hash:An(P),path:y.path})),_=o.createHref(A);return w({fullPath:A,hash:P,query:s===Xe?hs(r.query):r.query||{}},y,{redirectedFrom:void 0,href:_})}function E(r){return typeof r=="string"?Se(n,r,i.value.path):w({},r)}function k(r,g){if(d!==r)return X(8,{from:g,to:r})}function M(r){return x(r)}function W(r){return M(w(E(r),{replace:!0}))}function q(r){const g=r.matched[r.matched.length-1];if(g&&g.redirect){const{redirect:m}=g;let y=typeof m=="function"?m(r):m;return typeof y=="string"&&(y=y.includes("?")||y.includes("#")?y=E(y):{path:y},y.params={}),w({query:r.query,hash:r.hash,params:y.path!=null?{}:r.params},y)}}function x(r,g){const m=d=C(r),y=i.value,P=r.state,A=r.force,_=r.replace===!0,v=q(m);if(v)return x(w(E(v),{state:typeof v=="object"?w({},P,v.state):P,force:A,replace:_}),g||m);const L=m;L.redirectedFrom=g;let ee;return!A&&Nn(s,y,m)&&(ee=X(16,{to:L,from:y}),ze(y,y,!0,!1)),(ee?Promise.resolve(ee):Ne(L,y)).catch(T=>H(T)?H(T,2)?T:ye(T):ge(T,L,y)).then(T=>{if(T){if(H(T,2))return x(w({replace:_},E(T.to),{state:typeof T.to=="object"?w({},P,T.to.state):P,force:A}),g||L)}else T=Be(L,y,!0,_,P);return Me(L,y,T),T})}function kt(r,g){const m=k(r,g);return m?Promise.reject(m):Promise.resolve()}function pe(r){const g=ue.values().next().value;return g&&typeof g.runWithContext=="function"?g.runWithContext(r):r()}function Ne(r,g){let m;const[y,P,A]=ws(r,g);m=ke(y.reverse(),"beforeRouteLeave",r,g);for(const v of y)v.leaveGuards.forEach(L=>{m.push(G(L,r,g))});const _=kt.bind(null,r,g);return m.push(_),F(m).then(()=>{m=[];for(const v of a.list())m.push(G(v,r,g));return m.push(_),F(m)}).then(()=>{m=ke(P,"beforeRouteUpdate",r,g);for(const v of P)v.updateGuards.forEach(L=>{m.push(G(L,r,g))});return m.push(_),F(m)}).then(()=>{m=[];for(const v of A)if(v.beforeEnter)if(j(v.beforeEnter))for(const L of v.beforeEnter)m.push(G(L,r,g));else m.push(G(v.beforeEnter,r,g));return m.push(_),F(m)}).then(()=>(r.matched.forEach(v=>v.enterCallbacks={}),m=ke(A,"beforeRouteEnter",r,g,pe),m.push(_),F(m))).then(()=>{m=[];for(const v of l.list())m.push(G(v,r,g));return m.push(_),F(m)}).catch(v=>H(v,8)?v:Promise.reject(v))}function Me(r,g,m){p.list().forEach(y=>pe(()=>y(r,g,m)))}function Be(r,g,m,y,P){const A=k(r,g);if(A)return A;const _=g===U,v=J?history.state:{};m&&(y||_?o.replace(r.fullPath,w({scroll:_&&v&&v.scroll},P)):o.push(r.fullPath,P)),i.value=r,ze(r,g,m,_),ye()}let Z;function Pt(){Z||(Z=o.listen((r,g,m)=>{if(!Ve.listening)return;const y=C(r),P=q(y);if(P){x(w(P,{replace:!0}),y).catch(se);return}d=y;const A=i.value;J&&qn(Ue(A.fullPath,m.delta),de()),Ne(y,A).catch(_=>H(_,12)?_:H(_,2)?(x(_.to,y).then(v=>{H(v,20)&&!m.delta&&m.type===ce.pop&&o.go(-1,!1)}).catch(se),Promise.reject()):(m.delta&&o.go(-m.delta,!1),ge(_,y,A))).then(_=>{_=_||Be(y,A,!1),_&&(m.delta&&!H(_,8)?o.go(-m.delta,!1):m.type===ce.pop&&H(_,20)&&o.go(-1,!1)),Me(y,A,_)}).catch(se)}))}let me=te(),je=te(),le;function ge(r,g,m){ye(r);const y=je.list();return y.length?y.forEach(P=>P(r,g,m)):console.error(r),Promise.reject(r)}function bt(){return le&&i.value!==U?Promise.resolve():new Promise((r,g)=>{me.add([r,g])})}function ye(r){return le||(le=!r,Pt(),me.list().forEach(([g,m])=>r?m(r):g()),me.reset()),r}function ze(r,g,m,y){const{scrollBehavior:P}=e;if(!J||!P)return Promise.resolve();const A=!m&&Un(Ue(r.fullPath,0))||(y||!m)&&history.state&&history.state.scroll||null;return Vt().then(()=>P(r,g,A)).then(_=>_&&Dn(_)).catch(_=>ge(_,r,g))}const ve=r=>o.go(r);let _e;const ue=new Set,Ve={currentRoute:i,listening:!0,addRoute:h,removeRoute:R,clearRoutes:t.clearRoutes,hasRoute:b,getRoutes:S,resolve:C,options:e,push:M,replace:W,go:ve,back:()=>ve(-1),forward:()=>ve(1),beforeEach:a.add,beforeResolve:l.add,afterEach:p.add,onError:je.add,isReady:bt,install(r){const g=this;r.component("RouterLink",gs),r.component("RouterView",Es),r.config.globalProperties.$router=g,Object.defineProperty(r.config.globalProperties,"$route",{enumerable:!0,get:()=>D(i)}),J&&!_e&&i.value===U&&(_e=!0,M(o.location).catch(P=>{}));const m={};for(const P in U)Object.defineProperty(m,P,{get:()=>i.value[P],enumerable:!0});r.provide(Ie,g),r.provide(wt,zt(m)),r.provide(Ae,i);const y=r.unmount;ue.add(r),r.unmount=function(){ue.delete(r),ue.size<1&&(d=U,Z&&Z(),Z=null,i.value=U,_e=!1,le=!1),y()}}};function F(r){return r.reduce((g,m)=>g.then(()=>pe(m)),Promise.resolve())}return Ve}function ws(e,t){const n=[],s=[],o=[],a=Math.max(t.matched.length,e.matched.length);for(let l=0;l<a;l++){const p=t.matched[l];p&&(e.matched.find(d=>Y(d,p))?s.push(p):n.push(p));const i=e.matched[l];i&&(t.matched.find(d=>Y(d,i))||o.push(i))}return[n,s,o]}const St=Rs({history:Qn(),routes:[{name:"home",path:"/",component:()=>Q(()=>import("./HomeView-Pp2jRp34.js"),__vite__mapDeps([0,1,2]))},{name:"entity",path:"/entity",children:[{name:"entities",path:"",component:()=>Q(()=>import("./EntityView-CAhR72z2.js"),__vite__mapDeps([3,4,1,2,5]))},{name:"entityList",path:"/entity/:entity",component:()=>Q(()=>import("./EntityListView-D7XhS-cc.js"),__vite__mapDeps([6,1,2,4,7,8,9])),props:!0,children:[{name:"entityRecord",path:":id",component:()=>Q(()=>import("./EntityRecordView-DlxcsM1n.js"),__vite__mapDeps([10,4,1,2,8,7,11])),props:!0}]}]},{name:"api-explorer",path:"/api-explorer",component:()=>Q(()=>import("./ApiExplorerView-B67IDX4E.js"),__vite__mapDeps([12,1,2]))},{name:"realtime",path:"/realtime",component:()=>Q(()=>import("./RealtimeView-Be4rv9eq.js"),__vite__mapDeps([13,1,2]))}]});St.beforeResolve(async(e,t,n)=>{await $e().init(),n()});const xe=Ut(mn);xe.use(Gt());xe.use(St);xe.mount("#app");export{ut as M,Qt as T,Jt as _,ln as a,fe as b,Xt as c,Wt as e,Ps as l,St as r};
