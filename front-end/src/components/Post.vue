<template>
  <div style="padding:10px">

    <el-container class="border">
      <el-aside width="150px">
        <div class="block">
          <router-link v-bind:to="{ path: `/user/${post.author.id}` }"
            v-bind:title="post.author.name || post.author.username">
            <div>
              <el-avatar shape="circle" :size="70" :src="post.author._links.avatar" class="Circle">
              </el-avatar>
            </div>
          </router-link>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <div style="float:left">
            <h5>
              <router-link v-bind:to="{ path: `/user/${post.author.id}` }">
                <font color="#72c02c">{{ post.author.name || post.author.username }}</font>
              </router-link>
              <span class="h5">
                发布了文章
                <router-link v-bind:to="{ name: 'PostDetail', params: { id: post.id } }">
                  <font color="#72c02c">《{{ post.title }}》</font>
                </router-link>
              </span>
            </h5>
            <span style="font-size:10px">{{ $moment(post.timestamp).format('YYYY年MM月DD日 HH:mm:ss') }}</span>
          </div>
        </el-header>

        <el-main>
          <vue-markdown :source="post.summary" style="float:left;font-size:15px"></vue-markdown>
        </el-main>

        <el-footer>
          <div class="el-icon-view" style="padding-right:20px;width:40px">
            <span style="padding-left:5px">1</span>
          </div>
          <div class="el-icon-coffee-cup" style="padding-right:20px;width:40px">
            <span style="padding-left:5px">1</span>
          </div>
          <div class="el-icon-chat-round" style="padding-right:20px;width:40px">
            <span style="padding-left:5px">1</span>
          </div>
          <el-row :gutter="10" style="float:right">
            <el-col :span="2.5" v-if="post.author.id == sharedState.user_id">
              <div class="grid-content bg-purple">
                <!--编辑按键-->
                <el-button type="primary" size="small" plain @click="$emit('edit-post')">编辑
                </el-button>
                <!--弹框-->
              </div>
            </el-col>
            <el-col :span="2.5" v-if="post.author.id == sharedState.user_id">
              <div class="grid-content bg-purple">
                <el-button type="danger" size="small" plain v-on:click="$emit('delete-post')">删除 </el-button>
              </div>
            </el-col>
            <el-col :span="2.5">
              <router-link class="grid-content bg-purple" v-bind:to="{ name: 'PostDetail', params: { id: post.id } }">
                <el-button type="success" size="small" plain>阅读文本 </el-button>
              </router-link>
            </el-col>

          </el-row>
        </el-footer>
      </el-container>
    </el-container>


  </div>



</template>
<script>
import PostDetail from "./PostDetail"
  import {
    quillEditor
  } from "vue-quill-editor"; //调用编辑器
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  import store from "../store";
  import VueMarkdown from "vue-markdown";
  export default {
    name: "Post",
    props: ["post"],

    components: {
      VueMarkdown,
      quillEditor,
    },
    data() {
      return {
        sharedState: store.state,
        
      };
    },
    methods: {


    },

  };

</script>
<style>
  .border {
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.2);
    padding: 10px;

  }

  .Circle {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .el-header,
  .el-footer {
    color: #333;
    text-align: left;
    line-height: 0px;
  }

  .el-aside {
    color: #333;
    text-align: right;
    line-height: 0px;
    padding-right: 20px;
  }

  .el-main {
    color: #333;
    text-align: left;
    line-height: 20px;
  }

  .quill-editor {
    height: 150px;
    padding-bottom: 100px
  }

</style>
