<template>
<div id="app">
  <router-view/>
</div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

p {
  margin: 0;
}

.dialog_input input {
  height: 35px;
}
</style>
