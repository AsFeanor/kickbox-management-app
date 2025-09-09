<template>
  <div class="max-w-2xl mx-auto p-6 bg-white/90 rounded-2xl shadow-xl mt-8 mb-8">
    <h2 class="text-2xl font-bold mb-2 text-gray-800">Üye Kayıt Formu</h2>
    <p class="mb-6 text-gray-500">Lütfen tüm zorunlu alanları eksiksiz doldurun. <span class="text-red-500">*</span> zorunlu alanları belirtir.</p>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Ad <span class="text-red-500">*</span></label>
          <input v-model="form.ad" type="text" 
            :class="['w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400', {'border-red-500': errors.ad}]" 
            placeholder="Adınızı girin" required />
          <p v-if="errors.ad" class="text-red-500 text-xs mt-1">Bu alan zorunludur.</p>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Soyad <span class="text-red-500">*</span></label>
          <input v-model="form.soyad" type="text" 
            :class="['w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400', {'border-red-500': errors.soyad}]" 
            placeholder="Soyadınızı girin" required />
          <p v-if="errors.soyad" class="text-red-500 text-xs mt-1">Bu alan zorunludur.</p>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Cinsiyet <span class="text-red-500">*</span></label>
          <select v-model="form.cinsiyet" 
            :class="['w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400', {'border-red-500': errors.cinsiyet}]" 
            required>
            <option value="">Seçiniz</option>
            <option value="Kadın">Kadın</option>
            <option value="Erkek">Erkek</option>
            <option value="Diğer">Diğer</option>
          </select>
          <p v-if="errors.cinsiyet" class="text-red-500 text-xs mt-1">Bu alan zorunludur.</p>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Kayıt Tarihi <span class="text-red-500">*</span></label>
          <input v-model="form.kayitTarihi" type="date" 
            :class="['w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400', {'border-red-500': errors.kayitTarihi}]" 
            required />
          <p v-if="errors.kayitTarihi" class="text-red-500 text-xs mt-1">Bu alan zorunludur.</p>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Yaş <span class="text-red-500">*</span></label>
          <input v-model.number="form.yas" type="number" min="0" 
            :class="['w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400', {'border-red-500': errors.yas}]" 
            placeholder="Örn: 25" required />
          <p v-if="errors.yas" class="text-red-500 text-xs mt-1">Bu alan zorunludur.</p>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Kilo (kg) <span class="text-red-500">*</span></label>
          <input v-model.number="form.kilo" type="number" min="0" 
            :class="['w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400', {'border-red-500': errors.kilo}]" 
            placeholder="Örn: 70" required />
          <p v-if="errors.kilo" class="text-red-500 text-xs mt-1">Bu alan zorunludur.</p>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Telefon Numarası <span class="text-red-500">*</span></label>
          <input v-model="form.telefon" type="tel" 
            :class="['w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400', {'border-red-500': errors.telefon}]" 
            placeholder="05xx xxx xx xx" required />
          <p v-if="errors.telefon" class="text-red-500 text-xs mt-1">Bu alan zorunludur.</p>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Ders Türü <span class="text-red-500">*</span></label>
          <select v-model="form.dersTuru" 
            :class="['w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400', {'border-red-500': errors.dersTuru}]" 
            required>
            <option value="">Seçiniz</option>
            <option value="Özel">Özel</option>
            <option value="Grup">Grup</option>
          </select>
          <p v-if="errors.dersTuru" class="text-red-500 text-xs mt-1">Bu alan zorunludur.</p>
        </div>
        <div v-if="form.dersTuru === 'Grup'">
          <label class="block mb-1 font-semibold text-gray-700">Grup Kategorisi <span class="text-red-500">*</span></label>
          <select v-model="form.yasGrubu" 
            :class="['w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400', {'border-red-500': errors.yasGrubu}]" 
            required>
            <option value="">Seçiniz</option>
            <option v-for="category in eligibleCategories" :key="category.id" :value="category.id">
              {{ category.name }} 
              <span v-if="category.minAge || category.maxAge">
                ({{ category.minAge || 0 }} - {{ category.maxAge || 99 }} yaş)
              </span>
            </option>
          </select>
          <p v-if="errors.yasGrubu" class="text-red-500 text-xs mt-1">Bu alan zorunludur.</p>
          <p v-if="form.yas && eligibleCategories.length === 0" class="text-orange-500 text-xs mt-1">
            Bu yaş için uygun grup kategorisi bulunamadı.
          </p>
        </div>
        
        <!-- Mevcut Paket Durumu (Grup Dersi için) -->
        <div v-if="form.dersTuru === 'Grup' && form.yasGrubu" class="col-span-1 md:col-span-2">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="font-semibold text-blue-700 mb-3">Mevcut Paket Durumu</h3>
            <p class="text-sm text-blue-600 mb-3">
              Bu üye daha önce derse katıldıysa, mevcut paket durumunu belirtin.
              {{ getSelectedCategoryInfo() }}
            </p>
            
            <div class="space-y-3">
              <div>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="form.packageStatus" 
                    value="new" 
                    class="mr-2 text-blue-600"
                  />
                  <span class="text-sm font-medium">Yeni üye - paket başlatılacak</span>
                </label>
              </div>
              
              <div>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="form.packageStatus" 
                    value="active" 
                    class="mr-2 text-blue-600"
                  />
                  <span class="text-sm font-medium">Aktif paketi var - devam ediyor</span>
                </label>
              </div>
              
              <div>
                <label class="flex items-center">
                  <input 
                    type="radio" 
                    v-model="form.packageStatus" 
                    value="completed" 
                    class="mr-2 text-blue-600"
                  />
                  <span class="text-sm font-medium">Paketi tamamlamış - yeni paket gerekli</span>
                </label>
              </div>
            </div>
            <p v-if="errors.packageStatus" class="text-red-500 text-xs mt-2">Paket durumunu seçiniz.</p>
            
            <!-- Aktif Paket Detayları -->
            <div v-if="form.packageStatus === 'active'" class="mt-4 p-3 bg-white rounded border">
              <label class="block mb-2 text-sm font-medium text-gray-700">Katıldığı Ders Sayısı</label>
              <div class="flex items-center gap-3">
                <input 
                  v-model.number="form.attendedSessions" 
                  type="number" 
                  min="0" 
                  :max="getSelectedCategoryTotalSessions()"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="0"
                />
                <span class="text-sm text-gray-600">/ {{ getSelectedCategoryTotalSessions() }} ders</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Bu üyenin şu anki paketinde kaç derse katıldığını girin.
              </p>
            </div>
            
            <!-- Paket Başlangıç Tarihi -->
            <div v-if="form.packageStatus === 'active'" class="mt-3">
              <label class="block mb-1 text-sm font-medium text-gray-700">Paket Başlangıç Tarihi</label>
              <input 
                v-model="form.packageStartDate" 
                type="date" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <p class="text-xs text-gray-500 mt-1">
                Mevcut paketinin başladığı tarihi girin.
              </p>
            </div>
          </div>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-gray-700">Ücret (₺) <span class="text-red-500">*</span></label>
          <input v-model.number="form.ucret" type="number" min="0" 
            :class="['w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400', {'border-red-500': errors.ucret}]" 
            placeholder="Örn: 500" required />
          <p v-if="errors.ucret" class="text-red-500 text-xs mt-1">Bu alan zorunludur.</p>
        </div>
      </div>
      <div>
        <label class="block mb-1 font-semibold text-gray-700">Not</label>
        <textarea v-model="form.not" 
          :class="'w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition placeholder-gray-400'" 
          rows="3" placeholder="Ek bilgi... (Opsiyonel)"></textarea>
      </div>
      <!-- Özel Ders Gün/Saat Seçimi -->
      <div v-if="form.dersTuru === 'Özel'" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 mb-2">
        <h3 class="font-semibold text-blue-700 mb-2">Özel Ders Gün ve Saatleri</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1 font-medium text-gray-700">Gün 1</label>
            <select v-model="form.lesson_day_1" class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Seçiniz</option>
              <option>Pazartesi</option>
              <option>Salı</option>
              <option>Çarşamba</option>
              <option>Perşembe</option>
              <option>Cuma</option>
              <option>Cumartesi</option>
              <option>Pazar</option>
            </select>
          </div>
          <div class="flex gap-2 items-end">
            <div class="flex-1">
              <label class="block mb-1 font-medium text-gray-700">Saat Başlangıç</label>
              <input v-model="form.lesson_start_time_1" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <span class="mx-1 text-gray-500">-</span>
            <div class="flex-1">
              <label class="block mb-1 font-medium text-gray-700">Saat Bitiş</label>
              <input v-model="form.lesson_end_time_1" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block mb-1 font-medium text-gray-700">Gün 2</label>
            <select v-model="form.lesson_day_2" class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Seçiniz</option>
              <option>Pazartesi</option>
              <option>Salı</option>
              <option>Çarşamba</option>
              <option>Perşembe</option>
              <option>Cuma</option>
              <option>Cumartesi</option>
              <option>Pazar</option>
            </select>
          </div>
          <div class="flex gap-2 items-end">
            <div class="flex-1">
              <label class="block mb-1 font-medium text-gray-700">Saat Başlangıç</label>
              <input v-model="form.lesson_start_time_2" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <span class="mx-1 text-gray-500">-</span>
            <div class="flex-1">
              <label class="block mb-1 font-medium text-gray-700">Saat Bitiş</label>
              <input v-model="form.lesson_end_time_2" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
        </div>
      </div>
      <!-- /Özel Ders Gün/Saat Seçimi -->
      <div class="sticky bottom-0 bg-white/90 pt-4 pb-2 z-10 flex justify-end rounded-b-2xl">
        <button type="submit" :disabled="loading" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-white font-semibold py-2 px-8 rounded-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed">
          <span v-if="loading">Kaydediliyor...</span>
          <span v-else>Kaydet</span>
        </button>
      </div>
    </form>
    <div v-if="successMessage" class="text-green-600 font-semibold mt-2">{{ successMessage }}</div>
    <div v-if="errorMessage" class="text-red-600 font-semibold mt-2">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, computed } from 'vue'
import axios from 'axios'

const form = reactive({
  ad: '',
  soyad: '',
  cinsiyet: '',
  kayitTarihi: '',
  yas: '',
  kilo: '',
  telefon: '',
  dersTuru: '',
  yasGrubu: '',
  ucret: '',
  not: '',
  lesson_day_1: '',
  lesson_start_time_1: '',
  lesson_end_time_1: '',
  lesson_day_2: '',
  lesson_start_time_2: '',
  lesson_end_time_2: '',
  packageStatus: '',
  attendedSessions: '',
  packageStartDate: ''
})

const errors = reactive({})
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const groupCategories = ref([])

// Fetch group categories on component mount
onMounted(async () => {
  await fetchGroupCategories()
})

async function fetchGroupCategories() {
  try {
    const response = await axios.get('/api/group-categories')
    groupCategories.value = response.data.map(category => ({
      ...category,
      totalSessions: category.days.length * 4 // 4 hafta × haftadaki ders sayısı
    }))
  } catch (error) {
    console.error('Error fetching group categories:', error)
  }
}

// Computed property to get eligible categories based on user's age
const eligibleCategories = computed(() => {
  if (!form.yas || !groupCategories.value.length) return []
  
  const age = Number(form.yas)
  return groupCategories.value.filter(category => {
    const minAge = category.minAge || 0
    const maxAge = category.maxAge || 999
    return age >= minAge && age <= maxAge
  })
})

function validate() {
  errors.ad = !form.ad
  errors.soyad = !form.soyad
  errors.cinsiyet = !form.cinsiyet
  errors.kayitTarihi = !form.kayitTarihi
  errors.yas = !form.yas
  errors.kilo = !form.kilo
  errors.telefon = !form.telefon
  errors.dersTuru = !form.dersTuru
  errors.ucret = !form.ucret
  if (form.dersTuru === 'Grup') {
    errors.yasGrubu = !form.yasGrubu
    // Package status validation for group lessons
    if (form.yasGrubu && !form.packageStatus) {
      errors.packageStatus = true
    } else {
      errors.packageStatus = false
    }
  } else {
    errors.yasGrubu = false
    errors.packageStatus = false
  }
  // Not alanı opsiyonel
  return !Object.values(errors).some(Boolean)
}

async function handleSubmit() {
  successMessage.value = ''
  errorMessage.value = ''
  if (!validate()) return
  loading.value = true
  try {
    const payload = {
      ad: form.ad,
      soyad: form.soyad,
      cinsiyet: form.cinsiyet,
      kayit_tarihi: form.kayitTarihi,
      yas: Number(form.yas),
      kilo: Number(form.kilo),
      telefon: form.telefon,
      ders_turu: form.dersTuru,
      yas_grubu: form.dersTuru === 'Grup' ? form.yasGrubu : null,
      ucret: Number(form.ucret),
      not: form.not
    }
    
    // Add package info for group lessons
    if (form.dersTuru === 'Grup' && form.packageStatus) {
      payload.packageStatus = form.packageStatus
      if (form.packageStatus === 'active') {
        payload.attendedSessions = Number(form.attendedSessions) || 0
        payload.packageStartDate = form.packageStartDate || form.kayitTarihi
        
        // Calculate total sessions for this category
        const selectedCategory = groupCategories.value.find(c => c.id === form.yasGrubu)
        if (selectedCategory) {
          payload.totalSessions = selectedCategory.totalSessions
        }
      }
    }
    
    if (form.dersTuru === 'Özel') {
      payload.lesson_day_1 = form.lesson_day_1
      payload.lesson_start_time_1 = form.lesson_start_time_1
      payload.lesson_end_time_1 = form.lesson_end_time_1
      payload.lesson_day_2 = form.lesson_day_2
      payload.lesson_start_time_2 = form.lesson_start_time_2
      payload.lesson_end_time_2 = form.lesson_end_time_2
    }
    await axios.post('/api/members', payload)
    Object.keys(form).forEach(k => form[k] = '')
    form.packageStatus = '' // Reset package status
    successMessage.value = 'Üye başarıyla kaydedildi!'
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Kayıt sırasında bir hata oluştu.'
  } finally {
    loading.value = false
  }
}

// Watch for lesson start time changes and auto-set end times
watch(() => form.lesson_start_time_1, (newTime) => {
  console.log('lesson_start_time_1 changed:', newTime);
  if (newTime) {
    form.lesson_end_time_1 = addOneHour(newTime);
    console.log('Set lesson_end_time_1 to:', form.lesson_end_time_1);
  }
});

watch(() => form.lesson_start_time_2, (newTime) => {
  console.log('lesson_start_time_2 changed:', newTime);
  if (newTime) {
    form.lesson_end_time_2 = addOneHour(newTime);
    console.log('Set lesson_end_time_2 to:', form.lesson_end_time_2);
  }
});

// Helper function to add one hour to time string
function addOneHour(timeString) {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':').map(Number);
  let newHours = hours + 1;
  
  // Handle 24-hour wraparound
  if (newHours >= 24) {
    newHours = newHours - 24;
  }
  
  // Format as HH:MM
  return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Helper function to get selected category information
function getSelectedCategoryInfo() {
  const selectedCategory = groupCategories.value.find(c => c.id === form.yasGrubu)
  if (selectedCategory) {
    return `${selectedCategory.name} (${selectedCategory.minAge || 0} - ${selectedCategory.maxAge || 99} yaş)`
  }
  return 'Seçilen kategori bilgisi bulunamadı'
}

// Helper function to get selected category total sessions
function getSelectedCategoryTotalSessions() {
  const selectedCategory = groupCategories.value.find(c => c.id === form.yasGrubu)
  if (selectedCategory) {
    return selectedCategory.totalSessions || 8
  }
  return 8 // default
}
</script> 