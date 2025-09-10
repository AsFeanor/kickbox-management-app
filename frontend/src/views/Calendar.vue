<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Ders Takvimi
              </h1>
              <p class="text-sm text-gray-500">Tüm derslerinizi tek yerden yönetin</p>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="hidden md:flex items-center space-x-6">
            <div class="text-center">
              <div class="text-lg font-semibold text-gray-900">{{ stats.totalEvents }}</div>
              <div class="text-xs text-gray-500">Toplam Ders</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-green-600">{{ stats.privateEvents }}</div>
              <div class="text-xs text-gray-500">Özel Ders</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-blue-600">{{ stats.groupEvents }}</div>
              <div class="text-xs text-gray-500">Grup Dersi</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Navigation and View Controls -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <!-- Navigation and Current Date -->
          <div class="flex items-center space-x-4">
            <!-- Navigation Buttons -->
            <div class="flex items-center space-x-2">
              <button
                @click="navigateCalendar('prev')"
                class="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                title="Önceki"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              
              <button
                @click="navigateCalendar('today')"
                class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                Bugün
              </button>
              
              <button
                @click="navigateCalendar('next')"
                class="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                title="Sonraki"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            <!-- Current Date Display -->
            <div class="hidden sm:block">
              <h2 class="text-xl font-bold text-gray-900">{{ currentDateDisplay }}</h2>
            </div>
          </div>
          
          <!-- View Controls -->
          <div class="flex items-center space-x-2">
            <button
              v-for="view in viewOptions"
              :key="view.value"
              @click="changeView(view.value)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                currentView === view.value
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              ]"
            >
              {{ view.label }}
            </button>
            
            <!-- Day Click Hint -->
            <div v-if="currentView === 'dayGridMonth'" class="hidden lg:block text-xs text-gray-500 ml-3">
              💡 Güne tıklayarak detaylı görünümü açabilirsiniz
            </div>
          </div>
          
          <!-- Legend -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Özel Ders</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-gray-600">Grup Dersi</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span class="text-sm text-gray-600">Geçmiş</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Container -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <p class="text-gray-600 font-medium">Takvim yükleniyor...</p>
            <p class="text-sm text-gray-500 mt-1">Lütfen bekleyiniz</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="events.length === 0" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Henüz ders bulunmuyor</h3>
            <p class="text-gray-500">Dersler eklendiğinde burada görünecekler</p>
          </div>
        </div>

        <!-- Calendar -->
        <div v-else class="p-6">
          <FullCalendar ref="fullCalendar" :options="calendarOptions" />
        </div>
      </div>
    </div>

    <!-- Event Detail Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>
        
        <div class="relative inline-block bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-white">Ders Detayları</h3>
              <button @click="closeModal" class="text-white hover:text-gray-200 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="px-6 py-6" v-if="selectedEvent">
            <div class="space-y-4">
              <!-- Event Title -->
              <div class="text-center">
                <h4 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedEvent.title }}</h4>
                <div class="flex items-center justify-center space-x-2">
                  <span 
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      selectedEvent.extendedProps.type === 'private' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    ]"
                  >
                    <span class="w-2 h-2 rounded-full mr-2" :class="selectedEvent.extendedProps.type === 'private' ? 'bg-green-500' : 'bg-blue-500'"></span>
                    {{ selectedEvent.extendedProps.type === 'private' ? 'Özel Ders' : 'Grup Dersi' }}
                  </span>
                </div>
              </div>

              <!-- Event Details Grid -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-600">Tarih:</span>
                    <p class="text-gray-900 mt-1">{{ formatEventDate(selectedEvent.start) }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-gray-600">Saat:</span>
                    <p class="text-gray-900 mt-1">{{ formatEventTime(selectedEvent.start) }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-gray-600">Süre:</span>
                    <p class="text-gray-900 mt-1">{{ calculateDuration(selectedEvent.start, selectedEvent.end) }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-gray-600">Durum:</span>
                    <div class="mt-1">
                      <span 
                        :class="[
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          getStatusColor(selectedEvent.extendedProps.status)
                        ]"
                      >
                        <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotColor(selectedEvent.extendedProps.status)"></span>
                        {{ getStatusText(selectedEvent.extendedProps.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Group Session Additional Info -->
              <div v-if="selectedEvent.extendedProps.type === 'group'" class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="font-medium text-blue-900">Katılımcı Sayısı</p>
                    <p class="text-2xl font-bold text-blue-700">{{ selectedEvent.extendedProps.attendeesCount || 0 }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Future Lesson Warning -->
            <div v-if="selectedEvent?.extendedProps?.type === 'private' && isFutureLesson()" class="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div>
                  <p class="font-medium">Gelecek Ders Uyarısı</p>
                  <p class="mt-1 text-amber-600">Bu ders henüz gerçekleşmediği için "Katıldı" ve "Katılmadı" işaretlenemez. Sadece "Ertelendi" seçeneği kullanılabilir.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="bg-gray-50 px-6 py-4">
            <div class="flex items-center justify-between">
              <!-- Status Update Buttons for Private Lessons -->
              <div v-if="selectedEvent?.extendedProps?.type === 'private'" class="flex space-x-2">
                <button
                  v-for="status in statusOptions"
                  :key="status.value"
                  @click="updateEventStatus(status.value)"
                  :disabled="isStatusButtonDisabled(status.value)"
                  :class="[
                    'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isStatusButtonDisabled(status.value)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                      : `${status.color} hover:shadow-lg transform hover:scale-105`
                  ]"
                >
                  <span :class="status.icon + ' mr-2'"></span>
                  {{ status.label }}
                </button>
              </div>
              
              <div class="flex-1"></div>
              
              <button
                @click="closeModal"
                class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import config from '../config.js'

export default {
  name: 'Calendar',
  components: {
    FullCalendar
  },
  data() {
    return {
      loading: true,
      events: [],
      showModal: false,
      selectedEvent: null,
      currentView: 'dayGridMonth',
      currentDate: new Date(),
      
      viewOptions: [
        { value: 'dayGridMonth', label: 'Ay' },
        { value: 'timeGridWeek', label: 'Hafta' },
        { value: 'timeGridDay', label: 'Gün' }
      ],
      
      statusOptions: [
        { 
          value: 'attended', 
          label: 'Katıldı', 
          color: 'bg-green-600 text-white', 
          icon: 'w-4 h-4' 
        },
        { 
          value: 'missed', 
          label: 'Katılmadı', 
          color: 'bg-red-600 text-white', 
          icon: 'w-4 h-4' 
        }
      ],
      
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: false, // We'll create our own
        events: [],
        height: 'auto',
        eventClick: this.handleEventClick,
        eventDrop: this.handleEventDrop,
        dateClick: this.handleDateClick,
        datesSet: this.handleDatesSet,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        firstDay: 1, // Monday
        locale: 'tr',
        eventClassNames: this.getEventClassNames,
        eventDidMount: this.styleEvent,
        nowIndicator: true,
        navLinks: true,
        eventDisplay: 'block',
        displayEventTime: true,
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }
      }
    }
  },
  
  computed: {
    stats() {
      const total = this.events.length
      const privateEvents = this.events.filter(e => e.extendedProps?.type === 'private').length
      const groupEvents = this.events.filter(e => e.extendedProps?.type === 'group').length
      
      return {
        totalEvents: total,
        privateEvents,
        groupEvents
      }
    },
    
    currentDateDisplay() {
      const options = { 
        year: 'numeric', 
        month: 'long',
        locale: 'tr-TR'
      }
      
      if (this.currentView === 'timeGridWeek') {
        // For week view, show week range
        const startOfWeek = new Date(this.currentDate)
        const dayOfWeek = startOfWeek.getDay()
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Monday
        startOfWeek.setDate(diff)
        
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        
        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${startOfWeek.getDate()}-${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}`
        } else {
          return `${startOfWeek.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}`
        }
      } else if (this.currentView === 'timeGridDay') {
        return this.currentDate.toLocaleDateString('tr-TR', { 
          weekday: 'long',
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })
      } else {
        // Month view
        return this.currentDate.toLocaleDateString('tr-TR', options)
      }
    }
  },
  
  async mounted() {
    await this.fetchEvents()
  },
  
  methods: {
    async fetchEvents(preserveView = false) {
      this.loading = true
      
      // Store current view state if preserving
      let currentCalendarView = null
      let currentCalendarDate = null
      
      if (preserveView && this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi()
        currentCalendarView = calendarApi.view.type
        currentCalendarDate = calendarApi.getDate()
      }
      
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/calendar-events`)
        if (!response.ok) throw new Error('Failed to fetch events')
        
        const data = await response.json()
        this.events = data
        this.calendarOptions.events = data
        
        // Restore view if preserving
        this.$nextTick(() => {
          if (preserveView && this.$refs.fullCalendar && currentCalendarView) {
            const calendarApi = this.$refs.fullCalendar.getApi()
            calendarApi.changeView(currentCalendarView, currentCalendarDate)
            this.currentView = currentCalendarView
            this.updateCurrentDate(calendarApi)
          }
        })
      } catch (error) {
        console.error('Error fetching calendar events:', error)
        this.showNotification('Takvim etkinlikleri yüklenirken hata oluştu', 'error')
      } finally {
        this.loading = false
      }
    },
    
    changeView(view) {
      this.currentView = view
      
      // Update calendar view if it's already mounted
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi()
        calendarApi.changeView(view)
        this.updateCurrentDate(calendarApi)
      }
    },
    
    navigateCalendar(action) {
      if (!this.$refs.fullCalendar) return
      
      const calendarApi = this.$refs.fullCalendar.getApi()
      
      switch (action) {
        case 'prev':
          calendarApi.prev()
          break
        case 'next':
          calendarApi.next()
          break
        case 'today':
          calendarApi.today()
          break
      }
      
      this.updateCurrentDate(calendarApi)
    },
    
    updateCurrentDate(calendarApi) {
      this.currentDate = calendarApi.getDate()
    },
    
    handleDatesSet(dateInfo) {
      // Update current date when calendar view changes
      this.currentDate = dateInfo.view.currentStart
    },
    
    handleDateClick(info) {
      // Only switch to day view if we're not already in day view
      if (this.currentView !== 'timeGridDay') {
        this.currentView = 'timeGridDay'
        
        // Update calendar view and navigate to clicked date
        if (this.$refs.fullCalendar) {
          const calendarApi = this.$refs.fullCalendar.getApi()
          calendarApi.changeView('timeGridDay', info.date)
          this.updateCurrentDate(calendarApi)
        }
      }
    },
    
    getEventClassNames(info) {
      const { type, status } = info.event.extendedProps
      const classes = []
      
      // Base styling
      classes.push('fc-event-modern')
      
      // Type-based styling
      if (type === 'private') {
        classes.push('fc-event-private')
      } else if (type === 'group') {
        classes.push('fc-event-group')
      }
      
      // Status-based styling
      classes.push(`fc-event-${status}`)
      
      return classes
    },
    
         styleEvent(info) {
       const { type, status } = info.event.extendedProps
       const element = info.el
       
       // Add custom styling
       element.style.borderRadius = '8px'
       element.style.border = 'none'
       element.style.padding = '4px 8px 4px 12px' // Extra left padding for the status bar
       element.style.fontSize = '12px'
       element.style.fontWeight = '500'
       element.style.position = 'relative'
       
       // Color based on type
       if (type === 'private') {
         element.style.backgroundColor = '#10b981'
         element.style.color = 'white'
       } else if (type === 'group') {
         element.style.backgroundColor = '#3b82f6'
         element.style.color = 'white'
       }
       
       // Status-based styling with thick left borders
       if (status === 'attended') {
         element.style.borderLeft = '8px solid #10b981'
         element.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)'
       } else if (status === 'missed') {
         element.style.opacity = '0.7'
         element.style.borderLeft = '8px solid #ef4444'
         element.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)'
         element.style.filter = 'grayscale(0.3)'
       } else if (status === 'postponed') {
         element.style.background = 'linear-gradient(45deg, #f59e0b, #d97706)'
         element.style.borderLeft = '8px solid #f59e0b'
         element.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.4)'
       } else if (status === 'pending') {
         element.style.borderLeft = '8px solid #6b7280'
         element.style.boxShadow = '0 2px 8px rgba(107, 114, 128, 0.2)'
       }
     },
    
    handleEventClick(info) {
      this.selectedEvent = info.event
      this.showModal = true
    },
    
    async handleEventDrop(info) {
      const { event } = info
      const newDate = event.start.toISOString().split('T')[0]
      const newTime = event.start.toTimeString().split(' ')[0].substring(0, 5)
      
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/sessions/${event.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'reschedule',
            new_date: newDate,
            new_time: newTime
          })
        })
        
        if (!response.ok) throw new Error('Failed to reschedule')
        
        // Update the event locally - the drag already updated the display
        this.updateLocalEvent(event.id, { 
          start: event.start.toISOString(),
          end: event.end.toISOString()
        })
        
        this.showNotification('Ders başarıyla yeniden planlandı!', 'success')
      } catch (error) {
        console.error('Error rescheduling event:', error)
        this.showNotification('Ders yeniden planlanırken hata oluştu', 'error')
        info.revert()
      }
    },
    
    async updateEventStatus(newStatus) {
      if (!this.selectedEvent) return
      
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/sessions/${this.selectedEvent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_status',
            status: newStatus
          })
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update status')
        }
        
        // Update the event locally instead of refetching all events
        this.updateLocalEvent(this.selectedEvent.id, { status: newStatus })
        
        this.closeModal()
        this.showNotification('Ders durumu güncellendi!', 'success')
      } catch (error) {
        console.error('Error updating event status:', error)
        this.showNotification(error.message || 'Ders durumu güncellenirken hata oluştu', 'error')
      }
    },
    
    closeModal() {
      this.showModal = false
      this.selectedEvent = null
    },
    
    formatEventDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
      })
    },
    
    formatEventTime(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    calculateDuration(start, end) {
      if (!start || !end) return 'Belirsiz'
      const startDate = new Date(start)
      const endDate = new Date(end)
      const duration = (endDate - startDate) / (1000 * 60) // minutes
      const hours = Math.floor(duration / 60)
      const minutes = duration % 60
      
      if (hours > 0) {
        return `${hours} saat${minutes > 0 ? ` ${minutes} dakika` : ''}`
      }
      return `${minutes} dakika`
    },
    
    getStatusColor(status) {
      switch (status) {
        case 'attended': return 'bg-green-100 text-green-800'
        case 'missed': return 'bg-red-100 text-red-800'
        case 'postponed': return 'bg-yellow-100 text-yellow-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    },
    
    getStatusDotColor(status) {
      switch (status) {
        case 'attended': return 'bg-green-500'
        case 'missed': return 'bg-red-500'
        case 'postponed': return 'bg-yellow-500'
        default: return 'bg-gray-500'
      }
    },
    
    getStatusText(status) {
      switch (status) {
        case 'attended': return 'Katılındı'
        case 'missed': return 'Katılınmadı'
        case 'postponed': return 'Ertelendi'
        default: return 'Bekliyor'
      }
    },
    
    updateLocalEvent(eventId, updates) {
      // Find and update the event in local events array
      const eventIndex = this.events.findIndex(e => e.id === eventId)
      if (eventIndex !== -1) {
        // Update the event object
        Object.assign(this.events[eventIndex], updates)
        
        // If updating status, update extendedProps
        if (updates.status) {
          if (!this.events[eventIndex].extendedProps) {
            this.events[eventIndex].extendedProps = {}
          }
          this.events[eventIndex].extendedProps.status = updates.status
        }
        
        // Get calendar API and update the event
        if (this.$refs.fullCalendar) {
          const calendarApi = this.$refs.fullCalendar.getApi()
          const calendarEvent = calendarApi.getEventById(eventId)
          
          if (calendarEvent) {
            // Update FullCalendar event
            if (updates.start) calendarEvent.setStart(updates.start)
            if (updates.end) calendarEvent.setEnd(updates.end)
            if (updates.status) {
              calendarEvent.setExtendedProp('status', updates.status)
              // Force re-render to apply new styling
              calendarEvent.remove()
              calendarApi.addEvent(this.events[eventIndex])
            }
          }
        }
      }
    },
    
    // Check if the selected event is in the future
    isFutureLesson() {
      if (!this.selectedEvent || !this.selectedEvent.start) return false
      
      const eventDate = new Date(this.selectedEvent.start)
      const today = new Date()
      
      // Set today to start of day for accurate comparison
      today.setHours(0, 0, 0, 0)
      eventDate.setHours(0, 0, 0, 0)
      
      return eventDate > today
    },
    
    // Check if status button should be disabled
    isStatusButtonDisabled(statusValue) {
      if (!this.selectedEvent) return true
      
      // If already has this status, disable button
      if (this.selectedEvent.extendedProps?.status === statusValue) return true
      
      // For attended and missed status, check if it's a future lesson
      if ((statusValue === 'attended' || statusValue === 'missed') && this.isFutureLesson()) {
        return true
      }
      
      // Postponed can be done anytime for future lessons
      return false
    },

    showNotification(message, type = 'info') {
      // Simple notification for now
      if (type === 'success') {
        alert(`✅ ${message}`)
      } else if (type === 'error') {
        alert(`❌ ${message}`)
      } else {
        alert(`ℹ️ ${message}`)
      }
    }
  }
}
</script>

<style>
/* Modern FullCalendar styling */
.fc {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.fc-header-toolbar {
  display: none !important;
}

.fc-daygrid-day-number {
  font-weight: 600;
  color: #374151;
  padding: 8px;
}

.fc-col-header-cell {
  background: #f8fafc;
  border: none;
  padding: 12px 8px;
  font-weight: 600;
  color: #4b5563;
  font-size: 14px;
}

.fc-daygrid-day {
  background: white;
  border: 1px solid #e5e7eb;
}

.fc-day-today {
  background: #eff6ff !important;
  position: relative;
}

.fc-day-today .fc-daygrid-day-number {
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px;
}

.fc-event-modern {
  border: none !important;
  border-radius: 8px !important;
  padding: 4px 8px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  margin: 2px !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease !important;
}

.fc-event-modern:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
}

.fc-event-private {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  color: white !important;
}

.fc-event-group {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
}

.fc-event-attended {
  border-left: 8px solid #10b981 !important;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3) !important;
}

.fc-event-missed {
  opacity: 0.7 !important;
  border-left: 8px solid #ef4444 !important;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3) !important;
  filter: grayscale(0.3) !important;
}

.fc-event-pending {
  border-left: 8px solid #6b7280 !important;
  box-shadow: 0 2px 8px rgba(107, 114, 128, 0.2) !important;
}

.fc-more-link {
  color: #3b82f6 !important;
  font-weight: 500 !important;
}

.fc-popover {
  border: none !important;
  border-radius: 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.fc-popover-header {
  background: #f8fafc !important;
  border-bottom: 1px solid #e5e7eb !important;
  padding: 12px 16px !important;
  font-weight: 600 !important;
}

/* Time grid (day/week view) styling */
.fc-timegrid-slot {
  background: #fafafa;
  border-color: #e5e7eb !important;
}

.fc-timegrid-slot:nth-child(even) {
  background: #f9fafb;
}

.fc-timegrid-axis {
  background: #f8fafc !important;
  border-color: #e5e7eb !important;
  font-weight: 500;
  color: #6b7280;
}

.fc-timegrid-col-frame {
  background: white;
}

.fc-timegrid-event {
  border-radius: 6px !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  padding: 4px 6px !important;
  line-height: 1.2 !important;
}

.fc-timegrid-event-harness {
  margin: 1px !important;
}

.fc-timegrid-now-indicator-line {
  border-color: #ef4444 !important;
  border-width: 2px !important;
}

.fc-timegrid-now-indicator-arrow {
  border-left-color: #ef4444 !important;
  border-width: 5px !important;
}

/* Day view specific styling */
.fc-timeGridDay .fc-timegrid-event {
  min-height: 40px !important;
  padding: 8px 12px !important;
  font-size: 14px !important;
}

.fc-timeGridDay .fc-event-title {
  font-weight: 700 !important;
}

.fc-timeGridDay .fc-event-time {
  font-weight: 500 !important;
  opacity: 0.9;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .fc-daygrid-day-number {
    font-size: 14px;
  }
  
  .fc-event-modern {
    font-size: 10px !important;
    padding: 2px 4px !important;
  }
  
  .fc-timegrid-event {
    font-size: 11px !important;
    padding: 2px 4px !important;
  }
}

/* Smooth transitions */
* {
  transition: all 0.2s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 