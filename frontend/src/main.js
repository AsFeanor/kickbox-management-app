import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import MemberForm from './components/MemberForm.vue'
import MemberList from './components/MemberList.vue'
import PrivateLessons from './components/PrivateLessons.vue'
import GrupDersleri from './components/GrupDersleri.vue'
import Calendar from './views/Calendar.vue'

const Home = { template: '<div class="max-w-2xl mx-auto p-8 text-center text-2xl font-bold text-gray-700">Kickboks Salonu Yönetim Sistemi</div>' }

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/uye-kayit', name: 'MemberForm', component: MemberForm },
  { path: '/uyeler', name: 'MemberList', component: MemberList },
  { path: '/ozel-dersler', name: 'PrivateLessons', component: PrivateLessons },
  { path: '/grup-dersleri', name: 'GrupDersleri', component: GrupDersleri },
  { path: '/takvim', name: 'Calendar', component: Calendar }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
