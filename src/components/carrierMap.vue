<template>
  <div style="width: 100%;height: 90vh;min-height: 650px">
    <div class="svg-container" style="display: inline-block;width: 70%;height: 100%;">
      <svg id="carrierSvg" xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
           style="width: 100%;height: 100%">
        <defs id="textLine">
          <!--   刻度path     -->
          <path v-for="item in rulerPaths" :d="item.d" :id="item.id" :key="item.id"></path>
          <path v-for="item in defsList" :key="item"
                :d="item.d" :id="item.id"></path>
        </defs>
        <text id="trackName" :transform="trackNameTrans" :font-size="titleFontSize">{{ trackName }}</text>
        <text id="titleDesc" :transform="titleDescTrans" :font-size="titleFontSize">{{ titleDesc }}</text>
        <g id="mainContainer" :transform="cTrans">
          <!--        <circle :cx="cx" :cy="cy" :r="r"-->
          <!--                stroke="black"-->
          <!--                id="testCir"-->
          <!--                stroke-width="3"-->
          <!--                stroke-linecap="butt"-->
          <!--                fill="transparent"/>-->
          <path :d="circle" stroke="black" fill="transparent" stroke-linecap="butt" stroke-width="3"></path>
          <!--    刻度text    -->
          <path v-for="item in rulerItems" :key="item.d"
                :d="item.d" stroke="black" fill="transparent" stroke-width="2"></path>
          <text font-size="10px" v-for="item in rulerTexts" :key="item.id">
            <textPath :xlink:href="item.href">{{ item.text }}</textPath>
          </text>

          <path v-for="item in featureList" :id="item.id" :label="item.label" :d="item.d" :key="item"
                :fill="item.fill" stroke="black" stroke-width="1" class="show-detail"
                @click="showDetail(item.feature)"
                style="cursor: pointer"></path>
          <text font-size="12px" v-for="item in featureTitleList" :key="item">
            <textPath :id="item.id" :xlink:href="item.href">{{ item.realText }}</textPath>
          </text>
        </g>
      </svg>
    </div>
    <div class="right-detail">
      <!--      <Form label-position="left" :label-width="100">-->
      <!--        <FormItem v-for="item in carrierDetailList" :key="item.field" :label="item.field">-->
      <!--          <div>{{item.val}}</div>-->
      <!--        </FormItem>-->
      <!--      </Form>-->
      <Card title="detail" icon="ios-options" :padding="0" style="width: 100%;">
        <Button slot="extra" type="primary" @click="downlondPDF">export</Button>
        <Cell v-for="item in carrierDetailList" :key="item.field" :title="item.field">
          <input slot="extra"  :value="item.val" />
        </Cell>
      </Card>
      <card title="sequence" style="width: 100%;">
        <Button slot="extra" type="primary" @click="downloadDna">download .dna</Button>
        <div style="width: 100%;word-break:break-all;">
          {{ gbObject.seq }}
        </div>
      </card>
    </div>
    <Drawer title="Detail"
            width="500"
            :closable="false"
            v-model="showFeature">.
      <div style="width: 100%;border-bottom: 1px solid darkgray" v-for="(value, name) in featureDetail" :key="name">
        <Row>
          <i-col span="12" style="font-size: 16px">{{name}}</i-col>
          <i-col span="12" style="font-size: 16px">{{value}}</i-col>
        </Row>
      </div>

    </Drawer>
  </div>
</template>

<script>
import util from "@/components/public/util";

export default {
  name: "carrierMap",
  props: {
    gbObject: Object,
    showConfigMap: Object,
    carrier: Object
  },
  data: function () {
    return {
      showFeature : false,
      featureDetail : {},
      cTrans: "",
      cx: 0,
      cy: 0,
      useH: 0,
      useW: 0,
      r: 0,//圆半径
      width: 10,// 元件宽度
      maxArrow: 100, // 箭头最大长度
      seq: "",// 序列字符串
      title: "",
      features: [], //元件列表
      trackHeight: 35,
      textFontSize: 12,
      map: {},
      fileMap: {},
      searchList: {},

      defsList: [],
      featureList: [],
      featureTitleList: [],
      mainTrans: "",

      trackName: "",
      titleDesc: "",
      trackNameTrans: "",
      titleDescTrans: "",
      titleFontSize: "16px",


      rulerPaths: [],
      rulerTexts: [],
      rulerItems: [],
      circle: "",
      carrierDetailList: []
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    showDetail :function (feature){
      this.featureDetail = feature;
      this.showFeature = true;
    },
    downloadDna : function (){
      var postData = {
        fileId :  this.carrier.ID
      }
      util.downLoad(postData,"/snapGene/downLoad", this.carrier.CAT + "_" + this.carrier.NAME + ".dna");
    },
    downlondPDF : function (){
      var svgCode = document.getElementById("carrierSvg");
      var svgText = svgCode.outerHTML;
      var postData = {
        id : this.carrier.ID,
        svgBase64 : svgText,
        svgWidth : this.useW + "",
        svgHeight : this.useH + ""
      }
      util.downLoad(postData,"/snapGene/exportFile", this.carrier.CAT + "_" + this.carrier.NAME + ".pdf");
    },
    initPage: function () {
      console.log(this.$(".svg-container").height());
      console.log(this.$(".svg-container").width());
      // this.useH = Math.max(parseFloat(this.$(".svg-container").height()),650);
      this.useH = parseFloat(this.$(".svg-container").height());
      this.useW = parseFloat(this.$(".svg-container").width());
      this.r = Math.min(this.useH, this.useW) * 0.49;//圆半径
      this.cx = this.useH / 2;
      this.cy = this.useW / 2;
      this.cTrans = 'translate(' + this.useW / 2 + ',' + this.useH / 2 + ')';

      this.circle = this.getTextPath(1, this.gbObject.seq.length, this.gbObject.seq.length, this.r);

      var features = this.gbObject.features;

      features.sort(function (a, b) {
        return Math.abs(b.start - b.end) - Math.abs(a.start - a.end);
      });

      this.trackName = this.gbObject.name;
      this.titleDesc = this.gbObject.seq.length + "碱基对";
      var offset = this.gbObject.name.length * 10 / 2;
      this.trackNameTrans = 'translate(' + (this.useW / 2 - offset) + ',' + this.useH / 2 + ')';
      this.titleDescTrans = 'translate(' + (this.useW / 2 - 50) + ',' + (this.useH / 2 + 30) + ')';
      console.log(11111);
      this.drawRuler();
      console.log(2222);
      this.drawFeature();
      this.mainTrans = 'translate(' + this.useW + ',' + this.useH + ')';
      this.initCarrier();
    },
    initCarrier: function () {
      if (this.carrier.SEQUENCE == undefined || this.carrier.SEQUENCE == "") {
        this.carrier.SEQUENCE = this.gbObject.seq;
      }
      this.carrierDetailList = new Array();
      for (var item in this.carrier) {
        if (item == "_id" || item.toUpperCase() == "ID") {
          continue;
        }
        if (this.showConfigMap[item] != undefined && !this.showConfigMap[item].pageshow) {
          continue;
        }
        if (item == "SEQUENCE") {
          continue;
        }
        var row = {
          field: item,
          val: this.carrier[item]
        }
        this.carrierDetailList.push(row);
      }
    },
    drawFeature: function () {
      var alreadyList = new Array();
      var _ = this;

      this.defsList = new Array();
      this.featureList = new Array();
      this.featureTitleList = new Array(),

          this.gbObject.features.map(feature => {
            if (feature.type != "source") {
              feature.start = parseInt(feature.start);
              feature.end = parseInt(feature.end);
              var max = Math.max(feature.start, feature.end);
              var min = Math.min(feature.start, feature.end);
              feature.start = min;
              feature.end = max;
              var index = 0;
              var showText = feature.label || feature.note;
              this.map[showText] = feature;
              var realText = showText;
              if (showText.length * this.textFontSize > Math.abs(feature.end - feature.start)) {
                realText = showText.substring(0, Math.ceil(Math.abs(feature.end - feature.start) / _.textFontSize)) + "...";
              }

              var realEnd = Math.max(showText.length * this.textFontSize + feature.start, feature.end);
              if (alreadyList.length > 0) {
                alreadyList.map(item => {
                  if (item.start < realEnd && item.end > feature.start) {
                    index = Math.max(index, item.index + 1);
                  }
                });
              }
              alreadyList.push({
                start: feature.start,
                end: realEnd,
                index: index
              })
              var seq = _.gbObject.seq.substring(feature.start - 1, feature.end);
              feature.seq = seq;
              //绘制箭头
              var realr = _.r - 20 - index * _.trackHeight;
              var d = _.getPath(feature.start, feature.end, _.gbObject.seq.length, realr, feature.stand);

              var item = {
                id: feature.type,
                d: d,
                fill: _.randomColor(feature.type),
                label: showText,
                feature : feature
              }
              _.featureList.push(item);

              var txtD = _.getTextPath(feature.start, feature.start + _.gbObject.seq.length - feature.end, _.gbObject.seq.length, realr - 25);
              var textPath = {
                id: showText.replaceAll(" ", ""),
                d: txtD,
              }
              _.defsList.push(textPath);

              var featureText = {
                id: showText.replaceAll(" ", ""),
                href: "#" + showText.replaceAll(" ", ""),
                realText: realText
              }
              _.featureTitleList.push(featureText);
            }
          });
    },

    drawRuler: function () {
      var mainSplit = Math.ceil(this.gbObject.seq.length / 1000);
      this.rulerPaths = new Array();
      this.rulerTexts = new Array();
      this.rulerItems = new Array();
      for (var i = 0; i < mainSplit; i++) {
        var startPoint = this.transToSE(i * 1000, this.gbObject.seq.length, this.r);
        var endPoint = this.transToSE(i * 1000, this.gbObject.seq.length, this.r - 5);
        var lineArrs = ['M', startPoint.x, startPoint.y, 'L', endPoint.x, endPoint.y];
        var rulerItem = {
          d: lineArrs.join(' '),
        }
        this.rulerItems.push(rulerItem);

        var splitD = this.getTextPath(i * 1000, (i + 1) * 1000, this.gbObject.seq.length, this.r - 15);
        var rulerPath = {
          d: splitD,
          id: "line" + i
        }
        this.rulerPaths.push(rulerPath);

        var rulerText = {
          href: "#line" + i,
          text: i * 1000 + 1
        }
        this.rulerTexts.push(rulerText);
      }
    },
    getTextPath: function (start, end, length, r) {
      var startPoint = this.transToSE(start, length, r);
      var endPoint = this.transToSE(end, length, r);
      var lenghty = end - start > length / 2 ? 1 : 0;
      // path 属性
      var descriptions = ['M', startPoint.x, startPoint.y, 'A', r, r, 0, lenghty, 1, endPoint.x, endPoint.y];
      return descriptions.join(' ');
    },
    randomColor: function (type) {
      // var rd = Math.round(Math.random()*10);
      switch (type) {
        case "misc_feature":
          return "#696969";
        case "rep_origin":
          return "#FFFF00";
        case "CDS":
          return "#A52A2A";
        case "primer_bind":
          return "#9400D3";
        case "promoter":
          return "#F0FFFF";
        case "polyA_signal":
          return "#A9A9A9";
        default:
          return "#BC8F8F";
      }
    },
    getPath: function (start, end, length, r, stand) {
      start = parseInt(start);
      end = parseInt(end);
      length = parseInt(length);
      r = parseInt(r);

      var arrow = this.maxArrow / 2;
      if (end - start + 1 < this.maxArrow) {
        arrow = Math.abs(start - end) / 3;
      }
      if (stand == "-") {
        var outStartPoint = this.transToSE(start + arrow, length, r);
        var outEndPoint = this.transToSE(end, length, r);

        var inStartPoint = this.transToSE(start + arrow, length, r - this.width);
        var inEndPoint = this.transToSE(end, length, r - this.width);

        var arrowPoint1 = this.transToSE(start, length, r - this.width / 2);
        var arrowPoint2 = this.transToSE(start + arrow, length, r + 5);
        var arrowPoint3 = this.transToSE(start + arrow, length, r - this.width - 5);

        var lenghty = end - start > length / 2 ? 1 : 0;

        // path 属性
        var outDescriptions = ['M', outStartPoint.x, outStartPoint.y, 'A', r, r, 0, lenghty, 1, outEndPoint.x, outEndPoint.y];
        var endBlo = ['L', inEndPoint.x, inEndPoint.y];
        var inDescriptions = ['A', r - this.width, r - this.width, 0, lenghty, 0, inStartPoint.x, inStartPoint.y];//反向画弧线
        var arror = ['L', arrowPoint3.x, arrowPoint3.y, 'L', arrowPoint1.x, arrowPoint1.y, 'L', arrowPoint2.x, arrowPoint2.y, 'L', outStartPoint.x, outStartPoint.y,]
        // var startBlo = ['L',outStartPoint.x, outStartPoint.y];

        var retArr = new Array();
        retArr.push(...outDescriptions);
        retArr.push(...endBlo);
        retArr.push(...inDescriptions);
        retArr.push(...arror);
        return retArr.join(' ');
      } else {
        var outStartPoint2 = this.transToSE(start, length, r);
        var outEndPoint2 = this.transToSE(end - arrow, length, r);

        var inStartPoint2 = this.transToSE(start, length, r - this.width);
        var inEndPoint2 = this.transToSE(end - arrow, length, r - this.width);

        var arrowPoint12 = this.transToSE(end, length, r - this.width / 2);
        var arrowPoint22 = this.transToSE(end - arrow, length, r + 5);
        var arrowPoint32 = this.transToSE(end - arrow, length, r - this.width - 5);

        var lenghty2 = end - start > length / 2 ? 1 : 0;


        // path 属性
        var inDescriptions2 = ['M', inEndPoint2.x, inEndPoint2.y, 'A', r - this.width, r - this.width, 0, lenghty2, 0, inStartPoint2.x, inStartPoint2.y];//反向画弧线
        var endBlo2 = ['L', outStartPoint2.x, outStartPoint2.y];
        var outDescriptions2 = ['A', r, r, 0, lenghty2, 1, outEndPoint2.x, outEndPoint2.y];
        var arror2 = ['L', arrowPoint22.x, arrowPoint22.y, 'L', arrowPoint12.x, arrowPoint12.y, 'L', arrowPoint32.x, arrowPoint32.y, 'L', inEndPoint2.x, inEndPoint2.y]
        // var startBlo = ['L',outStartPoint.x, outStartPoint.y];

        var retArr2 = new Array();
        retArr2.push(...inDescriptions2);
        retArr2.push(...endBlo2);
        retArr2.push(...outDescriptions2);
        retArr2.push(...arror2);
        return retArr2.join(' ');
      }
    },
    transToSE: function (point, length, r) {
      point = parseFloat(point);
      length = parseFloat(length);
      r = parseFloat(r);
      var progress = point / length;

      // 计算当前的进度对应的角度值
      var degrees = progress * 360;

      // 计算当前角度对应的弧度值
      var rad = degrees * (Math.PI / 180);

      // 极坐标转换成直角坐标
      var x = (Math.sin(rad) * r).toFixed(2);
      var y = -(Math.cos(rad) * r).toFixed(2);

      return {
        x: x,
        y: y
      }
    }
  },
  watch: {
    gbObject() {
      this.initPage();
    }
  }
}
</script>

<style scoped>
.right-detail {
  display: inline-block;
  width: 25%;
  height: 100%;
  float: right;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  overflow-y: auto;
}
.right-detail::-webkit-scrollbar { width: 0 !important }
</style>