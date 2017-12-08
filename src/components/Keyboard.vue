<style scoped lang="less">
.keyboard {
    height: 280px;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background: white;
    z-index: 999;
    .done {
        height: 40px;
        background: #efeff4;
        border: 0.5px solid #999;
        border-right: none;
        border-left: none;
        padding-right: 10px;
        border-bottom: none;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .text-done {
            color: #007eff;
            font-size: 14px;
            font-weight: bolder;
        }
    }
    .list {
        height: 239.5px;
        padding: 8px 8px 0;
        background-color: #e7e7e7;
        .key:active {
            background: #d3d7e5;
        }
        .list_item {
            height: 20%;
            padding: 0 0 8px;
            .list_item_div {
                height: 100%;
            }
        }
        .key {
            height: 100%;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 1px 1px #888888;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            font-weight: bolder;
        }
        .key:nth-child(3n) {
            border-right: none;
        }
    }
}
.del {
    font-size: 28px;
}
.animated {
    animation-duration: 0.2s;
    animation-fill-mode: both;
}
@keyframes slideInDown {
    from {
        transform: translate3d(0, 0, 0);
        visibility: visible;
    }
    to {
        transform: translate3d(0, 100%, 0);
        display: none;
    }
}
@keyframes slideInUp {
    from {
        transform: translate3d(0, 100%, 0);
        visibility: visible;
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}
.slide-enter-active {
    animation-name: slideInUp;
}
.slide-leave-active {
    animation-name: slideInDown;
}
.icon-keyboard-delete {
    background-image: url("../assets/images/delete.png");
    background-size: 100%;
    width: 35px;
    height: 35px;
}
</style>
<template>
<transition name="slide">
  <div class="keyboard animated" v-show="show" @touchstart.stop.prevent="fn">
    <!-- 完成 按钮-->
    <div class="done">
      <p class="text-done" @touchstart="complete">完成</p>
    </div>
    <!-- 键盘区域 -->
    <div class="list">
      <flexbox class="list_item">
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('1')">1</div>
        </flexbox-item>
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('2')">2</div>
        </flexbox-item>
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('3')">3</div>
        </flexbox-item>
      </flexbox>
      <flexbox class="list_item">
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('4')">4</div>
        </flexbox-item>
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('5')">5</div>
        </flexbox-item>
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('6')">6</div>
        </flexbox-item>
      </flexbox>
      <flexbox class="list_item">
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('7')">7</div>
        </flexbox-item>
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('8')">8</div>
        </flexbox-item>
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('9')">9</div>
        </flexbox-item>
      </flexbox>
      <flexbox class="list_item">
        <flexbox-item class="list_item_div">
          <div class="key dot" @touchstart="typing('.')">.</div>
        </flexbox-item>
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('0')">0</div>
        </flexbox-item>
        <flexbox-item class="list_item_div">
          <div class="key" @touchstart="typing('')" style="box-shadow:none;background-color:#e7e7e7">
            <i class="icon-keyboard-delete"></i>
          </div>
        </flexbox-item>
      </flexbox>
    </div>

  </div>
</transition>
</template>
<script>
import {
  Flexbox,
  FlexboxItem,
  Divider
} from 'vux'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    Divider
  },
  props: ['show'],
  methods: {
    /*防止点击完成按钮左边的空白区域收起键盘*/
    fn() {},
    /*输入*/
    typing(val) {
      this.$emit('typing', val);
    },
    /*点击完成*/
    complete() {
      this.$emit('complete');
    }
  }
}
</script>
<style media="screen">
.list_item {
  height: 25%;
}
</style>
