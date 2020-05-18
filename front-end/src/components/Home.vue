<template>
  <div>
    <el-dialog title="编辑文章" :show-close="false" :visible="dialogFormVisible" :modal="false">
      <el-form :model="editForm">
        <el-form-item label="Title" :label-width="formLabelWidth">
          <el-input :value="editForm.title" v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="Summary" :label-width="formLabelWidth">
          <el-input :value="editForm.summary" v-model="editForm.summary"></el-input>
        </el-form-item>
        <el-form-item label="Body" :label-width="formLabelWidth">
          <quill-editor ref="myQuillEditor" v-model="editForm.body" :value="editForm.body"></quill-editor>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible= false">取 消</el-button>
        <el-button type="primary" @click="Update_form()">确 定</el-button>
      </div>
    </el-dialog>

    <div style="padding:10px">
      <!--  博客列表数目详情 -->
      <div slot="header" class="clearfix" style="  background-color: #e9eef3;padding:15px 10px;">
        <span class="el-icon-document" style="float:left">
          <i>All Post</i>
          <small>(共{{ posts._meta.total_items }}篇, {{ posts._meta.total_pages }}页)</small>
        </span>
        <el-dropdown style="float:right" trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>

          <el-dropdown-menu slot="dropdown">
            <router-link v-bind:to="{ name: 'Home', query: { page: 1, per_page: 1 }}">
              <el-dropdown-item>每页 1 篇</el-dropdown-item>
            </router-link>
            <router-link v-bind:to="{ name: 'Home', query: { page: 1, per_page: 5 }}">
              <el-dropdown-item>每页 5 篇</el-dropdown-item>
            </router-link>
            <router-link v-bind:to="{ name: 'Home', query: { page: 1, per_page: 10 }}">
              <el-dropdown-item>每页 10 篇</el-dropdown-item>
            </router-link>
            <router-link v-bind:to="{ name: 'Home', query: { page: 1, per_page: 20 }}">
              <el-dropdown-item>每页 20 篇</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!-- 阅览博客列表 -->
      <Post
        v-for="(post, index) in posts.items"
        v-bind:key="index"
        :post="post"
        v-on:delete-post="onDeletePost(post)"
        v-on:edit-post="onEditPost(post)"
      ></Post>
    </div>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="posts._meta.total_items "
      :page-size="posts._meta.per_page"
      v-on:page-count="posts._meta.total_pages"
      style="padding:10px;text-align: right"
      @prev-click="Prev_click()"
      @next-click="Next_click()"
      @current-change="Current_Change()"
      :current-page.sync="Current_Page"
    ></el-pagination>

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
      <div style="padding-top: 100px;">
        <el-button style="float: right;  " @click="SaveHtml()" 主要按钮>Save</el-button>
        <el-button style="float: right;   " @click="SaveHtml()" 主要按钮>POST</el-button>
      </div>
      <div v-html="str" class="ql-editor">{{str}}</div>
    </div>
  </div>
</template>
<script>
import store from "../store.js";
import Post from "./Post";
import { Loading } from "element-ui";
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    quillEditor,
    Post
  },
  data() {
    return {
      dialogFormVisible: false,
      Current_Page: Number(this.$route.query.currentPage) || 1,
      editorOption: {
        theme: "snow"
      },
      formLabelWidth: "120px",
      iter_pages: [], // 分页导航栏
      sharedState: store.state,
      posts: {},
      str: "",
      PostForm: {
        Title: "",
        Summary: "",
        Body: "",
        errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
        titleError: null,
        bodyError: null
      },
      editForm: {
        title: "",
        summary: "",
        body: "",
        errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
        titleError: null,
        bodyError: null
      }
    };
  },
  methods: {
    Update_form() {
      let loadingInstance = Loading.service("body");
      console.log("loading", this.loading);
      const path = `/posts/${this.editForm.id}`;
      const payload = {
        title: this.editForm.title,
        summary: this.editForm.summary,
        body: this.editForm.body
      };
      this.$axios
        .put(path, payload)
        .then(response => {
          // handle success
          this.getPosts();
          this.dialogFormVisible = false;
          this.$toasted.success("Congratulations, you are posting a article !");
          console.log("response :", response.data);
          this.editForm.title = "";
          this.editForm.summary = "";
          this.editForm.body = "";
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        })
        .catch(error => {
          // handle error
          console.log("error:", error);
        });
    },
    onEditPost(post) {
      (this.dialogFormVisible = true),
        //    loading=true,
        // 不要使用对象引用赋值： this.editForm = post
        // 这样是同一个 post 对象，用户在 editform 中的操作会双向绑定到该 post 上， 你会看到 modal 下面的博客也在变
        // 如果用户修改了一些数据，但是点了 cancel，你就必须在 onResetUpdate() 中重新加载一次博客列表，不然用户会看到修改后但未提交的不对称信息
        (this.editForm = Object.assign({}, post));
    },

    onDeletePost(post) {
      this.$confirm(
        `此操作将永久删除文章《${post.title}》, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          showClose: true
        }
      )
        .then(() => {
          const path = `/posts/${post.id}`;
          this.$axios
            .delete(path)
            .then(response => {
              // handle success
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getPosts();
            })
            .catch(error => {
              // handle error
              console.log(error.response.data);
              this.$toasted.error(error.response.data.message, {
                icon: "fingerprint"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    Current_Change() {
      console.log("Current_Page :", this.Current_Page);
      this.$router.push({
        name: "Home",
        query: {
          page: this.Current_Page,
          per_page: this.posts._meta.per_page
        }
      });
    },
    Prev_click() {
      this.$router.push({
        name: "Home",
        query: {
          page: this.posts._meta.page - 1,
          per_page: this.posts._meta.per_page
        }
      });
    },
    Next_click() {
      this.$router.push({
        name: "Home",
        query: {
          page: this.posts._meta.page + 1,
          per_page: this.posts._meta.per_page
        }
      });
    },

    getPosts() {
      let page = 1;
      let per_page = 3;
      if (typeof this.$route.query.page != "undefined") {
        page = this.$route.query.page;
      }
      if (typeof this.$route.query.per_page != "undefined") {
        per_page = this.$route.query.per_page;
      }

      const path = `/posts?page=${page}&per_page=${per_page}`;
      this.$axios
        .get(path)
        .then(response => {
          // handle success
          this.posts = response.data;
          console.log("posts:", this.posts);
          // 构建分页导航，当前页左、右两边各显示2页，比如  1, 2, ... 7, 8, 9, 10, 11 ... 30, 31
        })
        .catch(error => {
          // handle error
          console.log("error:", error);
        });
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
          this.$toasted.success("Congratulations, you are posting a article !");
          console.log("response :", response.data);
          this.PostForm.Title = "";
          this.PostForm.Summary = "";
          this.PostForm.Body = "";
          this.getPosts();
        })
        .catch(error => {
          // handle error
          console.log("error:", error);
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
    this.getPosts();
  },
  // 当查询参数 page 或 per_page 变化后重新加载数据
  beforeRouteUpdate(to, from, next) {
    // 注意：要先执行 next() 不然 this.$route.query 还是之前的
    next();
    this.getPosts();
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
  color: #333;
  text-align: center;
  line-height: 0px;
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

.box-card {
  width: 480px;
}

body {
  margin: 0;
}
</style>
