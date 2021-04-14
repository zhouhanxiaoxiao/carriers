<template>
  <div>
    <div class="search-container">
      <input class="search-input" placeholder="e.g. pA110, EGFP" v-model="searchVal"/>
      <Button class="search-btn" type="warning" @click="searchAll">Search</Button>
    </div>

    <!-- 筛选条件开始 -->
    <Collapse simple style="text-align: left;display: block">
      <Panel name="1">
        Advanced screening
        <div slot="content">
          <Card style="width:100%" v-for="(group,ind) in filterGroups"
                :key="group.inde" :title="'filter group '  + (ind + 1)">
            <div slot="extra">
              <Select filterable :transfer="true" v-if="ind > 0" v-model="group.flag" style="width: 80px;">
                <Option value="and">and</Option>
                <Option value="or">or</Option>
              </Select>
              <Button v-if="ind === filterGroups.length - 1" type="primary" style="margin-left: 10px"
                      icon="md-add-circle" @click="addNewGroup">{{ "add new group " }}
              </Button>
              <Button v-if="ind > 0" type="error" icon="md-close-circle" style="margin-left: 10px"
                      @click="deleteGroup(group.inde)">{{ "delete group " }}
              </Button>
            </div>
            <div class="row" v-for="(item, index) in group.filters" :key="item.ind" style="margin-bottom: 10px">
              <div class="col-1">
                <Select filterable :transfer="true" v-if="index > 0" v-model="item.andOror">
                  <Option value="and">and</Option>
                  <Option value="or">or</Option>
                </Select>
              </div>
              <div class="col-5">
                <Select filterable :transfer="true" v-model="item.key">
                  <Option v-for="item in searchList" :key="item.field" :value="item.field">{{ item.field }}</Option>
                </Select>
              </div>
              <div class="col-1">
                <Select filterable :transfer="true" v-model="item.equals">
                  <Option value="equals">equals</Option>
                  <Option value="notEquals">not equals</Option>
                </Select>
              </div>
              <div class="col-4">
                <Select filterable :transfer="true" v-model="item.value">
                  <Option v-for="val in getValues(item)" :key="val" :value="val">{{ val }}</Option>
                </Select>
              </div>
              <div class="col-1">
                <Icon type="md-close-circle" v-if="index != 0" :size="30" style="cursor: pointer"
                      @click="deleteRow(item.ind,group)"/>&nbsp;
                <Icon type="md-add-circle" v-if="index == group.filters.length - 1" :size="30" style="cursor: pointer"
                      @click="addNewFileter(group)"/>
              </div>
            </div>
          </Card>
          <Divider/>
          <Row style="margin-bottom: 10px;text-align: right">
            <Button type="primary" @click="filterResult">{{ $t("confirm") }}</Button>&nbsp;
            <Button type="warning" @click="resetFilter">{{ $t("reset") }}</Button>
          </Row>
        </div>
      </Panel>
    </Collapse>
    <!-- 筛选条件结束 -->

    <!-- 搜索list 开始 -->
    <v-table-title>
      <p slot="title">Result List ({{this.carriers.length}})</p>
      <div slot="extra">
        <Poptip
            confirm
            :disabled="this.selectedCarriers.length === 0"
            :transfer="true"
            v-if="isVector"
            title="Are you sure you want to delete this list?"
            @on-ok="deleteSelect">
          <Button type="error" :disabled="this.selectedCarriers.length === 0">delete</Button>
        </Poptip>
      </div>
    </v-table-title>
    <Table stripe border :columns="cols" :data="carriers" style="width: 100%" @on-selection-change="selectItem">
      <template slot-scope="{ row }" slot="operator">
        <Button type="success" @click="showDetail(row.ID)" class="opt-btn">detail</Button>
        <Button type="info" @click="eidtDetail(row)" v-if="isVector" class="opt-btn">edit</Button>
        <Poptip
            confirm
            :transfer="true"
            v-if="isVector"
            title="Are you sure you want to delete this item?"
            @on-ok="deleteOk(row.ID)">
          <Button type="error" class="opt-btn">delete</Button>
        </Poptip>
      </template>
    </Table>
    <!-- 搜索list 结束 -->

    <!-- 编辑抽屉 -->
    <Drawer title="edit"
            width="600"
            :mask-closable="false"
            :closable="true"
            v-model="editFlag">
      <Form>
        <Row :gutter="32">
          <i-col span="12" v-for="(value, name) in editCarr" :key="name">
            <FormItem :label="name" label-position="top">
              <Input v-model="editCarr[name]"/>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <Divider></Divider>
      <div style="margin-bottom: 20px">
        <Button style="margin-right: 8px" @click="editFlag = false">Cancel</Button>
        <Button type="primary" @click="submitEdit">Submit</Button>
        <Upload :action="getReplaceUrl" style="float: right" :data="uploadData" name="file" accept=".zip"
                @on-success="uploadBack">
          <Tooltip :content="$t('.zip文件包含.gb和.dna')" :transfer="true" placement="top-end">
            <Button icon="ios-cloud-upload-outline" type="error">replace .gb and .dna</Button>
          </Tooltip>
        </Upload>
      </div>
    </Drawer>
    <v-loading :show="loading"></v-loading>
  </div>
</template>

<script>
import VLoading from "@/components/public/v-loading";
import {v4 as uuidv4} from 'uuid';
import VTableTitle from "@/components/public/v-tableTitle";

export default {
  name: "carriersList",
  components: {VTableTitle, VLoading},
  props: {},
  data: function () {
    return {
      searchResult: {},
      searchVal: "",
      loading: false,
      carriers: [],
      cols: [],
      currentPage: 0,
      pageSize: 0,
      total: 0,
      editFlag: false,
      editCarr: {},
      editId: "",
      searchList: [],
      carriersOld: [],
      selectedCarriers: [],
      filterGroups: [
        {
          filters: [{
            ind: uuidv4(),
            andOror: "",
            key: "",
            equals: "",
            value: ""
          }],
          inde: uuidv4(),
          flag: ""
        }
      ],

    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    uploadBack : function (response, file, fileList){
      console.log(response, file, fileList);
    },
    deleteSelect: function () {
      var ids = new Array();
      this.selectedCarriers.map(item => ids.push(item.ID));
      var postData = {
        ids: JSON.stringify(ids)
      }
      this.loading = true;
      var _this = this;
      this.$axios.post("/home/deleteList", postData).then(function (res) {
        _this.loading = false;
        _this.$Message.success("delete success! count:" + res.data.retMap.count);
        _this.initPage();
      }).catch(function (res) {
        console.log(res)
        _this.loading = false;
        _this.$Message.error("system error!");
      });
    },
    selectItem: function (selection) {
      this.selectedCarriers = selection;
    },
    resetFilter: function () {
      this.filterGroups = [
        {
          filters: [{
            ind: uuidv4(),
            andOror: "",
            key: "",
            equals: "",
            value: ""
          }],
          inde: uuidv4(),
          flag: ""
        }
      ];
      this.carriers = this.carriersOld;
    },
    addNewGroup: function () {
      this.filterGroups.push({
        filters: [{
          ind: uuidv4(),
          andOror: "",
          key: "",
          equals: "",
          value: ""
        }],
        inde: uuidv4(),
        flag: "and"
      })
    },
    getValues: function (filter) {
      if (filter.key == "") {
        return [];
      }
      for (var index in this.searchList) {
        if (this.searchList[index].field == filter.key) {
          return this.searchList[index].values;
        }
      }
    },
    addNewFileter: function (group) {
      group.filters.push({
        ind: uuidv4(),
        andOror: "",
        key: "",
        equals: "",
        value: ""
      });
    },
    deleteGroup: function (inde) {
      var tmp = [...this.filterGroups];
      this.filterGroups = tmp.filter(item => item.inde !== inde);
    },
    deleteRow: function (ind, group) {
      var tmp = [...group.filters];
      group.filters = tmp.filter(item => item.ind !== ind);
    },
    filterResult: function () {
      var groupResultTmp = new Array();
      var groupSetTmp = {};
      for (var i = 0; i < this.filterGroups.length; i++) {
        var group = this.filterGroups[i];
        var tmplist = [...this.carriersOld];
        var groupResultSet = {};
        var groupList = [];
        for (var j = 0; j < group.filters.length; j++) {
          var result = new Array();
          var filter = group.filters[j];
          if (filter.andOror === "or") {
            if (tmplist.length > 0) {
              tmplist.map(item => {
                if (groupResultSet[item.ID] === undefined) {
                  groupResultSet[item.ID] = item;
                  groupList.push(item);
                }
              })
            }
            tmplist = [...this.carriersOld];
          }
          for (var index in tmplist) {
            var tmpCarrier = tmplist[index];
            if (filter.equals === "equals") {
              if (tmpCarrier[filter.key] === filter.value) {
                result.push(tmpCarrier);
              }
            } else {
              if (tmpCarrier[filter.key] !== filter.value) {
                result.push(tmpCarrier);
              }
            }
          }
          tmplist = result;
        }
        if (tmplist.length > 0) {
          tmplist.map(item => {
            if (groupResultSet[item.ID] === undefined) {
              groupResultSet[item.ID] = item;
              groupList.push(item);
            }
          })
        }
        if (i > 0) {
          if (group.flag === "and") {
            var tmpGroupList = new Array();
            var tmpSet = {};
            for (var item in groupResultSet) {
              if (groupSetTmp[item] !== undefined) {
                tmpGroupList.push(groupSetTmp[item]);
                tmpSet[item] = groupSetTmp[item];
              }
            }
            groupResultTmp = tmpGroupList;
            groupSetTmp = tmpSet;
          } else {
            var orTmpList = new Array();
            for (var orItem in groupResultSet) {
              if (groupSetTmp[orItem] === undefined) {
                orTmpList.push(groupSetTmp[orItem]);
                groupSetTmp[orItem] = groupResultTmp[orItem];
              }
            }
            groupResultTmp = [...groupResultTmp, ...orTmpList];
          }
        } else {
          groupResultTmp = groupList;
          groupSetTmp = groupResultSet;
        }
      }
      this.carriers = groupResultTmp;
    },
    compare: function (car) {
      var isAllEmpty = true;
      for (var item in this.searchResult) {
        for (var i = 0; i < this.searchResult[item].length; i++) {
          isAllEmpty = false;
          if (car[item] === this.searchResult[item][i]) {
            return true;
          }
        }
      }
      if (isAllEmpty) {
        return true;
      }
      return false;
    },
    searchAll: function () {
      this.initPage();
    },
    submitEdit: function () {
      this.editCarr.id = this.editId;
      var postData = {
        carrier: JSON.stringify(this.editCarr)
      }
      this.loading = true;
      var _this = this;
      this.$axios.post("/snapGene/commitCarrier", postData).then(function (res) {
        _this.loading = false;
        _this.editFlag = false;
        console.log(res);
        _this.initPage();
        _this.$Message.success("submit success");
      }).catch(function (res) {
        _this.loading = false;
        _this.editFlag = false;
        _this.$Message.error("system error!");
        console.log(res);
      })
    },
    deleteOk: function (id) {
      console.log(id);
      this.loading = true;
      var postData = {
        fileId: id
      };
      var _this = this;
      this.$axios.post("/snapGene/deleteCarrier", postData).then(function (res) {
        console.log(res);
        _this.loading = false;
        _this.$Message.success("delete success");
        _this.initPage();
      }).catch(function (res) {
        _this.loading = false;
        console.log(res);
      })
    },
    eidtDetail: function (row) {
      this.editId = row.ID;
      for (var name in row) {
        if (name == "_id" || name == "ID" || name == "_index" || name == "_rowKey" || name == "id") {
          continue;
        }
        this.editCarr[name] = row[name];
      }
      this.editFlag = true;
    },
    showDetail: function (id) {
      this.$router.push({name: "carrier", query: {id: id}});
    },
    initPage: function () {
      this.initCols();
      var postData = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        searchVal: this.searchVal
      }
      var _this = this;
      this.loading = true;
      this.$axios.post("/home/initPage", postData).then(function (res) {
        console.log(res)
        _this.loading = false;
        _this.carriers = res.data.retMap.carriers;
        _this.carriersOld = res.data.retMap.carriers;
        _this.total = res.data.retMap.total;
        _this.searchList = res.data.retMap.searchList;
        for (var i = 0; i < _this.searchList.length; i++) {
          var sec = _this.searchList[i];
          _this.searchResult[sec.field] = new Array();
        }
      }).catch(function (res) {
        _this.loading = false;
        console.log(res);
      })
    },
    initCols: function () {
      var cols = new Array();

      cols.push({
        type: 'selection',
        width: 60,
        align: 'center'
      });
      cols.push({
        type: 'index',
        width: 60,
        align: 'center'
      })
      cols.push({
        title: this.$t("CAT"),
        key: "CAT",
        width: 100,
        sortable: true
      });
      cols.push({
        title: this.$t("NAME"),
        key: "NAME",
        sortable: true
      })
      cols.push({
        title: this.$t("ADDGENE"),
        key: "ADDGENE",
        width: 120,
        sortable: true
      })
      cols.push({
        title: this.$t("PROMOTER"),
        key: "PROMOTER",
        width: 150,
        sortable: true
      })
      cols.push({
        title: this.$t("EXPRESSIONCASSETTE表达框"),
        key: "EXPRESSIONCASSETTE表达框",
        sortable: true
      })
      cols.push({
        title: this.$t("operator"),
        slot: "operator",
        width: 250,
      })
      this.cols = cols;
    }
  },
  computed: {
    isVector: function () {
      if (this.$store.getters.getName === undefined) {
        return false;
      }
      if (this.$store.getters.isVector && this.$store.getters.isReviewer) {
        return true;
      } else {
        return false;
      }
    },
    getReplaceUrl: function () {
      return this.$axios.defaults.baseURL + "/snapGene/replaceDna"
    },
    uploadData: function () {
      return {
        id: this.editId
      }
    }
  }
}
</script>

<style scoped>
.opt-btn {
  display: inline-block;
  margin: 2px 2px;
}

.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}

.search-container {
  display: inline-block;
  width: 60%;
  height: 10vh;
  border: 1px solid darkgray;
  border-radius: 10px;
  line-height: 10vh;
  margin-top: 4vh;
  text-align: left;
  margin-bottom: 50px;
}

.search-input {
  display: inline-block;
  width: 80%;
  height: 80%;
  border: none;
  outline: none;
  margin-left: 5%;
}

.search-btn {
  display: inline-block;
  width: 10%;
  height: 6vh;
  font-size: 16px;
}
</style>