webpackJsonp([4],{"+AFP":function(t,e){},"0T9I":function(t,e,s){"use strict";var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("transition",{attrs:{name:t.transition}},[s("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],staticClass:"weui-loading_toast vux-loading"},[s("div",{staticClass:"weui-mask_transparent"}),t._v(" "),s("div",{staticClass:"weui-toast",style:{position:t.position}},[s("i",{staticClass:"weui-loading weui-icon_toast"}),t._v(" "),s("p",{staticClass:"weui-toast__content"},[t._v(t._s(t.text||"加载中")),t._t("default")],2)])])])},n=[],a={render:i,staticRenderFns:n};e.a=a},"96t8":function(t,e,s){"use strict";e.a={name:"app"}},"CXy+":function(t,e,s){"use strict";var i=s("w766");e.a={name:"toast",mixins:[i.a],props:{value:Boolean,time:{type:Number,default:2e3},type:{type:String,default:"success"},transition:String,width:{type:String,default:"7.6em"},isShowMask:{type:Boolean,default:!1},text:String,position:String},data:function(){return{show:!1}},created:function(){this.value&&(this.show=!0)},computed:{currentTransition:function(){return this.transition?this.transition:"top"===this.position?"vux-slide-from-top":"bottom"===this.position?"vux-slide-from-bottom":"vux-fade"},toastClass:function(){return{"weui-toast_forbidden":"warn"===this.type,"weui-toast_cancel":"cancel"===this.type,"weui-toast_success":"success"===this.type,"weui-toast_text":"text"===this.type,"vux-toast-top":"top"===this.position,"vux-toast-bottom":"bottom"===this.position,"vux-toast-middle":"middle"===this.position}},style:function(){if("text"===this.type&&"auto"===this.width)return{padding:"10px"}}},watch:{show:function(t){var e=this;t&&(this.$emit("input",!0),this.$emit("on-show"),this.fixSafariOverflowScrolling("auto"),clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.show=!1,e.$emit("input",!1),e.$emit("on-hide"),e.fixSafariOverflowScrolling("touch")},this.time))},value:function(t){this.show=t}}}},"Ggw+":function(t,e,s){"use strict";var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"app"}},[s("router-view")],1)},n=[],a={render:i,staticRenderFns:n};e.a=a},Jgky:function(t,e,s){"use strict";function i(t){s("VeMs")}var n=s("CXy+"),a=s("pYns"),o=s("/Xao"),r=i,u=o(n.a,a.a,!1,r,null,null);e.a=u.exports},M93x:function(t,e,s){"use strict";function i(t){s("tJVz")}var n=s("96t8"),a=s("Ggw+"),o=s("/Xao"),r=i,u=o(n.a,a.a,!1,r,null,null);e.a=u.exports},NHnr:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s("TWX9"),n=s("M93x"),a=s("YaEn"),o=s("OkNQ"),r=s("wvqv"),u=s("AmAj");i.a.use(u.a),i.a.use(r.a),i.a.use(o.a),s("iDdd").attach(document.body),i.a.config.productionTip=!1,new i.a({el:"#app",router:a.a,template:"<App/>",components:{App:n.a}})},VeMs:function(t,e){},YaEn:function(t,e,s){"use strict";var i=s("TWX9"),n=s("zO6J"),a=function(){return s.e(0).then(s.bind(null,"mlqX"))},o=function(){return s.e(2).then(s.bind(null,"xLdf"))},r=function(){return s.e(1).then(s.bind(null,"Uq5d"))};i.a.use(n.a),e.a=new n.a({routes:[{path:"/",name:"Index",component:a},{path:"/err",name:"error",component:o},{path:"/commer",name:"commer",component:r}]})},nFDH:function(t,e,s){"use strict";function i(t){s("+AFP")}var n=s("u/JX"),a=s("0T9I"),o=s("/Xao"),r=i,u=o(n.a,a.a,!1,r,null,null);e.a=u.exports},pYns:function(t,e,s){"use strict";var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"vux-toast"},[s("div",{directives:[{name:"show",rawName:"v-show",value:t.isShowMask&&t.show,expression:"isShowMask && show"}],staticClass:"weui-mask_transparent"}),t._v(" "),s("transition",{attrs:{name:t.currentTransition}},[s("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],staticClass:"weui-toast",class:t.toastClass,style:{width:t.width}},[s("i",{directives:[{name:"show",rawName:"v-show",value:"text"!==t.type,expression:"type !== 'text'"}],staticClass:"weui-icon-success-no-circle weui-icon_toast"}),t._v(" "),t.text?s("p",{staticClass:"weui-toast__content",style:t.style,domProps:{innerHTML:t._s(t.text)}}):s("p",{staticClass:"weui-toast__content",style:t.style},[t._t("default")],2)])])],1)},n=[],a={render:i,staticRenderFns:n};e.a=a},tJVz:function(t,e){},"u/JX":function(t,e,s){"use strict";e.a={name:"loading",model:{prop:"show",event:"change"},props:{show:Boolean,text:String,position:String,transition:{type:String,default:"vux-mask"}},watch:{show:function(t){this.$emit("update:show",t)}}}}},["NHnr"]);