"use strict";(self.webpackChunkRemoteClient=self.webpackChunkRemoteClient||[]).push([[7873],{97873:(e,t,r)=>{r.d(t,{FO:()=>p,W7:()=>d,addOrUpdateResource:()=>l,fetchResources:()=>n,removeAllResources:()=>u,removeResource:()=>c});var a=r(3172),s=r(20102),o=r(17452);async function n(e,t={},r){await e.load(r);const a=(0,o.v_)(e.itemUrl,"resources"),{start:s=1,num:n=10,sortOrder:l="asc",sortField:c="created"}=t,u={query:{start:s,num:n,sortOrder:l,sortField:c,token:e.apiKey},signal:r?.signal},i=await e.portal.request(a,u);return{total:i.total,nextStart:i.nextStart,resources:i.resources.map((({created:t,size:r,resource:a})=>({created:new Date(t),size:r,resource:e.resourceFromPath(a)})))}}async function l(e,t,r,a){if(!e.hasPath())throw new s.Z(`portal-item-resource-${t}:invalid-path`,"Resource does not have a valid path");const n=e.portalItem;await n.load(a);const l=(0,o.v_)(n.userItemUrl,"add"===t?"addResources":"updateResources"),[c,u]=i(e.path),p=new FormData;return c&&"."!==c&&p.append("resourcesPrefix",c),null!=a&&a.compress&&p.append("compress","true"),p.append("fileName",u),p.append("file",r,u),p.append("f","json"),a?.access&&p.append("access",a.access),await n.portal.request(l,{method:"post",body:p,signal:a?.signal}),e}async function c(e,t,r){if(!t.hasPath())throw new s.Z("portal-item-resources-remove:invalid-path","Resource does not have a valid path");await e.load(r);const a=(0,o.v_)(e.userItemUrl,"removeResources");await e.portal.request(a,{method:"post",query:{resource:t.path},signal:r?.signal}),t.portalItem=null}async function u(e,t){await e.load(t);const r=(0,o.v_)(e.userItemUrl,"removeResources");return e.portal.request(r,{method:"post",query:{deleteAll:!0},signal:t?.signal})}function i(e){const t=e.lastIndexOf("/");return-1===t?[".",e]:[e.slice(0,t),e.slice(t+1)]}async function p(e){return"blob"===e.type?e.blob:"json"===e.type?new Blob([e.jsonString],{type:"application/json"}):(await(0,a.Z)(e.url,{responseType:"blob"})).data}function d(e,t){if(!e.hasPath())return null;const[r,,a]=function(e){const[t,r]=function(e){const t=(0,o.Ml)(e);return null==t?[e,""]:[e.slice(0,e.length-t.length-1),`.${t}`]}(e),[a,s]=i(t);return[a,s,r]}(e.path);return e.portalItem.resourceFromPath((0,o.v_)(r,t+a))}}}]);