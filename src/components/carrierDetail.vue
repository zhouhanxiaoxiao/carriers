<template>
  <div style="width: 100%;">
    <carrier-nav></carrier-nav>
    <div style="width:90%;height: 650px;margin-left: 5%;margin-top: 3vh;">
      <carrier-map :gb-object="feature" :show-config-map="showConfigMap" :carrier="carrier"></carrier-map>
    </div>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import CarrierNav from "@/components/public/carrierNav";
import CarrierMap from "@/components/carrierMap";
import VLoading from "@/components/public/v-loading";

export default {
  name: "carrierDetail",
  components: {VLoading, CarrierMap, CarrierNav},
  data : function (){
    return{
      loading : false,
      feature : {},
      showConfigMap : {},
      carrier : {},
      id : "",
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    console.log(this.id);
    this.initPage();
  },
  methods : {
    initPage : function (){
      this.loading = true;
      var _this = this;
      this.$axios.post("/snapGene/initPage",{id : this.id}).then(function (res){
        console.log(res,"========= detail ======")
        _this.loading = false;
        _this.feature = res.data.feature
        _this.showConfigMap = res.data.showConfigMap
        _this.carrier = res.data.carrier
      }).catch(function (res){
        _this.loading = false;
        console.log(res);
      });
    }
  },
  watch : {
    getId(newVal){
      this.id = newVal;
      this.initPage();
    }
  },
  computed : {
    getId : function (){
      return this.$route.query.id;
    }
  }
}
</script>

<style scoped>

</style>