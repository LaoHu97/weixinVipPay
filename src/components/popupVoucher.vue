<template lang="html">
  <div class="">
    <!-- <tab>
      <tab-item selected @on-item-click="onItemClick">可用优惠券</tab-item>
      <tab-item @on-item-click="onItemClick">不可用优惠券</tab-item>
    </tab> -->
    <checker v-model="inlineDescListValue" default-item-class="demo-item" selected-item-class="demo-item-selected" disabled-item-class="demo-item-disabled">
      <checker-item :value="item" v-for="(item, index) in inlineDescList" :key="index" @on-item-click="onItemCheckerClick" style="margin-top:15px;">
        <div class="checker_item_left">
          <icon type="circle"></icon>
        </div>
        <div class="checker_item_right">
          <flexbox>
            <flexbox-item :span="4">
              <div class="amount">
                <span>￥</span>{{item.cash_reduce_cost/100}}
              </div>
            </flexbox-item>
            <flexbox-item>
              <div class="text">
                  <div>
                    <em>折扣券</em>
                    <span>{{item.title}}</span>
                  </div>
                  <p>{{item.start_time}} - {{item.end_time}}</p>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </checker-item>
    </checker>
    <div style="padding: 15px;">
      <x-button @click.native="integralSubmilt" type="primary">确认</x-button>
    </div>
  </div>
</template>

<script>
import {
  dateFormat
} from 'vux'
import {
  Tab,
  TabItem,
  Divider,
  XButton,
  Checker,
  CheckerItem,
  Flexbox,
  FlexboxItem,
  Icon
} from 'vux'
export default {
  components: {
    Tab,
    TabItem,
    Divider,
    XButton,
    Checker,
    CheckerItem,
    Flexbox,
    FlexboxItem,
    Icon,
  },
  data() {
    return {
      inlineDescListValue: ''
    }
  },
  props: {
    /**
     * [inlineDescList description]
     * @type {[type=Array]}
     */
    inlineDescList: Array
  },
  methods: {
    onItemCheckerClick(itemValue, itemDisabled) {

    },
    onItemClick(index) {
      console.log(index);
    },
    integralSubmilt() {
      // console.log(.length);
      if (this.inlineDescList.length) {
        let value = this.inlineDescListValue;
        this.$emit('integralSubmilt', value);
      } else {
        let value = '';
        this.$emit('integralSubmilt', value);
      }
    }
  },
  mounted() {

  }
}
</script>

<style lang="css">
.vux-tab .vux-tab-item.vux-tab-selected {
    color: #FF9900;
    border-bottom: 3px solid #FF9900;
}
.demo-item {
    width: 100%;
    height: 120px;
}

.demo-item .checker_item_left {
    display: inline-block;
    height: 120px;
    line-height: 120px;
    width: 10%;
}
.demo-item .checker_item_right {
    height: 100%;
    width: 85%;
    float: right;
    background-color: #FFBE00;
    -webkit-filter: grayscale(100%);
    opacity: 0.8;
    margin-right: 15px;
    border-radius: 5px;
}
.demo-item-selected .checker_item_left i {
    color: #09BB07;
}
.demo-item-selected .checker_item_left .weui-icon-circle:before {
    content: "\EA06";
}
.demo-item-selected .checker_item_right{
  -webkit-filter: grayscale(0%);
  opacity: 1;
}
.amount{
  color: #fff;
  font-size:45px;
  line-height: 120px;
}
.amount span{
  font-size: 18px;
  line-height: 18px;
  display: block;
  float: left;
  margin-top: 40px;
}
.text{
  height: 120px;
  color: #fff;
}
.text em{
  background-color: #f00;
  font-size: 14px;
  font-style: normal;
  padding: 3px;
  border-radius: 5px;
}
.text div{
  padding-top: 32px;
}
.text p{
  font-size: 12px;
  padding-top: 20px;
}
</style>
