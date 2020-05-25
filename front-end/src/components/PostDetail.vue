<template>
  <div class="BODYA">
    <!-- 编辑弹框 -->

    <el-dialog title="编辑文章" :show-close="false" :visible="dialogFormVisible" :modal="true">
      <el-form :model="editForm">
        <el-form-item label="Title" label-width="120px">
          <el-input :value="editForm.title" v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="Summary" label-width="120px">
          <el-input :value="editForm.summary" v-model="editForm.summary"></el-input>
        </el-form-item>
        <el-form-item label="Body" label-width="120px">
          <quill-editor
            ref="myQuillEditor"
            v-model="editForm.body"
            :value="editForm.body"
            @focus="onEditorFocus($event)"
          ></quill-editor>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible= false">取 消</el-button>
        <el-button type="primary" @click="Update_form()">确 定</el-button>
      </div>
    </el-dialog>

    <el-container id="PostDetail">
      <el-header style="height:150px">
        <el-row>
          <el-col>
            <div>
              <h1 style="float:left;color:#72c02c">{{post.title}}</h1>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="1.5" class="grid-content" v-if="post.author.id == sharedState.user_id">
            <el-button size="mini" type="warning" plain @click="onEditPost(post)">编辑</el-button>
          </el-col>
          <el-col :span="1.5" class="grid-content" v-if="post.author.id == sharedState.user_id">
            <el-button size="mini" type="danger" plain v-on:click="onDeletePost(post)">删除</el-button>
          </el-col>
          <el-col :span="1.5" class="grid-content">
            <el-button size="mini" type="primary" plain @click="OnEditorFocus">
              <a href="#comment"></a>
              评论
            </el-button>
          </el-col>
          <el-col :span="1.5" class="grid-content">
            <div>
              <router-link
                v-bind:to="{ path: `/user/${post.author.id}` }"
                style="color:#777;"
              >{{post.author.username}}</router-link>
              <el-divider direction="vertical"></el-divider>
            </div>
          </el-col>
          <el-col :span="1.5">
            <div style="color:#777;  ">
              {{ $moment(post.timestamp).format('LLL') }}
              <el-divider direction="vertical"></el-divider>
            </div>
          </el-col>

          <el-col :span="1.5" class="grid-content">
            <div style="color:#777;" class="el-icon-chat-round">
              <font size="2px">1</font>
            </div>
          </el-col>

          <el-col :span="1.5" style="float:right;color:#777;" class="grid-content">
            <div class="el-icon-view">
              <font size="2">{{ post.views }}次阅读</font>
            </div>
          </el-col>
        </el-row>
        <div class="BBorder"></div>
      </el-header>

      <el-main>
        <article>
          <vue-markdown :source="escapeStringHTML(post.body)" class="markdown-body"></vue-markdown>
        </article>

        <el-row style="padding-top:20px">
          <el-col :span="2">
            <el-button type="success">喜欢</el-button>
          </el-col>

          <el-col :span="2">
            <el-avatar :size="40" v-bind:src="post.author._links.avatar"></el-avatar>
          </el-col>
        </el-row>

        <el-row style="padding-top:60px">
          <el-col :span="3">
            <el-tooltip :content="post.next_title||'无'" placement="top" effect="light">
              <router-link
                router-link
                v-bind:to="{ name: 'PostDetail', params: { id: post.next_id || 0 } }"
                href="#"
              >
                <el-button type="primary" size="big" plain icon="el-icon-arrow-left">上一篇</el-button>
              </router-link>
            </el-tooltip>
          </el-col>

          <el-col :span="3" style="float:right">
            <el-tooltip :content="post.prev_title||'无'  " placement="top" effect="light">
              <router-link
                router-link
                v-bind:to="{ name: 'PostDetail', params: { id: post.prev_id || 0 } }"
                href="#"
              >
                <el-button type="primary" plain>
                  下一篇
                  <i class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
              </router-link>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <!-- ------------------------------------------------------------评论功能------------------------------------------------------------------------------------- -->
    <!-- 评论 -->
    <div v-if="comments">
      <div v-for="(comment, index) in comments.items" v-bind:key="index">
        <!-- 置顶评论 -->
        <div style="padding:5px">
          <el-container class="Container C_BODER">
            <el-aside width="100px">
              <div style="float:right;">
                <el-avatar shape="circle" :size="60" v-bind:src="comment.author.avatar"></el-avatar>
              </div>
            </el-aside>
            <el-main>
              <div id="Comments">
                <div>
                  <template>
                    <b>
                      <font
                        style="font-size:20px"
                      >{{ comment.author.name || comment.author.username }}</font>
                    </b>
                    <el-tag
                      type="danger"
                      size="mini"
                      v-if="comment.author.id == comment.post.author_id"
                    >博文作者</el-tag>
                  </template>
                </div>
                <template>
                  <small>{{ $moment(comment.timestamp).format('YYYY年MM月DD日 HH:mm:ss') }}</small>
                </template>
                <div>
                  <vue-markdown :source="comment.body"></vue-markdown>
                </div>
                <div style="padding-top:20px">
                  <el-row>
                    <a v-on:click="onLikeOrUnlike(comment)" href="#">
                      <el-col :span="2" v-if="comment.likers_id.length > 0">
                        <small style="color:red" class="el-icon-thumb"></small>
                        <small>{{ comment.likers_id.length}}人赞</small>
                      </el-col>

                      <el-col :span="2" class="el-icon-thumb" v-else>
                        <small>赞</small>
                      </el-col>
                    </a>
                    <a v-on:click="onClickReply(child)" href="#" v-if="!comment.disabled">
                      <el-col :span="2" class="el-icon-edit-outline">
                        <small>回复</small>
                      </el-col>
                    </a>
                    <el-col :span="2" style="float:right">
                      <el-button type="danger" plain size="mini">删除</el-button>
                    </el-col>
                    <el-col :span="2" style="float:right">
                      <el-button type="warning" plain size="mini">屏蔽</el-button>
                    </el-col>
                    <el-col :span="2" style="float:right">
                      <el-button type="success" plain size="mini">恢复</el-button>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-main>
          </el-container>

          <el-footer height="fit-content" style="margin-bottom:60px" >
            <template >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入回复"
                v-model="textarea2"
              ></el-input>
              <el-button type="primary" plain  style="float:left">Sumbit</el-button>
            </template>
          </el-footer>
        </div>
        <!-- 子评论 -->
        <!-- <div v-if="comment.descendants" style="padding:5px">
          <el-container
            id="profile"
            v-for="(child, cindex) in comment.descendants"
            v-bind:key="cindex"
            class="Container C_BODER"
            style="width: 90%; float:right;"
          >
            <el-aside width="100px">
              <div style="float:right;">
                <el-avatar shape="circle" :size="60" v-bind:src="post.author._links.avatar"></el-avatar>
              </div>
            </el-aside>
            <el-main>
              <div id="Comments">
                <div>
                  <h3>{{ child.author.name || child.author.username }}</h3>
                </div>
                <div>{{ $moment(child.timestamp).format('YYYY年MM月DD日 HH:mm:ss') }}</div>
                <div>
                  <vue-markdown :source="child.body"></vue-markdown>
                </div>
                <div>
                  <el-row>
                    <el-col :span="2" class="el-icon-edit-outline">赞</el-col>
                    <el-col :span="2" class="el-icon-edit-outline">回复</el-col>
                    <el-col :span="2" style="float:right">
                      <el-button type="danger" plain size="mini">删除</el-button>
                    </el-col>
                    <el-col :span="2" style="float:right">
                      <el-button type="warning" plain size="mini">屏蔽</el-button>
                    </el-col>
                    <el-col :span="2" style="float:right">
                      <el-button type="success" plain size="mini">恢复</el-button>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-main>
          </el-container>
        </div>-->
      </div>
      <!-- 页码选择器 -->
      <div v-if="comments && comments._meta.total_pages > 1">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="comments._meta.total_items "
          :page-size="comments._meta.per_page"
          style="padding:10px;text-align: right"
          @current-change="Current_Change()"
          :current-page.sync="Current_Page"
        ></el-pagination>
      </div>
    </div>

    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="float:left">Comments</span>
        </div>
        <div class="text item">
          <quill-editor
            v-model="commentForm.body"
            ref="C_myQuillEditor"
            style="height:150px;padding-bottom:50px"
            @focus="onEditorFocus($event)"
          ></quill-editor>
        </div>
        <div style="float:left;padding:20px">
          <el-button @click="onResetAddComment">Cancle</el-button>
          <el-button @click="onSubmitAddComment">Sumbit</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import store from "../store";
// 导入 vue-markdown 组件解析 markdown 原文为　HTML
import VueMarkdown from "vue-markdown";
export default {
  name: "PostDetail",
  components: {
    VueMarkdown,
    quillEditor
  },
  data() {
    return {
      str: "",
      comments: "",
      Author_ID: "",
      focusStatus: false,
      sharedState: store.state,
      dialogFormVisible: false,
      Current_Page: Number(this.$route.query.currentPage) || 1,
      post: {
        author: {
          id: "",
          _links: {
            avatar: ""
          }
        },
        body: "",
        id: "",
        summary: "",
        title: "",
        view: "",
        _links: {}
      },
      editForm: {
        title: "",
        summary: "",
        body: "",
        errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
        titleError: null,
        bodyError: null
      },
      commentForm: {
        body: "",
        parent_id: "", // 被回复的评论的 id
        author_id: "", // 被回复的评论的作者的 id
        author_name: "", // 被回复的评论的作者的名字
        errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
        bodyError: null
      },
      editCommentForm: {
        body: "",
        errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
        bodyError: null
      }
    };
  },
  methods: {
    onEditorFocus() {
      this.$nextTick(function() {
        // this.$refs.C_myQuillEditor.quill.enable(true);
        // this.$refs.C_myQuillEditor.quill.blur();
      });

      console.log("object :>> ", this.editForm.body);
    },
    OnEditorFocus() {
      this.onEditorFocus();
    },
    Update_form() {
      //   let loadingInstance = Loading.service("body");
      //   console.log("loading", this.loading);
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

          this.getPost(this.editForm.id);
          this.dialogFormVisible = false;

          this.$toasted.success("Congratulations, you are posting a article !");
          console.log("response :", response.data);
          this.editForm.title = "";
          this.editForm.summary = "";
          this.editForm.body = "";
          //   this.$nextTick(() => {
          //     // 以服务的方式调用的 Loading 需要异步关闭
          //     loadingInstance.close();
          //   });
        })
        .catch(error => {
          // handle error
          console.log("error:", error);
        });
    },
    onEditPost(post) {
      this.dialogFormVisible = true;
      // 不要使用对象引用赋值： this.editForm = post
      // 这样是同一个 post 对象，用户在 editform 中的操作会双向绑定到该 post 上， 你会看到 modal 下面的博客也在变
      // 如果用户修改了一些数据，但是点了 cancel，你就必须在 onResetUpdate() 中重新加载一次博客列表，不然用户会看到修改后但未提交的不对称信息
      this.editForm = Object.assign({}, post);
    },
    onDeletePost(post) {
      this.$confirm(
        `此操作将永久删除文章《${this.post.title}》, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          showClose: true
        }
      )
        .then(() => {
          const path = `/posts/${this.post.id}`;
          this.$axios
            .delete(path)
            .then(response => {
              // handle success
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              if (typeof this.$route.query.redirect == "undefined") {
                this.$router.push("/").catch(err => {
                  err;
                });
              } else {
                this.$router.push(this.$route.query.redirect).catch(err => {
                  err;
                });
              }
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
    escapeStringHTML(str) {
      str = str.replace(/&lt;/g, "<");
      str = str.replace(/&gt;/g, ">");
      return str;
    },
    getPost(Author_ID) {
      const path = `/posts/${Author_ID}`;
      this.$axios
        .get(path)
        .then(response => {
          this.post = response.data;
          console.log("数据 post:>> ", this.post);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    getPostComments(id) {
      let page = 1;
      let per_page = 10;
      if (typeof this.$route.query.page != "undefined") {
        page = this.$route.query.page;
      }
      if (typeof this.$route.query.per_page != "undefined") {
        per_page = this.$route.query.per_page;
      }

      const path = `/posts/${id}/comments/?page=${page}&per_page=${per_page}`;
      this.$axios
        .get(path)
        .then(response => {
          // handle success
          this.comments = response.data;
          console.log("数据 comments:>> ", this.comments);
          //if (response.data._meta.total_items > 0) {
          //  this.comments = response.data
          //}
        })
        .catch(error => {
          // handle error
          console.error(error);
        });
    },
    Current_Change() {
      console.log("Current_Page :", this.Current_Page);
      this.$router
        .push({
          path: this.$route.path,
          query: {
            page: this.Current_Page,
            per_page: this.comments._meta.per_page
          }
        })
        .catch(err => {
          err;
        });
    },
    onResetAddComment() {
      this.commentForm.body = "";
      this.commentForm.parent_id = "";
      this.commentForm.author_id = "";
      this.commentForm.author_name = "";
      // 移除错误
      this.commentForm.bodyError = null;
    },
    onSubmitAddComment(e) {
      this.commentForm.errors = 0; // 重置
      if (!this.commentForm.body) {
        this.commentForm.errors++;
        this.commentForm.bodyError = "Body is required.";
      } else {
        this.commentForm.bodyError = null;
      }
      if (this.commentForm.errors > 0) {
        // 表单验证没通过时，不继续往下执行，即不会通过 axios 调用后端API
        return false;
      }
      const path = "/comments/";
      let payload = "";
      if (this.commentForm.parent_id) {
        // 说明是回复评论
        const at_who = `<a href="/user/${this.commentForm.author_id}" class="g-text-underline--none--hover">@${this.commentForm.author_name} </a>`;
        payload = {
          body: at_who + this.commentForm.body,
          post_id: this.$route.params.id,
          parent_id: this.commentForm.parent_id
        };
      } else {
        // 说明是发表一级评论
        payload = {
          body: this.commentForm.body,
          post_id: this.$route.params.id
        };
      }
      this.$axios
        .post(path, payload)
        .then(response => {
          // handle success
          this.getPostComments(this.$route.params.id);
          this.$toasted.success("Successed add a new comment.", {
            icon: "fingerprint"
          });
          this.onResetAddComment();
        })
        .catch(error => {
          // handle error
          console.log(error.response.data);
          this.$toasted.error(error.response.data.message, {
            icon: "fingerprint"
          });
        });
    },
    onLikeOrUnlike(comment) {
      // 用户需要先登录
      if (!this.sharedState.is_authenticated) {
        this.$toasted.error("您需要先登录才能点赞 ...", {
          icon: "fingerprint"
        });
        this.$router.replace({
          path: "/login",
          query: { redirect: this.$route.path + "#c" + comment.id }
        });
      }
      let path = "";
      if (comment.likers_id.indexOf(this.sharedState.user_id) != -1) {
        // 当前登录用户已点过赞，再次点击则取消赞
        path = `/comments/${comment.id}/unlike`;
      } else {
        path = `/comments/${comment.id}/like`;
      }
      this.$axios
        .get(path)
        .then(response => {
          // handle success
          this.getPostComments(this.$route.params.id);
          this.$toasted.success(response.data.message, { icon: "fingerprint" });
        })
        .catch(error => {
          // handle error
          console.log(error.response.data);
          this.$toasted.error(error.response.data.message, {
            icon: "fingerprint"
          });
        });
    },
    onClickReply(comment) {
      // 用户需要先登录
      if (!this.sharedState.is_authenticated) {
        this.$toasted.error("您需要先登录才能回复评论 ...", {
          icon: "fingerprint"
        });
        this.$router.replace({
          path: "/login",
          query: { redirect: this.$route.path + "#c" + comment.id }
        });
      }
      this.commentForm.parent_id = comment.id;
      this.commentForm.author_id = comment.author.id;
      this.commentForm.author_name =
        comment.author.name || comment.author.username;
    }
  },
  mounted() {},
  created() {
    const post_id = this.$route.params.id;
    this.getPostComments(post_id);
    this.getPost(post_id);
  },
  beforeRouteUpdate(to, from, next) {
    console.log("to.params.id :>> ", to.params.id);
    next();
    this.getPost(to.params.id);
    this.getPostComments(to.params.id);
  },
  directives: {
    focus: {
      inserted: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  }
};
</script>

<style scoped>
.BBorder {
  height: 1px;
  width: 100%;
  background: #eee;
  margin: 20px auto;
  text-align: center;
}

.el-main {
  color: #333;
  text-align: left;
}

.el-aside {
  text-align: center;
  line-height: 150px;
}

.el-header,
.el-footer {
  color: #333;
  text-align: center;
  line-height: 40px;
  padding: 0px;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
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
  width: fit-content;
  height: fit-content;
  margin: 0 auto;
}

.C_BODER {
  border-style: solid;
  border-width: 1px;
  border-color: #eee;
  margin: 10 auto;
}

.BODYA {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
