<template>

  <div>
    <el-dialog title="updatePostModal" :show-close="false" :visible="dialogFormVisible" :modal="true">
      <el-form :model="editForm">
        <el-form-item label="Title" :label-width="formLabelWidth">
          <el-input :value="editForm.title" v-model="editForm.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item label="Summary" :label-width="formLabelWidth">
          <el-input :value="editForm.summary" v-model="editForm.summary" placeholder="摘要"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <quill-editor ref="myQuillEditor" v-model="editForm.body" :value="editForm.body"
            @focus="onEditorFocus($event)"></quill-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible= false">取 消</el-button>
        <el-button type="primary" @click="Update_form()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 页头 -->
    <div class="C_followers">
      <h4 style="padding-left:20px" class="el-icon-s-custom">User
        Followers(共{{posts._meta.total_items}}个，{{posts._meta.total_pages}}页)</h4>
      <div style="float:right ;padding-right:30px">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <router-link v-bind:to="{ path: $route.path, query: { page: 1, per_page: 1 }}">
              <el-dropdown-item>每页 1 个</el-dropdown-item>
            </router-link>
            <router-link v-bind:to="{ path: $route.path, query: { page: 1, per_page: 5 }}">
              <el-dropdown-item>每页 5 个</el-dropdown-item>
            </router-link>
            <router-link v-bind:to="{ path: $route.path, query: { page: 1, per_page: 10 }}">
              <el-dropdown-item>每页 10 个</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <Post v-for="(post, index) in posts.items" v-bind:key="index" v-bind:post="post" v-on:edit-post="onEditPost(post)"
      v-on:delete-post="onDeletePost(post)">
    </Post>

    <el-pagination background layout="prev, pager, next" :total="posts._meta.total_items "
      :page-size="posts._meta.per_page" style="padding:10px;text-align: right" @current-change="Current_Change()"
      :current-page.sync="Current_Page"></el-pagination>

  </div>

</template>

<script>
  import Post from "./Post";
  import store from "../store";
  import {
    quillEditor
  } from "vue-quill-editor"; //调用编辑器
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  export default {
    name: "UserPostsList",
    components: {
      Post,
      quillEditor
    },
    data() {
      return {
        formLabelWidth: "80",
        dialogFormVisible: false,
        sharedState: store.state,
        Current_Page: Number(this.$route.query.currentPage) || 1,
        user: '',
        posts: {
          _meta: {
            total_items: null,
          }
        },
        editForm: {
          title: '',
          summary: '',
          body: '',
          errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
          titleError: null,
          bodyError: null
        }
      }
    },

    methods: {
      getUser(id) {
        const path = `users/${id}`
        this.$axios.get(path)
          .then((response) => {
            // handle success
            this.user = response.data
          })
          .catch((error) => {
            // handle error
            console.error(error)
          })
      },
      getUserPosts(id) {
        let page = 1
        let per_page = 3
        if (typeof this.$route.query.page != 'undefined') {
          page = this.$route.query.page
        }
        if (typeof this.$route.query.per_page != 'undefined') {
          per_page = this.$route.query.per_page
        }

        const path = `users/${id}/posts/?page=${page}&per_page=${per_page}`
        this.$axios.get(path)
          .then((response) => {
            // handle success
            this.posts = response.data
            console.log('posts:', response.data);
          })
          .catch((error) => {
            // handle error
            console.error(error)
          })
      },
      onEditPost(post) {
        (this.dialogFormVisible = true),
        // 不要使用对象引用赋值： this.editForm = post
        // 这样是同一个 post 对象，用户在 editForm 中的操作会双向绑定到该 post 上， 你会看到 modal 下面的博客也在变
        // 如果用户修改了一些数据，但是点了 cancel，你就必须在 onResetUpdate() 中重新加载一次博客列表，不然用户会看到修改后但未提交的不对称信息
        this.editForm = Object.assign({}, post)
      },
      onDeletePost(post) {
        this.$confirm(
            `此操作将永久删除文章《${post.title}》, 是否继续?`,
            "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
              showClose: true
            }
          )
          .then(() => {
            const path = `posts/${post.id}`;
            console.log('path :', path);
            this.$axios
              .delete(path)
              .then(response => {
                // handle success
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.$router.push({
                  name: 'UserPostsList',
                  query: {
                    id: response.data.id
                  }
                }).catch(err => {err})
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
          path: this.$route.path,
          query: {
            page: this.Current_Page,
            per_page: this.posts._meta.per_page
          }
        }).catch(err => {err});
      },
    },
    created() {
      const user_id = this.$route.params.id
      this.getUser(user_id)
      this.getUserPosts(user_id)
      // 初始化 bootstrap-markdown 插件
    },
    // 当 id 变化后重新加载数据
    beforeRouteUpdate(to, from, next) {
      next()
      this.getUser(to.params.id)
      this.getUserPosts(to.params.id)

    }
  }

</script>

<style scoped>
  .C_followers {
    margin-bottom: 20px;
    height: 60px;
    width: 100%;
    background-color: #eee;
    font-size: 1rem;
    line-height: 60px;
    color: rgb(124, 120, 120);
  }

</style>
