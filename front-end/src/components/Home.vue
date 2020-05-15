<template>
  <div>
    <!--  新增时输入 -->
    <el-container style="padding:10px">
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
    
    <el-pagination background layout="prev, pager, next" :total="1000" style="padding:10px"></el-pagination>
    <div slot="header" class="clearfix">
      <span>
        <el-input v-model="PostForm.Title" placeholder="标题" style="padding:10px"></el-input>
      </span>
      <span>
        <el-input v-model="PostForm.Summary" placeholder="摘要" style="padding:10px"></el-input>
      </span>
    </div>
    <div class="edit_container">
      <quill-editor
        v-model="PostForm.Body"
        ref="myQuillEditor"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"
        style="padding:10px"
      ></quill-editor>
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
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      editorOption: { theme: "snow" },
      str: "",
      PostForm: {
        Title: "",
        Summary: "",
        Body:
          "<p></p><p><br></p><ol><li><strong><em>Or drag/paste an image here.</em></strong></li><li><strong><em>rerew</em></strong></li><li><strong><em>rtrete</em></strong></li><li><strong><em>tytrytr</em></strong></li><li><strong><em>uytu</em></strong></li></ol>",
        errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
        titleError: null,
        bodyError: null
      }
    };
  },
  methods: {
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
            { icon: "fingerprint" }
          );
          this.PostForm.Title = ""
          this.PostForm.Summary = ""
          this.PostForm.Body = ""

        })
        .catch(error => {
          // handle error
          console.log("error:",error)
          
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
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>