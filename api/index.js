import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSONDatabase } from './db-json.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new JSONDatabase();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.railway.app', 'https://your-custom-domain.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

// Utility to get next N dates for two weekdays alternating, starting from a date
function getNextAlternatingDates(startDate, weekday1, weekday2, count) {
  const daysOfWeek = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const weekdayIndexes = [daysOfWeek.indexOf(weekday1), daysOfWeek.indexOf(weekday2)];
  let dates = [];
  let current = new Date(startDate);
  let toggle = 0;
  while (dates.length < count) {
    // Find next date for the current weekday
    let day = weekdayIndexes[toggle % 2];
    let diff = (day - current.getDay() + 7) % 7;
    if (diff === 0 && dates.length === 0) {
      // If start date is the correct day, use it
      dates.push(new Date(current));
    } else {
      current.setDate(current.getDate() + (diff === 0 ? 7 : diff));
      dates.push(new Date(current));
    }
    toggle++;
  }
  return dates;
}

app.post('/api/members', async (req, res) => {
  try {
    const {
      ad,
      soyad,
      cinsiyet,
      kayit_tarihi,
      yas,
      kilo,
      telefon,
      ders_turu,
      ucret,
      not: notField,
      yas_grubu,
      lesson_day_1,
      lesson_start_time_1,
      lesson_end_time_1,
      lesson_day_2,
      lesson_start_time_2,
      lesson_end_time_2,
      // Group package info
      packageStatus,
      attendedSessions,
      packageStartDate,
      totalSessions
    } = req.body;

    // Gelişmiş validation: 0 değerleri eksik sayılmaz, stringler trimlenir
    if (
      !ad?.trim() ||
      !soyad?.trim() ||
      !cinsiyet?.trim() ||
      !kayit_tarihi?.trim() ||
      yas === undefined || yas === null || yas === '' ||
      kilo === undefined || kilo === null || kilo === '' ||
      !telefon?.trim() ||
      !ders_turu?.trim() ||
      ucret === undefined || ucret === null || ucret === ''
    ) {
      return res.status(400).json({ error: 'Eksik alan(lar) var.' });
    }
    if (ders_turu === 'Grup' && !yas_grubu) {
      return res.status(400).json({ error: 'Yaş grubu zorunlu.' });
    }

    // Prepare member data
    const memberData = {
      ad,
      soyad,
      cinsiyet,
      kayit_tarihi: new Date(kayit_tarihi),
      yas,
      kilo,
      telefon,
      ders_turu,
      ucret,
      not: notField && notField.trim() !== '' ? notField : null,
      yas_grubu: yas_grubu ? String(yas_grubu) : null, // Convert to string for consistency
    };

    // Add group package info if provided
    if (ders_turu === 'Grup' && packageStatus) {
      if (packageStatus === 'active') {
        memberData.current_package_start_date = new Date(packageStartDate || kayit_tarihi);
        memberData.current_package_total_sessions = totalSessions || 8;
        memberData.current_package_attended_sessions = attendedSessions || 0;
        memberData.package_is_active = true;
        memberData.paid = true; // If they have an active package, assume they've paid
      } else if (packageStatus === 'completed') {
        memberData.current_package_start_date = new Date(kayit_tarihi);
        memberData.current_package_total_sessions = totalSessions || 8;
        memberData.current_package_attended_sessions = totalSessions || 8;
        memberData.package_is_active = false;
        memberData.paid = true; // Completed package means they've paid
      } else if (packageStatus === 'new') {
        // New member - package will be started later
        memberData.package_is_active = false;
        memberData.paid = false;
      }
    }

    // 1. Üye kaydı
    const member = await prisma.member.create({
      data: memberData,
    });

    // 2. Eğer özel ders ise, paket ve seansları oluştur
    if (ders_turu === 'Özel') {
      // Paket oluştur
      const packageRecord = await prisma.privateLessonPackage.create({
        data: {
          memberId: member.id,
          lesson_day_1,
          lesson_day_2,
          lesson_start_time_1,
          lesson_end_time_1,
          lesson_start_time_2,
          lesson_end_time_2,
        },
      });
      // Tarihleri oluştur
      const lessonDates = getNextAlternatingDates(
        kayit_tarihi,
        lesson_day_1,
        lesson_day_2,
        8
      );
      // 8 seansı oluştur
      let sessions = [];
      for (let i = 0; i < 8; i++) {
        const isFirstDay = i % 2 === 0;
        sessions.push({
          packageId: packageRecord.id,
          date: lessonDates[i],
          start_time: isFirstDay ? lesson_start_time_1 : lesson_start_time_2,
          end_time: isFirstDay ? lesson_end_time_1 : lesson_end_time_2,
          is_postponed: false
        });
      }
      await prisma.privateLessonSession.createMany({ data: sessions });
    }

    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu.' });
  }
});

app.get('/api/members', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      include: {
        privateLessonPackages: {
          select: {
            id: true,
            lesson_day_1: true,
            lesson_day_2: true,
            lesson_start_time_1: true,
            lesson_end_time_1: true,
            lesson_start_time_2: true,
            lesson_end_time_2: true,
            paid: true,
            is_completed: true,
            sessions: {
              select: {
                id: true,
                date: true,
                start_time: true,
                end_time: true,
                is_postponed: true,
                is_attended: true,
                is_missed: true,
                postponed_to_session_id: true,
                postponedTo: {
                  select: {
                    id: true,
                    date: true,
                    start_time: true,
                    end_time: true
                  }
                }
              }
            }
          }
        }
      }
    });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Üyeler alınırken bir hata oluştu.' });
  }
});

// Update member endpoint
app.patch('/api/members/:id', async (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  
  try {
    const {
      ad,
      soyad,
      cinsiyet,
      yas,
      kilo,
      telefon,
      ucret,
      not: notField,
      kayit_tarihi,
      // Özel ders programı alanları
      lesson_day_1,
      lesson_start_time_1,
      lesson_end_time_1,
      lesson_day_2,
      lesson_start_time_2,
      lesson_end_time_2
    } = req.body;

    console.log(`Updating member ${memberId}:`);
    console.log('Lesson schedule data received:', {
      lesson_day_1,
      lesson_start_time_1,
      lesson_end_time_1,
      lesson_day_2,
      lesson_start_time_2,
      lesson_end_time_2
    });

    // Gelişmiş validation
    if (
      !ad?.trim() ||
      !soyad?.trim() ||
      !cinsiyet?.trim() ||
      yas === undefined || yas === null || yas === '' ||
      kilo === undefined || kilo === null || kilo === '' ||
      !telefon?.trim() ||
      ucret === undefined || ucret === null || ucret === ''
    ) {
      return res.status(400).json({ error: 'Eksik alan(lar) var.' });
    }

    // Prepare update data (excluding lesson type and other structural changes)
    const updateData = {
      ad,
      soyad,
      cinsiyet,
      yas,
      kilo,
      telefon,
      ucret,
      not: notField && notField.trim() !== '' ? notField : null,
    };

    // Add registration date if provided
    if (kayit_tarihi) {
      updateData.kayit_tarihi = new Date(kayit_tarihi);
    }

    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: updateData,
      include: {
        privateLessonPackages: {
          select: {
            id: true,
            lesson_day_1: true,
            lesson_day_2: true,
            lesson_start_time_1: true,
            lesson_end_time_1: true,
            lesson_start_time_2: true,
            lesson_end_time_2: true,
            paid: true,
            is_completed: true,
            sessions: {
              select: {
                id: true,
                date: true,
                start_time: true,
                end_time: true,
                is_postponed: true,
                is_attended: true,
                is_missed: true,
                postponed_to_session_id: true,
                postponedTo: {
                  select: {
                    id: true,
                    date: true,
                    start_time: true,
                    end_time: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Update private lesson package schedule if provided
    if (updatedMember.ders_turu === 'Özel' && 
        (lesson_day_1 || lesson_start_time_1 || lesson_end_time_1 || 
         lesson_day_2 || lesson_start_time_2 || lesson_end_time_2)) {
      
      // Find the member's active private lesson package
      const activePackage = await prisma.privateLessonPackage.findFirst({
        where: { 
          memberId: memberId,
          is_completed: false
        }
      });

      if (activePackage) {
        console.log('Found active package:', activePackage.id);
        const packageUpdateData = {};
        
        if (lesson_day_1) packageUpdateData.lesson_day_1 = lesson_day_1;
        if (lesson_start_time_1) packageUpdateData.lesson_start_time_1 = lesson_start_time_1;
        if (lesson_end_time_1) packageUpdateData.lesson_end_time_1 = lesson_end_time_1;
        if (lesson_day_2) packageUpdateData.lesson_day_2 = lesson_day_2;
        if (lesson_start_time_2) packageUpdateData.lesson_start_time_2 = lesson_start_time_2;
        if (lesson_end_time_2) packageUpdateData.lesson_end_time_2 = lesson_end_time_2;

        console.log('Package update data:', packageUpdateData);

        if (Object.keys(packageUpdateData).length > 0) {
          await prisma.privateLessonPackage.update({
            where: { id: activePackage.id },
            data: packageUpdateData
          });
          
          // Also update existing sessions with new times
          if (lesson_start_time_1 || lesson_end_time_1 || lesson_start_time_2 || lesson_end_time_2) {
            console.log('Updating existing session times...');
            
            // Get all sessions for this package
            const sessions = await prisma.privateLessonSession.findMany({
              where: { packageId: activePackage.id }
            });
            
            for (const session of sessions) {
              const sessionDate = new Date(session.date);
              const dayOfWeek = sessionDate.toLocaleDateString('tr-TR', { weekday: 'long' });
              
              let updateSessionData = {};
              
              // Update session times based on which day it is
              if (dayOfWeek === (lesson_day_1 || activePackage.lesson_day_1)) {
                if (lesson_start_time_1) updateSessionData.start_time = lesson_start_time_1;
                if (lesson_end_time_1) updateSessionData.end_time = lesson_end_time_1;
              } else if (dayOfWeek === (lesson_day_2 || activePackage.lesson_day_2)) {
                if (lesson_start_time_2) updateSessionData.start_time = lesson_start_time_2;
                if (lesson_end_time_2) updateSessionData.end_time = lesson_end_time_2;
              }
              
              if (Object.keys(updateSessionData).length > 0) {
                await prisma.privateLessonSession.update({
                  where: { id: session.id },
                  data: updateSessionData
                });
                console.log(`Updated session ${session.id} times:`, updateSessionData);
              }
            }
          }
          
          console.log(`Successfully updated private lesson schedule for member ${memberId}`);
        } else {
          console.log('No package data to update');
        }
      } else {
        console.log('No active package found for member', memberId);
      }
    }

    res.json(updatedMember);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Üye bulunamadı.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Üye güncellenirken bir hata oluştu.' });
  }
});

// Delete member endpoint
app.delete('/api/members/:id', async (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  
  try {
    // First delete related data
    // Delete private lesson sessions
    await prisma.privateLessonSession.deleteMany({
      where: {
        package: {
          memberId: memberId
        }
      }
    });
    
    // Delete private lesson packages
    await prisma.privateLessonPackage.deleteMany({
      where: { memberId: memberId }
    });
    
    // Remove from group sessions (many-to-many relationship)
    // First, find all group sessions where this member is an attendee
    const groupSessions = await prisma.groupSession.findMany({
      where: {
        attendees: {
          some: { id: memberId }
        }
      }
    });
    
    // Then disconnect the member from each session individually
    for (const session of groupSessions) {
      await prisma.groupSession.update({
        where: { id: session.id },
        data: {
          attendees: {
            disconnect: { id: memberId }
          }
        }
      });
    }
    
    // Finally delete the member
    await prisma.member.delete({
      where: { id: memberId }
    });

    res.json({ message: 'Üye başarıyla silindi.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Üye bulunamadı.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Üye silinirken bir hata oluştu.' });
  }
});

// Legacy private lesson session update endpoint
app.patch('/api/private-sessions/:id', async (req, res) => {
  const sessionId = parseInt(req.params.id, 10);
  const { status, action, new_date, new_time, new_end_time } = req.body;
  try {
    const session = await prisma.privateLessonSession.findUnique({ where: { id: sessionId } });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // If session is postponed and status is attended/missed, reactivate and clean up replacement
    if (session.is_postponed && (status === 'attended' || status === 'missed')) {
      // Update this session
      const updated = await prisma.privateLessonSession.update({
        where: { id: sessionId },
        data: {
          is_attended: status === 'attended',
          is_missed: status === 'missed',
          is_postponed: false,
          postponed_to_session_id: null,
        }
      });
      
      // Find the latest postponed session (replacement) for this package and delete it
      const latestReplacement = await prisma.privateLessonSession.findFirst({
        where: {
          packageId: session.packageId,
          is_postponed: false,
          is_attended: false,
          is_missed: false
        },
        orderBy: {
          date: 'desc'
        }
      });
      
      if (latestReplacement) {
        await prisma.privateLessonSession.delete({ where: { id: latestReplacement.id } });
      }
      
      // Check if we have 8 completed sessions (attended or missed), ignoring postponed sessions
      const allSessions = await prisma.privateLessonSession.findMany({
        where: { packageId: session.packageId }
      });

      const completedSessions = allSessions.filter(s => 
        (s.is_attended || s.is_missed) && !s.is_postponed
      );

      // If we have 8 completed sessions, mark the package as completed
      if (completedSessions.length >= 8) {
        await prisma.privateLessonPackage.update({
          where: { id: session.packageId },
          data: { is_completed: true }
        });
      }
      
      return res.json(updated);
    }

    // Check if marking as attended/missed would exceed 8 completed lessons limit
    if (status === 'attended' || status === 'missed') {
      // Get all sessions for this package
      const pkg = await prisma.privateLessonPackage.findUnique({
        where: { id: session.packageId },
        select: {
          sessions: {
            where: {
              OR: [
                { is_attended: true },
                { is_missed: true }
              ],
              id: { not: sessionId } // Don't count the current session
            }
          }
        }
      });
      
      // Check if we already have 8 completed (attended/missed) lessons
      if (pkg && pkg.sessions.length >= 8) {
        return res.status(400).json({ error: 'Maksimum 8 tamamlanmış ders sınırına ulaşıldı.' });
      }
    }

    // 1. Mark as attended
    if (status === 'attended') {
      await prisma.privateLessonSession.update({
        where: { id: sessionId },
        data: { is_attended: true, is_missed: false, is_postponed: false }
      });
    }
    // 2. Mark as missed
    else if (status === 'missed') {
      await prisma.privateLessonSession.update({
        where: { id: sessionId },
        data: { is_attended: false, is_missed: true, is_postponed: false }
      });
    }
    // 3. Postpone 1 week (legacy)
    else if (action === 'postpone_1_week') {
      const newDate = new Date(session.date);
      newDate.setDate(newDate.getDate() + 7);
      const newSession = await prisma.privateLessonSession.create({
        data: {
          packageId: session.packageId,
          date: newDate,
          start_time: session.start_time,
          end_time: session.end_time,
          is_postponed: false
        }
      });
      await prisma.privateLessonSession.update({
        where: { id: sessionId },
        data: { is_postponed: true, postponed_to_session_id: newSession.id }
      });
      return res.json({ updated: { ...session, is_postponed: true, postponed_to_session_id: newSession.id }, newSession });
    }
    // 4. Reschedule to specific date/time
    else if (action === 'reschedule') {
      const newDate = new_date ? new Date(new_date) : session.date;
      const startTime = new_time || session.start_time;
      const endTime = new_end_time || session.end_time;
      const newSession = await prisma.privateLessonSession.create({
        data: {
          packageId: session.packageId,
          date: newDate,
          start_time: startTime,
          end_time: endTime,
          is_postponed: false
        }
      });
      await prisma.privateLessonSession.update({
        where: { id: sessionId },
        data: { is_postponed: true, postponed_to_session_id: newSession.id }
      });
      return res.json({ updated: { ...session, is_postponed: true, postponed_to_session_id: newSession.id }, newSession });
    }
    // 5. Postpone to next slot according to weekly schedule
    else if (action === 'postpone_to_next_slot') {
      // Get the parent package and its schedule
      const pkg = await prisma.privateLessonPackage.findUnique({
        where: { id: session.packageId },
        select: {
          lesson_day_1: true,
          lesson_day_2: true,
          lesson_start_time_1: true,
          lesson_end_time_1: true,
          lesson_start_time_2: true,
          lesson_end_time_2: true,
          sessions: { 
            select: { 
              id: true,
              date: true,
              is_attended: true,
              is_missed: true,
              is_postponed: true
            } 
          }
        }
      });
      if (!pkg) return res.status(404).json({ error: 'Package not found' });
      
      // Find all scheduled dates
      const scheduledDates = pkg.sessions.map(s => new Date(s.date));
      // Find the latest scheduled date
      const latestDate = scheduledDates.reduce((a, b) => (a > b ? a : b), new Date(session.date));
      // Determine next slot after latestDate according to the package's schedule
      const daysOfWeek = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      const weekday1 = pkg.lesson_day_1;
      const weekday2 = pkg.lesson_day_2;
      const weekdayIndexes = [daysOfWeek.indexOf(weekday1), daysOfWeek.indexOf(weekday2)];
      // Find the next available date after latestDate that matches either lesson_day_1 or lesson_day_2
      let nextSlotDate = null;
      let searchDate = new Date(latestDate);
      for (let i = 1; i <= 14; i++) { // search up to 2 weeks ahead
        searchDate.setDate(searchDate.getDate() + 1);
        const dayIdx = searchDate.getDay();
        if (dayIdx === weekdayIndexes[0] || dayIdx === weekdayIndexes[1]) {
          // Check if this date is already used
          if (!scheduledDates.some(d => d.toDateString() === searchDate.toDateString())) {
            nextSlotDate = new Date(searchDate);
            break;
          }
        }
      }
      if (!nextSlotDate) return res.status(400).json({ error: 'No available slot found in the next 2 weeks.' });
      // Determine which slot (1 or 2) it is
      let slotIdx = daysOfWeek.indexOf(weekday1) === nextSlotDate.getDay() ? 1 : 2;
      let startTime = slotIdx === 1 ? pkg.lesson_start_time_1 : pkg.lesson_start_time_2;
      let endTime = slotIdx === 1 ? pkg.lesson_end_time_1 : pkg.lesson_end_time_2;
      // Create the new session
      const newSession = await prisma.privateLessonSession.create({
        data: {
          packageId: session.packageId,
          date: nextSlotDate,
          start_time: startTime,
          end_time: endTime,
          is_postponed: false
        }
      });
      // Mark the original session as postponed and link to new session
      const updated = await prisma.privateLessonSession.update({
        where: { id: sessionId },
        data: { 
          is_postponed: true,
          postponed_to_session_id: newSession.id
        }
      });
      return res.json({ updated, newSession });
    }
    // Return updated sessions for the package
    const updatedSessions = await prisma.privateLessonSession.findMany({
      where: { packageId: session.packageId },
      orderBy: { date: 'asc' }
    });

    // Check if we have 8 completed sessions (attended or missed), ignoring postponed sessions
    const completedSessions = updatedSessions.filter(s => 
      (s.is_attended || s.is_missed) && !s.is_postponed
    );

    // If we have 8 completed sessions, mark the package as completed
    if (completedSessions.length >= 8) {
      await prisma.privateLessonPackage.update({
        where: { id: session.packageId },
        data: { is_completed: true }
      });
    }

    res.json(updatedSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu.' });
  }
});

// PATCH endpoint to update payment status of a private lesson package
app.patch('/api/private-lesson-packages/:id', async (req, res) => {
  const packageId = parseInt(req.params.id, 10);
  const { paid } = req.body;
  if (typeof paid !== 'boolean') {
    return res.status(400).json({ error: 'paid field must be boolean' });
  }
  try {
    const updatedPackage = await prisma.privateLessonPackage.update({
      where: { id: packageId },
      data: { paid },
    });
    res.json(updatedPackage);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Package not found' });
    }
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu.' });
  }
});

// POST endpoint to renew a private lesson package
app.post('/api/private-lesson-packages/:id/renew', async (req, res) => {
  const packageId = parseInt(req.params.id, 10);
  const { lesson_day_1, lesson_time_1, lesson_day_2, lesson_time_2 } = req.body;
  
  // Validate input
  if (!lesson_day_1 || !lesson_time_1 || !lesson_day_2 || !lesson_time_2) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get the existing package with its sessions to find the latest lesson date
    const existingPackage = await prisma.privateLessonPackage.findUnique({
      where: { id: packageId },
      include: {
        sessions: {
          select: {
            date: true
          }
        }
      }
    });

    if (!existingPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Calculate the next lesson date starting from today (not from the last session)
    const daysOfWeek = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const weekday1Index = daysOfWeek.indexOf(lesson_day_1);
    const weekday2Index = daysOfWeek.indexOf(lesson_day_2);
    
    // Start searching from today
    let nextStartDate = new Date();
    nextStartDate.setHours(0, 0, 0, 0); // Set to beginning of day
    
    console.log('Renewing package starting from today:', nextStartDate.toISOString().split('T')[0]);
    console.log('Looking for lesson days:', lesson_day_1, 'and', lesson_day_2);
    
    // Find the next occurrence of either lesson_day_1 or lesson_day_2 (including today)
    let found = false;
    for (let i = 0; i < 14; i++) { // search up to 2 weeks ahead
      const currentDayIndex = nextStartDate.getDay();
      if (currentDayIndex === weekday1Index || currentDayIndex === weekday2Index) {
        found = true;
        break;
      }
      nextStartDate.setDate(nextStartDate.getDate() + 1);
    }

    if (!found) {
      return res.status(400).json({ error: 'Could not find next lesson date' });
    }
    
    console.log('New package will start from:', nextStartDate.toISOString().split('T')[0]);

    // Mark the existing package as completed
    await prisma.privateLessonPackage.update({
      where: { id: packageId },
      data: { is_completed: true }
    });

    // Parse lesson times
    const [lesson_start_time_1, lesson_end_time_1] = lesson_time_1.split('-');
    const [lesson_start_time_2, lesson_end_time_2] = lesson_time_2.split('-');

    // Create new package with paid: false (requires new payment)
    const newPackage = await prisma.privateLessonPackage.create({
      data: {
        memberId: existingPackage.memberId,
        lesson_day_1,
        lesson_day_2,
        lesson_start_time_1,
        lesson_end_time_1,
        lesson_start_time_2,
        lesson_end_time_2,
        paid: false, // New package requires payment
        is_completed: false
      },
    });

    // Generate 8 sessions for the new package starting from the calculated date
    const lessonDates = getNextAlternatingDates(
      nextStartDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
      lesson_day_1,
      lesson_day_2,
      8
    );

    let sessions = [];
    for (let i = 0; i < 8; i++) {
      const isFirstDay = i % 2 === 0;
      sessions.push({
        packageId: newPackage.id,
        date: lessonDates[i],
        start_time: isFirstDay ? lesson_start_time_1 : lesson_start_time_2,
        end_time: isFirstDay ? lesson_end_time_1 : lesson_end_time_2,
        is_postponed: false,
        is_attended: false,
        is_missed: false
      });
    }

    await prisma.privateLessonSession.createMany({ data: sessions });

    // Return the new package with its sessions
    const packageWithSessions = await prisma.privateLessonPackage.findUnique({
      where: { id: newPackage.id },
      include: {
        sessions: {
          select: {
            id: true,
            date: true,
            start_time: true,
            end_time: true,
            is_postponed: true,
            is_attended: true,
            is_missed: true,
            postponed_to_session_id: true,
            postponedTo: {
              select: {
                id: true,
                date: true,
                start_time: true,
                end_time: true
              }
            }
          },
          orderBy: { date: 'asc' }
        }
      }
    });

    res.status(201).json(packageWithSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu.' });
  }
});

// Helper endpoint to update existing packages that should be completed
app.post('/api/update-completed-packages', async (req, res) => {
  try {
    // Find all packages where all sessions are completed but package is not marked as completed
    const packages = await prisma.privateLessonPackage.findMany({
      where: {
        is_completed: false
      },
      include: {
        sessions: true
      }
    });

    let updatedCount = 0;
    
    for (const pkg of packages) {
      const completedSessions = pkg.sessions.filter(s => 
        (s.is_attended || s.is_missed) && !s.is_postponed
      );
      
      if (completedSessions.length >= 8) {
        await prisma.privateLessonPackage.update({
          where: { id: pkg.id },
          data: { is_completed: true }
        });
        updatedCount++;
      }
    }

    res.json({ message: `${updatedCount} paket güncellendi` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Bir hata oluştu.' });
  }
});

// GROUP LESSONS ENDPOINTS

// Get all group categories
app.get('/api/group-categories', async (req, res) => {
  try {
    const categories = await prisma.groupCategory.findMany({
      orderBy: { name: 'asc' }
    });
    
    // Parse days JSON string back to array
    const categoriesWithParsedDays = categories.map(cat => ({
      ...cat,
      days: JSON.parse(cat.days)
    }));
    
    res.json(categoriesWithParsedDays);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kategoriler alınırken hata oluştu.' });
  }
});

// Create a new group category
app.post('/api/group-categories', async (req, res) => {
  const { name, minAge, maxAge, days, startTime, endTime } = req.body;
  
  if (!name || !days || !startTime || !endTime) {
    return res.status(400).json({ error: 'Eksik alanlar var.' });
  }
  
  try {
    const category = await prisma.groupCategory.create({
      data: {
        name,
        minAge: minAge || null,
        maxAge: maxAge || null,
        days: JSON.stringify(days), // Store as JSON string
        startTime,
        endTime
      }
    });
    
    res.status(201).json({
      ...category,
      days: JSON.parse(category.days)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kategori oluşturulurken hata oluştu.' });
  }
});

// Update a group category
app.put('/api/group-categories/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  const { name, minAge, maxAge, days, startTime, endTime } = req.body;
  
  if (!name || !days || !startTime || !endTime) {
    return res.status(400).json({ error: 'Eksik alanlar var.' });
  }
  
  try {
    const updatedCategory = await prisma.groupCategory.update({
      where: { id: categoryId },
      data: {
        name,
        minAge: minAge || null,
        maxAge: maxAge || null,
        days: JSON.stringify(days),
        startTime,
        endTime
      }
    });
    
    res.json({
      ...updatedCategory,
      days: JSON.parse(updatedCategory.days)
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Kategori bulunamadı.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Kategori güncellenirken hata oluştu.' });
  }
});

// Delete a group category
app.delete('/api/group-categories/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  
  try {
    // First check if category has any sessions
    const sessionsCount = await prisma.groupSession.count({
      where: { categoryId }
    });
    
    if (sessionsCount > 0) {
      // Delete all sessions first
      await prisma.groupSession.deleteMany({
        where: { categoryId }
      });
    }
    
    // Then delete the category
    await prisma.groupCategory.delete({
      where: { id: categoryId }
    });
    
    res.json({ message: 'Kategori ve ilgili seanslar başarıyla silindi.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Kategori bulunamadı.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Kategori silinirken hata oluştu.' });
  }
});

// Delete all sessions for a category
app.delete('/api/group-categories/:id/sessions', async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  
  try {
    const result = await prisma.groupSession.deleteMany({
      where: { categoryId }
    });
    
    res.json({ message: `${result.count} seans silindi.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Seanslar silinirken hata oluştu.' });
  }
});

// Generate sessions for the next 4 weeks
app.post('/api/group-categories/:id/schedule', async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  const { startDate } = req.body;
  
  console.log(`🎯 Schedule generation started for category ${categoryId}, startDate: ${startDate}`);
  
  if (!startDate) {
    return res.status(400).json({ error: 'Başlangıç tarihi gerekli.' });
  }
  
  try {
    // Get the category
    const category = await prisma.groupCategory.findUnique({
      where: { id: categoryId }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Kategori bulunamadı.' });
    }
    
    console.log(`📋 Category found:`, category);
    
    // Get all members in this category
    const categoryMembers = await prisma.member.findMany({
      where: {
        ders_turu: 'Grup',
        yas_grubu: categoryId.toString()
      },
      select: {
        id: true,
        ad: true,
        soyad: true
      }
    });
    
    console.log(`👥 Found ${categoryMembers.length} members for category ${categoryId}:`, categoryMembers);
    
    // First, delete all existing sessions for this category
    const deletedSessions = await prisma.groupSession.deleteMany({
      where: { categoryId }
    });
    
    console.log(`🗑️ Deleted ${deletedSessions.count} existing sessions`);
    
    const days = JSON.parse(category.days);
    const daysOfWeek = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const targetDayIndices = days.map(day => daysOfWeek.indexOf(day));
    
    console.log(`📅 Target days:`, days, `-> indices:`, targetDayIndices);
    
    // Generate sessions for the next 4 weeks
    const sessions = [];
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 28); // 4 weeks
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayIndex = d.getDay();
      if (targetDayIndices.includes(dayIndex)) {
        // Set the time for the session
        const sessionDate = new Date(d);
        const [hours, minutes] = category.startTime.split(':');
        sessionDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        sessions.push({
          categoryId,
          date: sessionDate
        });
      }
    }
    
    console.log(`📅 Generated ${sessions.length} session dates`);
    
    // Create all sessions
    const createdSessions = await Promise.all(sessions.map(sessionData => 
      prisma.groupSession.create({
        data: sessionData
      })
    ));
    
    console.log(`✅ Created ${createdSessions.length} sessions in database`);
    
    // For each created session, add all category members as attendees (default: attended)
    for (const session of createdSessions) {
      if (categoryMembers.length > 0) {
        await prisma.groupSession.update({
          where: { id: session.id },
          data: {
            attendees: {
              connect: categoryMembers.map(member => ({ id: member.id }))
            }
          }
        });
        console.log(`👥 Added ${categoryMembers.length} members to session ${session.id}`);
      } else {
        console.log(`⚠️ No members to add to session ${session.id}`);
      }
    }
    
    console.log(`🎉 Schedule generation completed successfully`);
    
    res.json({ 
      message: `${sessions.length} seans oluşturuldu ve ${categoryMembers.length} üye otomatik katıldı olarak işaretlendi.`,
      sessionsCreated: sessions.length,
      membersAdded: categoryMembers.length
    });
  } catch (error) {
    console.error('❌ Error in schedule generation:', error);
    res.status(500).json({ error: 'Seanslar oluşturulurken hata oluştu.' });
  }
});

// Get sessions for a category with attendees
app.get('/api/group-categories/:id/sessions', async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  
  try {
    // Get today's start to include today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const sessions = await prisma.groupSession.findMany({
      where: {
        categoryId,
        date: {
          gte: today // Include today's sessions and future ones
        }
      },
      include: {
        attendees: {
          select: {
            id: true,
            ad: true,
            soyad: true,
            yas: true,
            telefon: true
          }
        }
      },
      orderBy: { date: 'asc' },
      take: 12 // Next 12 sessions
    });
    
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Seanslar alınırken hata oluştu.' });
  }
});

// Update all past group sessions to mark everyone as attended
app.post('/api/group-sessions/mark-all-past-attended', async (req, res) => {
  try {
    const now = new Date()
    
    // Get all past sessions
    const pastSessions = await prisma.groupSession.findMany({
      where: {
        date: {
          lt: now
        }
      },
      include: {
        category: true,
        attendees: true
      }
    })
    
    // For each past session, get all members of that category and mark them as attended
    for (const session of pastSessions) {
      // Get all members of this category
      const categoryMembers = await prisma.member.findMany({
        where: {
          ders_turu: 'Grup',
          yas_grubu: session.category.id.toString()
        }
      })
      
      // Add all category members to this session as attendees
      const memberIds = categoryMembers.map(m => ({ id: m.id }))
      
      await prisma.groupSession.update({
        where: { id: session.id },
        data: {
          attendees: {
            set: memberIds // This will replace all attendees with the new list
          }
        }
      })
    }
    
    res.json({ 
      message: 'Geçmiş tüm seanslar için katılım durumu güncellendi',
      updatedSessions: pastSessions.length
    })
  } catch (error) {
    console.error('Error updating past sessions:', error)
    res.status(500).json({ error: 'Geçmiş seanslar güncellenirken hata oluştu' })
  }
})

// Mark attendance for a session
app.post('/api/group-sessions/:sessionId/attendance', async (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10);
  const { memberId, present } = req.body;
  
  if (!memberId || typeof present !== 'boolean') {
    return res.status(400).json({ error: 'Eksik veya hatalı veri.' });
  }
  
  try {
    if (present) {
      // Add member to session attendees
      await prisma.groupSession.update({
        where: { id: sessionId },
        data: {
          attendees: {
            connect: { id: parseInt(memberId) }
          }
        }
      });
    } else {
      // Remove member from session attendees
      await prisma.groupSession.update({
        where: { id: sessionId },
        data: {
          attendees: {
            disconnect: { id: parseInt(memberId) }
          }
        }
      });
    }
    
    res.json({ message: 'Yoklama güncellendi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Yoklama güncellenirken hata oluştu.' });
  }
});

// Get all members eligible for group lessons
app.get('/api/members/group-eligible', async (req, res) => {
  const { minAge, maxAge } = req.query;
  
  try {
    const where = {
      ders_turu: 'Grup'
    };
    
    if (minAge || maxAge) {
      where.yas = {};
      if (minAge) where.yas.gte = parseInt(minAge);
      if (maxAge) where.yas.lte = parseInt(maxAge);
    }
    
    const members = await prisma.member.findMany({
      where,
      select: {
        id: true,
        ad: true,
        soyad: true,
        yas: true,
        telefon: true,
        yas_grubu: true
      },
      orderBy: [
        { ad: 'asc' },
        { soyad: 'asc' }
      ]
    });
    
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Üyeler alınırken hata oluştu.' });
  }
});

// Get members for a specific group category
app.get('/api/group-categories/:id/members', async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  
  try {
    const members = await prisma.member.findMany({
      where: {
        ders_turu: 'Grup',
        yas_grubu: String(categoryId)
      },
      select: {
        id: true,
        ad: true,
        soyad: true,
        yas: true,
        telefon: true,
        kayit_tarihi: true,
        ucret: true,
        paid: true,
        payment_due_date: true,
        last_payment_reminder: true,
        current_package_start_date: true,
        current_package_total_sessions: true,
        current_package_attended_sessions: true,
        package_is_active: true
      },
      orderBy: { ad: 'asc' }
    });
    
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Üyeler alınırken hata oluştu.' });
  }
});

// Update member payment status
app.patch('/api/members/:id/payment', async (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  const { paid, payment_due_date } = req.body;
  
  try {
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        paid: paid,
        payment_due_date: payment_due_date ? new Date(payment_due_date) : null
      }
    });
    
    res.json(updatedMember);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Üye bulunamadı.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Ödeme durumu güncellenirken hata oluştu.' });
  }
});

// Send payment reminder
app.post('/api/members/:id/payment-reminder', async (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  
  try {
    // Update last payment reminder date
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        last_payment_reminder: new Date()
      }
    });
    
    res.json({ 
      message: 'Ödeme hatırlatması gönderildi.',
      member: updatedMember
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hatırlatma gönderilirken hata oluştu.' });
  }
});

// Start a new group package for a member
app.post('/api/members/:id/start-group-package', async (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  
  try {
    // Get member and category info
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        groupSessions: {
          include: {
            category: true
          }
        }
      }
    });
    
    if (!member || member.ders_turu !== 'Grup') {
      return res.status(400).json({ error: 'Geçersiz grup dersi üyesi.' });
    }
    
    // Get category to calculate sessions per week
    const category = await prisma.groupCategory.findUnique({
      where: { id: parseInt(member.yas_grubu) }
    });
    
    if (!category) {
      return res.status(400).json({ error: 'Kategori bulunamadı.' });
    }
    
    // Calculate total sessions (4 weeks × sessions per week)
    const daysPerWeek = JSON.parse(category.days).length;
    const totalSessions = daysPerWeek * 4; // 4 hafta
    
    // Update member with new package
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        current_package_start_date: new Date(),
        current_package_total_sessions: totalSessions,
        current_package_attended_sessions: 0,
        package_is_active: true,
        paid: false // New package requires payment
      }
    });
    
    res.json({
      message: 'Yeni paket başlatıldı.',
      member: updatedMember,
      packageInfo: {
        totalSessions,
        daysPerWeek,
        weeksTotal: 4
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Paket başlatılırken hata oluştu.' });
  }
});

// Update member attendance for group lessons (calculate from sessions)
app.post('/api/members/:id/update-attendance', async (req, res) => {
  const memberId = parseInt(req.params.id, 10)
  const { increment } = req.body
  
  try {
    // Get member info
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        yas_grubu: true,
        current_package_start_date: true,
        current_package_total_sessions: true,
        package_is_active: true
      }
    })
    
    if (!member || member.ders_turu !== 'Grup') {
      return res.status(404).json({ error: 'Grup dersi üyesi bulunamadı' })
    }
    
    // Calculate attended sessions from actual group sessions
    const attendedSessions = await prisma.groupSession.count({
      where: {
        categoryId: parseInt(member.yas_grubu),
        attendees: {
          some: {
            id: memberId
          }
        },
        date: {
          gte: member.current_package_start_date || new Date('2000-01-01'),
          lt: new Date() // Only past sessions count
        }
      }
    })
    
    // Update member's attended sessions count
    await prisma.member.update({
      where: { id: memberId },
      data: {
        current_package_attended_sessions: attendedSessions
      }
    })
    
    res.json({ 
      message: 'Paket durumu güncellendi',
      attendedSessions: attendedSessions 
    })
  } catch (error) {
    console.error('Error updating attendance:', error)
    res.status(500).json({ error: 'Paket durumu güncellenirken hata oluştu' })
  }
})

// Update member package details manually  
app.patch('/api/members/:id/update-package', async (req, res) => {
  const memberId = parseInt(req.params.id, 10);
  const { attended_sessions, package_start_date, package_is_active } = req.body;
  
  try {
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    });
    
    if (!member) {
      return res.status(404).json({ error: 'Üye bulunamadı.' });
    }
    
    const updateData = {};
    
    if (attended_sessions !== undefined) {
      updateData.current_package_attended_sessions = parseInt(attended_sessions);
    }
    
    if (package_start_date) {
      updateData.current_package_start_date = new Date(package_start_date);
    }
    
    if (package_is_active !== undefined) {
      updateData.package_is_active = package_is_active;
    }
    
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: updateData
    });
    
    res.json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Paket güncellenirken hata oluştu.' });
  }
});

// Add all category members to all existing sessions
app.post('/api/group-categories/:id/add-members-to-sessions', async (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  
  console.log(`🔧 Adding members to all sessions for category ${categoryId}`);
  
  try {
    // Get the category
    const category = await prisma.groupCategory.findUnique({
      where: { id: categoryId }
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Kategori bulunamadı.' });
    }
    
    // Get all members in this category
    const categoryMembers = await prisma.member.findMany({
      where: {
        ders_turu: 'Grup',
        yas_grubu: categoryId.toString()
      },
      select: {
        id: true,
        ad: true,
        soyad: true
      }
    });
    
    console.log(`👥 Found ${categoryMembers.length} members for category ${categoryId}:`, categoryMembers);
    
    // Get all sessions for this category
    const sessions = await prisma.groupSession.findMany({
      where: { categoryId },
      include: {
        attendees: {
          select: { id: true }
        }
      }
    });
    
    console.log(`📅 Found ${sessions.length} sessions for category ${categoryId}`);
    
    let updatedSessionsCount = 0;
    
    // For each session, add all category members as attendees
    for (const session of sessions) {
      const existingAttendeeIds = session.attendees.map(a => a.id);
      const membersToAdd = categoryMembers.filter(member => !existingAttendeeIds.includes(member.id));
      
      if (membersToAdd.length > 0) {
        await prisma.groupSession.update({
          where: { id: session.id },
          data: {
            attendees: {
              connect: membersToAdd.map(member => ({ id: member.id }))
            }
          }
        });
        console.log(`➕ Added ${membersToAdd.length} new members to session ${session.id}`);
        updatedSessionsCount++;
      } else {
        console.log(`✅ Session ${session.id} already has all members`);
      }
    }
    
    console.log(`🎉 Updated ${updatedSessionsCount} sessions with members`);
    
    res.json({
      message: `${updatedSessionsCount} seans güncellendi, ${categoryMembers.length} üye eklendi.`,
      sessionsUpdated: updatedSessionsCount,
      membersAdded: categoryMembers.length,
      totalSessions: sessions.length
    });
  } catch (error) {
    console.error('❌ Error adding members to sessions:', error);
    res.status(500).json({ error: 'Seanslar güncellenirken hata oluştu.' });
  }
});

// Fix group members package info
app.post('/api/group-members/fix-packages', async (req, res) => {
  try {
    // Get all group members
    const groupMembers = await prisma.member.findMany({
      where: { ders_turu: 'Grup' },
      select: {
        id: true,
        ad: true,
        soyad: true,
        yas_grubu: true,
        current_package_total_sessions: true,
        current_package_attended_sessions: true,
        current_package_start_date: true,
        package_is_active: true
      }
    });

    let fixedCount = 0;

    for (const member of groupMembers) {
      // Check if member needs package fix
      if (!member.current_package_total_sessions || member.current_package_total_sessions === 0) {
        // Get category info
        const category = await prisma.groupCategory.findUnique({
          where: { id: parseInt(member.yas_grubu) }
        });

        if (category) {
          // Calculate total sessions (4 weeks × sessions per week)
          const daysPerWeek = JSON.parse(category.days).length;
          const totalSessions = daysPerWeek * 4; // 4 weeks
          
          // Set package start date if not exists
          const packageStartDate = member.current_package_start_date || new Date();
          
          // Update member with correct package info
          await prisma.member.update({
            where: { id: member.id },
            data: {
              current_package_total_sessions: totalSessions,
              current_package_start_date: packageStartDate,
              package_is_active: true,
              current_package_attended_sessions: member.current_package_attended_sessions || 0
            }
          });
          
          fixedCount++;
        }
      }
    }

    res.json({
      message: `${fixedCount} üyenin paket bilgisi düzeltildi`,
      fixedCount,
      totalMembers: groupMembers.length
    });
  } catch (error) {
    console.error('Error fixing group packages:', error);
    res.status(500).json({ error: 'Paket bilgileri düzeltilirken hata oluştu' });
  }
});

// Unified Calendar Events Endpoint
app.get('/api/calendar-events', async (req, res) => {
  try {
    const events = [];

    // Fetch Private Lesson Sessions
    const privateSessions = await prisma.privateLessonSession.findMany({
      include: {
        package: {
          include: {
            member: {
              select: {
                ad: true,
                soyad: true
              }
            }
          }
        }
      },
      orderBy: { date: 'asc' }
    });

    // Map Private Sessions to Calendar Events
    privateSessions.forEach(session => {
      // Create start and end times
      const sessionDate = new Date(session.date);
      const startTime = new Date(sessionDate);
      const endTime = new Date(sessionDate);
      
      // Parse start and end times
      if (session.start_time) {
        const [startHour, startMinute] = session.start_time.split(':');
        startTime.setHours(parseInt(startHour), parseInt(startMinute), 0);
      }
      
      if (session.end_time) {
        const [endHour, endMinute] = session.end_time.split(':');
        endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);
      } else {
        // If no end time, add 1 hour to start time
        endTime.setTime(startTime.getTime() + 60 * 60 * 1000);
      }

      let status = 'pending';
      if (session.is_attended === true) status = 'attended';
      else if (session.is_missed === true) status = 'missed';
      else if (session.is_postponed === true) status = 'postponed';

      events.push({
        id: `private-${session.id}`,
        title: `${session.package.member.ad} ${session.package.member.soyad} (Özel)`,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        extendedProps: {
          type: 'private',
          status: status,
          sessionId: session.id,
          memberId: session.package.memberId
        }
      });
    });

    // Fetch Group Sessions
    const groupSessions = await prisma.groupSession.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        },
        attendees: true
      },
      orderBy: { date: 'asc' }
    });

    // Map Group Sessions to Calendar Events
    groupSessions.forEach(session => {
      // Create start and end times
      const sessionDate = new Date(session.date);
      const startTime = new Date(sessionDate);
      const endTime = new Date(sessionDate);
      
      // Parse start and end times from category
      if (session.category.startTime) {
        const [startHour, startMinute] = session.category.startTime.split(':');
        startTime.setHours(parseInt(startHour), parseInt(startMinute), 0);
      }
      
      if (session.category.endTime) {
        const [endHour, endMinute] = session.category.endTime.split(':');
        endTime.setHours(parseInt(endHour), parseInt(endMinute), 0);
      } else {
        // If no end time, add 1.5 hours to start time (typical group lesson duration)
        endTime.setTime(startTime.getTime() + 90 * 60 * 1000);
      }

      // Determine status based on session date
      const now = new Date();
      let status = 'pending';
      if (sessionDate < now) {
        status = session.attendees.length > 0 ? 'attended' : 'missed';
      }

      events.push({
        id: `group-${session.id}`,
        title: `${session.category.name} (Grup)`,
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        extendedProps: {
          type: 'group',
          status: status,
          sessionId: session.id,
          categoryId: session.categoryId,
          attendeesCount: session.attendees.length
        }
      });
    });

    // Sort events by start time
    events.sort((a, b) => new Date(a.start) - new Date(b.start));

    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Takvim etkinlikleri alınırken hata oluştu' });
  }
});

// Update session endpoint for rescheduling
app.patch('/api/sessions/:id', async (req, res) => {
  const sessionId = req.params.id;
  const { action, new_date, new_time, status } = req.body;

  console.log('Session update request:', { sessionId, action, new_date, new_time, status });
  console.log('Action comparison:', action, '===', 'update_status', ':', action === 'update_status');

  try {
    if (action === 'reschedule') {
      // Determine if it's a private or group session
      const [type, id] = sessionId.split('-');
      const numericId = parseInt(id);

      if (type === 'private') {
        // Update private lesson session
        const newDateTime = new Date(`${new_date}T00:00:00`);
        
        // Get current session to preserve lesson duration
        const currentSession = await prisma.privateLessonSession.findUnique({
          where: { id: numericId }
        });
        
        let endTime = new_time;
        if (currentSession.start_time && currentSession.end_time) {
          // Calculate duration from original session
          const [startHour, startMinute] = currentSession.start_time.split(':');
          const [endHour, endMinute] = currentSession.end_time.split(':');
          const originalDuration = (parseInt(endHour) * 60 + parseInt(endMinute)) - (parseInt(startHour) * 60 + parseInt(startMinute));
          
          // Apply same duration to new time
          const [newHour, newMinute] = new_time.split(':');
          const newEndMinutes = parseInt(newHour) * 60 + parseInt(newMinute) + originalDuration;
          const newEndHour = Math.floor(newEndMinutes / 60);
          const newEndMin = newEndMinutes % 60;
          endTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMin.toString().padStart(2, '0')}`;
        } else {
          // Default to 1 hour duration if no existing times
          const [newHour, newMinute] = new_time.split(':');
          const newEndMinutes = parseInt(newHour) * 60 + parseInt(newMinute) + 60;
          const newEndHour = Math.floor(newEndMinutes / 60);
          const newEndMin = newEndMinutes % 60;
          endTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMin.toString().padStart(2, '0')}`;
        }
        
        await prisma.privateLessonSession.update({
          where: { id: numericId },
          data: { 
            date: newDateTime,
            start_time: new_time,
            end_time: endTime
          }
        });
      } else if (type === 'group') {
        // Update group session
        const newDateTime = new Date(`${new_date}T00:00:00`);
        
        await prisma.groupSession.update({
          where: { id: numericId },
          data: { date: newDateTime }
        });
      }

      res.json({ message: 'Seans başarıyla yeniden planlandı' });
    } else if (action === 'update_status') {
      // Update session status
      console.log('Processing update_status for sessionId:', sessionId);
      const [type, id] = sessionId.split('-');
      const numericId = parseInt(id);
      console.log('Parsed session info:', { type, id, numericId });

      if (type === 'private') {
        // Get session details to check date
        const session = await prisma.privateLessonSession.findUnique({
          where: { id: numericId }
        });
        
        if (!session) {
          return res.status(404).json({ error: 'Seans bulunamadı' });
        }
        
        // Check if trying to mark attended/missed for future lesson
        const sessionDate = new Date(session.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        sessionDate.setHours(0, 0, 0, 0);
        
        if ((status === 'attended' || status === 'missed') && sessionDate > today) {
          return res.status(400).json({ 
            error: 'Gelecek tarihli dersler için katılım durumu işaretlenemez. Sadece bugün veya geçmiş dersler için bu işlem yapılabilir.' 
          });
        }
        
        let updateData = {};
        if (status === 'attended') {
          updateData.is_attended = true;
          updateData.is_missed = false;
          updateData.is_postponed = false;
        } else if (status === 'missed') {
          updateData.is_attended = false;
          updateData.is_missed = true;
          updateData.is_postponed = false;
        } else if (status === 'postponed') {
          updateData.is_attended = false;
          updateData.is_missed = false;
          updateData.is_postponed = true;
        }

        console.log('Updating session with data:', { numericId, updateData });
        
        const updatedSession = await prisma.privateLessonSession.update({
          where: { id: numericId },
          data: updateData
        });
        
        console.log('Session updated successfully:', updatedSession);
      } else if (type === 'group') {
        // For group sessions, we could implement status updates
        // For now, just acknowledge the request
        console.log('Group session status update not implemented yet');
      }

      res.json({ message: 'Seans durumu güncellendi' });
    } else if (action === 'postpone_to_next_slot') {
      // Postpone session to next available slot
      const [type, id] = sessionId.split('-');
      const numericId = parseInt(id);
      
      console.log('Processing postpone_to_next_slot for sessionId:', sessionId);

      if (type === 'private') {
        // Get session details
        const session = await prisma.privateLessonSession.findUnique({
          where: { id: numericId },
          include: {
            package: {
              select: {
                lesson_day_1: true,
                lesson_day_2: true,
                lesson_start_time_1: true,
                lesson_end_time_1: true,
                lesson_start_time_2: true,
                lesson_end_time_2: true
              }
            }
          }
        });
        
        if (!session) {
          return res.status(404).json({ error: 'Seans bulunamadı' });
        }

        // Get all sessions in the same package, ordered by date
        const allSessions = await prisma.privateLessonSession.findMany({
          where: { packageId: session.packageId },
          orderBy: { date: 'asc' }
        });

        console.log('All sessions before postpone:', allSessions.map(s => ({
          id: s.id,
          date: s.date.toISOString().split('T')[0],
          start_time: s.start_time,
          is_current: s.id === numericId
        })));

        // Find the index of current session
        const currentIndex = allSessions.findIndex(s => s.id === numericId);
        
        if (currentIndex === -1) {
          return res.status(404).json({ error: 'Session bulunamadı' });
        }

        if (currentIndex === allSessions.length - 1) {
          return res.status(400).json({ 
            error: 'Bu son ders, ertelenecek başka ders yok. Lütfen yeni tarih ve saat seçme özelliğini kullanın.' 
          });
        }

        // Get sessions that will be affected (current session + all after it)
        const sessionsToMove = allSessions.slice(currentIndex);
        const nextSession = allSessions[currentIndex + 1];

        console.log('Sessions to move:', sessionsToMove.map(s => ({
          id: s.id,
          date: s.date.toISOString().split('T')[0]
        })));

        // Step 1: Move current session to next session's slot
        const updatedCurrentSession = await prisma.privateLessonSession.update({
          where: { id: numericId },
          data: {
            date: nextSession.date,
            start_time: nextSession.start_time,
            end_time: nextSession.end_time,
            is_postponed: false,
            postponed_to_session_id: null
          }
        });

        console.log('Moved current session to:', {
          date: nextSession.date.toISOString().split('T')[0],
          start_time: nextSession.start_time
        });

        // Step 2: Shift all other sessions forward by one position
        for (let i = 1; i < sessionsToMove.length; i++) {
          const sessionToUpdate = sessionsToMove[i];
          
          if (i === sessionsToMove.length - 1) {
            // This is the last session, we need to create a new slot for it
            const lastSessionDate = new Date(sessionToUpdate.date);
            const newSlot = calculateNextLessonDate(lastSessionDate, session.package);
            
            console.log('Creating new slot for last session:', {
              oldDate: lastSessionDate.toISOString().split('T')[0],
              newDate: newSlot.date.toISOString().split('T')[0],
              startTime: newSlot.startTime
            });

            // Update the last session to the new calculated slot
            await prisma.privateLessonSession.update({
              where: { id: sessionToUpdate.id },
              data: {
                date: newSlot.date,
                start_time: newSlot.startTime,
                end_time: newSlot.endTime
              }
            });
          } else {
            // Move this session to the next session's original slot
            const targetSession = sessionsToMove[i + 1];
            
            console.log('Moving session from', {
              from: sessionToUpdate.date.toISOString().split('T')[0],
              to: targetSession.date.toISOString().split('T')[0]
            });

            await prisma.privateLessonSession.update({
              where: { id: sessionToUpdate.id },
              data: {
                date: targetSession.date,
                start_time: targetSession.start_time,
                end_time: targetSession.end_time
              }
            });
          }
        }

        const updatedSession = updatedCurrentSession;
        
        // Helper function to calculate next lesson date
        function calculateNextLessonDate(fromDate, pkg) {
          const date = new Date(fromDate);
          const dayOfWeek = date.toLocaleDateString('tr-TR', { weekday: 'long' });
          
          // Determine which lesson day this was and find the next one
          if (dayOfWeek === pkg.lesson_day_1) {
            // Current was day 1, next should be day 2
            const daysUntilDay2 = getDaysUntilWeekday(date, pkg.lesson_day_2);
            date.setDate(date.getDate() + daysUntilDay2);
            return {
              date: date,
              startTime: pkg.lesson_start_time_2,
              endTime: pkg.lesson_end_time_2
            };
          } else {
            // Current was day 2, next should be day 1 of next week
            const daysUntilDay1 = getDaysUntilWeekday(date, pkg.lesson_day_1);
            date.setDate(date.getDate() + daysUntilDay1);
            return {
              date: date,
              startTime: pkg.lesson_start_time_1,
              endTime: pkg.lesson_end_time_1
            };
          }
        }
        
        // Helper function to get days until a specific weekday
        function getDaysUntilWeekday(fromDate, targetDayName) {
          const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
          const currentDay = fromDate.getDay();
          const targetDay = dayNames.indexOf(targetDayName);
          
          let daysUntil = targetDay - currentDay;
          if (daysUntil <= 0) {
            daysUntil += 7; // Next week
          }
          
          return daysUntil;
        }

        console.log('Session postponed to next lesson slot:', { updatedSession });

        res.json({ 
          message: 'Ders bir sonraki derse ertelendi',
          updated: updatedSession
        });
      } else {
        res.status(400).json({ error: 'Grup dersleri için erteleme henüz desteklenmiyor' });
      }
    } else {
      console.log('Invalid action received:', action, 'Type:', typeof action);
      res.status(400).json({ error: 'Geçersiz aksiyon: ' + action });
    }
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ error: 'Seans güncellenirken hata oluştu' });
  }
});

// Catch-all handler for production: serve frontend
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Frontend served from: ${path.join(__dirname, '../frontend/dist')}`);
  }
}); 