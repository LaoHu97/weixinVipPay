<template>
  <div class="index">
    <h2>西安万鼎</h2>
    <group>
      <keyboardinput @input="logomsg"></keyboardinput>
    </group>
    <group>
      <cell class="vip_list">
        <span slot="title"><span style="vertical-align:middle;">会员优惠</span><badge :text="discountText * 10+' 折'" style="height:21px;line-height:21px;border-radius:21px;margin-left:25px"></badge></span>
        <span slot style="color:#f74c31;">￥-{{discount}}</span>
      </cell>
      <cell title="会员卡支付">
        <x-switch slot v-model="balance" title='' :disabled="balanceDisabled" prevent-default @on-click="balanceClick"></x-switch>
        <span slot="inline-desc">可用余额<span  style="color:#f74c31;">￥{{availableBalance}}</span></span>
      </cell>
      <cell title="积分抵现">
        <x-switch  class="vip_list_fu" title=""></x-switch>
        <span slot="inline-desc">共5888积分，可用5000积分，抵￥50.00<span  style="color:#f74c31;"></span></span>
      </cell>
      <!-- <x-switch  class="vip_list_fu" title="会员卡支付" v-model="balance" :inline-desc="'共5888积分，可用5000积分，抵￥50.00'" @on-change="balanceClick"></x-switch> -->
      <!-- <x-switch  class="vip_list_fu" title="积分抵现" :inline-desc="'共5888积分，可用5000积分，抵￥50.00'"></x-switch> -->
      <cell  class="vip_list" is-link @click.native="integralClick">
        <span slot="title"><span style="vertical-align:middle;">优惠券抵扣</span><badge :text="badgeText" style="height:21px;line-height:21px;border-radius:21px;margin-left:15px;border-radius: 3px;background:#fff;border:1px #f74c31 solid;color:#f74c31;"></badge></span>
        <span slot style="color:#666;">未使用</span>
      </cell>
    </group>
    <div v-transfer-dom>
      <popup v-model="integralShow" position="right" width="100%">
        <tab>
          <tab-item selected @on-item-click="onItemClick">可用优惠券</tab-item>
          <tab-item @on-item-click="onItemClick">不可用优惠券</tab-item>
        </tab>
        <checker v-model="inlineDescListValue" default-item-class="demo-item" selected-item-class="demo-item-selected" disabled-item-class="demo-item-disabled">
          <checker-item :value="item" v-for="(item, index) in inlineDescList" :key="index" @on-item-click="onItemCheckerClick" style="margin-top:15px;">
            <div class="checker_item_left">
              <icon type="circle"></icon>
            </div>
            <div class="checker_item_right">

            </div>
          </checker-item>
        </checker>
        <div style="padding: 15px;">
          <x-button @click.native="integralShow = false" type="primary">确认</x-button>
        </div>
      </popup>
    </div>
    <flexbox style="position: fixed;bottom:0;">
      <flexbox-item :span="8"><div class="flex-demo">{{payment}}:<span style="color:#f74c31;">￥{{payAmount}}</span></div></flexbox-item>
      <flexbox-item style="margin:0;"><x-button type="primary" class="button" @click.native="submit">确认买单</x-button></flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import currency from 'currency'
import { getPayMemInfoNew } from '../api.js'
import keyboardinput from '../components/KeyboardInput.vue'
import { XInput, Group, XButton, Cell, Checklist, CellBox,  Badge, TransferDom, Popup, XSwitch, Tab, TabItem, Checker, CheckerItem, Flexbox, FlexboxItem, Icon } from 'vux'
export default {
  name: 'KeyboardInput',
  directives: {
    TransferDom
  },
  components: {
    XInput,
    XButton,
    Group,
    Cell,
    Checklist,
    CellBox,
    Badge,
    Popup,
    XSwitch,
    keyboardinput,
    Tab,
    TabItem,
    Checker,
    CheckerItem,
    Flexbox,
    FlexboxItem,
    Icon
  },
  data () {
    return {
      maskValue:'123123',
      integralShow:false,
      badgeText:'1张可用',
      discountText:'',//会员折扣
      discount:'0.00',//会员折扣应减金额
      payAmount:'0.00',//应付金额
      balance:false,//会员余额默认关闭
      balanceDisabled:true,//会员余额是否可用
      memberBalance:'',//会员卡使用后余额
      availableBalance:'',//会员卡未使用余额
      payment:'微信支付',//支付方式
      inlineDescList: [
        {key: '1', value: '1', inlineDesc: 'Tiger is the king of mountain'},
        {key: '2', value: '2', inlineDesc: 'Lion is the king of woods'},
        {key: '3', value: '3'}
      ],
      inlineDescListValue:[],

    }
  },
  watch:{
　　　payAmount(curVal,oldVal){
　　　　if (curVal) {
　　　　  this.balanceDisabled=false;
　　　　}
　　　}
　},
  created () {
    // `this` 指向 vm 实例
    this.Initialization();
    // console.log(this.$route.query.mid);
  },
  methods: {
    //初始化方法
    Initialization(){
      let para ={
        'openCode':(!this.$route.query.code || this.$route.query.code == '') ? '' : this.$route.query.code,
        'state':(!this.$route.query.state || this.$route.query.state == '') ? '' : this.$route.query.state,
        'eid': (!this.$route.query.eid || this.$route.query.eid == '') ? '' : this.$route.query.eid,
        'mid': (!this.$route.query.mid || this.$route.querymid == '') ? '' : this.$route.query.mid,
        'sid': this.$route.query.entType == 2 ? this.$route.query.sid : '',
        'cardCode': (!this.$route.query.cardCode || this.$route.query.cardCode == '') ? '' : this.$route.query.cardCode,
        'cardOpenId': (!this.$route.query.cardOpenId || this.$route.query.cardOpenId == '') ? '' : this.$route.query.cardOpenId,
        'cardId': (!this.$route.query.cardId || this.$route.query.cardId == '') ? '' : this.$route.query.cardId,
        'type': (!this.$route.query.type || this.$route.query.type == '') ? '' : this.$route.query.type,
        'scene': 'W',
        'entType': (!this.$route.query.entType || this.$route.query.entType == '') ? '' : this.$route.query.entType,
        'isInitCode':(!this.$route.query.openId || this.$route.query.openId == '') ? null : '1',
        'payOpenId':this.$route.query.model == 'FT' ? this.$route.query.openid : this.$route.query.openId,
        'model':(!this.$route.query.model || this.$route.query.model == '') ? '' : this.$route.query.model
      }
      getPayMemInfoNew(para).then((res)=>{
        let{status,message}=res;
        if (status==200) {
          this.discountText=res.data.discount;
          this.availableBalance=String(currency(1));
        }else {

        }
      })
    },
    onItemCheckerClick(itemValue, itemDisabled){

    },
    submit(){
      console.log("123");
    },
    onItemClick(index){
      console.log(index);
    },
    balanceClick(newVal, oldVal){
      if (this.balanceDisabled) {
        this.$vux.toast.text('请输入金额', 'bottom')
      }else{
        if (this.payAmount>=this.availableBalance) {
          this.$vux.toast.text('余额不足，请充值', 'bottom')
        }else {
          this.balance=newVal;
          if (newVal) {
            this.payment="会员支付";
          }else {
            this.payment="微信支付";
          }
        }
        // this.balance=newVal;
        // if (newVal) {
        //   if (this.payAmount<=this.availableBalance) {
        //     this.memberBalance=String(currency(this.availableBalance).subtract(this.payAmount));
        //     this.payAmount="0.00";
        //   }else {
        //     this.payAmount = String(currency(this.payAmount).subtract(this.availableBalance));
        //   }
        // }else {
        //   if (this.payAmount<=this.availableBalance) {
        //     this.payAmount = String(currency(this.availableBalance).subtract(this.memberBalance));
        //   }else {
        //     this.payAmount = String(currency(this.payAmount).add(this.availableBalance));
        //   }
        // }
      }
    },
    integralClick(){
      this.integralShow=true;
    },
    logomsg(msg){
      let _val =currency(msg).multiply(this.discountText);
      if (isNaN(_val)) {
        return
      }
      this.discount = String(currency(msg).subtract(_val));
      this.payAmount = String(_val);
    }
  },
  mounted() {
    // this.availableBalance=String(currency(5));
    // this.discountText=9.1;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
.index h2{
  text-align: center;
}
.flex-demo {
  text-align: left;
  padding-left: 15px;
  line-height: 69px;
  font-size: 20px;
  height: 69px;
  background-color: #fff;
  background-clip: padding-box;
}
.button{
  border-radius: 0;
  position: fixed;
  bottom: 0;
  line-height: 67px;
  width: 35%;
}
.vip_list{
  line-height: 2.8;
}
.vip_list_fu{
  height: 57px;
}
.vux-tab .vux-tab-item.vux-tab-selected{
  color: #FF9900;
  border-bottom: 3px solid #FF9900;
}
.demo-item{
  width: 100%;
  height: 120px;
}

.demo-item .checker_item_left{
  display: inline-block;
  height: 120px;
  line-height: 120px;
  width: 10%;
}
.demo-item .checker_item_right{
  height: 100%;
  width: 85%;
  float: right;
  background-color: #FFBE00;
  margin-right: 15px;
}
.demo-item-selected .checker_item_left i{
  color: #09BB07;
}
.demo-item-selected .checker_item_left .weui-icon-circle:before{
  content: "\EA06";
}
</style>
