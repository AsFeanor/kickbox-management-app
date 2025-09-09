<template>
  <div class="max-w-6xl mx-auto p-4 md:p-8">
    <h1 class="text-2xl font-bold text-blue-700 mb-6 text-center">Özel Dersler</h1>
    <div v-if="loading" class="text-center text-blue-600 font-semibold py-8">Yükleniyor...</div>
    <div v-else-if="members.length === 0" class="text-center text-gray-500 py-8">Özel ders paketi olan üye yok.</div>
    <div v-else class="grid gap-8 md:grid-cols-2">
      <div v-for="member in filteredMembers" :key="member.id" class="bg-white rounded-2xl shadow-md p-0 flex flex-col relative overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100">
          <div>
            <div class="text-lg font-semibold text-gray-800">{{ member.ad }} {{ member.soyad }}</div>
            <div class="text-sm text-gray-400">Telefon: {{ member.telefon }}</div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span
              class="px-3 py-1 text-xs font-semibold rounded-full shadow-sm"
              :class="getCurrentPackage(member).paid ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'"
            >
              {{ getCurrentPackage(member).paid ? 'Ödeme Alındı' : 'Ödeme Bekleniyor' }}
            </span>
            <div class="flex gap-2">
              <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                {{ completedSessionCount(member) }}/8 Tamamlandı
              </span>
              <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-300">
                Toplam {{ allSessions(member).length }} Ders
              </span>
            </div>
            <!-- Renew Package Button -->
            <button
              v-if="getCurrentPackage(member).is_completed && getCurrentPackage(member).paid"
              @click="renewPackage(member)"
              :disabled="renewingPackageId === getCurrentPackage(member).id"
              class="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg v-if="renewingPackageId === getCurrentPackage(member).id" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span v-if="renewingPackageId === getCurrentPackage(member).id">Başlatılıyor...</span>
              <span v-else>Yeni Paket Başlat</span>
            </button>
          </div>
        </div>
        <!-- Payment Button -->
        <div v-if="getCurrentPackage(member) && !getCurrentPackage(member).paid" class="px-6 pt-4">
          <button
            @click="handlePayment(member)"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Ödemeyi Onayla
          </button>
        </div>
        <!-- Lessons Grid -->
        <div class="px-6 pb-6 pt-4">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div
              v-for="lesson in allSessions(member)"
              :key="lesson.id"
              class="rounded-xl flex flex-col items-center justify-center h-20 text-xs font-semibold border transition select-none cursor-pointer relative"
              :class="[
                lesson.is_postponed ? 'bg-yellow-50 border-yellow-300 text-yellow-800' :
                lesson.is_attended ? 'bg-green-50 border-green-300 text-green-800' :
                lesson.is_missed ? 'bg-red-50 border-red-300 text-red-800' :
                isFutureLesson(lesson) ? 'bg-blue-50 border-blue-200 text-blue-700' :
                'bg-gray-50 border-gray-200 text-gray-500',
                selectedLesson && selectedLesson.id === lesson.id && selectedMember && selectedMember.id === member.id && showMenu ? 'ring-2 ring-blue-400' : ''
              ]"
              @click="openMenu(member, lesson, $event)"
            >
              <!-- Future lesson indicator -->
              <div v-if="isFutureLesson(lesson)" class="absolute top-1 right-1">
                <svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span class="mb-1">{{ formatDate(lesson.date) }}</span>
              <span>{{ lesson.start_time }} - {{ lesson.end_time }}</span>
              <span v-if="lesson.is_postponed" class="text-[10px] text-yellow-700 mt-1">
                Ertelendi
                <span v-if="lesson.postponedTo" class="block text-[9px]">
                  → {{ formatDate(lesson.postponedTo.date) }}
                </span>
              </span>
              <span v-else-if="lesson.is_attended" class="text-[10px] text-green-700 mt-1">Katıldı</span>
              <span v-else-if="lesson.is_missed" class="text-[10px] text-red-700 mt-1">Katılmadı</span>
              <span v-else-if="isFutureLesson(lesson)" class="text-[10px] text-blue-600 mt-1">Gelecek</span>
              <span v-else class="text-[10px] text-gray-400 mt-1">Bekliyor</span>

              <!-- Menu/Modal: only for this lesson/member -->
              <div v-if="showMenu && selectedLesson && selectedLesson.id === lesson.id && selectedMember && selectedMember.id === member.id" class="fixed z-50 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-4 transition-all duration-200 transform scale-100 opacity-100" :style="getMenuPosition()">
                <!-- Future Lesson Warning -->
                <div v-if="isFutureLesson(selectedLesson)" class="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <span class="text-sm font-medium text-amber-800">Gelecek Ders</span>
                  </div>
                  <p class="text-xs text-amber-700 mt-1">
                    Sadece bugün veya geçmiş dersler için katılım durumu işaretlenebilir.
                  </p>
                </div>
                
                <!-- Action Buttons -->
                <button 
                  @click.stop="handleAction(selectedMember, selectedLesson, 'attended')" 
                  :disabled="isFutureLesson(selectedLesson)"
                  :class="[
                    'block w-full text-left px-3 py-2 rounded transition-colors',
                    isFutureLesson(selectedLesson) 
                      ? 'text-gray-400 bg-gray-50 cursor-not-allowed opacity-50' 
                      : 'hover:bg-green-50 text-gray-700 hover:text-green-800'
                  ]"
                >
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Katıldı olarak işaretle
                  </div>
                </button>
                
                <button 
                  @click.stop="handleAction(selectedMember, selectedLesson, 'missed')" 
                  :disabled="isFutureLesson(selectedLesson)"
                  :class="[
                    'block w-full text-left px-3 py-2 rounded transition-colors',
                    isFutureLesson(selectedLesson) 
                      ? 'text-gray-400 bg-gray-50 cursor-not-allowed opacity-50' 
                      : 'hover:bg-red-50 text-gray-700 hover:text-red-800'
                  ]"
                >
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Katılmadı (ders hakkı yansın)
                  </div>
                </button>
                
                <!-- Separator -->
                <hr class="my-2 border-gray-200">
                
                <button @click.stop="handleAction(selectedMember, selectedLesson, 'postpone')" class="block w-full text-left px-3 py-2 hover:bg-yellow-50 rounded transition-colors text-gray-700 hover:text-yellow-800">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7l4-4m0 0l4 4m-4-4v18"></path>
                    </svg>
                    1 ders ertele
                  </div>
                </button>
                
                <button @click.stop="openDateModal(selectedMember, selectedLesson)" class="block w-full text-left px-3 py-2 hover:bg-blue-50 rounded transition-colors text-gray-700 hover:text-blue-800">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Yeni tarih ve saat seç
                  </div>
                </button>
                
                <!-- Separator -->
                <hr class="my-2 border-gray-200">
                
                <button @click.stop="closeMenu" class="block w-full text-left px-3 py-2 text-gray-500 hover:bg-gray-100 rounded transition-colors">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Kapat
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Backdrop for menu -->
        <div v-if="showMenu" class="fixed inset-0 z-40" @click="closeMenu"></div>
        
        <!-- Date Modal -->
        <div v-if="showDateModal" class="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div class="bg-white rounded-xl shadow-xl p-6 w-80 relative">
            <button @click="closeDateModal" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">✕</button>
            <h2 class="text-lg font-bold mb-4">Yeni Tarih ve Saat Seç</h2>
            <input v-model="newDate" type="date" class="w-full mb-3 border rounded px-2 py-1" />
            <input v-model="newStartTime" type="time" class="w-full mb-3 border rounded px-2 py-1" />
            <input v-model="newEndTime" type="time" class="w-full mb-3 border rounded px-2 py-1" />
            <button @click="saveNewDate" class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onActivated, onUnmounted } from 'vue'
import axios from 'axios'

const members = ref([])
const loading = ref(true)
const selectedLesson = ref(null)
const selectedMember = ref(null)
const showMenu = ref(false)
const showDateModal = ref(false)
const newDate = ref('')
const newStartTime = ref('')
const newEndTime = ref('')
const renewingPackageId = ref(null)
const menuPosition = ref({ top: 0, left: 0 })

const filteredMembers = computed(() =>
  members.value.filter(m =>
    m.privateLessonPackages &&
    m.privateLessonPackages.length > 0 &&
    m.privateLessonPackages.some(pkg => pkg.sessions && pkg.sessions.length > 0)
  )
)

// Helper function to get the current active package (most recent non-completed package)
function getCurrentPackage(member) {
  if (!member.privateLessonPackages || member.privateLessonPackages.length === 0) {
    return null;
  }
  
  // Find the most recent non-completed package, or if all are completed, the most recent one
  const activePackage = member.privateLessonPackages.find(pkg => !pkg.is_completed);
  if (activePackage) {
    return activePackage;
  }
  
  // If all packages are completed, return the most recent one
  return member.privateLessonPackages[member.privateLessonPackages.length - 1];
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('tr-TR')
}

// Check if lesson is in the future
function isFutureLesson(lesson) {
  if (!lesson || !lesson.date) return false
  
  const lessonDate = new Date(lesson.date)
  const today = new Date()
  
  // Set to start of day for accurate comparison
  today.setHours(0, 0, 0, 0)
  lessonDate.setHours(0, 0, 0, 0)
  
  return lessonDate > today
}

function openMenu(member, lesson, event) {
  selectedLesson.value = lesson
  selectedMember.value = member
  showMenu.value = true
  
  // Calculate menu position based on click event
  const rect = event.target.getBoundingClientRect()
  const menuWidth = 288 // w-72 = 288px
  const menuHeight = 350 // approximate height
  
  let left = rect.left + rect.width / 2 - menuWidth / 2
  let top = rect.top + rect.height / 2 - menuHeight / 2
  
  // Keep menu within viewport
  if (left < 10) left = 10
  if (left + menuWidth > window.innerWidth - 10) left = window.innerWidth - menuWidth - 10
  if (top < 10) top = 10
  if (top + menuHeight > window.innerHeight - 10) top = window.innerHeight - menuHeight - 10
  
  menuPosition.value = { top: `${top}px`, left: `${left}px` }
  
  // Prevent body scroll when menu is open
  document.body.style.overflow = 'hidden'
}
function closeMenu() {
  showMenu.value = false
  selectedLesson.value = null
  selectedMember.value = null
  
  // Restore body scroll when menu is closed
  document.body.style.overflow = 'auto'
}

function getMenuPosition() {
  return menuPosition.value
}
async function refreshMembers() {
  try {
    // İlk olarak mevcut paketlerin completion durumunu güncelle
    await updateCompletedPackages();
    
    // Sonra üyeleri yenile
    const res = await axios.get('/api/members');
    members.value = res.data;
  } catch (err) {
    console.error('Üyeler alınırken hata:', err);
  }
}

async function updateCompletedPackages() {
  try {
    await axios.post('/api/update-completed-packages');
  } catch (err) {
    console.error('Paket durumları güncellenirken hata:', err);
  }
}

function handleAction(member, lesson, actionType) {
  console.log('handleAction called with lesson:', lesson);
  console.log('lesson.id:', lesson.id);
  
  const url = `/api/sessions/private-${lesson.id}`;  // Add 'private-' prefix
  let body = {};
  if (actionType === 'attended') body = { action: 'update_status', status: 'attended' };
  else if (actionType === 'missed') body = { action: 'update_status', status: 'missed' };
  else if (actionType === 'postpone') body = { action: 'postpone_to_next_slot' };
  else return;

  loading.value = true;
  axios.patch(url, body)
    .then(async res => {
      if (actionType === 'attended' || actionType === 'missed') {
        // For attended/missed actions, refresh from API to get updated package completion status
        await refreshMembers();
      } else if (actionType === 'postpone') {
        // For postpone action, just refresh from API to get all updated sessions
        await refreshMembers();
      }
      closeMenu();
    })
    .catch(err => {
      console.error('Hata:', err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert('İşlem sırasında bir hata oluştu.');
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

function updateSessionInMember(member, updatedSession) {
  // Find and update the session in all packages (reactive)
  (member.privateLessonPackages || []).forEach(pkg => {
    const idx = pkg.sessions.findIndex(s => s.id === updatedSession.id);
    if (idx !== -1) {
      // Use splice for Vue reactivity
      pkg.sessions.splice(idx, 1, { ...pkg.sessions[idx], ...updatedSession });
    }
  });
}

function appendSessionToMember(member, newSession) {
  // Add the new session to the correct package
  (member.privateLessonPackages || []).forEach(pkg => {
    if (pkg.id === newSession.packageId) {
      pkg.sessions.push(newSession);
    }
  });
}

function openDateModal(member, lesson) {
  showDateModal.value = true
  showMenu.value = false
  selectedLesson.value = lesson
  selectedMember.value = member
  newDate.value = lesson.date
  newStartTime.value = lesson.start_time
  newEndTime.value = lesson.end_time
}
function closeDateModal() {
  showDateModal.value = false
  selectedLesson.value = null
  selectedMember.value = null
}
function saveNewDate() {
  // TODO: API call to update date/time
  if (selectedLesson.value) {
    selectedLesson.value.date = newDate.value
    selectedLesson.value.start_time = newStartTime.value
    selectedLesson.value.end_time = newEndTime.value
  }
  closeDateModal()
}

function allSessions(member) {
  // Get sessions from the current active package only
  const currentPackage = getCurrentPackage(member);
  if (!currentPackage || !currentPackage.sessions) {
    return [];
  }
  
  // Sort by date ascending
  const sessions = [...currentPackage.sessions];
  sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
  return sessions;
}

function completedSessionCount(member) {
  const sessions = allSessions(member);
  return sessions.filter(s => s.is_attended || s.is_missed).length;
}

async function handlePayment(member) {
  const packageId = getCurrentPackage(member).id;
  try {
    await axios.patch(`/api/private-lesson-packages/${packageId}`, { paid: true });
    // Update local state
    getCurrentPackage(member).paid = true;
  } catch (err) {
    console.error('Ödeme güncellenirken hata:', err);
    alert('Ödeme güncellenirken bir hata oluştu.');
  }
}

async function renewPackage(member) {
  const packageToRenew = getCurrentPackage(member);
  renewingPackageId.value = packageToRenew.id;
  
  try {
    // Prepare renewal data using existing package settings
    // Backend will automatically calculate start_date from the last lesson
    // New package will be created with paid: false (requires new payment)
    const renewalData = {
      lesson_day_1: packageToRenew.lesson_day_1,
      lesson_time_1: `${packageToRenew.lesson_start_time_1}-${packageToRenew.lesson_end_time_1}`,
      lesson_day_2: packageToRenew.lesson_day_2,
      lesson_time_2: `${packageToRenew.lesson_start_time_2}-${packageToRenew.lesson_end_time_2}`
    };
    
    // Call the renew endpoint
    const response = await axios.post(`/api/private-lesson-packages/${packageToRenew.id}/renew`, renewalData);
    
    // Add the new package to the member's packages
    member.privateLessonPackages.push(response.data);
    
    // Refresh data from server to ensure consistency
    await refreshMembers();
    
    alert('Yeni paket başarıyla oluşturuldu! Ödeme yapılana kadar dersler başlamayacaktır.');
  } catch (err) {
    console.error('Paket yenilenirken hata:', err);
    if (err.response && err.response.data && err.response.data.error) {
      alert(err.response.data.error);
    } else {
      alert('Paket yenilenirken bir hata oluştu.');
    }
  } finally {
    renewingPackageId.value = null;
  }
}

// Refresh data when window gains focus (for cross-component updates)
const handleWindowFocus = async () => {
  console.log('Window focused - refreshing PrivateLessons data...');
  await refreshMembers();
}

onMounted(async () => {
  await refreshMembers();
  loading.value = false;
  window.addEventListener('focus', handleWindowFocus);
})

// Refresh data when component is activated (tab switch)
onActivated(async () => {
  console.log('PrivateLessons activated - refreshing data...');
  await refreshMembers();
})

onUnmounted(() => {
  window.removeEventListener('focus', handleWindowFocus);
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.15s ease;
}
</style> 