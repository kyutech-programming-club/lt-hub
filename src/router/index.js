import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import Events from '@/views/Events.vue'
import Event from '@/views/Event.vue'
import Users from '@/views/Users.vue'
import User from '@/views/User.vue'

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
