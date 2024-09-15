import{a as _,G as g,s as z,o as t,c as m,w as r,h as $,b as s,l as d,K as w,L as C,C as f,k as F,t as p,n as S,e as T,q as b,i as E,p as U,O as G}from"./RootLayout.vue_vue_type_style_index_0_lang-Be9ADJki.js";import{_ as D,a as M,b as A,l as N,r as V,e as L,c as R}from"./main-D7-rVbLu.js";import{C as q}from"./CardWidget-C-5i89zD.js";import{_ as K,i as O,l as j,o as J,a as W}from"./index-CrRoHKrF.js";import{_ as H}from"./FormBase.vue_vue_type_script_setup_true_lang-Bg_caU13.js";import{_ as B}from"./DisplayTimestamp.vue_vue_type_script_setup_true_lang-CGEF_rbB.js";import{_ as Q}from"./DisplayJSON.vue_vue_type_style_index_0_lang-2NTNMNp6.js";import"./InputPassword.vue_vue_type_script_setup_true_lang-BCVcZZGg.js";const X={class:"title-5 text-accent"},Y={class:"text-small italic"},Z={class:"title-4 text-center"},ee=_({__name:"EntityActions",props:{entityDef:{},record:{}},setup(n){const e=n,a=g([]),l=g({key:"",label:"",description:"",params:[],action:()=>{}}),o=g({}),v=g(!1);z(()=>{a.value=e.entityDef.actions.filter(c=>!c.private)});async function h(c){if(l.value=c,c.params&&c.params.length>0){o.value={},c.params.forEach(i=>{o.value[i.key]={error:"",value:null}}),v.value=!0;return}await x(c)}async function x(c){if(!y(c,o.value))return;const i={};for(const k in o.value)i[k]=o.value[k].value;const u=await M.runEntityAction(e.entityDef.entityId,e.record.id,c.key,i);S({title:`Action ${c.label||c.key} completed`,message:u.message||u||"Action completed",type:"success"}),o.value={},l.value={key:"",label:"",description:"",params:[],action:()=>{}},v.value=!1}function y(c,i){let u=!1;if(!c.params)return!0;for(const k of c.params){if(k.required&&!i[k.key].value){i[k.key].error="Please provide a value",u=!0;continue}i[k.key].error=""}return!u}return(c,i)=>(t(),m(F,{class:"row shrink"},{default:r(()=>[i[3]||(i[3]=$("div",null,[$("div",{class:"title-4"},"Actions")],-1)),s(f,{class:"row shrink"},{default:r(()=>[(t(!0),d(C,null,w(a.value,u=>(t(),m(q,{key:u.key},{default:r(()=>[s(f,{class:"col-2 shrink vertical-align-center"},{default:r(()=>[s(D,{icon:"play_arrow",color:"secondary",onClick:k=>h(u),label:u.label,key:"play"},null,8,["onClick","label"]),s(f,null,{default:r(()=>[$("div",X,p(u.label),1),$("div",Y,p(u.description),1)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1}),s(K,{modelValue:v.value,"onUpdate:modelValue":i[2]||(i[2]=u=>v.value=u)},{default:r(()=>[s(F,{class:"row row-gap-4"},{default:r(()=>[$("div",Z,p(l.value.label||l.value.key),1),s(H,{name:"actionParamsForm",onSubmitted:i[1]||(i[1]=async()=>await x(l.value))},{default:r(()=>[s(f,{class:"row row-gap-4"},{default:r(()=>[s(f,null,{default:r(()=>[(t(!0),d(C,null,w(l.value.params,u=>(t(),d("div",{key:u.key},[(t(),m(T(b(O)[u.fieldType]),{label:u.key,required:u.required,error:o.value[u.key].error,modelValue:o.value[u.key].value,"onUpdate:modelValue":k=>o.value[u.key].value=k},null,8,["label","required","error","modelValue","onUpdate:modelValue"]))]))),128))]),_:1}),s(f,{class:"col shrink horizontal-align-center gap-3"},{default:r(()=>[s(D,{icon:"cancel",color:"error",onClick:i[0]||(i[0]=u=>v.value=!1),label:"Cancel"}),s(D,{icon:"play_arrow",type:"submit",color:"secondary",label:l.value.label},null,8,["label"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}))}}),le=_({__name:"EntityInfo",props:{entityDef:{},record:{}},setup(n){return(e,a)=>(t(),m(f,null,{default:r(()=>[s(f,{class:"col"},{default:r(()=>[a[0]||(a[0]=$("div",{class:"label"},"Created At:",-1)),s(B,{class:"label text-info-dark",value:e.record.createdAt},null,8,["value"])]),_:1}),s(f,{class:"col"},{default:r(()=>[a[1]||(a[1]=$("div",{class:"label"},"Last Updated:",-1)),s(B,{class:"label text-info-dark",value:e.record.updatedAt},null,8,["value"])]),_:1})]),_:1}))}}),te=_({__name:"EntityToolbar",props:{editMode:{type:Boolean}},emits:["edit","save","delete"],setup(n,{emit:e}){const a=e,l=n;return j(o=>{J(o,()=>{l.editMode&&a("save")})}),(o,v)=>(t(),m(f,{class:"toolbar col shrink"},{default:r(()=>[s(A,{speed:"fast"},{default:r(()=>[o.editMode?(t(),m(D,{key:0,icon:"save",size:"1",color:"success",onClick:v[0]||(v[0]=h=>o.$emit("save"))})):E("",!0)]),_:1}),s(A,{speed:"fast"},{default:r(()=>[o.editMode?(t(),m(D,{key:0,onClick:v[1]||(v[1]=h=>o.$emit("delete")),icon:"delete",size:"1",color:"error"})):E("",!0)]),_:1}),s(D,{onClick:v[2]||(v[2]=h=>o.$emit("edit",!o.editMode)),icon:o.editMode?"edit_off":"edit",label:"Edit Mode",color:"warning",size:"1"},null,8,["icon"])]),_:1}))}}),P=_({__name:"DisplayData",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),ae=_({__name:"DisplayInt",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),se=_({__name:"DisplayBigInt",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),ne=_({__name:"DisplayDate",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),re=_({__name:"DisplayBoolean",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),ie=_({__name:"DisplayPassword",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),oe=_({__name:"DisplayChoices",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),ue=_({__name:"DisplayMultiChoice",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),de=_({__name:"DisplayText",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),ce=_({__name:"DisplayEmail",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),pe=_({__name:"DisplayImage",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),fe=_({__name:"DisplayPhone",props:{value:{},field:{}},setup(n){const e=n;return(a,l)=>(t(),d("div",null,p(e.value),1))}}),_e=_({__name:"DisplayConnection",props:{value:{},field:{},titleValue:{}},setup(n){return(e,a)=>(t(),d("div",null,p(e.titleValue),1))}}),ve={IDField:P,DataField:P,IntField:ae,BigIntField:se,DateField:ne,BooleanField:re,PasswordField:ie,ChoicesField:oe,MultiChoiceField:ue,TextField:de,EmailField:ce,ImageField:pe,JSONField:Q,PhoneField:fe,ConnectionField:_e,TimestampField:W},me={class:"title-4 text-primary"},ye={class:"text-small align-content-center bold"},ke={class:"text-medium align-content-center"},I=_({__name:"EntityFieldGroup",props:{group:{},edit:{type:Boolean},record:{}},setup(n){return(e,a)=>(t(),m(q,null,{default:r(()=>[s(f,{class:"row shrink"},{default:r(()=>[$("div",me,p(e.group.title),1),s(F,{class:U(["group-fields column-gap-3",{edit:e.edit}])},{default:r(()=>[s(f,{class:"field-names"},{default:r(()=>[(t(!0),d(C,null,w(e.group.fields.filter(l=>!l.hidden),l=>(t(),d("div",ye,p(l.label),1))),256))]),_:1}),s(f,{class:"row field-values"},{default:r(()=>[(t(!0),d(C,null,w(e.group.fields,l=>(t(),d("div",ke,[(t(),m(T(b(ve)[l.fieldType]),{field:l,value:e.record[l.key]},null,8,["field","value"]))]))),256))]),_:1})]),_:1},8,["class"])]),_:1})]),_:1}))}}),$e={class:"title-4"},ge={class:"text-small italic text-primary-bright"},Me=_({__name:"EntityRecordView",props:{entity:{},id:{}},setup(n){const e=n;let a={};const l=g({}),o={loaded:g(!1),saving:g(!1)},v=g(!1);async function h(){o.loaded.value=!1,l.value=await M.getEntity(e.entity,e.id),o.loaded.value=!0}async function x(){if(!l.value)return;o.saving.value=!0;const y=l.value;await M.updateEntity(e.entity,y.id,y),o.saving.value=!1}return N(e.entity,"update",async y=>{y.id===e.id&&(l.value=y,S({message:`${a.config.label} ${l.value[a.config.titleField||"id"]} was updated`,title:`${a.config.label} Updated`,type:"success"}))}),G(()=>{if(!e.id||!e.entity)return V.push("/entity");const y=L.getDef(e.entity);if(!y)return V.push("/entity");a=y}),z(async()=>{await h()}),(y,c)=>(t(),m(A,null,{default:r(()=>[o.loaded.value?(t(),m(F,{key:0,class:"position-relative entity-record-grid"},{default:r(()=>[s(f,{class:"top-bar col shrink vertical-align-center horizontal-align-between"},{default:r(()=>[s(f,null,{default:r(()=>[$("div",$e,p(l.value[b(a).config.titleField||"id"]),1),$("div",ge,p(l.value.id),1)]),_:1}),s(te,{editMode:v.value,onSave:x,onDelete:c[0]||(c[0]=()=>{}),onEdit:c[1]||(c[1]=i=>v.value=i)},null,8,["editMode"])]),_:1}),s(F,{class:"fields"},{default:r(()=>[s(f,{class:"row shrink"},{default:r(()=>[(t(!0),d(C,null,w(b(a).fieldGroups.filter(i=>i.key!=="default"),i=>(t(),m(I,{group:i,record:l.value,key:i.key},null,8,["group","record"]))),128)),(t(!0),d(C,null,w(b(a).fieldGroups.filter(i=>i.key==="default"),i=>(t(),m(I,{group:i,record:l.value,key:i.key},null,8,["group","record"]))),128))]),_:1})]),_:1}),s(f,{class:"info"},{default:r(()=>[s(le,{entityDef:b(a),record:l.value},null,8,["entityDef","record"])]),_:1}),s(f,{class:"actions"},{default:r(()=>[s(ee,{entityDef:b(a),record:l.value},null,8,["entityDef","record"])]),_:1}),s(R,{loaded:!o.saving.value},null,8,["loaded"])]),_:1})):E("",!0)]),_:1}))}});export{Me as default};
