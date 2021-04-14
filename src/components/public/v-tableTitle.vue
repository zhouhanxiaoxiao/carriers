<template>
  <div class="table-title">
    <div class="title">
      <slot name="title"></slot>
    </div>
    <div class="extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
export default {
name: "v-tableTitle"
}
</script>

<style scoped>
.table-title{
  width: 100%;
  height: 50px;
  border: 1px solid #e8e8e8;
  background-color: white;
  border-radius: 5px;
  text-align: left;

}
.title{
  font-size: 25px;
  font-weight: bold;
  display: inline-block;
  text-align: left;
  line-height: 50px;
  margin-left: 10px;
}
.extra{
  display: inline-block;
  float: right;
  text-align: right;
  height: 50px;
  line-height: 50px;
  margin-right: 10px;
}
</style>