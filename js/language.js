/**
 * Language Toggle Module
 * Handles bilingual content switching (EN/AR) with RTL support
 */

window.LanguageToggle = (function() {
  'use strict';

  let langBtn = null;
  let currentLang = 'en';

  // Translation dictionary
  const translations = {
    en: {
      // Navigation
      nav_home: 'Home',
      nav_about: 'About',
      nav_services: 'Services',
      nav_portfolio: 'Portfolio',
      nav_testimonials: 'Testimonials',
      nav_contact: 'Contact',
      lang_switch: 'عربي',

      // Hero
      hero_title: 'Strategic Solutions for Visionary Leaders',
      hero_subtitle: 'We partner with ambitious organizations to unlock growth, optimize operations, and lead market transformation.',
      cta_consultation: 'Book a Free Consultation',
      cta_services: 'Explore Our Services',
      stat_clients: '+ Clients',
      stat_industries: '+ Industries',
      stat_retention: '% Retention',

      // About
      about_title: 'Who We Are',
      about_description: 'Since 2012, Summit Edge Consulting has been the trusted strategic partner for organizations across the MENA region. We embed with your team and execute together, ensuring sustainable transformation and measurable results.',
      about_experience: '10+ Years Experience',
      about_experience_desc: 'Proven track record across multiple industries',
      about_partnership: 'True Partnership',
      about_partnership_desc: 'We work alongside your team as embedded partners',
      about_results: 'Measurable Results',
      about_results_desc: 'Data-driven strategies with clear ROI metrics',
      about_regional: 'Regional Expertise',
      about_regional_desc: 'Deep understanding of MENA market dynamics',

      // Services
      services_title: 'What We Offer',
      services_subtitle: 'Comprehensive consulting services tailored to accelerate your business transformation',
      service_strategy_title: 'Strategic Planning & Growth',
      service_strategy_desc: 'Long-term roadmaps, market entry strategies, and competitive analysis for sustainable growth.',
      service_financial_title: 'Financial Advisory',
      service_financial_desc: 'Financial restructuring, investment analysis, and risk management to optimize returns.',
      service_digital_title: 'Digital Transformation',
      service_digital_desc: 'Process automation, technology adoption, and digital strategy implementation.',
      service_hr_title: 'Human Capital & Talent',
      service_hr_desc: 'Organizational design, leadership development, and talent acquisition strategies.',
      service_operations_title: 'Operational Excellence',
      service_operations_desc: 'Supply chain optimization, lean processes, and quality management.',

      // Portfolio
      portfolio_title: 'Our Work',
      portfolio_subtitle: 'Real results delivered for organizations across diverse industries',
      filter_all: 'All Projects',
      filter_strategy: 'Strategy',
      filter_financial: 'Financial',
      filter_digital: 'Digital',
      filter_operations: 'Operations',
      view_details: 'View Details',

      // Testimonials
      testimonials_title: 'Client Feedback',
      testimonials_subtitle: 'What our partners say about working with Summit Edge',
      testimonial_1_quote: '"Summit Edge helped us restructure our operations and we saw a 40% increase in efficiency within 6 months."',
      testimonial_1_name: 'Ahmed Al-Rashidi',
      testimonial_1_role: 'CEO, Gulf Real Estate Group',
      testimonial_2_quote: '"Their financial advisory team guided us through a complex funding round. Professional and knowledgeable."',
      testimonial_2_name: 'Noura Al-Mansoori',
      testimonial_2_role: 'CFO, Emirates Tech Startup',
      testimonial_3_quote: '"The digital transformation roadmap they created was practical and achievable. We are now industry leaders."',
      testimonial_3_name: 'Khaled Al-Harbi',
      testimonial_3_role: 'Director, Advanced Healthcare Systems',

      // Contact
      contact_title: 'Get In Touch',
      contact_subtitle: 'Ready to transform your business? Let us discuss your challenges and opportunities.',
      form_name: 'Full Name',
      form_email: 'Email Address',
      form_phone: 'Phone Number',
      form_message: 'Message',
      form_submit: 'Send Message',
      success_message: 'Thank you! We will get back to you within 24 hours.',

      // Footer
      footer_description: 'Elevating businesses to new heights through strategic consulting and transformational partnerships.',
      footer_links: 'Quick Links',
      footer_services: 'Services',
      footer_connect: 'Connect With Us',
      copyright: '© 2026 Summit Edge Consulting. All rights reserved.'
    },
    ar: {
      // Navigation
      nav_home: 'الرئيسية',
      nav_about: 'من نحن',
      nav_services: 'خدماتنا',
      nav_portfolio: 'أعمالنا',
      nav_testimonials: 'آراء العملاء',
      nav_contact: 'تواصل معنا',
      lang_switch: 'EN',

      // Hero
      hero_title: 'حلول استراتيجية لقادة الرؤية',
      hero_subtitle: 'نتشارك مع المؤسسات الطموحة لتحقيق النمو وتطوير العمليات وقيادة التحول في السوق.',
      cta_consultation: 'احجز استشارة مجانية',
      cta_services: 'اكتشف خدماتنا',
      stat_clients: '+ عميل',
      stat_industries: '+ قطاع',
      stat_retention: '% الاحتفاظ',

      // About
      about_title: 'من نحن',
      about_description: 'منذ عام 2012، كانت قمة الريادة للاستشارات الشريك الاستراتيجي الموثوق للمؤسسات في منطقة الشرق الأوسط. نعمل مع فريقك وننفذ معًا لضمان التحول المستدام والنتائج القابلة للقياس.',
      about_experience: 'خبرة أكثر من 10 سنوات',
      about_experience_desc: 'سجل حافل عبر صناعات متعددة',
      about_partnership: 'شراكة حقيقية',
      about_partnership_desc: 'نعمل جنبًا إلى جنب مع فريقك كشركاء',
      about_results: 'نتائج قابلة للقياس',
      about_results_desc: 'استراتيجيات مدفوعة بالبيانات',
      about_regional: 'خبرة إقليمية',
      about_regional_desc: 'فهم عميق لديناميكيات السوق',

      // Services
      services_title: 'ما نقدمه',
      services_subtitle: 'خدمات استشارية شاملة مصممة لتسريع عملية تحول أعمالك',
      service_strategy_title: 'التخطيط الاستراتيجي والنمو',
      service_strategy_desc: 'خرائط طريق طويلة المدى واستراتيجيات دخول السوق للنمو المستدام.',
      service_financial_title: 'الاستشارات المالية',
      service_financial_desc: 'إعادة الهيكلة المالية وتحليل الاستثمار وإدارة المخاطر.',
      service_digital_title: 'التحول الرقمي',
      service_digital_desc: 'أتمتة العمليات وتبني التكنولوجيا وتنفيذ الاستراتيجية الرقمية.',
      service_hr_title: 'رأس المال البشري والمواهب',
      service_hr_desc: 'التصميم التنظيمي وتطوير القيادة واستراتيجيات اكتساب المواهب.',
      service_operations_title: 'التميز التشغيلي',
      service_operations_desc: 'تحسين سلسلة التوريد والعمليات الرشيقة وإدارة الجودة.',

      // Portfolio
      portfolio_title: 'أعمالنا',
      portfolio_subtitle: 'نتائج حقيقية تم تقديمها لمؤسسات عبر صناعات متنوعة',
      filter_all: 'جميع المشاريع',
      filter_strategy: 'الاستراتيجية',
      filter_financial: 'المالية',
      filter_digital: 'الرقمية',
      filter_operations: 'العمليات',
      view_details: 'عرض التفاصيل',

      // Testimonials
      testimonials_title: 'آراء العملاء',
      testimonials_subtitle: 'ماذا يقول شركاؤنا عن العمل مع قمة الريادة',
      testimonial_1_quote: '"ساعدتنا قمة الريادة في إعادة هيكلة عملياتنا وشهدنا زيادة بنسبة 40% في الكفاءة خلال 6 أشهر."',
      testimonial_1_name: 'أحمد الراشدي',
      testimonial_1_role: 'الرئيس التنفيذي، مجموعة الخليج العقارية',
      testimonial_2_quote: '"أرشدنا فريق الاستشارات المالية خلال جولة تمويل معقدة. محترفون وذوو معرفة."',
      testimonial_2_name: 'نورة المنصوري',
      testimonial_2_role: 'المدير المالي، شركة الإمارات التقنية',
      testimonial_3_quote: '"كانت خارطة طريق التحول الرقمي التي أنشأوها عملية وقابلة للتحقيق. نحن الآن رواد في صناعتنا."',
      testimonial_3_name: 'خالد الحربي',
      testimonial_3_role: 'مدير، أنظمة الرعاية الصحية المتقدمة',

      // Contact
      contact_title: 'تواصل معنا',
      contact_subtitle: 'هل أنت مستعد لتحويل أعمالك؟ دعنا نناقش تحدياتك وفرصك.',
      form_name: 'الاسم الكامل',
      form_email: 'البريد الإلكتروني',
      form_phone: 'رقم الهاتف',
      form_message: 'الرسالة',
      form_submit: 'إرسال الرسالة',
      success_message: 'شكرًا لك! سنتواصل معك خلال 24 ساعة.',

      // Footer
      footer_description: 'نرتقي بالأعمال إلى آفاق جديدة من خلال الاستشارات الاستراتيجية والشراكات التحويلية.',
      footer_links: 'روابط سريعة',
      footer_services: 'الخدمات',
      footer_connect: 'تواصل معنا',
      copyright: '© 2026 قمة الريادة للاستشارات. جميع الحقوق محفوظة.'
    }
  };

  /**
   * Get saved language or browser default
   */
  function getSavedLanguage() {
    const saved = localStorage.getItem('summit-lang');
    if (saved && translations[saved]) return saved;
    
    const browserLang = navigator.language.slice(0, 2);
    return browserLang === 'ar' ? 'ar' : 'en';
  }

  /**
   * Set language and update content
   */
  function setLanguage(lang) {
    if (!translations[lang]) return;

    currentLang = lang;
    localStorage.setItem('summit-lang', lang);

    // Set direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    // Update all translatable elements
    updateContent();
    updateButton();

    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: lang }
    }));
  }

  /**
   * Update all translatable content
   */
  function updateContent() {
    const dict = translations[currentLang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // Update aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key]) {
        el.setAttribute('aria-label', dict[key]);
      }
    });
  }

  /**
   * Update language toggle button
   */
  function updateButton() {
    if (!langBtn) return;

    const text = langBtn.querySelector('.lang-text') || langBtn;
    text.textContent = translations[currentLang].lang_switch;
    langBtn.setAttribute('aria-label', `Switch to ${currentLang === 'en' ? 'Arabic' : 'English'}`);
  }

  /**
   * Toggle language
   */
  function toggle() {
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
  }

  /**
   * Initialize module
   */
  function init() {
    langBtn = document.getElementById('langToggle') ||
              document.querySelector('[data-lang-toggle]') ||
              document.querySelector('.lang-toggle');

    if (!langBtn) {
      console.warn('Language toggle not found');
    }

    // Set initial language
    setLanguage(getSavedLanguage());

    // Event listener
    if (langBtn) {
      langBtn.addEventListener('click', toggle);
    }

    console.log('🌍 Language: ' + currentLang.toUpperCase());
  }

  return {
    init,
    setLanguage,
    toggle,
    getLanguage: () => currentLang,
    getTranslation: (key) => translations[currentLang][key]
  };

})();
