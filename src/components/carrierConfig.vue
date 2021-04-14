<template>
  <div>
    <carrier-nav></carrier-nav>
    <div
        style="width: 90%;margin-left: 5%;background-color: white;border-radius: 10px;margin-top: 20px;padding: 10px 10px;">
      <div class="accordion" id="accordionExample">
        <div class="card">
          <div class="card-header" id="headingOne">
            <h2 class="mb-0">
              <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse"
                      data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                展示项配置
              </button>
            </h2>
          </div>

          <div id="collapseOne" class="collapse show row" aria-labelledby="headingOne" data-parent="#accordionExample"
               style="padding: 10px 10px">
            <div class="card-body">
              <div class="form-check form-check-inline col-4 col-sm-4 col-md-3 col-lg-2 col-xl-2" style="width: 100%"
                   v-for="item in show" :key="item.field">
                <input class="form-check-input" type="checkbox" :id="item.field" v-model="item.pageshow"
                       style="cursor: pointer"
                       @click="showText(item.pageshow)">
                <label class="form-check-label" :for="item.field" style="cursor: pointer">{{ item.field }}</label>
              </div>
              <div class="modal-footer" style="margin-top: 10px">
                <button type="button" class="btn btn-primary btn-sm" @click="saveShowList" :disabled="pageBtnDisabled">
                  {{ pageBtnText }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header" id="headingTwo">
            <h2 class="mb-0">
              <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
                      data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                导出配置
              </button>
            </h2>
          </div>
          <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
            <div class="card-body">
              <h3>first table</h3>
              <div class="form-check form-check-inline col-4 col-sm-4 col-md-3 col-lg-2 col-xl-2" style="width: 100%"
                   v-for="item in pdfFixList" :key="item.field">
                <input class="form-check-input" type="checkbox" :id="item.field + '1'" v-model="item.pdfposition"
                       style="cursor: pointer" @click="selectFix(item)">
                <label class="form-check-label" :for="item.field + '1'" style="cursor: pointer">{{ item.field }}</label>
              </div>

              <h3 style="margin-top: 50px">Basic information 基本信息</h3>
              <div class="form-check form-check-inline col-4 col-sm-4 col-md-3 col-lg-2 col-xl-2" style="width: 100%"
                   v-for="item in pdfActivityList" :key="item.field">
                <input class="form-check-input" type="checkbox" :id="item.field + '2'" v-model="item.pdfposition"
                       style="cursor: pointer" @click="selectActivity(item)">
                <label class="form-check-label" :for="item.field + '2'" style="cursor: pointer">{{ item.field }}</label>
              </div>
              <div class="modal-footer" style="margin-top: 10px">
                <button type="button" class="btn btn-primary btn-sm" @click="saveShowConfig" :disabled="pdfBtnDisabled">
                  {{ pdfBtnText }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header" id="headingThree">
            <h2 class="mb-0">
              <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse"
                      data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                上传
              </button>
            </h2>
          </div>
          <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
            <div class="card-body">
              <form id="fileForm" method="post" :action="fileAciton" enctype="multipart/form-data" target='ifr'>
                <div class="form-group">
                  <label for="gbs">请选择包含.gb和.dna文件的.zip压缩包</label>
                  <input type="file" accept=".zip" multiple="false" class="form-control-file" id="gbs" name="all">
                </div>
                <div class="form-group">
                  <label for="dnas">请选择描述文件Excel</label>
                  <input type="file" accept=".xlsx" multiple="true" class="form-control-file" id="dnas" name="excl">
                </div>
                <button @click="submit" class="btn btn-primary mb-2">confirm</button>
              </form>
              <iframe name='ifr' id="ifr" style='display: none;'></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import CarrierNav from "@/components/public/carrierNav";
import VLoading from "@/components/public/v-loading";

export default {
  name: "carrierConfig",
  components: {VLoading, CarrierNav},
  data: function () {
    return {
      loading: false,
      ddd: "111",
      show: [],
      pdfFixList: [],
      pdfActivityList: [],
      pageBtnDisabled: false,
      pageBtnText: "save changes",
      pdfBtnDisabled: false,
      pdfBtnText: "save changes"
    }
  },
  mounted: function () {
    this.initPage();
    var iframe = document.getElementById("ifr");
    var _this = this;
    iframe.onload= function () {
      _this.loading = false;
      var bodycontent= window.frames["ifr"].document.body.innerText;
      console.log(bodycontent);
      if (bodycontent.indexOf("success") != -1){
        _this.$Message.success("上传成功！");
      }else {
        _this.$Modal.warning({
          title: "导入异常",
          content: bodycontent
        });
      }
    }
  },
  methods: {
    submit :function (){
      this.loading = true;
      this.$("#fileForm").submit();
      return false;
    },
    initPage: function () {
      var _ = this;
      this.$axios.post("/snapGene/adminInit").then(function (res) {
        res = res.data;
        console.log(res);
        _.show = res.showList;
        _.pdfFixList = JSON.parse(JSON.stringify(res.showList));
        _.pdfActivityList = JSON.parse(JSON.stringify(res.showList));
        if (_.pdfFixList != undefined && _.pdfFixList.length > 0) {
          for (var item in _.pdfFixList) {
            if (_.pdfFixList[item].pdfposition == 'fix') {
              _.pdfFixList[item].pdfposition = true;
            } else {
              _.pdfFixList[item].pdfposition = false;
            }
          }
        }
        if (_.pdfActivityList != undefined && _.pdfActivityList.length > 0) {
          for (var sub in _.pdfActivityList) {
            if (_.pdfActivityList[sub].pdfposition == 'activity') {
              _.pdfActivityList[sub].pdfposition = true;
            } else {
              _.pdfActivityList[sub].pdfposition = false;
            }
          }
        }
      }).catch(function (res) {
        console.log(res);
        _.$Message.error("system error");
      });
    },
    selectFix: function (flag) {
      console.log(flag.pdfposition);
      if (!flag.pdfposition) {
        for (var i = 0; i < this.pdfActivityList.length; i++) {
          var activityItem = this.pdfActivityList[i];
          if (activityItem.field === flag.field) {
            activityItem.pdfposition = false;
          }
        }
      }
    },
    selectActivity: function (flag) {
      console.log(flag.pdfposition);
      if (!flag.pdfposition) {
        for (var i = 0; i < this.pdfFixList.length; i++) {
          var fixItem = this.pdfFixList[i];
          if (fixItem.field === flag.field) {
            fixItem.pdfposition = false;
          }
        }
      }
    },
    showText: function (text) {
      console.log(text);
    },
    saveShowList: function () {
      var _ = this;
      this.loading = true;
      this.$axios.post("/snapGene/saveShowList",{showList: JSON.stringify(_.show)}).then(function (res){
        console.log(res);
        _.loading = false;
        _.pageBtnDisabled = false;
        _.pageBtnText = "save changes"
        _.$Message.success("commit success！");
        _.initPage();
      }).catch(function (res){
        console.log(res);
        _.pageBtnDisabled = false;
        _.pageBtnText = "save changes"
        _.$Message.error("system error");
      })
    },
    saveShowConfig: function () {
      var postData = {
        fixList: JSON.stringify(this.pdfFixList),
        activityList: JSON.stringify(this.pdfActivityList)
      }
      var _ = this;
      this.pdfBtnDisabled = true;
      this.pdfBtnText = "submitting....";
      this.loading = true;
      this.$axios.post("/snapGene/savePdfConfig",postData).then(function (res){
        console.log(res);
        _.loading = false;
        _.pdfBtnDisabled = false;
        _.pdfBtnText = "save changes";
        _.$Message.success("commit success！");
        _.initPage();
      }).catch(function (res){
        _.loading = false;
        console.log(res);
        _.pdfBtnDisabled = false;
        _.pdfBtnText = "save changes";
        // alert("系统异常，admin150");
        _.$Message.error("system error");
      })
    }
  },
  computed : {
    fileAciton : function (){
      return this.$axios.defaults.baseURL + "/snapGene/load_gb_data"
    }
  }
}
</script>

<style scoped>

</style>