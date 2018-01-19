<template>
<div class="index">
  <h3>{{title}}</h3>
  <group>
    <keyboardinput @input="logomsg"></keyboardinput>
  </group>
  <group>
    <cell class="vip_list">
      <span slot="title"><span style="vertical-align:middle;">会员优惠</span>
      <badge :text="discountText * 10+' 折'" v-if='this.ismem' style="height:21px;line-height:21px;border-radius:21px;margin-left:15px;border-radius: 3px;background:#fff;border:1px #f74c31 solid;color:#f74c31;"></badge>
      <badge text="无会员" v-else style="height:21px;line-height:21px;border-radius:21px;margin-left:15px;border-radius: 3px;background:#fff;border:1px #f74c31 solid;color:#f74c31;"></badge>
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
    <cell class="vip_list" is-link @click.native="integralClick()">
      <span slot="title"><span style="vertical-align:middle;">优惠券抵扣</span>
      <badge :text="badgeText" style="height:21px;line-height:21px;border-radius:21px;margin-left:15px;border-radius: 3px;background:#fff;border:1px #f74c31 solid;color:#f74c31;"></badge>
      </span>
      <span slot style="color:#666;" ref="redCoupon">{{coupon}}</span>
    </cell>
  </group>
  <div v-transfer-dom>
    <popup v-model="integralShow" position="right" width="100%">
      <popupvoucher @integralSubmilt="integralSubmilt" :inlineDescList="inlineDescList"></popupvoucher>
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
  <!-- 输入支付密码 -->
  <div v-transfer-dom>
    <x-dialog v-model="payPassword">
      <icon type="clear" style="float:left;margin:20px 0 0 15px" @click.native="payPassword=false"></icon>
      <h4 style="margin:1em ">支付&nbsp;&nbsp;&nbsp;</h4>
      <div style="width:100%;height:1px;background-color:#1aad19 "></div>
      <h2>￥{{vipPay.amount}}</h2>
      <box gap="0 25px ">
        <x-input class="dialog_input " v-model="vipPay.password" placeholder="请输入支付密码 " :max="6" :show-clear="false " type="password" placeholder-align="center " text-align="center "></x-input>
      </box>
      <box gap="25px 25px 15px 25px ">
        <x-button type="primary " @click.native="submitFormVIP">确认支付</x-button>
      </box>
    </x-dialog>
  </div>
</div>
</template>

<script>
import wx from 'weixin-js-sdk'
import {
  querystring,
  md5
} from 'vux'
import currency from 'currency'
import {
  getPayMemInfo,
  queryCoupon,
  getPrepayInfo,
  getPayInfoByMemCard,
  updateMempayInfo
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
  XDialog,
  Box,
  Icon
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
    popupvoucher,
    XDialog,
    Box,
    Icon
  },
  data() {
    return {
      inlineDescList: [],

      integralShow: false,
      badgeText: '1张可用',

      title: '',

      consumeAmount: '', //消费金额
      payAmount: '0.00', //应付金额
      deductibleAmount: '0.00', //积分抵扣多少钱

      ismem: false,
      discountText: '', //会员折扣
      discount: '0.00', //会员折扣应减金额

      balance: false, //会员余额默认关闭
      balanceDisabled: true, //会员余额是否可用
      memberBalance: '', //会员卡使用后余额
      availableBalance: '', //会员卡未使用余额
      payment: '微信支付', //支付方式
      payPassword: false,

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
      coupon: '未使用',
      amountCoupon: '',
      //下单数据
      pay: {
        oid: '',
        least_cost: '',
        couponCode: '',
        couponId: ''
      },
      vipPay: {
        id: '',
        memId: '',
        pwd: '',
        password: '',
        amount: '',
        deductOrderId: '',
        deductTransId: ''
      }
    }
  },
  watch: {　　　
    //应付金额发生变化会调用此方法
    payAmount(curVal, oldVal) {

    },
    //输入金额发生变化会调用此方法
    consumeAmount(curVal, oldVal) {
      this.consumeAmountDeputy();
      //如果输入金额等于“0.00”
      if (!curVal || !this.ismem) {　　
        //会员余额关闭
        this.balance = false;
        //积分抵现关闭
        this.bounSwitch = false;
        //会员余额不可用
        this.balanceDisabled = true;
        //积分抵现不可用
        this.bounsDisabled = true;
        console.log('true');
      } else {
        //会员余额可用
        this.balanceDisabled = false;
        //积分抵现可用
        this.bounsDisabled = false;
        console.log('false');
      }
    }
  },
  created() {
    // `this` 指向 vm 实例
    this.Initialization();
    // console.log(querystring.parse().mid);
  },
  methods: {
    /**
     * [consumeAmountDeputy 计算积分抵现方法]
     * @return {[type]} [可用积分与抵扣金额]
     */
    consumeAmountDeputy() {
      //当前金额最多可用积分为当前 “（应付金额*每使用xx积分）/抵扣XX元 ”
      let bounsAvailable = parseInt(((this.payAmount * 100) * this.bounsRule.cost_bonus_unit) / this.bounsRule.reduce_money);
      if (!this.ismem) {
        return
      }
      console.log(bounsAvailable);
      //如果单笔最多使用积分大于等于当前金额最多可用积分并且如果会员积分大于等于当前金额最多可用积分
      if (this.bounsCondition.max_reduce_bonus >= bounsAvailable && this.bouns >= bounsAvailable) {
        console.log("1");
        //可用积分等于当前金额最多可用积分
        this.bounsAvailable = bounsAvailable;
        //当前抵扣金额等于“（当前金额最多可用积分*抵扣XX元）/每使用xx积分”
        this.deductibleAmount = String(currency(((bounsAvailable * this.bounsRule.reduce_money) / this.bounsRule.cost_bonus_unit) / 100));
        //如果会员积分小于当前金额最多可用积分
      } else if (this.bouns < bounsAvailable) {
        console.log("2");
        //抵扣金额等于（会员积分/每使用xx积分）*抵扣XX元
        let deductibleAmount = ((this.bouns * this.bounsRule.reduce_money) / this.bounsRule.cost_bonus_unit) / 100;
        this.deductibleAmount = String(currency(Math.floor(deductibleAmount * 100) / 100));
        //可用积分等于会员积分123
        this.bounsAvailable = (this.deductibleAmount * 100) * this.bounsRule.cost_bonus_unit;
        console.log(this.bounsAvailable);
        console.log(this.bounsRule.cost_bonus_unit);
      } else {
        console.log("3");
        //可用积分等于单笔最多使用积分
        this.bounsAvailable = this.bounsCondition.max_reduce_bonus;
        //抵扣金额等于（单笔最多使用积分/每使用xx积分）*抵扣XX元
        this.deductibleAmount = String(currency(((this.bounsCondition.max_reduce_bonus * this.bounsRule.reduce_money) / this.bounsRule.cost_bonus_unit) / 100));
      }
    },
    //确认买单
    submit() {
      if (this.payAmount == '0.00') {
        return this.$vux.toast.text('请检查金额', 'bottom');
      }
      // 显示
      this.$vux.loading.show({
        text: '请稍候'
      })
      if (this.payment == "微信支付") {
        let para = {
          ismem: this.ismem,
          mid: querystring.parse().mid,
          sid: querystring.parse().sid,
          eid: querystring.parse().eid,
          oid: this.pay.oid,
          amount: this.payAmount,
          desc: '',
          type: '1',
          scene: 'W',
          cardCode: querystring.parse().cardCode,
          cardOpenId: querystring.parse().cardOpenId,
          cardId: querystring.parse().cardId,
          orgAmt: this.consumeAmount,
          discount: String(currency(this.consumeAmount).multiply(this.discountText)),
          bounsDeduct: this.deductibleAmount,
          couponDeduct: String(this.amountCoupon),
          discountUnit: String(this.discountText),
          useBouns: String(this.bounsAvailable),
          cost_bonus_unit: String(this.bounsRule.cost_bonus_unit),
          reduce_money: String(this.bounsRule.reduce_money),
          least_money_to_use_bonus: String(this.bounsCondition.least_money_to_use_bonus),
          max_reduce_bonus: String(this.bounsCondition.max_reduce_bonus),
          least_cost: String(this.pay.least_cost),
          reduce_cost: String(this.amountCoupon * 100),
          couponCode: this.pay.couponCode,
          couponId: String(this.pay.couponId),
          version: '3.0.0',
          url: window.location.href.split('#')[0]
        }
        para.bounsDeduct = this.bounSwitch ? String(this.deductibleAmount) : '';
        para.useBouns = this.bounSwitch ? String(this.bounsAvailable) : '';
        getPrepayInfo(para).then((res) => {
          var _this = this;
          let {
            status,
            data,
            message
          } = res;
          if (status == 200) {
            let out_trade_no = data.out_trade_no;
            sessionStorage.setItem('out_trade_no', JSON.stringify(out_trade_no));
            var orderType = "";
            sessionStorage.setItem('orderType', JSON.stringify(orderType));
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: data.appId, // 必填，公众号的唯一标识
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.noncestr, // 必填，生成签名的随机串
              signature: data.configSign, // 必填，签名，见附录1
              jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
            wx.ready(function() {
              wx.chooseWXPay({
                timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.paySign, // 支付签名
                success: function(res) {
                  // 支付成功后的回调函数
                  _this.$router.push({
                    path: '/commer',
                  });
                },
                fail: function(res) {
                  _this.$vux.toast.show({
                    text: '支付失败',
                    type: 'warn',
                    time: 6000,
                    isShowMask: true
                  })
                },
                cancel: function(res) {
                  _this.$vux.toast.show({
                    text: '取消支付',
                    type: 'warn',
                    time: 6000,
                    isShowMask: true
                  })
                }
              });
            });
          } else {
            // 显示
            _this.$vux.toast.show({
              text: '下单失败',
              type: 'warn',
              time: 6000,
              isShowMask: true
            })
          }
          // 隐藏
          this.$vux.loading.hide()
        })
      } else if (this.payment == "会员支付") {
        let para = {
          ismem: this.ismem,
          mid: querystring.parse().mid,
          sid: querystring.parse().sid,
          eid: querystring.parse().eid,
          oid: this.pay.oid,
          amount: this.payAmount,
          desc: '',
          type: '1',
          scene: 'W',
          cardCode: querystring.parse().cardCode,
          cardOpenId: querystring.parse().cardOpenId,
          cardId: querystring.parse().cardId,
          orgAmt: this.consumeAmount,
          discount: String(currency(this.consumeAmount).multiply(this.discountText)),
          bounsDeduct: this.deductibleAmount,
          couponDeduct: String(this.amountCoupon),
          discountUnit: String(this.discountText),
          useBouns: String(this.bounsAvailable),
          cost_bonus_unit: String(this.bounsRule.cost_bonus_unit),
          reduce_money: String(this.bounsRule.reduce_money),
          least_money_to_use_bonus: String(this.bounsCondition.least_money_to_use_bonus),
          max_reduce_bonus: String(this.bounsCondition.max_reduce_bonus),
          least_cost: String(this.pay.least_cost),
          reduce_cost: String(this.amountCoupon * 100),
          couponCode: this.pay.couponCode,
          couponId: String(this.pay.couponId),
          version: '3.0.0',
          url: window.location.href.split('#')[0]
        }
        para.bounsDeduct = this.bounSwitch ? String(this.deductibleAmount) : '';
        para.useBouns = this.bounSwitch ? String(this.bounsAvailable) : '';
        getPayInfoByMemCard(para).then((res) => {
          let {
            status,
            data,
            message
          } = res;
          if (status == 200) {
            this.payPassword = true;
            this.vipPay.deductTransId = data.deductTransId;
            this.vipPay.deductOrderId = data.deductOrderId;
            this.vipPay.amount = this.payAmount;
            this.vipPay.id = data.transId;
            this.vipPay.memId = data.memAccount.member_id;
            this.vipPay.pwd = data.checkPw;
            var out_trade_no = data.out_trade_no;
            sessionStorage.setItem('out_trade_no', JSON.stringify(out_trade_no));
            var orderType = "m";
            sessionStorage.setItem('orderType', JSON.stringify(orderType));
          } else {
            // 显示
            this.$vux.toast.show({
              text: '下单失败',
              type: 'warn',
              time: 6000,
              isShowMask: true
            })
          }
          // 隐藏
          this.$vux.loading.hide()
        })
      }

    },
    submitFormVIP() {
      // 显示
      this.$vux.loading.show({
        text: '请稍候'
      })
      let para = {
        id: String(this.vipPay.id),
        pwd: md5(this.vipPay.password + this.vipPay.pwd),
        memId: String(this.vipPay.memId),
        deductOrderId: String(this.vipPay.deductOrderId),
        deductTransId: String(this.vipPay.deductTransId)
      }
      updateMempayInfo(para).then((res) => {
        console.log(res);
        let {
          status,
          message
        } = res;
        if (status == 200) {
          this.$router.push({
            path: '/commer',
          });
        }
        // 隐藏
        this.$vux.loading.hide()
      })
    },
    //初始化方法
    Initialization() {
      // 显示
      this.$vux.loading.show({
        text: '请稍候'
      })
      let para = {
        openCode: (!querystring.parse().code || querystring.parse().code == '') ? '' : querystring.parse().code,
        state: (!querystring.parse().state || querystring.parse().state == '') ? '' : querystring.parse().state,
        eid: (!querystring.parse().eid || querystring.parse().eid == '') ? '' : querystring.parse().eid,
        mid: (!querystring.parse().mid || querystring.parse().mid == '') ? '' : querystring.parse().mid,
        sid: querystring.parse().entType == 2 ? querystring.parse().sid : '',
        cardCode: (!querystring.parse().cardCode || querystring.parse().cardCode == '') ? '' : querystring.parse().cardCode,
        cardOpenId: (!querystring.parse().cardOpenId || querystring.parse().cardOpenId == '') ? '' : querystring.parse().cardOpenId,
        cardId: (!querystring.parse().cardId || querystring.parse().cardId == '') ? '' : querystring.parse().cardId,
        type: (!querystring.parse().type || querystring.parse().type == '') ? '' : querystring.parse().type,
        scene: 'W',
        entType: (!querystring.parse().entType || querystring.parse().entType == '') ? '' : querystring.parse().entType,
        isInitCode: (!querystring.parse().openId || querystring.parse().openId == '') ? null : '1',
        payOpenId: querystring.parse().model == 'FT' ? querystring.parse().openid : querystring.parse().openId,
        model: (!querystring.parse().model || querystring.parse().model == '') ? '' : querystring.parse().model
      }
      getPayMemInfo(para).then((res) => {
        let {
          status,
          message
        } = res;
        this.ismem = res.data.ismem;
        this.title = res.data.storeName;
        //下单数据
        this.pay.oid = res.data.payOpenId;
        if (status == 200 && res.data.ismem) {
          this.discountText = res.data.discount;
          this.availableBalance = String(currency(res.data.balance));
          this.bouns = res.data.bouns;
          this.bounsRule.cost_bonus_unit = res.data.cost_bonus_unit;
          //单位元转化为分
          this.bounsRule.reduce_money = res.data.reduce_money;
          this.bounsCondition.least_money_to_use_bonus = res.data.least_money_to_use_bonus;
          this.bounsCondition.max_reduce_bonus = res.data.max_reduce_bonus;
        } else if (status == 200 && !res.data.ismem) {
          this.discountText = res.data.discount;
          this.availableBalance = '0';
          this.bouns = '0';
          this.bounsRule.cost_bonus_unit = '0';
          //单位元转化为分
          this.bounsRule.reduce_money = '0';
          this.bounsCondition.least_money_to_use_bonus = '0';
          this.bounsCondition.max_reduce_bonus = '0';
        } else {
          this.$router.push({
            path: '/err'
          })
        }
        // 隐藏
        this.$vux.loading.hide()
      })
    },
    //积分抵现Switch
    bounsClick(newVal, oldVal) {
      //如果开关不可用，提示*****
      if (!this.ismem) {
        this.$vux.toast.text('您还不是会员', 'bottom')
        return
      }
      if (this.bounsDisabled) {
        this.$vux.toast.text('请输入金额', 'bottom')
        //否则如果输入金额小于“满多少金额可用”，提示****
      } else if (currency(this.consumeAmount).multiply(this.discountText) < this.bounsCondition.least_money_to_use_bonus / 100) {
        this.$vux.toast.text('满' + this.bounsCondition.least_money_to_use_bonus / 100 + '元可用', 'bottom')
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
      if (!this.ismem) {
        this.$vux.toast.text('您还不是会员', 'bottom')
        return
      }
      //如果开关置灰，表示金额未输入
      if (this.balanceDisabled) {
        this.$vux.toast.text('请输入金额', 'bottom')
      } else {
        //如果余额小于输入的金额，则提示
        if (parseInt(this.payAmount) >= parseInt(this.availableBalance)) {
          this.$vux.toast.text('余额不足，请充值', 'bottom')
        } else {
          //开关打开，选择会员支付或微信支付
          this.balance = newVal
          if (newVal) {
            this.payment = "会员支付";
          } else {
            this.payment = "微信支付";
          }
        }
      }
    },
    //点击优惠券调用方法
    integralClick() {
      if (this.payAmount == '0.00') {
        return this.$vux.toast.text('请检查金额', 'bottom');
      }
      // 显示
      this.$vux.loading.show({
        text: '加载中'
      })
      let para = {
        amount: String(currency(this.consumeAmount).multiply(this.discountText)),
        mid: (!querystring.parse().mid || querystring.parse().mid == '') ? '' : querystring.parse().mid,
        cardOpenId: (!querystring.parse().cardOpenId || querystring.parse().cardOpenId == '') ? '' : querystring.parse().cardOpenId
      }
      queryCoupon(para).then((res) => {
        let {
          status,
          data,
          message
        } = res
        if (status == 200) {
          this.integralShow = true;
          this.payAmount = String(currency(this.payAmount).add(this.amountCoupon));
          this.inlineDescList = data.wdCouponList;
        }
        // 隐藏
        this.$vux.loading.hide()
      })
    },
    integralSubmilt(value) {
      this.integralShow = false;
      if (!value) {
        this.$refs.redCoupon.style.color = '#666';
        this.coupon = "未使用";
        this.amountCoupon = '';
      } else {
        this.pay.least_cost = value.cash_least_cost;
        this.pay.couponCode = value.code;
        this.pay.couponId = value.id;

        this.$refs.redCoupon.style.color = '#f74c31';
        this.coupon = "￥-" + currency(value.cash_reduce_cost / 100);
        this.amountCoupon = value.cash_reduce_cost / 100;
        this.payAmount = String(currency(this.payAmount).subtract(this.amountCoupon));
        this.consumeAmountDeputy();
      }
    },
    severalAvailable(cb) {
      let para = {
        amount: cb,
        mid: (!querystring.parse().mid || querystring.parse().mid == '') ? '' : querystring.parse().mid,
        cardOpenId: (!querystring.parse().cardOpenId || querystring.parse().cardOpenId == '') ? '' : querystring.parse().cardOpenId
      }
      queryCoupon(para).then((res) => {
        let {
          status,
          data,
          message
        } = res
        if (status == 200) {
          this.badgeText = data.wdCouponList.length + '张可用';
        }
      })
    },
    logomsg(msg) {
      this.bounSwitch = false;
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
      this.severalAvailable(String(_val));
      this.$refs.redCoupon.style.color = '#666';
      this.coupon = "未使用";
      this.amountCoupon = '';
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
.dialog_input {
    border: 1px solid #999;
    padding: 0;
    height: 35px;
    border-radius: 5px;
}
</style>
