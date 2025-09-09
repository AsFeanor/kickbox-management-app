<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Ders Takvimi</h1>
        <p class="text-gray-600">Tüm özel ve grup dersleri tek takvimde</p>
      </div>

      <!-- Debug Info -->
      <div class="mb-4 p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-800">
          Loading: {{ loading }}, Events Count: {{ events.length }}
        </p>
      </div>

      <!-- Calendar -->
      <div class="bg-white rounded-lg shadow border p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Takvim yükleniyor...</p>
        </div>
        
        <div v-else-if="events.length === 0" class="text-center py-8">
          <p class="text-gray-600">Hiç etkinlik bulunamadı.</p>
        </div>
        
        <div v-else>
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      loading: true,
      events: [],
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        },
        events: [],
        height: 600,
        eventClick: this.handleEventClick,
        editable: true,
        selectable: true
      }
    }
  },
  async mounted() {
    await this.fetchEvents()
  },
  methods: {
    async fetchEvents() {
      this.loading = true
      try {
        console.log('Fetching calendar events...')
        const response = await fetch('http://localhost:3001/api/calendar-events')
        if (!response.ok) throw new Error('Failed to fetch events')
        const data = await response.json()
        console.log('Fetched events:', data)
        this.events = data
        this.calendarOptions.events = data
        console.log('Events assigned:', this.events)
      } catch (error) {
        console.error('Error fetching calendar events:', error)
        alert('Takvim etkinlikleri yüklenirken hata oluştu.')
      } finally {
        this.loading = false
        console.log('Loading state set to false')
      }
    },
    handleEventClick(info) {
      console.log('Event clicked:', info.event)
      alert(`Event: ${info.event.title}`)
    }
  }
}
</script>

<style>
/* FullCalendar custom styles */
.fc {
  font-family: inherit;
}

.fc-toolbar-title {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #1f2937;
}

.fc-button {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: white !important;
  border-radius: 0.375rem !important;
  font-weight: 500 !important;
  padding: 0.375rem 0.75rem !important;
}

.fc-button:hover {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
}

.fc-event {
  background-color: #3b82f6 !important;
  border-color: #3b82f6 !important;
  color: white !important;
}
</style> 