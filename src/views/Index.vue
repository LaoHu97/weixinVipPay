<template>
<div class="index">
  <h3>{{title}}</h3>
  <group>
    <keyboardinput @input="logomsg"></keyboardinput>
  </group>
  <group>
    <cell class="vip_list">
      <span slot="title"><span style="vertical-align:middle;">会员优惠</span>
      <badge :text="discountText * 10+' 折'" style="height:21px;line-height:21px;border-radius:21px;margin-left:25px"></badge>
      </span>
      <span slot style="color:#f74c31;">￥-{{discount}}</span>
    </cell>
    <cell title="会员卡支付">
      <x-switch slot v-model="balance" title='' :disabled="balanceDisabled" prevent-default @on-click="balanceClick" style="padding:0"></x-switch>
      <span slot="inline-desc">可用余额<span  style="color:#f74c31;">￥{{availableBalance}}</span></span>
    </cell>
    <cell title="积分抵现">
      <x-switch slot v-model="bounSwitch" title="" :disabled="bounsDisabled" prevent-default @on-click="bounsClick" style="padding:0"></x-switch>
      <span slot="inline-desc">共{{bouns}}积分，可用{{bounsAvailable}}积分，抵<span  style="color:#f74c31;">￥-{{deductibleAmount}}</span></span>
    </cell>
    <!-- <x-switch  class="vip_list_fu" title="会员卡支付" v-model="balance" :inline-desc="'共5888积分，可用5000积分，抵￥50.00'" @on-change="balanceClick"></x-switch> -->
    <!-- <x-switch  class="vip_list_fu" title="积分抵现" :inline-desc="'共5888积分，可用5000积分，抵￥50.00'"></x-switch> -->
    <cell class="vip_list" is-link @click.native="integralClick">
      <span slot="title"><span style="vertical-align:middle;">优惠券抵扣</span>
      <badge :text="badgeText" style="height:21px;line-height:21px;border-radius:21px;margin-left:15px;border-radius: 3px;background:#fff;border:1px #f74c31 solid;color:#f74c31;"></badge>
      </span>
      <span slot style="color:#666;">未使用</span>
    </cell>
  </group>
  <div v-transfer-dom>
    <popup v-model="integralShow" position="right" width="100%">
      <popupvoucher @integralSubmilt="integralSubmilt"></popupvoucher>
    </popup>
  </div>
  <flexbox style="position: fixed;bottom:0;">
    <flexbox-item :span="8">
      <div class="flex-demo">{{payment}}:<span style="color:#f74c31;">￥{{payAmount}}</span></div>
    </flexbox-item>
    <flexbox-item style="margin:0;">
      <x-button type="primary" class="button" @click.native="submit">确认买单</x-button>
    </flexbox-item>
  </flexbox>
</div>
</template>

<script>
import currency from 'currency'
import {
  getPayMemInfoNew
} from '../api.js'
import keyboardinput from '../components/KeyboardInput.vue'
import popupvoucher from '../components/popupVoucher.vue'
import {
  XInput,
  Group,
  XButton,
  Cell,
  Checklist,
  CellBox,
  Badge,
  TransferDom,
  Popup,
  XSwitch,
  Flexbox,
  FlexboxItem,
} from 'vux'
export default {
  name: 'KeyboardInput',
  name: 'popupVoucher',
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
    Flexbox,
    FlexboxItem,
    popupvoucher
  },
  data() {
    return {
      integralShow: false,
      badgeText: '1张可用',

      title: '',

      consumeAmount: '', //消费金额
      payAmount: '0.00', //应付金额
      deductibleAmount: '0.00', //积分抵扣多少钱

      discountText: '', //会员折扣
      discount: '0.00', //会员折扣应减金额

      balance: false, //会员余额默认关闭
      balanceDisabled: true, //会员余额是否可用
      memberBalance: '', //会员卡使用后余额
      availableBalance: '', //会员卡未使用余额
      payment: '微信支付', //支付方式

      bouns: '', //会员积分
      bounSwitch: false, //积分抵现默认关闭
      bounsAvailable: '0', //可用积分
      bounsDisabled: true, //积分是否可用
      //积分使用条件
      bounsCondition: {
        least_money_to_use_bonus: '', //满多少可用，单位分
        max_reduce_bonus: '' //单笔最多使用
      },
      //积分抵扣规则
      bounsRule: {
        cost_bonus_unit: '', //每使用xx积分
        reduce_money: '' //抵扣xx元
      },
    }
  },
  watch: {　　　
    //应付金额发生变化会调用此方法
    payAmount(curVal, oldVal) {

    },
    //输入金额发生变化会调用此方法
    consumeAmount(curVal, oldVal) {
      //当前金额最多可用积分为当前 “（应付金额*每使用xx积分）/抵扣XX元 ”
      let bounsAvailable = parseInt((this.payAmount * this.bounsRule.cost_bonus_unit) / this.bounsRule.reduce_money);
      //如果单笔最多使用积分大于等于当前金额最多可用积分并且如果会员积分大于等于当前金额最多可用积分
      if (this.bounsCondition.max_reduce_bonus >= bounsAvailable && this.bouns >= bounsAvailable) {
        //可用积分等于当前金额最多可用积分
        this.bounsAvailable = bounsAvailable;
        //当前抵扣金额等于“（当前金额最多可用积分*抵扣XX元）/每使用xx积分”
        this.deductibleAmount = String(currency((bounsAvailable * this.bounsRule.reduce_money) / this.bounsRule.cost_bonus_unit));
        //如果会员积分小于当前金额最多可用积分
      } else if (bounsAvailable > this.bouns) {
        //可用积分等于会员积分123
        this.bounsAvailable = this.bouns;
        //抵扣金额等于（会员积分/每使用xx积分）*抵扣XX元
        this.deductibleAmount = String(currency((this.bouns / this.bounsRule.cost_bonus_unit) * this.bounsRule.reduce_money));
      } else {
        //可用积分等于单笔最多使用积分
        this.bounsAvailable = this.bounsCondition.max_reduce_bonus;
        //抵扣金额等于（单笔最多使用积分/每使用xx积分）*抵扣XX元
        this.deductibleAmount = String(currency((this.bounsCondition.max_reduce_bonus / this.bounsRule.cost_bonus_unit) * this.bounsRule.reduce_money));
      }
      //如果输入金额等于“0.00”
      if (curVal == "0.00") {　　
        //会员余额关闭
        this.balance = false, 　
          //积分抵现关闭
          this.bounSwitch = false, 　
          //会员余额不可用
          this.balanceDisabled = true;
        //积分抵现不可用
        this.bounsDisabled = true;　
      } else {
        //会员余额可用
        this.balanceDisabled = false;
        //积分抵现可用
        this.bounsDisabled = false;
      }
    }
  },
  created() {
    // `this` 指向 vm 实例
    this.Initialization();
    // console.log(this.$route.query.mid);
  },
  methods: {
    //初始化方法
    Initialization() {
      let para = {
        'openCode': (!this.$route.query.code || this.$route.query.code == '') ? '' : this.$route.query.code,
        'state': (!this.$route.query.state || this.$route.query.state == '') ? '' : this.$route.query.state,
        'eid': (!this.$route.query.eid || this.$route.query.eid == '') ? '' : this.$route.query.eid,
        'mid': (!this.$route.query.mid || this.$route.querymid == '') ? '' : this.$route.query.mid,
        'sid': this.$route.query.entType == 2 ? this.$route.query.sid : '',
        'cardCode': (!this.$route.query.cardCode || this.$route.query.cardCode == '') ? '' : this.$route.query.cardCode,
        'cardOpenId': (!this.$route.query.cardOpenId || this.$route.query.cardOpenId == '') ? '' : this.$route.query.cardOpenId,
        'cardId': (!this.$route.query.cardId || this.$route.query.cardId == '') ? '' : this.$route.query.cardId,
        'type': (!this.$route.query.type || this.$route.query.type == '') ? '' : this.$route.query.type,
        'scene': 'W',
        'entType': (!this.$route.query.entType || this.$route.query.entType == '') ? '' : this.$route.query.entType,
        'isInitCode': (!this.$route.query.openId || this.$route.query.openId == '') ? null : '1',
        'payOpenId': this.$route.query.model == 'FT' ? this.$route.query.openid : this.$route.query.openId,
        'model': (!this.$route.query.model || this.$route.query.model == '') ? '' : this.$route.query.model
      }
      getPayMemInfoNew(para).then((res) => {
        let {
          status,
          message
        } = res;
        if (status == 200) {
          this.title = res.data.storeName;
          this.discountText = res.data.discount;
          this.availableBalance = String(currency(res.data.balance));
          this.bouns = res.data.bouns;
          this.bounsRule.cost_bonus_unit = res.data.cost_bonus_unit;
          this.bounsRule.reduce_money = res.data.reduce_money;
          this.bounsCondition.least_money_to_use_bonus = res.data.least_money_to_use_bonus;
          this.bounsCondition.max_reduce_bonus = res.data.max_reduce_bonus;
        } else {

        }
      })
    },
    //积分抵现Switch
    bounsClick(newVal, oldVal) {
      //如果开关不可用，提示*****
      if (this.bounsDisabled) {
        this.$vux.toast.text('请输入金额', 'bottom')
        //否则如果输入金额小于“满多少金额可用”，提示****
      } else if (this.consumeAmount < this.bounsCondition.least_money_to_use_bonus) {
        this.$vux.toast.text('满' + this.bounsCondition.least_money_to_use_bonus + '元可用', 'bottom')
      } else {
        //打开开关或者关闭开关
        this.bounSwitch = newVal;
        if (newVal) {
          //应付金额为当前应付金额减去积分抵现金额
          this.payAmount = String(currency(this.payAmount).subtract(this.deductibleAmount));
        } else {
          //应付金额为当前应付金额加上积分抵现金额
          this.payAmount = String(currency(this.payAmount).add(this.deductibleAmount));
        }
      }
    },
    //选择会员支付或微信支付
    balanceClick(newVal, oldVal) {
      //如果开关置灰，表示金额未输入
      if (this.balanceDisabled) {
        this.$vux.toast.text('请输入金额', 'bottom')
      } else {
        //如果余额小于输入的金额，则提示
        if (this.payAmount >= this.availableBalance) {
          this.$vux.toast.text('余额不足，请充值', 'bottom')
        } else {
          //开关打开，选择会员支付或微信支付
          this.balance = newVal;
          if (newVal) {
            this.payment = "会员支付";
          } else {
            this.payment = "微信支付";
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
    integralClick() {
      this.integralShow = true;
    },
    integralSubmilt(value) {
      this.integralShow = false;
      console.log(value);
    },
    logomsg(msg) {
      //当前输入值
      this.consumeAmount = msg;
      //计算出折扣后多少
      let _val = currency(msg).multiply(this.discountText);
      if (isNaN(_val)) {
        return
      }
      //折扣后减多少钱
      this.discount = String(currency(msg).subtract(_val));
      //计算出应付金额
      this.payAmount = String(_val);
    }
  },
  mounted() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
.index h3 {
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
.button {
    border-radius: 0;
    position: fixed;
    bottom: 0;
    line-height: 67px;
    width: 35%;
}
.vip_list {
    line-height: 2.8;
}
.vip_list_fu {
    height: 57px;
}
</style>
