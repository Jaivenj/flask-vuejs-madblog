import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/Register'
import EditProfile from '@/components/EditProfile'
import Ping from '@/components/Ping'
import PostDetail from '@/components/PostDetail'

import User from '@/components/User'
import Overview from '@/components/Overview'
import Followers from '@/components/Followers'
import Following from '@/components/Following'
import UserPostsList from '@/components/UserPostsList'

import Settings from '@/components/Settings'
import Profile from '@/components/Profile'
import Account from '@/components/Account'
import Email from '@/components/Email'
import Notification from '@/components/Notification'



Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      // 博客文章详情页
      path: '/post/:id',
      name: 'PostDetail',
      component: PostDetail
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/ping',
      name: 'Ping',
      component: Ping
    },

    {
      // 用户修改自己的个人信息
      path: '/edit-profile',
      name: 'EditProfile',
      component: EditProfile,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/user/:id',
      name: 'User',
      component: User,
      children: [
        // Overview will be rendered inside User's <router-view>
        // when /user/:id is matched
        // 注意： 要有默认子路由，父路由不能指定 name
        {
          path: '',
          component: Overview
        },
        {
          path: 'overview',
          name: 'Overview',
          component: Overview
        },

        // Followers will be rendered inside User's <router-view>
        // when /user/:id/followers is matched
        {
          path: 'followers',
          name: 'Followers',
          component: Followers
        },

        // Following will be rendered inside User's <router-view>
        // when /user/:id/following is matched
        {
          path: 'following',
          name: 'Following',
          component: Following
        },
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        {
          path: 'followeds-posts',
          name: 'UserPostsList',
          component: UserPostsList
        }

      ],
      meta: {
        requiresAuth: true
      }
    }, {
      // 用户修改自己的个人信息
      path: '/settings',
      component: Settings,
      children: [{
          path: '',
          component: Profile
        },
        {
          path: 'profile',
          name: 'SettingProfile',
          component: Profile
        },
        {
          path: 'account',
          name: 'SettingAccount',
          component: Account
        },
        {
          path: 'email',
          name: 'SettingEmail',
          component: Email
        },
        {
          path: 'notification',
          name: 'SettingNotification',
          component: Notification
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('madblog-token')
  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else if (token && to.name == 'Login') {
    // 用户已登录，但又去访问登录页面时不让他过去
    next({
      path: from.fullPath
    })
  } else if (to.matched.length === 0) { // 要前往的路由不存在时
    console.log('here')
    console.log(to.matched)
    Vue.toasted.error('404: NOT FOUND', {
      icon: 'fingerprint'
    })
    if (from.name) {
      next({
        name: from.name
      })
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next()
  }
})

export default router
