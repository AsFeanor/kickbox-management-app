<script setup>
import MemberForm from './components/MemberForm.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white shadow sticky top-0 z-20">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex space-x-4">
            <router-link
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="$route.path === '/' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'"
            >Anasayfa</router-link>
            <router-link
              to="/uye-kayit"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="$route.path === '/uye-kayit' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'"
            >Üye Kayıt</router-link>
            <router-link
              to="/uyeler"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="$route.path === '/uyeler' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'"
            >Üye Listesi</router-link>
            <router-link
              to="/ozel-dersler"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="$route.path === '/ozel-dersler' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'"
            >Özel Dersler</router-link>
            <router-link
              to="/grup-dersleri"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="$route.path === '/grup-dersleri' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'"
            >Grup Dersleri</router-link>
            <router-link
              to="/takvim"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="$route.path === '/takvim' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-100'"
            >Takvim</router-link>
          </div>
        </div>
      </div>
    </nav>
    <!-- Page Content -->
    <main class="flex-1 flex flex-col items-center justify-center py-8">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
</style>
