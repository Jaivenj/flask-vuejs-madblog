<template>
  <div>
    <!--  新增时输入 -->
    <div slot="header" class="clearfix" style="  background-color: #e9eef3;padding:15px">
      <span class="el-icon-document">
        <i> All Post</i>
        <small>(共{{ posts._meta.total_items }}篇, {{ posts._meta.total_pages }}页)</small>
      </span>
      <el-dropdown style="float:right" trigger="click">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-container style="padding:10px" v-if="posts">
      <el-aside width="200px" v-for="(post, index) in posts.items" v-bind:key="index">
        <div class="block">
          <router-link v-bind:to="{ name: 'Profile', params: { id: post.author.id }}"
            v-bind:title="post.author.name || post.author.username">
            <el-avatar shape="circle" :size="70" :fit="fit"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
          </router-link>
        </div>
      </el-aside>
      <el-container>



        <el-header>Header</el-header>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>

    <el-pagination background layout="prev, pager, next" :total="1000" style="padding:10px;text-align: right">
    </el-pagination>
    <div slot="header" class="clearfix">
      <span>
        <el-input v-model="PostForm.Title" placeholder="标题" style="padding:10px"></el-input>
      </span>
      <span>
        <el-input v-model="PostForm.Summary" placeholder="摘要" style="padding:10px"></el-input>
      </span>
    </div>
    <div class="edit_container">
      <quill-editor v-model="PostForm.Body" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)" @change="onEditorChange($event)" style="padding:10px"></quill-editor>
      <!-- 从数据库读取展示 -->
      <div style="padding:10px">
        <el-button style="float: right;  " v-on:click="SaveHtml()" 主要按钮>Save</el-button>
        <el-button style="float: right;   " v-on:click="SaveHtml" 主要按钮>POST</el-button>
      </div>
      <div v-html="str" class="ql-editor">{{str}}</div>
    </div>
  </div>
</template>
<script>
  import store from '../store.js'
  import {
    quillEditor
  } from "vue-quill-editor"; //调用编辑器
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        editorOption: {
          theme: "snow"
        },
        iter_pages: [], // 分页导航栏
        sharedState: store.state,
        posts: '',
        str: "",
        PostForm: {
          Title: "",
          Summary: "",
          Body: "<p></p><p><br></p><ol><li><strong><em>Or drag/paste an image here.</em></strong></li><li><strong><em>rerew</em></strong></li><li><strong><em>rtrete</em></strong></li><li><strong><em>tytrytr</em></strong></li><li><strong><em>uytu</em></strong></li></ol>",
          errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
          titleError: null,
          bodyError: null
        },
        editForm: {
          title: '',
          summary: '',
          body: '',
          errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
          titleError: null,
          bodyError: null
        }
      };
    },
    methods: {
      getPosts() {
        let page = 1
        let per_page = 3
        if (typeof this.$route.query.page != 'undefined') {
          page = this.$route.query.page
        }
        if (typeof this.$route.query.per_page != 'undefined') {
          per_page = this.$route.query.per_page
        }

        const path = `/posts?page=${page}&per_page=${per_page}`
        this.$axios.get(path)
          .then((response) => {
            // handle success
            this.posts = response.data
            console.log("posts:", this.posts)
            // 构建分页导航，当前页左、右两边各显示2页，比如  1, 2, ... 7, 8, 9, 10, 11 ... 30, 31
            let arr = [1, 2, this.posts._meta.page - 2, this.posts._meta.page - 1, this.posts._meta.page, this.posts
              ._meta.page + 1, this.posts._meta.page + 2, this.posts._meta.total_pages - 1, this.posts._meta
              .total_pages
            ]
            // 小于1，或大于最大页数的都是非法的，要去除
            arr = arr.filter(item => item > 0 && item <= this.posts._meta.total_pages)
            // 去除重复项
            this.iter_pages = [...new Set(arr)]
            // 假设当前页为1，总页数为6或6以上时，在倒数第2个位置插入特殊标记  1, 2, 3 ... 5, 6
            if (this.posts._meta.page + 2 < this.posts._meta.total_pages - 2) {
              this.iter_pages.splice(-2, 0, 'NaN')
            }
            // 当前页为6或6以上时，在第3个位置插入特殊标记  1, 2 ... 4, 5, 6
            if (this.posts._meta.page - 3 > 2) {
              this.iter_pages.splice(2, 0, 'NaN')
            }
          })
          .catch((error) => {
            // handle error
            console.log("error:", error)
          })
      },
      onEditorReady(editor) {
        // 准备编辑器
      },
      onEditorBlur() {}, // 失去焦点事件
      onEditorFocus() {}, // 获得焦点事件
      onEditorChange() {}, // 内容改变事件
      // 转码
      escapeStringHTML(str) {
        str = str.replace(/&lt;/g, "<");
        str = str.replace(/&gt;/g, ">");
        return str;
      },
      SaveHtml() {
        this.PostForm.errors = 0; // 重置

        if (!this.PostForm.Title) {
          this.PostForm.errors++;
          this.PostForm.titleError = "Title is required.";
        } else {
          this.PostForm.titleError = null;
        }
        if (!this.PostForm.Body) {
          this.PostForm.errors++;
          this.PostForm.bodyError = "Body is required.";
        }
        if (this.PostForm.errors > 0) {
          // 表单验证没通过时，不继续往下执行，即不会通过 axios 调用后端API
          console.log(this.PostForm.errors);
          console.log("PostForm:", this.PostForm);
          return false;
        }

        console.log(this.PostForm.Body);
        const path = "/posts";
        const payload = {
          title: this.PostForm.Title,
          summary: this.PostForm.Summary,
          body: this.PostForm.Body
        };
        this.$axios
          .post(path, payload)
          .then(response => {
            // handle success
            this.$toasted.success(
              "Congratulations, you are posting a article !",
            );
            console.log('response :', response.data);
            this.PostForm.Title = ""
            this.PostForm.Summary = ""
            this.PostForm.Body = ""

          })
          .catch(error => {
            // handle error
            console.log("error:", error)

          });
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill;
      }
    },
    mounted() {
      let content = ""; // 请求后台返回的内容字符串
      this.str = this.escapeStringHTML(content);
    },
    created() {
      this.getPosts()
    },
    // 当查询参数 page 或 per_page 变化后重新加载数据
    beforeRouteUpdate(to, from, next) {
      // 注意：要先执行 next() 不然 this.$route.query 还是之前的
      next()
      this.getPosts()
    }
  };

</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 0px;
  }

  .el-aside {

    color: #333;
    text-align: right;
    line-height: 0px;
    padding-right: 20px;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 0px;
  }

  body>.el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";

  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;

  }

</style>
