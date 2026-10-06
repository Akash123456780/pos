import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'hi' | 'mr';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    mr: string;
  };
}

const TRANSLATIONS: Translations = {
  // Navigation
  navHome: { en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
  navSales: { en: 'Sales', hi: 'बिक्री', mr: 'विक्री' },
  navInventory: { en: 'Inventory', hi: 'स्टॉक', mr: 'साठा' },
  navReports: { en: 'Reports', hi: 'रिपोर्ट्स', mr: 'अहवाल' },
  navMore: { en: 'More', hi: 'अधिक', mr: 'अधिक' },

  // Header & Greetings
  goodMorning: { en: 'Good Morning', hi: 'शुभ प्रभात', mr: 'शुभ प्रभात' },
  goodAfternoon: { en: 'Good Afternoon', hi: 'शुभ दोपहर', mr: 'शुभ दुपार' },
  goodEvening: { en: 'Good Evening', hi: 'शुभ संध्या', mr: 'शुभ संध्याकाळ' },
  welcomeBack: { en: 'Welcome back, Owner', hi: 'स्वागत है, मालिक', mr: 'स्वागत आहे, मालक' },
  allBranches: { en: 'All Branches', hi: 'सभी शाखाएं', mr: 'सर्व शाखा' },

  // Dashboard KPIs
  todaySales: { en: "Today's Sales", hi: 'आज की बिक्री', mr: 'आजची विक्री' },
  todayProfit: { en: "Today's Profit", hi: 'आज का शुद्ध नफा', mr: 'आजचा निव्वळ नफा' },
  todayBills: { en: "Today's Bills", hi: 'आज के बिल', mr: 'आजची बिले' },
  todayExpenses: { en: "Today's Expenses", hi: 'आज के खर्च', mr: 'आजचे खर्च' },
  cashCollection: { en: 'Cash Collection', hi: 'नकद संकलन', mr: 'रोख वसुली' },
  upiCollection: { en: 'UPI Collection', hi: 'UPI संकलन', mr: 'UPI वसुली' },
  cardCollection: { en: 'Card Collection', hi: 'कार्ड संकलन', mr: 'कार्ड वसुली' },
  creditSales: { en: 'Credit Sales', hi: 'उधार बिक्री (खाता)', mr: 'उधारी विक्री (खाते)' },
  stockValue: { en: 'Stock Value', hi: 'स्टॉक मूल्यांकन', mr: 'साठ्याचे मूल्यांकन' },
  receivables: { en: 'Receivables', hi: 'ग्राहकों से प्राप्य', mr: 'ग्राहकांकडून येणे बाकी' },
  payables: { en: 'Payables', hi: 'सप्लायर देय', mr: 'पुरवठादारांना देणे बाकी' },
  lowStockAlert: { en: 'Low Stock Alert', hi: 'कम स्टॉक अलर्ट', mr: 'कमी साठ्याची सूचना' },
  salesVelocity: { en: 'Hourly Sales Velocity', hi: 'प्रति घंटा बिक्री गति', mr: 'तासनिहाय विक्री गती' },
  inventoryAlerts: { en: 'Inventory Alerts', hi: 'स्टॉक सूचनाएं', mr: 'साठा सूचना' },
  staffActivity: { en: 'Live Staff Activity', hi: 'कर्मचारी गतिविधि', mr: 'कर्मचारी कामकाज' },
  recentBills: { en: 'Recent Bills', hi: 'हाल ही के बिल', mr: 'नुकतीच झालेली बिले' },
  vsYesterday: { en: 'vs yesterday', hi: 'कल की तुलना में', mr: 'कालच्या तुलनेत' },
  reviewStock: { en: 'Review Stock', hi: 'स्टॉक जांचें', mr: 'साठा तपासा' },
  khataLedger: { en: 'Customer Khata', hi: 'ग्राहक खाता बही', mr: 'ग्राहक खातेवही' },

  // Actions
  viewAll: { en: 'View All', hi: 'सभी देखें', mr: 'सर्व पहा' },
  syncNow: { en: 'Sync Now', hi: 'डेटा सिंक करें', mr: 'डेटा सिंक करा' },
  searchPlaceholder: { en: 'Search bills, products, customers, staff, branches...', hi: 'बिल, उत्पाद, ग्राहक, कर्मचारी खोजें...', mr: 'बिल, वस्तू, ग्राहक, कर्मचारी शोधा...' },
  lastSynced: { en: 'Synced just now', hi: 'अभी सिंक हुआ', mr: 'आत्ताच सिंक झाले' },
  offlineBanner: { en: "Offline — showing last synchronized data", hi: 'ऑफ़लाइन — अंतिम सिंक किया गया डेटा दिखाया जा रहा है', mr: 'ऑफलाइन — शेवटचा सिंक झालेला डेटा दाखवला जात आहे' },
  reconnecting: { en: "Synchronizing data with Cloud...", hi: 'क्लाउड के साथ डेटा सिंक हो रहा है...', mr: 'क्लाउडसोबत डेटा सिंक होत आहे...' },
  syncCompleted: { en: "Sync completed successfully", hi: 'डेटा सफलतापूर्वक सिंक हुआ', mr: 'डेटा यशस्वीरीत्या सिंक झाला' },
  connectionRestored: { en: "Connection restored", hi: 'इंटरनेट कनेक्शन पूर्ववत', mr: 'इंटरनेट कनेक्शन पूर्ववत झाले' },

  // Sections
  businessHealth: { en: 'Business Health', hi: 'व्यवसाय स्वास्थ्य', mr: 'व्यवसाय आरोग्य' },
  customers: { en: 'Customers', hi: 'ग्राहक वर्ग', mr: 'ग्राहक वर्ग' },
  suppliers: { en: 'Suppliers', hi: 'सप्लायर्स / पुरवठादार', mr: 'पुरवठादार' },
  staff: { en: 'Staff & Cashiers', hi: 'कर्मचारी व कैशियर', mr: 'कर्मचारी आणि कॅशियर' },
  expenses: { en: 'Daily Expenses', hi: 'दैनिक खर्च', mr: 'दैनिक खर्च' },
  posDevices: { en: 'POS Terminals Fleet', hi: 'POS उपकरण समूह', mr: 'POS मशिन्स समूह' },
  notifications: { en: 'Notifications', hi: 'सूचना केंद्र', mr: 'सूचना केंद्र' },
  security: { en: 'Security Center', hi: 'सुरक्षा केंद्र', mr: 'सुरक्षा केंद्र' },
  settings: { en: 'Store Settings', hi: 'स्टोअर सेटिंग्स', mr: 'स्टोअर सेटिंग्ज' },
  gstSummary: { en: 'GST Tax Summary', hi: 'जीएसटी कर सारांश', mr: 'जीएसटी कर तपशील' },
  reportsCenter: { en: 'Reports Center', hi: 'रिपोर्ट केंद्र', mr: 'अहवाल केंद्र' },
  cashRegister: { en: 'Cash Till Reconciliation', hi: 'नकद गल्ला मिलान', mr: 'गल्ला रोकड ताळमेळ' },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof typeof TRANSLATIONS) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => TRANSLATIONS[key]?.en || String(key),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('nexus_language') as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('nexus_language', lang);
  };

  const t = (key: keyof typeof TRANSLATIONS): string => {
    const item = TRANSLATIONS[key];
    if (!item) return String(key);
    return item[language] || item.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
