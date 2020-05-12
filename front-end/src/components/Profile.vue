<template>
  <div>
    <!-- Member since -->
    <h4 class="h6 g-font-weight-300 g-mb-10">
      <i class="icon-badge g-pos-rel g-top-1 g-color-gray-dark-v5 g-mr-5"></i> Member since :
      <span v-if="user">{{ $moment(user.member_since).format('LLL') }}</span>
    </h4>
    <!-- End Member since -->
    <!-- Last seen -->
    <h4 class="h6 g-font-weight-300 g-mb-10">
      <i class="icon-eye g-pos-rel g-top-1 g-color-gray-dark-v5 g-mr-5"></i> Last seen :
      <span v-if="user">{{ $moment(user.last_seen).fromNow() }}</span>
    </h4>
    <router-link v-if="$route.params.id == sharedState.user_id" v-bind:to="{ name: 'EditProfile' }" class="btn btn-block u-btn-outline-primary g-rounded-50 g-py-12 g-mb-10">
    <i class="icon-user-follow g-pos-rel g-top-1 g-mr-5"></i> Edit Profile
</router-link>
    <!-- End Last seen -->
  </div>
</template>

<script>
import store from '../store.js'

export default {
  name: 'Profile',  //this is the name of the component
  data () {
    return {
      sharedState: store.state,
      user: {
        username: '',
        email: '',
        name: '',
        location: '',
        about_me: '',
        member_since: '',
        last_seen: '',
        _links: {
          self: '',
          avatar: ''
        }
      }
    }
  },
  methods: {
    getUser (id) {
      const path = `/users/${id}`
      this.$axios.get(path)
        .then((response) => {
          this.user = response.data
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error)
        });
    }
  },
  created () {
    const user_id = this.$route.params.id
    this.getUser(user_id)
  },
  // 当 id 变化后重新加载数据
  beforeRouteUpdate (to, from, next) {
    this.getUser(to.params.id)
    next()
  }
}
</script>

<style>
</style>