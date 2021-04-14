<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
    <div class="virBak-lb"></div>
    <div class="virBak-lt"></div>
    <div class="virBak-rb"></div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  beforeMount() {
    this.$store.commit("saveUser", this.$cookies.get("user"));
  }
}
</script>

<style>
#app {
  font-family: Roboto,helvetica neue,HelveticaNeue,liberation sans,Arimo,Helvetica,Arial,sans-serif,dejavu_sans,symbola;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.virBak-rb{
  height: 1000px;
  width: 1000px;
  position: fixed;
  right: -200px;
  bottom: -300px;
  background: url("./assets/backVir.png") no-repeat;
  background-size: contain;
  opacity: 0.1;
  z-index: -99;
}
.virBak-lb{
  height: 300px;
  width: 300px;
  position: fixed;
  left: -50px;
  bottom: -50px;
  background: url("./assets/backVir.png") no-repeat;
  background-size: contain;
  opacity: 0.1;
  z-index: -99;
}
.virBak-lt{
  height: 500px;
  width: 500px;
  position: fixed;
  left: -250px;
  top: -250px;
  background: url("./assets/backVir.png") no-repeat;
  background-size: contain;
  opacity: 0.1;
  z-index: -99;
}
</style>
