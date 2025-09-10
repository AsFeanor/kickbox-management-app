<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Grup Dersleri</h1>
          <p class="text-gray-600">Ders kategorileri ve yönetimi</p>
        </div>
        <button
          @click="showNewCategoryModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Yeni Kategori
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loadingCategories" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="bg-white rounded-lg shadow border p-6 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-200 rounded"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div v-else-if="categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Category Header -->
          <div class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-semibold text-gray-900">{{ category.name }}</h3>
                <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    {{ category.min_age }} - {{ category.max_age }} yaş
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ category.time }}
                  </span>
                </div>
                <div class="mt-1 text-sm text-gray-600">
                  {{ getDays(category.days) }}
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="generateSchedule(category.id)"
                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Program
                </button>
                <button
                  @click="activeTab[category.id] = 'members'; loadCategoryMembers(category.id)"
                  class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                  </svg>
                  Üyeler
                </button>
              </div>
            </div>
          </div>

          <!-- Category Content -->
          <div class="p-4">
            <!-- Tabs -->
            <div class="border-b border-gray-200 mb-4">
              <nav class="-mb-px flex space-x-6">
                <button
                  @click="activeTab[category.id] = 'sessions'"
                  :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab[category.id] === 'sessions' || !activeTab[category.id]
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  ]"
                >
                  Seanslar
                </button>
                <button
                  @click="activeTab[category.id] = 'members'; loadCategoryMembers(category.id)"
                  :class="[
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab[category.id] === 'members'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  ]"
                >
                  Üyeler
                </button>
              </nav>
            </div>

            <!-- Sessions Tab -->
            <div v-if="activeTab[category.id] === 'sessions' || !activeTab[category.id]">
              <div v-if="loadingSessions[category.id]" class="text-center py-6">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
              
              <div v-else-if="categorySessions[category.id]?.length > 0">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Yaklaşan Seanslar</h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    v-for="session in categorySessions[category.id]"
                    :key="session.id"
                    @click="toggleSessionExpansion(session.id, category.id)"
                    :class="[
                      'p-3 rounded-lg border text-sm font-medium transition-all text-left',
                      expandedSession === session.id
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    ]"
                  >
                    <div class="text-xs text-gray-500 mb-1">{{ formatDate(session.date) }}</div>
                    <div class="font-semibold">{{ formatTime(session.date) }}</div>
                    <div class="mt-1 text-xs text-blue-600">
                      {{ session.attendees?.length || 0 }} katılımcı
                    </div>
                  </button>
                </div>

                                 <!-- Expanded Session Details -->
                 <div v-if="expandedSession" class="mt-4">
                   <div v-for="session in categorySessions[category.id]" :key="session.id">
                     <div v-if="expandedSession === session.id" class="bg-blue-50 rounded-lg p-4">
                       <div class="flex items-center justify-between mb-4">
                         <h5 class="font-medium text-gray-900">
                           {{ formatDate(session.date) }} - {{ formatTime(session.date) }} Yoklaması
                         </h5>
                         <div class="flex gap-2">
                           <button
                             @click="setAllAttendance(session, category.id, true)"
                             class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                           >
                             Hepsini Katılacak
                           </button>
                           <button
                             @click="setAllAttendance(session, category.id, false)"
                             class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                           >
                             Hepsini Katılmayacak
                           </button>
                         </div>
                       </div>

                                               <!-- Members Attendance List -->
                        <div v-if="getCategoryMembers(category.id).length > 0" class="space-y-2">
                          <div
                            v-for="member in getCategoryMembers(category.id)"
                            :key="member.id"
                            :class="[
                              'flex items-center justify-between p-3 rounded-lg border',
                              hasRemainingLessons(member) ? 'bg-white' : 'bg-gray-100'
                            ]"
                          >
                            <div class="flex items-center gap-3">
                              <div 
                                class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                :class="[
                                  !hasRemainingLessons(member) ? 'bg-gray-500' :
                                  isAttending(session, member.id) ? 'bg-green-500' : 'bg-gray-400'
                                ]"
                              >
                                {{ getInitials(member.ad, member.soyad) }}
                              </div>
                              <div>
                                <div class="font-medium text-gray-900 text-sm">{{ member.ad }} {{ member.soyad }}</div>
                                <div class="text-xs text-gray-500">
                                  {{ member.yas }} yaş • 
                                  <span :class="[
                                    hasRemainingLessons(member) ? 'text-blue-600' : 'text-red-600 font-medium'
                                  ]">
                                    {{ getRemainingLessons(member) }} ders kaldı
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div class="flex items-center gap-3">
                              <!-- Package Status Warning -->
                              <div v-if="!hasRemainingLessons(member)" class="text-center">
                                <span class="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                  Paket Bitti
                                </span>
                              </div>
                              
                              <!-- Normal Status for Active Members -->
                              <div v-else>
                                <!-- Status Badge -->
                                <span
                                  :class="[
                                    'px-2 py-1 rounded-full text-xs font-medium',
                                    isAttending(session, member.id)
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  ]"
                                >
                                  {{ isAttending(session, member.id) ? 'Katılacak' : 'Katılmayacak' }}
                                </span>
                                
                                <!-- Toggle Button -->
                                <button
                                  @click="toggleMemberAttendance(session, member.id, !isAttending(session, member.id))"
                                  :class="[
                                    'px-3 py-1 text-xs rounded-lg font-medium transition-colors ml-2',
                                    isAttending(session, member.id)
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  ]"
                                >
                                  {{ isAttending(session, member.id) ? 'Çıkar' : 'Ekle' }}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                       
                       <div v-else class="text-sm text-gray-500 text-center py-4">
                         Bu kategoride henüz üye yok
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
              
              <div v-else class="text-center py-6 text-gray-500">
                <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-sm">Henüz seans oluşturulmamış</p>
                <button
                  @click="generateSchedule(category.id)"
                  class="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Program Oluştur
                </button>
              </div>
            </div>

            <!-- Members Tab -->
            <div v-if="activeTab[category.id] === 'members'">
              <div v-if="loadingMembers[category.id]" class="text-center py-6">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>

                             <div v-else-if="categoryMembers[category.id]?.length > 0">
                 <!-- Stats -->
                 <div class="grid grid-cols-3 gap-3 mb-4">
                   <div class="bg-blue-50 rounded-lg p-3 text-center">
                     <div class="text-lg font-bold text-blue-600">{{ categoryMembers[category.id].length }}</div>
                     <div class="text-xs text-gray-600">Toplam</div>
                   </div>
                   <div class="bg-green-50 rounded-lg p-3 text-center">
                     <div class="text-lg font-bold text-green-600">{{ categoryMembers[category.id].filter(m => m.paid).length }}</div>
                     <div class="text-xs text-gray-600">Ödendi</div>
                   </div>
                   <div class="bg-red-50 rounded-lg p-3 text-center">
                     <div class="text-lg font-bold text-red-600">{{ categoryMembers[category.id].filter(m => !m.paid).length }}</div>
                     <div class="text-xs text-gray-600">Bekliyor</div>
                   </div>
                 </div>

                 <!-- Action Buttons -->
                 <div class="flex justify-end mb-4">
                   <button
                     @click="fixPackages()"
                     class="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 transition-colors"
                   >
                     Paket Bilgilerini Düzelt
                   </button>
                 </div>

                                 <!-- Members List -->
                 <div class="space-y-3">
                   <div
                     v-for="member in categoryMembers[category.id]"
                     :key="member.id"
                     class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                   >
                     <div class="flex items-center justify-between mb-3">
                       <div class="flex items-center gap-3">
                         <div 
                           class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                           :class="[member.paid ? 'bg-green-500' : 'bg-gray-400']"
                         >
                           {{ getInitials(member.ad, member.soyad) }}
                         </div>
                         <div>
                           <div class="font-medium text-gray-900">{{ member.ad }} {{ member.soyad }}</div>
                           <div class="text-sm text-gray-500">{{ member.yas }} yaş • {{ member.telefon }}</div>
                         </div>
                       </div>
                       <div class="text-right">
                         <div class="font-bold text-gray-900">₺{{ member.ucret }}</div>
                         <button
                           @click="togglePaymentStatus(member)"
                           :class="[
                             'px-3 py-1 text-xs rounded-full font-medium mt-1',
                             member.paid 
                               ? 'bg-green-100 text-green-800' 
                               : 'bg-red-100 text-red-800'
                           ]"
                         >
                           {{ member.paid ? 'Ödendi' : 'Bekliyor' }}
                         </button>
                       </div>
                     </div>
                     
                     <!-- Progress Section -->
                     <div class="border-t border-gray-200 pt-3">
                       <div class="flex items-center justify-between mb-2">
                         <span class="text-sm text-gray-600">Ders İlerlemesi</span>
                         <span class="text-sm font-medium text-gray-900">
                           {{ member.current_package_attended_sessions || 0 }}/{{ member.current_package_total_sessions || 8 }}
                         </span>
                       </div>
                       <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                         <div 
                           class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                           :style="{ width: getPackageProgress(member) + '%' }"
                         ></div>
                       </div>
                       <div class="flex items-center justify-between">
                         <span class="text-xs text-gray-500">
                           {{ getPackageProgress(member) }}% tamamlandı
                         </span>
                         <button
                           @click="openPackageEditModal(member)"
                           class="text-xs text-blue-600 hover:text-blue-800"
                         >
                           Düzenle
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>

              <div v-else class="text-center py-6 text-gray-500">
                <div class="text-sm">Bu kategoride henüz üye yok</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
          <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Henüz kategori yok</h3>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          Grup dersleri için yaş kategorilerini oluşturun. Her kategori için ders günleri ve saatleri belirleyebilirsiniz.
        </p>
        <button
          @click="showNewCategoryModal = true"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          İlk Kategoriyi Oluştur
        </button>
      </div>
    </div>

    <!-- New Category Modal -->
    <div v-if="showNewCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">Yeni Kategori Oluştur</h2>
          <button @click="closeNewCategoryModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="createCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Adı</label>
            <input 
              v-model="newCategory.name" 
              type="text" 
              required 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Örn: Çocuklar, Gençler"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Min Yaş</label>
              <input 
                v-model.number="newCategory.minAge" 
                type="number" 
                required 
                min="5" 
                max="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Yaş</label>
              <input 
                v-model.number="newCategory.maxAge" 
                type="number" 
                required 
                min="5" 
                max="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ders Günleri</label>
            <div class="grid grid-cols-2 gap-2">
              <label v-for="day in weekDays" :key="day" class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="newCategory.days" 
                  :value="day"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">{{ day }}</span>
              </label>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Başlangıç Saati</label>
              <input 
                v-model="newCategory.startTime" 
                type="time" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bitiş Saati</label>
              <input 
                v-model="newCategory.endTime" 
                type="time" 
                required 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div class="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              @click="closeNewCategoryModal"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit" 
              :disabled="creatingCategory"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="creatingCategory">Oluşturuluyor...</span>
              <span v-else>Oluştur</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import config from '../config.js'

// Reactive state
const categories = ref([])
const loadingCategories = ref(false)
const categorySessions = ref({})
const loadingSessions = ref({})
const categoryMembers = ref({})
const loadingMembers = ref({})
const showingMembers = ref({})
const expandedSession = ref(null)
const showNewCategoryModal = ref(false)
const activeTab = ref({})
const creatingCategory = ref(false)

// New category form data
const newCategory = ref({
  name: '',
  minAge: '',
  maxAge: '',
  days: [],
  startTime: '',
  endTime: ''
})

// Week days for checkbox selection
const weekDays = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

// Load categories
async function fetchCategories() {
  loadingCategories.value = true
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/group-categories`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    categories.value = data
    
    // Load sessions for each category
    for (const category of data) {
      await fetchCategorySessions(category.id)
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    alert('Kategoriler yüklenirken hata oluştu. Backend server çalışıyor mu?')
  } finally {
    loadingCategories.value = false
  }
}

// Load sessions for a category
async function fetchCategorySessions(categoryId) {
  loadingSessions.value[categoryId] = true
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/group-categories/${categoryId}/sessions`)
    const sessions = await response.json()
    categorySessions.value[categoryId] = sessions
  } catch (error) {
    console.error('Error fetching sessions:', error)
  } finally {
    loadingSessions.value[categoryId] = false
  }
}

// Load members for a category
async function loadCategoryMembers(categoryId) {
  showingMembers.value[categoryId] = true
  loadingMembers.value[categoryId] = true
  
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/group-categories/${categoryId}/members`)
    const members = await response.json()
    categoryMembers.value[categoryId] = members
  } catch (error) {
    console.error('Error loading members:', error)
    alert('Üyeler yüklenirken hata oluştu.')
  } finally {
    loadingMembers.value[categoryId] = false
  }
}

// Modal functions
function closeNewCategoryModal() {
  showNewCategoryModal.value = false
  // Reset form
  newCategory.value = {
    name: '',
    minAge: '',
    maxAge: '',
    days: [],
    startTime: '',
    endTime: ''
  }
}

async function createCategory() {
  if (newCategory.value.days.length === 0) {
    alert('En az bir ders günü seçmelisiniz!')
    return
  }
  
  if (newCategory.value.minAge >= newCategory.value.maxAge) {
    alert('Minimum yaş, maksimum yaştan küçük olmalıdır!')
    return
  }
  
  creatingCategory.value = true
  
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/group-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newCategory.value.name,
        minAge: newCategory.value.minAge,
        maxAge: newCategory.value.maxAge,
        days: newCategory.value.days,
        startTime: newCategory.value.startTime,
        endTime: newCategory.value.endTime
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      alert('Kategori başarıyla oluşturuldu!')
      closeNewCategoryModal()
      await fetchCategories() // Refresh categories
    } else {
      const error = await response.json()
      alert('Kategori oluşturulurken hata: ' + error.error)
    }
  } catch (error) {
    console.error('Error creating category:', error)
    alert('Kategori oluşturulurken hata oluştu.')
  } finally {
    creatingCategory.value = false
  }
}

// Generate schedule for category
async function generateSchedule(categoryId) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/group-categories/${categoryId}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: new Date().toISOString().split('T')[0]
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      alert(`${result.sessionsCreated} seans oluşturuldu!`)
      await fetchCategorySessions(categoryId)
    } else {
      const error = await response.json()
      alert('Program oluşturulurken hata: ' + error.error)
    }
  } catch (error) {
    console.error('Error generating schedule:', error)
    alert('Program oluşturulurken hata oluştu.')
  }
}

// Toggle payment status
async function togglePaymentStatus(member) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/members/${member.id}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid: !member.paid })
    })
    
    if (response.ok) {
      member.paid = !member.paid
    }
  } catch (error) {
    console.error('Error updating payment:', error)
    alert('Ödeme durumu güncellenirken hata oluştu.')
  }
}

// Toggle session expansion
async function toggleSessionExpansion(sessionId, categoryId) {
  if (expandedSession.value === sessionId) {
    expandedSession.value = null
  } else {
    expandedSession.value = sessionId
    
    // Load category members if not already loaded
    if (!categoryMembers.value[categoryId] || categoryMembers.value[categoryId].length === 0) {
      console.log(`Loading members for category ${categoryId} when opening session ${sessionId}`)
      await loadCategoryMembers(categoryId)
    }
  }
}

// Helper functions
function getInitials(ad, soyad) {
  return `${ad?.[0] || ''}${soyad?.[0] || ''}`.toUpperCase()
}

function getDays(days) {
  try {
    if (Array.isArray(days)) {
      return days.join(', ')
    }
    if (typeof days === 'string') {
      const parsed = JSON.parse(days)
      return Array.isArray(parsed) ? parsed.join(', ') : 'Günler belirtilmemiş'
    }
    return 'Günler belirtilmemiş'
  } catch (error) {
    return 'Günler belirtilmemiş'
  }
}

// Package progress calculation
function getPackageProgress(member) {
  if (!member.current_package_total_sessions || member.current_package_total_sessions === 0) return 0
  
  const attended = member.current_package_attended_sessions || 0
  const total = member.current_package_total_sessions
  
  return Math.round((attended / total) * 100)
}

// Session attendance helpers
function getCategoryMembers(categoryId) {
  return categoryMembers.value[categoryId] || []
}

function isAttending(session, memberId) {
  return session.attendees.some(attendee => attendee.id === memberId)
}

// Package status helpers
function hasRemainingLessons(member) {
  const attended = member.current_package_attended_sessions || 0
  const total = member.current_package_total_sessions || 8
  return attended < total
}

function getRemainingLessons(member) {
  const attended = member.current_package_attended_sessions || 0
  const total = member.current_package_total_sessions || 8
  const remaining = total - attended
  return remaining > 0 ? remaining : 0
}

// Attendance management
async function setAllAttendance(session, categoryId, willAttend) {
  const members = getCategoryMembers(categoryId)
  
  // Filter members based on remaining lessons
  const eligibleMembers = willAttend 
    ? members.filter(member => hasRemainingLessons(member)) // Only members with remaining lessons
    : members // For removing, process all members
  
  try {
    // Update eligible members attendance in parallel
    const promises = eligibleMembers.map(member => 
      fetch(`${config.API_BASE_URL}/api/group-sessions/${session.id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: member.id, present: willAttend })
      })
    )
    
    await Promise.all(promises)
    
    // Update package attendance for eligible members
    const packagePromises = eligibleMembers.map(member =>
      fetch(`${config.API_BASE_URL}/api/members/${member.id}/update-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: willAttend })
      })
    )
    
    await Promise.all(packagePromises)
    
    // Show info message about excluded members
    if (willAttend) {
      const excludedCount = members.length - eligibleMembers.length
      if (excludedCount > 0) {
        alert(`${eligibleMembers.length} üye katılımcı olarak işaretlendi. ${excludedCount} üyenin paketi bittiği için işlem yapılmadı.`)
      }
    }
    
    // Refresh the session data
    await fetchCategorySessions(categoryId)
    
    // Also refresh member list if members tab is active
    if (activeTab.value[categoryId] === 'members') {
      await loadCategoryMembers(categoryId)
    }
  } catch (error) {
    console.error('Error setting all attendance:', error)
    alert('Toplu yoklama güncellenirken hata oluştu.')
  }
}

async function toggleMemberAttendance(session, memberId, willAttend) {
  // Find the member to check their package status
  // First find which category this session belongs to
  let member = null
  for (const [categoryId, members] of Object.entries(categoryMembers.value)) {
    member = members.find(m => m.id === memberId)
    if (member) break
  }
  
  // Check if trying to add member with no remaining lessons
  if (willAttend && member && !hasRemainingLessons(member)) {
    alert(`${member.ad} ${member.soyad} adlı üyenin paketi bitmiş. Yeni paket başlatılmalı.`)
    return
  }
  
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/group-sessions/${session.id}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, present: willAttend })
    })
    
    if (response.ok) {
      // Update package attendance
      await fetch(`${config.API_BASE_URL}/api/members/${memberId}/update-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: willAttend })
      })
      
      // Find category for this session
      const category = categories.value.find(c => 
        categorySessions.value[c.id]?.some(s => s.id === session.id)
      )
      
      if (category) {
        await fetchCategorySessions(category.id)
        // Also refresh member list if members tab is active
        if (activeTab.value[category.id] === 'members') {
          await loadCategoryMembers(category.id)
        }
      }
    }
  } catch (error) {
    console.error('Error updating attendance:', error)
    alert('Yoklama güncellenirken hata oluştu.')
  }
}

// Package editing
function openPackageEditModal(member) {
  // Simple implementation - you can expand this with a proper modal
  const newAttended = prompt(
    `${member.ad} ${member.soyad} için katıldığı ders sayısını girin:`,
    member.current_package_attended_sessions || 0
  )
  
  if (newAttended !== null) {
    updateMemberPackage(member, parseInt(newAttended))
  }
}

async function updateMemberPackage(member, attendedSessions) {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/members/${member.id}/update-package`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attended_sessions: attendedSessions
      })
    })
    
    if (response.ok) {
      // Update local state
      member.current_package_attended_sessions = attendedSessions
      alert('Paket bilgileri güncellendi!')
    }
  } catch (error) {
    console.error('Error updating package:', error)
    alert('Paket güncellenirken hata oluştu.')
  }
}

// Fix all packages
async function fixPackages() {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/group-members/fix-packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (response.ok) {
      const result = await response.json()
      alert(`${result.fixedCount} üyenin paket bilgisi düzeltildi!`)
      
      // Refresh all member lists
      for (const category of categories.value) {
        if (activeTab.value[category.id] === 'members') {
          await loadCategoryMembers(category.id)
        }
      }
    }
  } catch (error) {
    console.error('Error fixing packages:', error)
    alert('Paket bilgileri düzeltilirken hata oluştu.')
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('tr-TR', { 
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatTime(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 GrupDersleri component mounted')
  
  // Test backend connection
  try {
    const testResponse = await fetch(`${config.API_BASE_URL}/api/group-categories`)
    console.log('📡 Backend test response status:', testResponse.status)
    if (testResponse.ok) {
      console.log('✅ Backend is running')
    } else {
      console.log('❌ Backend returned error:', testResponse.status)
    }
  } catch (error) {
    console.log('🔥 Backend connection failed:', error.message)
    alert('Backend server bağlantısı kurulamadı. Lütfen backend server\'ı başlatın.')
    return
  }
  
  await fetchCategories()
})
</script> 