<template>
  <div class="Member_div">
    <dir>
      <el-avatar shape="circle" :size="60" :src="user._links.avatar" class="Member_Border"></el-avatar>
      
    </dir>
    

    <dir>
      <el-avatar shape="circle" :size="60" :src="user._links.avatar" class="Member_Border"></el-avatar>
    </dir>

    <div>asdasdasd
        <div>asdasdasd</div>
    </div>
  </div>
</template>
<script>
  import store from '../store'
  export default {
    name: 'Member',
    props: ['user'],
    data() {
      return {

      }
    },
  }

</script>
<style>
  .Member_div {
    justify-content: flex-start;
    display: flex;
    height: 100px;
    width: 675px;
    margin: 0 auto;
    flex-direction: row;
    border: 1px solid #eee;
    align-items:center;
  }

  .Member_Border {
    border-radius: 50px;
    border-style: solid;
    margin: 0 auto;
    border-color: #eee;
    padding: 1px;
  }

</style>
