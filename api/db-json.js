import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel'de /tmp kullanmamız gerekiyor
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/database.json' 
  : path.join(__dirname, 'database.json');

export class JSONDatabase {
  constructor() {
    this.initDB();
  }

  initDB() {
    try {
      if (!fs.existsSync(dbPath)) {
        const initialData = {
          members: [],
          privateLessonPackages: [],
          privateLessonSessions: [],
          groupCategories: [],
          groupSessions: [],
          lastId: {
            members: 0,
            privateLessonPackages: 0,
            privateLessonSessions: 0,
            groupCategories: 0,
            groupSessions: 0
          }
        };
        fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
      }
    } catch (error) {
      console.error('Database init error:', error);
    }
  }

  read() {
    try {
      return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (error) {
      console.error('Database read error:', error);
      return this.getDefaultData();
    }
  }

  write(data) {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Database write error:', error);
    }
  }

  getDefaultData() {
    return {
      members: [],
      privateLessonPackages: [],
      privateLessonSessions: [],
      groupCategories: [],
      groupSessions: [],
      lastId: {
        members: 0,
        privateLessonPackages: 0,
        privateLessonSessions: 0,
        groupCategories: 0,
        groupSessions: 0
      }
    };
  }

  getNextId(table) {
    const data = this.read();
    data.lastId[table] = (data.lastId[table] || 0) + 1;
    this.write(data);
    return data.lastId[table];
  }

  // Prisma-like API
  member = {
    findMany: (options = {}) => {
      const data = this.read();
      let result = data.members;
      
      if (options.include?.privateLessonPackages) {
        result = result.map(member => ({
          ...member,
          privateLessonPackages: data.privateLessonPackages
            .filter(pkg => pkg.memberId === member.id)
            .map(pkg => ({
              ...pkg,
              sessions: options.include?.privateLessonPackages?.include?.sessions
                ? data.privateLessonSessions.filter(session => session.packageId === pkg.id)
                : undefined
            }))
        }));
      }
      
      return result;
    },

    findUnique: (options) => {
      const data = this.read();
      const member = data.members.find(m => m.id === options.where.id);
      
      if (member && options.include?.privateLessonPackages) {
        member.privateLessonPackages = data.privateLessonPackages
          .filter(pkg => pkg.memberId === member.id)
          .map(pkg => ({
            ...pkg,
            sessions: options.include?.privateLessonPackages?.include?.sessions
              ? data.privateLessonSessions.filter(session => session.packageId === pkg.id)
              : undefined
          }));
      }
      
      return member;
    },

    create: (options) => {
      const data = this.read();
      const newMember = {
        id: this.getNextId('members'),
        ...options.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.members.push(newMember);
      this.write(data);
      return newMember;
    },

    update: (options) => {
      const data = this.read();
      const index = data.members.findIndex(m => m.id === options.where.id);
      if (index !== -1) {
        data.members[index] = {
          ...data.members[index],
          ...options.data,
          updatedAt: new Date().toISOString()
        };
        this.write(data);
        return data.members[index];
      }
      return null;
    },

    delete: (options) => {
      const data = this.read();
      const index = data.members.findIndex(m => m.id === options.where.id);
      if (index !== -1) {
        const deleted = data.members.splice(index, 1)[0];
        
        // Cascade delete
        data.privateLessonPackages = data.privateLessonPackages.filter(pkg => pkg.memberId !== deleted.id);
        data.privateLessonSessions = data.privateLessonSessions.filter(session => {
          const pkg = data.privateLessonPackages.find(p => p.id === session.packageId);
          return pkg?.memberId !== deleted.id;
        });
        
        this.write(data);
        return deleted;
      }
      return null;
    }
  };

  privateLessonPackage = {
    findMany: (options = {}) => {
      const data = this.read();
      let result = data.privateLessonPackages;
      
      if (options.where) {
        result = result.filter(pkg => {
          return Object.keys(options.where).every(key => pkg[key] === options.where[key]);
        });
      }
      
      if (options.include?.sessions) {
        result = result.map(pkg => ({
          ...pkg,
          sessions: data.privateLessonSessions.filter(session => session.packageId === pkg.id)
        }));
      }
      
      return result;
    },

    findUnique: (options) => {
      const data = this.read();
      const pkg = data.privateLessonPackages.find(p => p.id === options.where.id);
      
      if (pkg && options.include?.sessions) {
        pkg.sessions = data.privateLessonSessions.filter(session => session.packageId === pkg.id);
      }
      
      return pkg;
    },

    findFirst: (options) => {
      const data = this.read();
      let result = data.privateLessonPackages;
      
      if (options.where) {
        result = result.filter(pkg => {
          return Object.keys(options.where).every(key => pkg[key] === options.where[key]);
        });
      }
      
      const pkg = result[0];
      if (pkg && options.include?.sessions) {
        pkg.sessions = data.privateLessonSessions.filter(session => session.packageId === pkg.id);
      }
      
      return pkg;
    },

    create: (options) => {
      const data = this.read();
      const newPackage = {
        id: this.getNextId('privateLessonPackages'),
        ...options.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.privateLessonPackages.push(newPackage);
      this.write(data);
      return newPackage;
    },

    update: (options) => {
      const data = this.read();
      const index = data.privateLessonPackages.findIndex(p => p.id === options.where.id);
      if (index !== -1) {
        data.privateLessonPackages[index] = {
          ...data.privateLessonPackages[index],
          ...options.data,
          updatedAt: new Date().toISOString()
        };
        this.write(data);
        return data.privateLessonPackages[index];
      }
      return null;
    }
  };

  privateLessonSession = {
    findMany: (options = {}) => {
      const data = this.read();
      let result = data.privateLessonSessions;
      
      if (options.where) {
        result = result.filter(session => {
          return Object.keys(options.where).every(key => session[key] === options.where[key]);
        });
      }
      
      if (options.orderBy?.date) {
        result.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return options.orderBy.date === 'asc' ? dateA - dateB : dateB - dateA;
        });
      }
      
      return result;
    },

    findUnique: (options) => {
      const data = this.read();
      return data.privateLessonSessions.find(s => s.id === options.where.id);
    },

    create: (options) => {
      const data = this.read();
      const newSession = {
        id: this.getNextId('privateLessonSessions'),
        ...options.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.privateLessonSessions.push(newSession);
      this.write(data);
      return newSession;
    },

    createMany: (options) => {
      const data = this.read();
      const newSessions = options.data.map(sessionData => ({
        id: this.getNextId('privateLessonSessions'),
        ...sessionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      data.privateLessonSessions.push(...newSessions);
      this.write(data);
      return { count: newSessions.length };
    },

    update: (options) => {
      const data = this.read();
      const index = data.privateLessonSessions.findIndex(s => s.id === options.where.id);
      if (index !== -1) {
        data.privateLessonSessions[index] = {
          ...data.privateLessonSessions[index],
          ...options.data,
          updatedAt: new Date().toISOString()
        };
        this.write(data);
        return data.privateLessonSessions[index];
      }
      return null;
    },

    delete: (options) => {
      const data = this.read();
      const index = data.privateLessonSessions.findIndex(s => s.id === options.where.id);
      if (index !== -1) {
        const deleted = data.privateLessonSessions.splice(index, 1)[0];
        this.write(data);
        return deleted;
      }
      return null;
    }
  };

  groupCategory = {
    findMany: () => {
      const data = this.read();
      return data.groupCategories;
    },

    create: (options) => {
      const data = this.read();
      const newCategory = {
        id: this.getNextId('groupCategories'),
        ...options.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.groupCategories.push(newCategory);
      this.write(data);
      return newCategory;
    }
  };

  groupSession = {
    findMany: (options = {}) => {
      const data = this.read();
      let result = data.groupSessions;
      
      if (options.where) {
        result = result.filter(session => {
          return Object.keys(options.where).every(key => session[key] === options.where[key]);
        });
      }
      
      return result;
    },

    create: (options) => {
      const data = this.read();
      const newSession = {
        id: this.getNextId('groupSessions'),
        ...options.data,
        attendees: options.data.attendees || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.groupSessions.push(newSession);
      this.write(data);
      return newSession;
    },

    update: (options) => {
      const data = this.read();
      const index = data.groupSessions.findIndex(s => s.id === options.where.id);
      if (index !== -1) {
        data.groupSessions[index] = {
          ...data.groupSessions[index],
          ...options.data,
          updatedAt: new Date().toISOString()
        };
        this.write(data);
        return data.groupSessions[index];
      }
      return null;
    }
  };
}
