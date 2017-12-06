<template>
<div class="center" v-bind:style="screenHeight">
  <box class="success">
    <icon type="success" is-msg></icon>
    <span>消费成功</span>
  </box>
  <p class="title">{{mname}}</p>
  <form-preview header-label="付款金额" :header-value="amount" :body-items="list" class="preview"></form-preview>
  <box gap="20px 10px">
    <x-button type="primary" @click.native="submit()">完成</x-button>
  </box>
  <img :src="adUrl" alt="" width="100%" class="bottom-img">
</div>
</template>
<script>
import {
  FormPreview,
  Icon,
  Box,
  XButton
} from 'vux'
export default {
  components: {
    FormPreview,
    Icon,
    Box,
    XButton
  },
  data() {
    return {
      screenHeight: {
        height: ""
      },
      list: [],
      amount: '',
      mname: '',
      adUrl: ''
    }
  },
  methods: {
    submit() {
      this.$wechat.closeWindow();
    }
  },
  mounted() {
    if (window.innerHeight < 550) {
      this.screenHeight.height = "550px"
    } else {
      this.screenHeight.height = window.innerHeight + "px";
    };
    let orderid = JSON.parse(sessionStorage.getItem('out_trade_no'));
    let orderType = JSON.parse(sessionStorage.getItem('orderType'));
    var that = this;
    that.$http({
      method: 'post',
      url: COURSES + '/ad/queryAd',
      data: {
        'orderid': String(orderid),
        'orderType': String(orderType)
      }
    }).then(function(res) {
      let {
        status
      } = res.data;
      if (status == 200) {
        that.list = res.data.data.itemsList;
        that.amount = "￥" + res.data.data.amount;
        that.mname = res.data.data.mname;
        that.adUrl = res.data.data.adUrl;
      } else {

      }
    });
  }
}
</script>
<style media="screen">
.center {
  background-color: #eee;
  position: relative;
}

.center .title {
  text-align: center;
  font-size: 20px;
  margin: 0 10px;
  background-color: #fff;
  padding: 15px 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.center .preview {
  margin: 0 10px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

.success {
  text-align: center;
  font-size: 18px;
  color: #09BB07;
  font-weight: bolder;
  padding: 10px 0 10px 0;
}

.success .weui-icon_msg {
  font-size: 23px;
}

.copyright {
  text-align: center;
  font-size: 14px;
  color: #999;
  padding-bottom: 2px;
}

.bottom-img {
  position: fixed;
  bottom: 0;
}
</style>
