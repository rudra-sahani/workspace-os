import {
  Workspace,
  WorkspaceSettings,
  WorkspaceModuleConfig,
  MediaFile,
  Payment,
  SmartPass,
  AttendanceLog,
  SaaSChatMessage,
  SaaSAnnouncement,
  GalleryAlbum,
  GalleryItem,
  SaaSDocument,
  EmailTemplate,
  EmailCampaign,
  AIPrompt,
  AIGeneration,
  AIDocument,
  Notification,
  NotificationPreference,
  GlobalSearchItem,
  WorkspaceImport,
  AnalyticsMetrics,
  Participant
} from '../types';

// Helper to handle local persistence of SaaS state
const getSaaSStore = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(`saas_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const setSaaSStore = (key: string, data: any) => {
  localStorage.setItem(`saas_${key}`, JSON.stringify(data));
};

// ==========================================
// 1. WORKSPACE SETTINGS SERVICE
// ==========================================
export class WorkspaceSettingsService {
  static getSettings(workspaceId: string): WorkspaceSettings {
    const allSettings = getSaaSStore<Record<string, WorkspaceSettings>>('settings', {});
    if (!allSettings[workspaceId]) {
      // Create defaults
      allSettings[workspaceId] = {
        workspaceId,
        branding: {
          theme: 'dark',
          primaryColor: '#6366f1', // indigo
          fontFamily: 'Inter',
        },
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        defaultLanguage: 'en',
        registrationBehavior: {
          autoApproveFree: false,
          requirePaymentVerification: true,
        },
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
        },
      };
      setSaaSStore('settings', allSettings);
    }
    return allSettings[workspaceId];
  }

  static updateSettings(workspaceId: string, settings: Partial<WorkspaceSettings>): WorkspaceSettings {
    const allSettings = getSaaSStore<Record<string, WorkspaceSettings>>('settings', {});
    const current = this.getSettings(workspaceId);
    allSettings[workspaceId] = {
      ...current,
      ...settings,
      branding: {
        ...current.branding,
        ...(settings.branding || {}),
      },
      registrationBehavior: {
        ...current.registrationBehavior,
        ...(settings.registrationBehavior || {}),
      },
      notificationPreferences: {
        ...current.notificationPreferences,
        ...(settings.notificationPreferences || {}),
      },
    };
    setSaaSStore('settings', allSettings);
    return allSettings[workspaceId];
  }
}

// ==========================================
// 2. MODULE CONFIGURATION & VALIDATION SERVICE
// ==========================================
export class ModuleConfigurationService {
  static getModuleConfigs(workspaceId: string): WorkspaceModuleConfig[] {
    const allConfigs = getSaaSStore<Record<string, WorkspaceModuleConfig[]>>('module_configs', {});
    if (!allConfigs[workspaceId]) {
      // Setup initial default strict configurations
      allConfigs[workspaceId] = [
        {
          id: `mod-att-${workspaceId}`,
          workspaceId,
          moduleKey: 'attendance',
          isEnabled: true,
          settings: {
            singleScan: true,
            requirePayment: true,
            manualCheckIn: false,
          },
          updatedAt: new Date().toISOString(),
        },
        {
          id: `mod-pay-${workspaceId}`,
          workspaceId,
          moduleKey: 'payments',
          isEnabled: true,
          settings: {
            amount: 4000,
            currency: 'INR',
            allowRefunds: false,
            upiId: 'workspaceos@ybl',
          },
          updatedAt: new Date().toISOString(),
        },
        {
          id: `mod-reg-${workspaceId}`,
          workspaceId,
          moduleKey: 'registration',
          isEnabled: true,
          settings: {
            fieldsCount: 5,
            requireApproval: true,
          },
          updatedAt: new Date().toISOString(),
        }
      ];
      setSaaSStore('module_configs', allConfigs);
    }
    return allConfigs[workspaceId];
  }

  static validateModuleSettings(moduleKey: string, settings: Record<string, any>): { valid: boolean; error?: string } {
    if (moduleKey === 'attendance') {
      if (typeof settings.singleScan !== 'boolean') return { valid: false, error: 'singleScan must be a boolean' };
      if (typeof settings.requirePayment !== 'boolean') return { valid: false, error: 'requirePayment must be a boolean' };
    }
    if (moduleKey === 'payments') {
      if (typeof settings.amount !== 'number' || settings.amount <= 0) return { valid: false, error: 'amount must be a positive number' };
      if (!settings.currency) return { valid: false, error: 'currency is required' };
    }
    return { valid: true };
  }

  static updateModuleSettings(workspaceId: string, moduleKey: string, isEnabled: boolean, settings: Record<string, any>): WorkspaceModuleConfig {
    const validation = this.validateModuleSettings(moduleKey, settings);
    if (!validation.valid) {
      throw new Error(`Module validation error for ${moduleKey}: ${validation.error}`);
    }

    const configs = this.getModuleConfigs(workspaceId);
    const index = configs.findIndex(c => c.moduleKey === moduleKey);
    const updated: WorkspaceModuleConfig = {
      id: index >= 0 ? configs[index].id : `mod-${moduleKey}-${Date.now()}`,
      workspaceId,
      moduleKey,
      isEnabled,
      settings,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      configs[index] = updated;
    } else {
      configs.push(updated);
    }

    const allConfigs = getSaaSStore<Record<string, WorkspaceModuleConfig[]>>('module_configs', {});
    allConfigs[workspaceId] = configs;
    setSaaSStore('module_configs', allConfigs);
    return updated;
  }
}

// ==========================================
// 3. AI-FIRST MODULE SERVICE
// ==========================================
export class AIService {
  static getPrompts(workspaceId: string): AIPrompt[] {
    return getSaaSStore<AIPrompt[]>(`ai_prompts_${workspaceId}`, []);
  }

  static getGenerations(workspaceId: string): AIGeneration[] {
    return getSaaSStore<AIGeneration[]>(`ai_generations_${workspaceId}`, []);
  }

  static getAIDocuments(workspaceId: string): AIDocument[] {
    return getSaaSStore<AIDocument[]>(`ai_docs_${workspaceId}`, []);
  }

  static async generateContent(
    workspaceId: string,
    promptType: 'Event' | 'Form' | 'Itinerary' | 'Announcement' | 'Email',
    promptText: string
  ): Promise<string> {
    // Save prompt record
    const prompts = this.getPrompts(workspaceId);
    const newPrompt: AIPrompt = {
      id: `prompt-${Date.now()}`,
      workspaceId,
      promptType,
      promptText,
      createdAt: new Date().toISOString(),
    };
    prompts.push(newPrompt);
    setSaaSStore(`ai_prompts_${workspaceId}`, prompts);

    // Simulate AI model completion response with dynamic templates based on promptType
    let result = '';
    if (promptType === 'Event') {
      result = `### AI Generated Custom Workspace: ${promptText}\n\n* **Primary Category**: Innovation Camp\n* **Ideal Modules**: Registration, Smart Passes, Payments, Schedule, Digital Documents.\n* **Strategic Insight**: This workspace needs high automation because members expect rapid check-ins. Let's auto-enable digital guides.`;
    } else if (promptType === 'Form') {
      result = `[\n  {"label": "Professional Role", "type": "Dropdown", "required": true, "options": ["Developer", "Designer", "Founder", "Investor"]},\n  {"label": "Dietary Preference", "type": "Radio", "required": false, "options": ["Standard", "Veg", "Vegan"]},\n  {"label": "Portfolio URL", "type": "Short Text", "required": true}\n]`;
    } else if (promptType === 'Itinerary') {
      result = `### Master Schedule Itinerary\n\n* **09:00 AM** - Keynote Address: Building modular products\n* **11:00 AM** - Expert Tech Panel & Breakout Rooms\n* **01:00 PM** - Lunch & Collaborative Networking\n* **03:00 PM** - Demo Pitches & Jury Evaluation\n* **06:00 PM** - Winner Awards & Venture Funding Cocktail`;
    } else if (promptType === 'Announcement') {
      result = `📢 **Important Notice**: Dear WorkspaceOS Members, we have published the updated workspace maps and legal guides in your Documents panel. Please review them prior to check-in at the main gate.`;
    } else {
      result = `Hi {{Name}},\n\nWelcome to our exclusive workspace. Your Smart Pass with ticket number {{TicketNumber}} has been successfully provisioned. Please check your dashboard for active schedules.\n\nBest,\nSaaS Operations Team`;
    }

    // Save generation record
    const generations = this.getGenerations(workspaceId);
    const newGen: AIGeneration = {
      id: `gen-${Date.now()}`,
      workspaceId,
      promptId: newPrompt.id,
      generatorType: promptType,
      completionText: result,
      tokensUsed: Math.floor(promptText.length * 1.4 + result.length * 1.3),
      createdAt: new Date().toISOString(),
    };
    generations.push(newGen);
    setSaaSStore(`ai_generations_${workspaceId}`, generations);

    // Save as AIDocument if Itinerary or Event
    if (promptType === 'Itinerary' || promptType === 'Event') {
      const aiDocs = this.getAIDocuments(workspaceId);
      aiDocs.push({
        id: `aidoc-${Date.now()}`,
        workspaceId,
        title: `AI ${promptType} - ${promptText.substring(0, 30)}...`,
        content: result,
        documentType: promptType,
        createdAt: new Date().toISOString(),
      });
      setSaaSStore(`ai_docs_${workspaceId}`, aiDocs);
    }

    return result;
  }
}

// ==========================================
// 4. NOTIFICATIONS SERVICE
// ==========================================
export class NotificationService {
  static getNotifications(userId: string): Notification[] {
    return getSaaSStore<Notification[]>(`notifs_${userId}`, [
      {
        id: 'notif-1',
        userId,
        title: 'Payment Confirmed',
        body: 'Your manual UPI transaction reference has been successfully verified. Your smart pass is ready.',
        status: 'Unread',
        category: 'Payment',
        createdAt: new Date().toISOString(),
      }
    ]);
  }

  static getPreferences(userId: string): NotificationPreference {
    const allPrefs = getSaaSStore<Record<string, NotificationPreference>>('notif_preferences', {});
    if (!allPrefs[userId]) {
      allPrefs[userId] = {
        userId,
        email: true,
        inApp: true,
        push: true,
        sms: false,
      };
      setSaaSStore('notif_preferences', allPrefs);
    }
    return allPrefs[userId];
  }

  static updatePreferences(userId: string, prefs: Partial<NotificationPreference>): NotificationPreference {
    const allPrefs = getSaaSStore<Record<string, NotificationPreference>>('notif_preferences', {});
    const current = this.getPreferences(userId);
    allPrefs[userId] = {
      ...current,
      ...prefs,
    };
    setSaaSStore('notif_preferences', allPrefs);
    return allPrefs[userId];
  }

  static createNotification(userId: string, title: string, body: string, category: Notification['category']): Notification {
    const notifs = this.getNotifications(userId);
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      body,
      status: 'Unread',
      category,
      createdAt: new Date().toISOString(),
    };
    notifs.unshift(newNotif);
    setSaaSStore(`notifs_${userId}`, notifs);
    return newNotif;
  }
}

// ==========================================
// 5. STORAGE / MEDIA FILE SERVICE
// ==========================================
export class StorageService {
  static getMediaFiles(workspaceId: string): MediaFile[] {
    return getSaaSStore<MediaFile[]>(`media_${workspaceId}`, [
      {
        id: 'media-qr-default',
        workspaceId,
        filename: 'default_upi_qr.png',
        bucketName: 'payments',
        mimeType: 'image/png',
        fileSize: 120443,
        uploadedBy: 'owner-id',
        url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=300&q=80',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'media-doc-default',
        workspaceId,
        filename: 'workspace_handbook_v2.pdf',
        bucketName: 'documents',
        mimeType: 'application/pdf',
        fileSize: 2450392,
        uploadedBy: 'owner-id',
        url: '#',
        createdAt: new Date().toISOString(),
      }
    ]);
  }

  static uploadMediaFile(
    workspaceId: string,
    filename: string,
    mimeType: string,
    fileSize: number,
    uploadedBy: string,
    simulatedUrl: string
  ): MediaFile {
    const files = this.getMediaFiles(workspaceId);
    const newFile: MediaFile = {
      id: `media-${Date.now()}`,
      workspaceId,
      filename,
      bucketName: mimeType.startsWith('image/') ? 'images' : 'documents',
      mimeType,
      fileSize,
      uploadedBy,
      url: simulatedUrl || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=300&q=80',
      createdAt: new Date().toISOString(),
    };
    files.push(newFile);
    setSaaSStore(`media_${workspaceId}`, files);
    return newFile;
  }
}

// ==========================================
// 6. GLOBAL SEARCH SERVICE
// ==========================================
export class GlobalSearchService {
  static search(workspaceId: string, query: string, items: GlobalSearchItem[]): GlobalSearchItem[] {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return items.filter(
      item =>
        item.workspaceId === workspaceId &&
        (item.title.toLowerCase().includes(lowerQuery) || item.content.toLowerCase().includes(lowerQuery))
    );
  }
}

// ==========================================
// 7. ANALYTICS SERVICE
// ==========================================
export class AnalyticsService {
  static getMetrics(workspaceId: string): AnalyticsMetrics {
    const allMetrics = getSaaSStore<Record<string, AnalyticsMetrics>>('analytics', {});
    if (!allMetrics[workspaceId]) {
      // Seed robust SaaS analytics trend data
      allMetrics[workspaceId] = {
        workspaceId,
        registrationCountByDay: {
          'Mon': 12,
          'Tue': 18,
          'Wed': 31,
          'Thu': 45,
          'Fri': 62,
          'Sat': 81,
          'Sun': 95,
        },
        paymentCollectionByDay: {
          'Mon': 8000,
          'Tue': 12000,
          'Wed': 24000,
          'Thu': 40000,
          'Fri': 56000,
          'Sat': 72000,
          'Sun': 92000,
        },
        attendanceCountByHour: {
          '08:00': 15,
          '09:00': 64,
          '10:00': 112,
          '11:00': 120,
          '12:00': 122,
          '13:00': 118,
          '14:00': 122,
        },
        emailDeliveryRates: {
          sent: 320,
          delivered: 318,
          opened: 245,
        },
        workspaceGrowthRate: 24.5,
        totalRevenueCollected: 92000,
      };
      setSaaSStore('analytics', allMetrics);
    }
    return allMetrics[workspaceId];
  }

  static incrementRevenue(workspaceId: string, amount: number) {
    const metrics = this.getMetrics(workspaceId);
    metrics.totalRevenueCollected += amount;
    const allMetrics = getSaaSStore<Record<string, AnalyticsMetrics>>('analytics', {});
    allMetrics[workspaceId] = metrics;
    setSaaSStore('analytics', allMetrics);
  }
}

// ==========================================
// 13. DATA IMPORT ENGINE SERVICE (MEMBERS, ETC)
// ==========================================
export class ImportService {
  static getImports(workspaceId: string): WorkspaceImport[] {
    return getSaaSStore<WorkspaceImport[]>(`imports_${workspaceId}`, []);
  }

  static triggerImport(
    workspaceId: string,
    sourceType: WorkspaceImport['sourceType'],
    rawCSVContent: string
  ): WorkspaceImport {
    // Basic lines split simulation
    const lines = rawCSVContent.trim().split('\n');
    const headers = lines[0]?.split(',') || [];
    const rows = lines.slice(1).map(line => {
      const vals = line.split(',');
      const obj: Record<string, any> = {};
      headers.forEach((h, idx) => {
        obj[h.trim()] = vals[idx]?.trim() || '';
      });
      return obj;
    });

    const validationErrors: string[] = [];
    // Validate CSV formatting rules
    if (!headers.includes('email') && !headers.includes('Email')) {
      validationErrors.push("Missing required 'email' column.");
    }
    if (!headers.includes('name') && !headers.includes('Name')) {
      validationErrors.push("Missing required 'name' column.");
    }

    const imports = this.getImports(workspaceId);
    const newImport: WorkspaceImport = {
      id: `import-${Date.now()}`,
      workspaceId,
      sourceType,
      status: validationErrors.length > 0 ? 'Failed' : 'Validated',
      progress: validationErrors.length > 0 ? 0 : 100,
      previewData: rows.slice(0, 5), // Preview top 5 rows
      errorReport: validationErrors.length > 0 ? validationErrors.join('\n') : undefined,
      rollbackToken: `token-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    imports.unshift(newImport);
    setSaaSStore(`imports_${workspaceId}`, imports);
    return newImport;
  }

  static rollbackImport(workspaceId: string, importId: string): boolean {
    const imports = this.getImports(workspaceId);
    const idx = imports.findIndex(i => i.id === importId);
    if (idx >= 0) {
      imports[idx].status = 'Failed';
      imports[idx].progress = 0;
      imports[idx].errorReport = 'Import successfully rolled back by administrator.';
      setSaaSStore(`imports_${workspaceId}`, imports);
      return true;
    }
    return false;
  }
}
