<template lang="html">
<div class="error">
  <icon type="warn" is-msg></icon>
  <p>系统错误，请稍候再试！</p>
  <div>
    <span>西安万鼎网络科技有限公司</span>
  </div>
</div>
</template>

<script>
import {
  Box,
  Icon
} from 'vux'
export default {
  components: {
    Box,
    Icon
  }
}
</script>

<style lang="css">
.error{
  text-align: center;
  margin-top: 100px;
}
.error p{
  line-height: 52px;
  color: #999;
}
.error div{
  font-size: 12px;
  color: #999;
  position: fixed;
  bottom: 40px;
  width: 100%;
}
</style>
