<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Üye Yönetimi</h1>
        <p class="text-lg text-gray-600">Tüm üyelerinizi buradan yönetebilirsiniz</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Toplam Üye</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalMembers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Özel Ders</p>
              <p class="text-2xl font-bold text-gray-900">{{ privateLessonMembers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Grup Dersi</p>
              <p class="text-2xl font-bold text-gray-900">{{ groupLessonMembers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Toplam Gelir</p>
              <p class="text-2xl font-bold text-gray-900">₺{{ totalRevenue.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Ad, soyad veya telefon ile ara..."
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <select
              v-model="filterLessonType"
              class="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Ders Türleri</option>
              <option value="Özel">Özel Ders</option>
              <option value="Grup">Grup Dersi</option>
            </select>
            <select
              v-model="filterGroupCategory"
              class="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Gruplar</option>
              <option v-for="category in groupCategories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <select
              v-model="filterGender"
              class="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Cinsiyetler</option>
              <option value="Kadın">Kadın</option>
              <option value="Erkek">Erkek</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div class="mt-4 space-y-2">
            <div class="h-3 bg-gray-200 rounded"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- Results Info -->
      <div v-else-if="filteredMembers.length > 0" class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="text-sm text-gray-700">
            <span class="font-medium">{{ filteredMembers.length }}</span> üye bulundu
            <span v-if="totalPages > 1" class="mx-2">•</span>
            <span v-if="totalPages > 1">
              Sayfa <span class="font-medium">{{ currentPage }}</span> / <span class="font-medium">{{ totalPages }}</span>
              ({{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredMembers.length) }})
            </span>
          </div>
          <div v-if="totalPages > 1" class="flex items-center space-x-2 mt-3 sm:mt-0">
            <span class="text-sm text-gray-500">Sayfa başına:</span>
            <select 
              v-model="itemsPerPage" 
              @change="currentPage = 1"
              class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="6">6</option>
              <option :value="9">9</option>
              <option :value="12">12</option>
              <option :value="18">18</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Members Grid -->
      <div v-if="filteredMembers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="member in paginatedMembers"
          :key="member.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
        >
          <!-- Member Header -->
          <div class="p-6 pb-4">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {{ getInitials(member.ad, member.soyad) }}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 truncate">
                  {{ member.ad }} {{ member.soyad }}
                </h3>
                <p class="text-sm text-gray-500 flex items-center mt-1">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {{ member.telefon }}
                </p>
              </div>
              <div class="flex flex-col items-end space-y-2">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-semibold rounded-full',
                    member.ders_turu === 'Özel' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  ]"
                >
                  {{ member.ders_turu }}
                </span>
                
                <!-- Action Buttons -->
                <div class="flex space-x-1">
                  <button
                    @click="editMember(member)"
                    class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    title="Düzenle"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteMember(member)"
                    class="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    title="Sil"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Member Details -->
          <div class="px-6 pb-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Yaş:</span>
                <span class="ml-1 font-medium">{{ member.yas }}</span>
              </div>
              <div>
                <span class="text-gray-500">Kilo:</span>
                <span class="ml-1 font-medium">{{ member.kilo }} kg</span>
              </div>
                      <div>
                <span class="text-gray-500">Cinsiyet:</span>
                <span class="ml-1 font-medium">{{ member.cinsiyet }}</span>
                      </div>
                      <div>
                <span class="text-gray-500">Ücret:</span>
                <span class="ml-1 font-medium text-green-600">₺{{ member.ucret }}</span>
              </div>
            </div>
          </div>

          <!-- Age Group (for Group lessons) -->
          <div v-if="member.ders_turu === 'Grup' && member.yas_grubu" class="px-6 pb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {{ getGroupCategoryName(member.yas_grubu) }}
            </span>
          </div>

          <!-- Private Lesson Packages -->
          <div v-if="member.privateLessonPackages && member.privateLessonPackages.length > 0" class="border-t border-gray-100">
            <div class="p-4">
              <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Özel Ders Paketleri ({{ member.privateLessonPackages.length }})
              </h4>
              <div class="space-y-3 max-h-48 overflow-y-auto">
                <div
                  v-for="(pkg, index) in member.privateLessonPackages"
                  :key="pkg.id"
                  class="bg-gray-50 rounded-lg p-3"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-medium text-gray-600">Paket {{ index + 1 }}</span>
                    <div class="flex space-x-2">
                      <span
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          pkg.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        ]"
                      >
                        {{ pkg.paid ? 'Ödendi' : 'Bekliyor' }}
                      </span>
                      <span
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          pkg.is_completed ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        {{ pkg.is_completed ? 'Tamamlandı' : 'Devam Ediyor' }}
                      </span>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-white rounded p-2">
                      <div class="font-medium text-gray-700">{{ pkg.lesson_day_1 }}</div>
                      <div class="text-gray-500">{{ pkg.lesson_start_time_1 }} - {{ pkg.lesson_end_time_1 }}</div>
                    </div>
                    <div class="bg-white rounded p-2">
                      <div class="font-medium text-gray-700">{{ pkg.lesson_day_2 }}</div>
                      <div class="text-gray-500">{{ pkg.lesson_start_time_2 }} - {{ pkg.lesson_end_time_2 }}</div>
                    </div>
                  </div>
                  <!-- Session Progress -->
                  <div class="mt-2">
                    <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Ders İlerlemesi</span>
                      <span>{{ getCompletedSessions(pkg) }}/8</span>
                      </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: `${getSessionProgress(pkg)}%` }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="member.not" class="border-t border-gray-100 p-4">
            <div class="flex items-start space-x-2">
              <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586l-4.414 4.414z"></path>
              </svg>
              <p class="text-sm text-gray-600">{{ member.not }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredMembers.length > 0 && totalPages > 1" class="flex items-center justify-center space-x-2 mt-8">
        <!-- Previous Button -->
        <button
          @click="prevPage"
          :disabled="!hasPrevPage"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            hasPrevPage
              ? 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-300 bg-gray-100 border border-gray-200 cursor-not-allowed'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <!-- Page Numbers -->
        <div class="flex space-x-1">
          <!-- First page -->
          <button
            v-if="currentPage > 3"
            @click="goToPage(1)"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            1
          </button>
          <span v-if="currentPage > 4" class="px-2 py-2 text-gray-400">...</span>

          <!-- Visible pages -->
          <button
            v-for="page in getVisiblePages()"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              page === currentPage
                ? 'text-white bg-blue-600 border border-blue-600'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>

          <!-- Last page -->
          <span v-if="currentPage < totalPages - 3" class="px-2 py-2 text-gray-400">...</span>
          <button
            v-if="currentPage < totalPages - 2"
            @click="goToPage(totalPages)"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {{ totalPages }}
          </button>
        </div>

        <!-- Next Button -->
        <button
          @click="nextPage"
          :disabled="!hasNextPage"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            hasNextPage
              ? 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-300 bg-gray-100 border border-gray-200 cursor-not-allowed'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredMembers.length === 0" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Üye bulunamadı</h3>
        <p class="mt-2 text-gray-500">
          {{ searchQuery || filterLessonType || filterGroupCategory || filterGender 
             ? 'Arama kriterlerinize uygun üye bulunamadı.' 
             : 'Henüz kayıtlı üye bulunmuyor.' }}
        </p>
      </div>
    </div>
    
    <!-- Edit Member Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeEditModal"></div>
        
        <div class="relative inline-block bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-white">Üye Düzenle</h3>
              <button @click="closeEditModal" class="text-white hover:text-gray-200 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <form @submit.prevent="updateMember" class="px-6 py-6">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ad *</label>
                  <input
                    v-model="editForm.ad"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Soyad *</label>
                  <input
                    v-model="editForm.soyad"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Yaş *</label>
                  <input
                    v-model.number="editForm.yas"
                    type="number"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kilo (kg) *</label>
                  <input
                    v-model.number="editForm.kilo"
                    type="number"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cinsiyet *</label>
                <select
                  v-model="editForm.cinsiyet"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="Kadın">Kadın</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                <input
                  v-model="editForm.telefon"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ücret (₺) *</label>
                <input
                  v-model.number="editForm.ucret"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Not</label>
                <textarea
                  v-model="editForm.not"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ek bilgi... (Opsiyonel)"
                ></textarea>
              </div>
              
              <!-- Registration Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kayıt Tarihi</label>
                <input
                  v-model="editForm.kayit_tarihi"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <!-- Private Lesson Schedule (Only for Özel Ders) -->
              <div v-if="editForm.ders_turu === 'Özel'" class="space-y-4">
                <h4 class="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Ders Programı</h4>
                
                <!-- First Lesson Day -->
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">1. Ders Günü</label>
                    <select
                      v-model="editForm.lesson_day_1"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seçiniz</option>
                      <option value="Pazartesi">Pazartesi</option>
                      <option value="Salı">Salı</option>
                      <option value="Çarşamba">Çarşamba</option>
                      <option value="Perşembe">Perşembe</option>
                      <option value="Cuma">Cuma</option>
                      <option value="Cumartesi">Cumartesi</option>
                      <option value="Pazar">Pazar</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç</label>
                    <input
                      v-model="editForm.lesson_start_time_1"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
                    <input
                      v-model="editForm.lesson_end_time_1"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <!-- Second Lesson Day -->
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">2. Ders Günü</label>
                    <select
                      v-model="editForm.lesson_day_2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seçiniz</option>
                      <option value="Pazartesi">Pazartesi</option>
                      <option value="Salı">Salı</option>
                      <option value="Çarşamba">Çarşamba</option>
                      <option value="Perşembe">Perşembe</option>
                      <option value="Cuma">Cuma</option>
                      <option value="Cumartesi">Cumartesi</option>
                      <option value="Pazar">Pazar</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç</label>
                    <input
                      v-model="editForm.lesson_start_time_2"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş</label>
                    <input
                      v-model="editForm.lesson_end_time_2"
                      type="time"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Lesson Type Display (Read-only) -->
              <div class="bg-gray-50 p-3 rounded-lg">
                <label class="block text-sm font-medium text-gray-700 mb-1">Ders Türü</label>
                <div class="flex items-center">
                  <span
                    :class="[
                      'px-3 py-1 text-sm font-semibold rounded-full',
                      editForm.ders_turu === 'Özel' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    ]"
                  >
                    {{ editForm.ders_turu }}
                  </span>
                  <span class="ml-3 text-sm text-gray-500">
                    (Ders türü değiştirilemez)
                  </span>
                </div>
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                :disabled="editLoading"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="editLoading">Güncelleniyor...</span>
                <span v-else>Güncelle</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

const members = ref([])
const loading = ref(true)
const searchQuery = ref('')
const filterLessonType = ref('')
const filterGender = ref('')
const filterGroupCategory = ref('')
const groupCategories = ref([])

// Edit Modal
const showEditModal = ref(false)
const editLoading = ref(false)
const editingMember = ref(null)
const editForm = ref({
  ad: '',
  soyad: '',
  cinsiyet: '',
  yas: '',
  kilo: '',
  telefon: '',
  ucret: '',
  not: '',
  ders_turu: '',
  kayit_tarihi: '',
  lesson_day_1: '',
  lesson_start_time_1: '',
  lesson_end_time_1: '',
  lesson_day_2: '',
  lesson_start_time_2: '',
  lesson_end_time_2: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(9) // 3x3 grid

// Watch for group category changes
watch(filterGroupCategory, (newValue) => {
  if (newValue) {
    // When a group category is selected, automatically set lesson type to "Grup"
    filterLessonType.value = 'Grup'
  }
})

// Watch for lesson type changes
watch(filterLessonType, (newValue) => {
  if (newValue !== 'Grup') {
    // When lesson type is not "Grup", clear group category filter
    filterGroupCategory.value = ''
  }
})

// Computed properties for stats
const totalMembers = computed(() => members.value.length)
const privateLessonMembers = computed(() => members.value.filter(m => m.ders_turu === 'Özel').length)
const groupLessonMembers = computed(() => members.value.filter(m => m.ders_turu === 'Grup').length)
const totalRevenue = computed(() => {
  return members.value.reduce((sum, member) => {
    if (member.ders_turu === 'Özel' && member.privateLessonPackages) {
      // Count paid packages for private lesson members
      const paidPackages = member.privateLessonPackages.filter(pkg => pkg.paid).length
      return sum + (paidPackages * (member.ucret || 0))
    } else if (member.ders_turu === 'Grup') {
      // For group lessons, count only the registration fee
      return sum + (member.ucret || 0)
    }
    return sum
  }, 0)
})

// Filtered members
const filteredMembers = computed(() => {
  let filtered = members.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(member => 
      member.ad.toLowerCase().includes(query) ||
      member.soyad.toLowerCase().includes(query) ||
      member.telefon.includes(query)
    )
  }

  // Group category filter (also filters to only group lessons)
  if (filterGroupCategory.value) {
    filtered = filtered.filter(member => 
      member.ders_turu === 'Grup' && 
      member.yas_grubu && 
      member.yas_grubu.toString() === filterGroupCategory.value.toString()
    )
  }
  // Lesson type filter (only apply if no group category is selected)
  else if (filterLessonType.value) {
    filtered = filtered.filter(member => member.ders_turu === filterLessonType.value)
  }

  // Gender filter
  if (filterGender.value) {
    filtered = filtered.filter(member => member.cinsiyet === filterGender.value)
  }

  return filtered
})

// Paginated members
const paginatedMembers = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredMembers.value.slice(startIndex, endIndex)
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredMembers.value.length / itemsPerPage.value))
const hasNextPage = computed(() => currentPage.value < totalPages.value)
const hasPrevPage = computed(() => currentPage.value > 1)

// Helper functions
function getInitials(ad, soyad) {
  return `${ad?.[0] || ''}${soyad?.[0] || ''}`.toUpperCase()
}

function getCompletedSessions(pkg) {
  if (!pkg.sessions) return 0
  return pkg.sessions.filter(s => s.is_attended || s.is_missed).length
}

function getActiveSessions(pkg) {
  if (!pkg.sessions) return 0
  // Count only non-postponed sessions (active sessions)
  return pkg.sessions.filter(s => !s.is_postponed).length
}

function getSessionProgress(pkg) {
  if (!pkg.sessions || pkg.sessions.length === 0) return 0
  const completed = getCompletedSessions(pkg)
  const activeSessions = getActiveSessions(pkg)
  
  // If we have more than 8 active sessions, cap at 8 for percentage calculation
  const totalSessions = Math.min(activeSessions, 8)
  if (totalSessions === 0) return 0
  
  return Math.round((completed / 8) * 100) // Always calculate based on 8 lessons
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR')
}

// Fetch group categories on component mount
onMounted(async () => {
  try {
    // Fetch both members and group categories
    const [membersRes, categoriesRes] = await Promise.all([
      axios.get('/api/members'),
      axios.get('/api/group-categories')
    ])
    
    members.value = membersRes.data
    groupCategories.value = categoriesRes.data
  } catch (err) {
    console.error('Veriler alınırken hata:', err)
    members.value = []
    groupCategories.value = []
  } finally {
    loading.value = false
  }
})

// Helper function to get group category name by ID
function getGroupCategoryName(categoryId) {
  if (!categoryId || !groupCategories.value.length) return categoryId
  
  const category = groupCategories.value.find(cat => cat.id === parseInt(categoryId))
  return category ? category.name : categoryId
}

// Pagination functions
function nextPage() {
  if (hasNextPage.value) {
    currentPage.value++
  }
}

function prevPage() {
  if (hasPrevPage.value) {
    currentPage.value--
  }
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Get visible page numbers for pagination
function getVisiblePages() {
  const visibleRange = 2 // Show 2 pages on each side of current page
  let start = Math.max(1, currentPage.value - visibleRange)
  let end = Math.min(totalPages.value, currentPage.value + visibleRange)
  
  // Adjust start if we're near the end
  if (end - start < visibleRange * 2) {
    start = Math.max(1, end - visibleRange * 2)
  }
  
  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
}

// Reset to first page when filters change
watch([searchQuery, filterLessonType, filterGender, filterGroupCategory], () => {
  currentPage.value = 1
})

// Edit Member Functions
function editMember(member) {
  editingMember.value = member
  
  // Format registration date for input[type="date"]
  let formattedDate = ''
  if (member.kayit_tarihi) {
    const date = new Date(member.kayit_tarihi)
    formattedDate = date.toISOString().split('T')[0]
  }
  
  // Get private lesson schedule from first package
  const firstPackage = member.privateLessonPackages?.[0] || {}
  
  editForm.value = {
    ad: member.ad,
    soyad: member.soyad,
    cinsiyet: member.cinsiyet,
    yas: member.yas,
    kilo: member.kilo,
    telefon: member.telefon,
    ucret: member.ucret,
    not: member.not || '',
    ders_turu: member.ders_turu,
    kayit_tarihi: formattedDate,
    lesson_day_1: firstPackage.lesson_day_1 || '',
    lesson_start_time_1: firstPackage.lesson_start_time_1 || '',
    lesson_end_time_1: firstPackage.lesson_end_time_1 || '',
    lesson_day_2: firstPackage.lesson_day_2 || '',
    lesson_start_time_2: firstPackage.lesson_start_time_2 || '',
    lesson_end_time_2: firstPackage.lesson_end_time_2 || ''
  }
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingMember.value = null
  editForm.value = {
    ad: '',
    soyad: '',
    cinsiyet: '',
    yas: '',
    kilo: '',
    telefon: '',
    ucret: '',
    not: '',
    ders_turu: '',
    kayit_tarihi: '',
    lesson_day_1: '',
    lesson_start_time_1: '',
    lesson_end_time_1: '',
    lesson_day_2: '',
    lesson_start_time_2: '',
    lesson_end_time_2: ''
  }
}

async function updateMember() {
  if (!editingMember.value) return
  
  editLoading.value = true
  
  try {
    const updateData = {
      ad: editForm.value.ad,
      soyad: editForm.value.soyad,
      cinsiyet: editForm.value.cinsiyet,
      yas: editForm.value.yas,
      kilo: editForm.value.kilo,
      telefon: editForm.value.telefon,
      ucret: editForm.value.ucret,
      not: editForm.value.not
    }
    
    // Add registration date if provided
    if (editForm.value.kayit_tarihi) {
      updateData.kayit_tarihi = editForm.value.kayit_tarihi
    }
    
    // Add private lesson schedule if it's a private lesson member
    if (editForm.value.ders_turu === 'Özel') {
      console.log('Sending lesson schedule data:', {
        lesson_day_1: editForm.value.lesson_day_1,
        lesson_start_time_1: editForm.value.lesson_start_time_1,
        lesson_end_time_1: editForm.value.lesson_end_time_1,
        lesson_day_2: editForm.value.lesson_day_2,
        lesson_start_time_2: editForm.value.lesson_start_time_2,
        lesson_end_time_2: editForm.value.lesson_end_time_2
      });
      
      if (editForm.value.lesson_day_1) updateData.lesson_day_1 = editForm.value.lesson_day_1
      if (editForm.value.lesson_start_time_1) updateData.lesson_start_time_1 = editForm.value.lesson_start_time_1
      if (editForm.value.lesson_end_time_1) updateData.lesson_end_time_1 = editForm.value.lesson_end_time_1
      if (editForm.value.lesson_day_2) updateData.lesson_day_2 = editForm.value.lesson_day_2
      if (editForm.value.lesson_start_time_2) updateData.lesson_start_time_2 = editForm.value.lesson_start_time_2
      if (editForm.value.lesson_end_time_2) updateData.lesson_end_time_2 = editForm.value.lesson_end_time_2
    }
    
    const response = await axios.patch(`/api/members/${editingMember.value.id}`, updateData)
    
    // Update local data
    const index = members.value.findIndex(m => m.id === editingMember.value.id)
    if (index !== -1) {
      members.value[index] = { ...members.value[index], ...response.data }
    }
    
    closeEditModal()
    alert('Üye bilgileri başarıyla güncellendi!')
    
  } catch (error) {
    console.error('Error updating member:', error)
    alert(error.response?.data?.error || 'Üye güncellenirken hata oluştu.')
  } finally {
    editLoading.value = false
  }
}

async function deleteMember(member) {
  if (!confirm(`${member.ad} ${member.soyad} adlı üyeyi silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz ve üyenin tüm ders kayıtları silinecektir.`)) {
    return
  }
  
  try {
    await axios.delete(`/api/members/${member.id}`)
    
    // Remove from local data
    members.value = members.value.filter(m => m.id !== member.id)
    
    alert('Üye başarıyla silindi.')
    
  } catch (error) {
    console.error('Error deleting member:', error)
    alert(error.response?.data?.error || 'Üye silinirken hata oluştu.')
  }
}
</script>

<style scoped>
/* Custom scrollbar styles */
.max-h-48::-webkit-scrollbar {
  width: 6px;
}

.max-h-48::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* For Firefox */
.max-h-48 {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}
</style> 