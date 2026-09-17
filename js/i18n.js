'use strict';
/**
 * AI Pattern & Image Design Studio PRO — js/i18n.js
 * Multi-Language Translation Engine
 * Supported Languages: English (en), Bengali (bn), Arabic (ar - with RTL support)
 */

const I18N = {
  currentLocale: 'en',
  
  DICTIONARY: {
    en: {
      appName: 'AI Pattern & Image Design Studio PRO',
      tagline: 'Generate. Customize. Create.',
      easyMode: 'Easy Mode',
      proMode: 'Pro Mode',
      onePageMode: 'One-Page Mode',
      hotkeys: 'Hotkeys',
      newDesign: 'New',
      undo: 'Undo',
      redo: 'Redo',
      projects: 'Projects',
      randomize: 'Randomize',
      copy: 'Copy',
      csvExport: 'CSV',
      stockExport: 'Stock Studio',
      download: 'Download',
      masterDownload: '10MB+ Master (8K)',
      generate: 'Generate',
      generate20: '20 Unique',
      variation: 'Variation',
      favorite: 'Favorite',
      batch: 'Batch Generator',
      seamlessTest: 'Seamless Test',
      beforeAfter: 'Before / After',
      categories: 'Categories',
      patterns: 'Patterns',
      templates: 'Templates',
      aiGenerate: 'AI Generate',
      colors: 'Colors',
      sliders: 'Sliders',
      effects: 'FX',
      size: 'Size',
      export: 'Export',
      layers: 'Layers',
      promptPlaceholder: "Describe a pattern with AI (e.g., 'luxury gold floral seamless pattern for packaging')…",
      aiAnalyzing: 'AI is analyzing your prompt…',
      applyAndGenerate: 'Apply & Generate',
      magicAutoDesign: '1-Click Magic Auto-Design',
      searchCategories: 'Search 96 categories & 9,600 sub-styles…',
      searchPatterns: 'Search 203+ patterns…',
      activePalette: 'Active Palette',
      colorHarmony: 'Color Harmony',
      imageToPalette: 'Image to Palette',
      uploadDropzone: 'Drop image here or click to upload',
      resolutionPreset: 'Resolution Preset',
      canvasWidth: 'Width',
      canvasHeight: 'Height',
      lockAspectRatio: 'Lock Aspect Ratio',
      printResolution: 'Print Resolution (PPI)',
      exportFormat: 'Format',
      exportQuality: 'Quality',
      batchCount: 'Batch Count',
      batchGenerateBtn: 'Generate Batch',
      downloadZip: 'Download ZIP (Images + CSV)',
      saveProject: 'Save Current Design',
      exportJson: 'Export JSON',
      importJson: 'Import JSON',
      seamlessPass: 'Seamless: PASS',
      seamlessFail: 'Possible edge mismatch detected',
      similarityScore: 'Similarity',
      uniqueness: 'Uniqueness',
      aiCredits: 'AI Credits',
      aiProviderNotConfigured: 'AI provider not configured.',
      configureApi: 'Configure API',
      localDemoGenerator: 'Local Demo Generator',
      freeCredits: 'Free Credits',
      allRightsReserved: 'MIT License © 2026 AI Pattern Studio PRO'
    },
    bn: {
      appName: 'এআই প্যাটার্ন অ্যান্ড ইমেজ ডিজাইন স্টুডিও প্রো',
      tagline: 'তৈরি করুন। কাস্টমাইজ করুন। সৃষ্টি করুন।',
      easyMode: 'সহজ মোড',
      proMode: 'প্রো মোড',
      onePageMode: 'ওয়ান-পেজ মোড',
      hotkeys: 'শর্টকাট',
      newDesign: 'নতুন',
      undo: 'পূর্বাবস্থা (আন্ডু)',
      redo: 'পুনরাবৃত্তি (রিডু)',
      projects: 'প্রজেক্টসমূহ',
      randomize: 'র‍্যান্ডম করুন',
      copy: 'কপি',
      csvExport: 'সিএসভি',
      stockExport: 'স্টক স্টুডিও',
      download: 'ডাউনলোড',
      masterDownload: '১০মেগাবাইট+ মাস্টার (৮কে)',
      generate: 'জেনারেট করুন',
      generate20: '২০টি ইউনিক ডিজাইন',
      variation: 'ভেরিয়েশন',
      favorite: 'প্রিয় তালিকা',
      batch: 'ব্যাচ জেনারেটর',
      seamlessTest: 'সিমলেস টেস্ট',
      beforeAfter: 'আগে / পরে',
      categories: 'ক্যাটাগরি',
      patterns: 'প্যাটার্নসমূহ',
      templates: 'টেমপ্লেটসমূহ',
      aiGenerate: 'এআই জেনারেট',
      colors: 'রঙ স্টুডিও',
      sliders: 'কন্ট্রোল স্লাইডার',
      effects: 'এফেক্টস (FX)',
      size: 'রেজোলিউশন ও সাইজ',
      export: 'এক্সপোর্ট',
      layers: 'লেয়ার সিস্টেম',
      promptPlaceholder: "এআই প্রম্পট লিখুন (যেমন: 'লাক্সারি গোল্ড ফ্লোরাল সিমলেস প্যাটার্ন')…",
      aiAnalyzing: 'এআই আপনার প্রম্পট বিশ্লেষণ করছে…',
      applyAndGenerate: 'প্রয়োগ ও জেনারেট',
      magicAutoDesign: 'এক ক্লিকে ম্যাজিক ডিজাইন',
      searchCategories: '৯৬টি ক্যাটাগরি ও ৯,৬০০টি সাব-স্টাইল খুঁজুন…',
      searchPatterns: '২০৩+ প্যাটার্ন খুঁজুন…',
      activePalette: 'বর্তমান প্যালেট',
      colorHarmony: 'রঙের সামঞ্জস্য (হার্মোনি)',
      imageToPalette: 'ছবি থেকে রঙ সংগ্রহ',
      uploadDropzone: 'ছবি টেনে আনুন বা ক্লিক করে আপলোড করুন',
      resolutionPreset: 'রেজোলিউশন প্রিসেট',
      canvasWidth: 'প্রস্থ (W)',
      canvasHeight: 'উচ্চতা (H)',
      lockAspectRatio: 'অনুপাত লক রাখুন',
      printResolution: 'প্রিন্ট রেজোলিউশন (PPI)',
      exportFormat: 'ফরম্যাট',
      exportQuality: 'কোয়ালিটি',
      batchCount: 'ব্যাচ সংখ্যা',
      batchGenerateBtn: 'ব্যাচ তৈরি করুন',
      downloadZip: 'জিপ ফাইল ডাউনলোড (ছবি + সিএসভি)',
      saveProject: 'বর্তমান ডিজাইন সংরক্ষণ করুন',
      exportJson: 'জেসন এক্সপোর্ট',
      importJson: 'জেসন ইমপোর্ট',
      seamlessPass: 'সিমলেস: শতভাগ মিলেছে',
      seamlessFail: 'প্রান্তের অমিল শনাক্ত হয়েছে',
      similarityScore: 'সাদৃশ্য',
      uniqueness: 'ইউনিকনেস',
      aiCredits: 'এআই ক্রেডিট',
      aiProviderNotConfigured: 'এআই প্রোভাইডার কনফিগার করা নেই।',
      configureApi: 'এপিআই সেট করুন',
      localDemoGenerator: 'লোকাল ডেমো জেনারেটর',
      freeCredits: 'ফ্রি ক্রেডিট',
      allRightsReserved: 'স্বত্বাধিকার © ২০২৬ এআই প্যাটার্ন স্টুডিও প্রো'
    },
    ar: {
      appName: 'استوديو تصميم الأنماط والصور بالذكاء الاصطناعي برو',
      tagline: 'توليد. تخصيص. إبداع.',
      easyMode: 'الوضع السهل',
      proMode: 'وضع المحترفين',
      onePageMode: 'وضع الصفحة الواحدة',
      hotkeys: 'اختصارات المفاتيح',
      newDesign: 'جديد',
      undo: 'تراجع',
      redo: 'إعادة',
      projects: 'المشاريع',
      randomize: 'عشوائي',
      copy: 'نسخ',
      csvExport: 'ملف CSV',
      stockExport: 'استوديو ستوك',
      download: 'تحميل',
      masterDownload: 'نسخة ماستر 10 ميجابايت (8K)',
      generate: 'توليد',
      generate20: '20 تصميم فريد',
      variation: 'تنويع',
      favorite: 'المفضلة',
      batch: 'المولد الدفعي',
      seamlessTest: 'فحص التكرار السلس',
      beforeAfter: 'قبل / بعد',
      categories: 'التصنيفات',
      patterns: 'الأنماط',
      templates: 'القوالب',
      aiGenerate: 'توليد الذكاء الاصطناعي',
      colors: 'استوديو الألوان',
      sliders: 'أشرطة التحكم',
      effects: 'التأثيرات',
      size: 'المقاس والدقة',
      export: 'تصدير',
      layers: 'نظام الطبقات',
      promptPlaceholder: "اكتب وصف النمط بالذكاء الاصطناعي (مثل: 'نمط هندسي إسلامي ذهبي سلس')…",
      aiAnalyzing: 'جاري تحليل الوصف بالذكاء الاصطناعي…',
      applyAndGenerate: 'تطبيق وتوليد',
      magicAutoDesign: 'تصميم سحري بنقرة واحدة',
      searchCategories: 'ابحث في 96 فئة و 9,600 نمط فرعي…',
      searchPatterns: 'ابحث في أكثر من 203 نمط…',
      activePalette: 'لوحة الألوان الحالية',
      colorHarmony: 'تناسق الألوان',
      imageToPalette: 'استخراج الألوان من صورة',
      uploadDropzone: 'اسحب الصورة هنا أو اضغط للرفع',
      resolutionPreset: 'إعدادات الدقة المسبقة',
      canvasWidth: 'العرض',
      canvasHeight: 'الارتفاع',
      lockAspectRatio: 'قفل نسبة العرض إلى الارتفاع',
      printResolution: 'دقة الطباعة (PPI)',
      exportFormat: 'صيغة التصدير',
      exportQuality: 'الجودة',
      batchCount: 'عدد الدفعة',
      batchGenerateBtn: 'توليد الدفعة',
      downloadZip: 'تحميل كملف مضغوط ZIP',
      saveProject: 'حفظ التصميم الحالي',
      exportJson: 'تصدير JSON',
      importJson: 'استيراد JSON',
      seamlessPass: 'التكرار السلس: متطابق تماماً',
      seamlessFail: 'تم اكتشاف عدم تطابق في الحواف',
      similarityScore: 'التشابه',
      uniqueness: 'التميز',
      aiCredits: 'رصيد الذكاء الاصطناعي',
      aiProviderNotConfigured: 'مزود الذكاء الاصطناعي غير مضبوط.',
      configureApi: 'إعداد واجهة API',
      localDemoGenerator: 'مولد النماذج المحلي (ديمو)',
      freeCredits: 'الرصيد المجاني',
      allRightsReserved: 'جميع الحقوق محفوظة © 2026 استوديو الأنماط'
    }
  },

  init(defaultLocale = 'en') {
    const saved = localStorage.getItem('pgpro_locale') || defaultLocale;
    this.setLocale(saved);
  },

  setLocale(locale) {
    if (!this.DICTIONARY[locale]) locale = 'en';
    this.currentLocale = locale;
    localStorage.setItem('pgpro_locale', locale);

    // Apply RTL if Arabic
    const isRTL = (locale === 'ar');
    document.documentElement.setAttribute('lang', locale);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.body.classList.toggle('rtl-layout', isRTL);

    this.applyTranslations();
    
    // Dispatch event so other components update if necessary
    window.dispatchEvent(new CustomEvent('localechanged', { detail: { locale, isRTL } }));
  },

  t(key, fallback = '') {
    const dict = this.DICTIONARY[this.currentLocale] || this.DICTIONARY.en;
    return dict[key] || (this.DICTIONARY.en && this.DICTIONARY.en[key]) || fallback || key;
  },

  applyTranslations() {
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (val) el.textContent = val;
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = this.t(key);
      if (val) el.setAttribute('placeholder', val);
    });

    // Translate title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = this.t(key);
      if (val) el.setAttribute('title', val);
    });
  }
};

if (typeof window !== 'undefined') {
  window.I18N = I18N;
}
if (typeof module !== 'undefined') {
  module.exports = I18N;
}
