import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Events from '@/views/Events.vue'
import Event from '@/views/Event.vue'
import Users from '@/views/Users.vue'
import User from '@/views/User.vue'
import Talk from '@/views/Talk.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/events',
    name: 'events',
    component: Events
  },
  {
    path: '/events/:id/',
    name: 'event',
    component: Event
  },
  {
    path: '/users',
    name: 'users',
    component: Users
  },
  {
    path: '/users/:uid/',
    name: 'user',
    component: User
  },
  {
    path: '/talks/:id',
    name: 'talk',
    props: true, // paramsの値が遷移先のpropsとして使える
    component: Talk
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
