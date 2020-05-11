<template>
  <div >
    <el-alert title={{ message }} type="info" show-icon ></el-alert>
  </div>
</template>

<script>
export default {
  props: [ "message"]
};
</script>