/**
 * Multi-Language Regional i18n Localization Dictionary
 * Supports English (en), Hindi (hi), and Gujarati (gu) for rural dairy farmers.
 */

export const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    myHerd: 'My Cattle Herd',
    breedAdvisor: 'Sire Match & AI',
    milkLogs: 'Milk Yield Logs',
    coopPayment: 'Co-op Payment',
    inventory: 'Semen Straw Stock',
    registerCow: 'Register Cattle Tag',
    logMilk: 'Log Milk Collection',
    systemReady: 'System Ready',
    offlineMode: 'Offline Mode (Local Sync)',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    myHerd: 'मेरी गाय और भैंस',
    breedAdvisor: 'नस्ल मिलान और कृत्रिम गर्भाधान',
    milkLogs: 'दूध उत्पादन रिकॉर्ड',
    coopPayment: 'डेयरी भुगतान',
    inventory: 'सीमेन स्ट्रॉ स्टॉक',
    registerCow: 'नया कान-टैग दर्ज करें',
    logMilk: 'दूध संग्रह दर्ज करें',
    systemReady: 'सिस्टम तैयार है',
    offlineMode: 'ऑफ़लाइन मोड (स्थानीय सिंक)',
  },
  gu: {
    dashboard: 'ડેશબોર્ડ',
    myHerd: 'મારું પશુધન',
    breedAdvisor: 'નસલ સુધારણા અને કૃત્રિમ બીજદાન',
    milkLogs: 'દૂધ ઉત્પાદન નોંધણી',
    coopPayment: 'ડેરી ચૂકવણી',
    inventory: 'સીમેન સ્ટ્રો સ્ટોક',
    registerCow: 'નવો ઇયર ટૅગ ઉમેરો',
    logMilk: 'દૂધ ભરાવો',
    systemReady: 'સિસ્ટમ સજ્જ છે',
    offlineMode: 'ઑફલાઇન મોડ',
  }
};

export function getTranslation(lang = 'en', key) {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}
