<template>
  <div>
    <el-alert 
    title="消息" 
    type="info" 
    show-icon v-bind:type="variant"
    >{{message}}</el-alert>
  </div>
</template>

<script>
  export default {
    name: 'Alert',
    props: ['variant', "message"]
  };

</script>
