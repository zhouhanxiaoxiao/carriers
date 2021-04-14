<template>
  <nav class="navbar navbar-dark" style="background-color: #0483c8">
    <a class="navbar-brand" @click="goHome" style="display: inline-block;">
      <img src="../../assets/carrier.png" style="width: 200px" alt="">
    </a>
    <form class="form-inline my-2 my-lg-0">
<!--      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>-->
<!--      <Button type="success" size="large" @click="gotologin" v-if="!hasUser">login</Button>-->
<!--      <button class="btn btn-success" v-if="hasUser" @click="gotoAdmin">{{ "hello," + user.name }}</button>-->
      <div class="dropdown">
        <button class="btn btn-outline-light dropdown-toggle"
                type="button" id="dropdownMenuButton" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
          {{ $t("hello") + "，" + user.name}}
        </button>
        <div class="dropdown-menu dropdown-menu-right" style="font-size: 14px;line-height: normal">
          <a class="dropdown-item" @click="gotoAdmin" v-if="isCarrierUser">{{ $t("configuration") }}</a>
          <a class="dropdown-item" @click="casOut">{{ $t("exit") }}</a>
        </div>
      </div>
    </form>
    <v-loading :show="loading"></v-loading>
  </nav>
</template>

<script>
import util from "@/components/public/util";
import VLoading from "@/components/public/v-loading";

export default {
  name: "carrierNav",
  components: {VLoading},
  data : function (){
    return{
      user : {},
      loading : false
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      var _this = this;
      this.$axios.get("/home/user").then(function (res){
        console.log(res);
        _this.$cookies.set("user", res.data.retMap.user);
        _this.$store.commit("saveUser",res.data.retMap.user);
        _this.user = res.data.retMap.user;
      }).catch(function (res){
        console.log(res);
      })
    },
    casOut : function (){
      this.loading = true;
      window.open(util.casOutUrl);
      setTimeout(function (){
        window.location.reload();
      },5000);
    },
    goHome : function (){
      this.$router.push("/home");
    },
    gotologin : function (){
      var currentUrl = window.location.href;
      currentUrl = currentUrl.replaceAll(":","%3A").replaceAll("/","%2F");
      window.location.href = util.loginUrl + currentUrl;
    },
    gotoAdmin : function (){
      this.$router.push("/config");
    }
  },
  computed : {
    hasUser : function (){
      console.log(this.user.name)
      if (this.user.name != undefined){
        return true;
      }else {
        return false;
      }
    },
    isCarrierUser : function (){
      return this.$store.getters.isVector;
    }
  },
}
</script>

<style scoped>

</style>