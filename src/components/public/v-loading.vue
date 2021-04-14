<template>
  <div class="loading" v-if="isShow">
    <div style="display: inline-block;width: 20%;margin-top: 20px">
      <Alert>加载中....</Alert>
    </div>
    <svg class="svg-container">
      <path id="pulsar" stroke="rgba(0,155,155,1)"
            fill="none" stroke-width="3"
            stroke-linejoin="round"
            d="M0,90L250,90Q257,60 262,87T267,95 270,88 273,92t6,35 7,-60T290,127 297,107s2,-11 10,-10 1,1 8,-10T319,95c6,4 8,-6 10,-17s2,10 9,11h210" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "v-loading",
  props : {
    show : Boolean
  },
  beforeMount() {
    this.isShow = this.show;
  },
  data : function (){
    return {
      isShow : false
    }
  },
  watch:{
    show(newValue){
      console.log(newValue)
      this.isShow = newValue
    }
  }
}
</script>
<style scoped>
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
.load-div{
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
.svg-container{
  margin-top: 30px;
  margin-left: 30%;
}
.loading {
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  margin: 0 auto;
  padding: 0;
  text-align: center;
}
.loading svg {
  width: 100%;
  height: 100%;
}
.loading #pulsar {
  stroke-dasharray: 281;
  -webkit-animation: dash 2.5s infinite linear forwards;
  animation: dash 2.5s infinite linear forwards;
}
/*Animation*/

@-webkit-keyframes dash {
  from {
    stroke-dashoffset: 814;
  }
  to {
    stroke-dashoffset: -814;
  }
}
@keyframes dash {
  from {
    stroke-dashoffset: 814;
  }
  to {
    stroke-dashoffset: -814;
  }
}
</style>