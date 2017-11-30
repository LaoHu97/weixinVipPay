<template lang="html">
  <div class="">
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
      <x-button @click.native="integralSubmilt" type="primary">确认</x-button>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Divider, XButton, Checker, CheckerItem, Flexbox, FlexboxItem, Icon} from 'vux'
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
  data () {
    return {
      inlineDescListValue: [],
      inlineDescList: [{
          key: '1',
          value: '1',
          inlineDesc: 'Tiger is the king of mountain'
        },
        {
          key: '2',
          value: '2',
          inlineDesc: 'Lion is the king of woods'
        },
        {
          key: '3',
          value: '3'
        }
      ],
    }
  },
  methods: {
    onItemCheckerClick(itemValue, itemDisabled) {

    },
    onItemClick(index) {
      console.log(index);
    },
    integralSubmilt(){
      let value = this.inlineDescListValue;
      this.$emit('integralSubmilt',value);
    }
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
    margin-right: 15px;
}
.demo-item-selected .checker_item_left i {
    color: #09BB07;
}
.demo-item-selected .checker_item_left .weui-icon-circle:before {
    content: "\EA06";
}
</style>
