<template>
  <div style="text-align: center;">
    <carrier-nav></carrier-nav>
    <div class="svg-container">
      <div style="width: 100%;margin-top: 5vh;padding:10px 5% ">
        <carriers-list></carriers-list>
      </div>
    </div>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import CarriersList from "@/components/carriersList";
import CarrierNav from "@/components/public/carrierNav";
import VLoading from "@/components/public/v-loading";
export default {
  name: "home",
  components: {VLoading, CarrierNav, CarriersList},
  data : function (){
    return{
      loading : false,
      searchVal : ""
    }
  },
  methods : {
    searchAll : function (){
      this.loading = true;
      var _this = this;
      var postData = {
        searchVal : this.searchVal
      }
      this.$axios.post("/home/search",postData).then(function (res){
        console.log(res);
      }).then(function (res){
        _this.loading = false;
        _this.$Message.error("system error");
        console.log(res);
      })
    }
  }
}
</script>

<style scoped>
.search-container{
  display: inline-block;
  width: 50%;
  height: 10vh;
  border: 1px solid darkgray;
  border-radius: 10px;
  line-height: 10vh;
  margin-top: 4vh;
  text-align: left;
}
.search-input{
  display: inline-block;
  width: 80%;
  height: 80%;
  border: none;
  outline:none;
  margin-left: 5%;
}
.search-btn{
  display: inline-block;
  width: 10%;
  height: 6vh;
  font-size: 16px;
}

</style>