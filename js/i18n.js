/**
 * CloFix i18n - header, footer, and page [data-i18n] labels.
 * Preference saved in localStorage. Missing keys fall back to English.
 */
(function () {
  var STORAGE_KEY = "clofix-lang";
  var selectedLanguage = null;
  var translationObserver = null;
  var LABELS = {
    en: "EN", zh: "ZH", es: "ES", hi: "HI", ar: "AR", bn: "BN", pt: "PT",
    ru: "RU", ja: "JA", fr: "FR", de: "DE", ko: "KO", id: "ID", tr: "TR", vi: "VI", it: "IT"
  };
  var LANGUAGE_FLAGS = {
    en: ["🇺🇸", "United States"], zh: ["🇨🇳", "China"], es: ["🇪🇸", "Spain"],
    hi: ["🇮🇳", "India"], ar: ["🇸🇦", "Saudi Arabia"], bn: ["🇧🇩", "Bangladesh"],
    pt: ["🇧🇷", "Brazil"], ru: ["🇷🇺", "Russia"], ja: ["🇯🇵", "Japan"],
    fr: ["🇫🇷", "France"], de: ["🇩🇪", "Germany"], ko: ["🇰🇷", "South Korea"],
    id: ["🇮🇩", "Indonesia"], tr: ["🇹🇷", "Türkiye"], vi: ["🇻🇳", "Vietnam"],
    it: ["🇮🇹", "Italy"]
  };
  var LANGUAGE_NAMES = {
    en: "English", zh: "Chinese", es: "Spanish", hi: "Hindi", ar: "Arabic",
    bn: "Bangla", pt: "Portuguese", ru: "Russian", ja: "Japanese", fr: "French",
    de: "German", ko: "Korean", id: "Indonesian", tr: "Turkish", vi: "Vietnamese",
    it: "Italian"
  };

  var EN = {
    "nav.tagline": "Global WAF",
    "nav.home": "Home",
    "nav.product": "Product",
    "nav.services": "Services",
    "nav.resources": "Resources",
    "nav.company": "Company",
    "nav.contact": "Contact",
    "nav.free_trial": "Free Trial",
    "nav.overview": "Overview",
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.platform": "Platform",
    "nav.core_services": "Core Services",
    "nav.all_services": "All Services",
    "nav.managed": "Managed Services",
    "nav.infrastructure": "Infrastructure",
    "nav.learn": "Learn",
    "nav.docs_hub": "Documentation Hub",
    "nav.blogs": "Blogs",
    "nav.insights": "Our Insights",
    "nav.faq": "FAQ",
    "nav.support": "Support",
    "nav.case_study": "Case Study",
    "nav.documentation": "Documentation",
    "nav.tools": "Tools",
    "nav.about": "About Us",
    "nav.careers": "Careers",
    "nav.partners_title": "Partners",
    "nav.our_clients": "Our Clients",
    "nav.our_partners": "Our Partners",
    "nav.become_partner": "Become A Partner",
    "nav.devops_manage": "DevOps Manage Service",
    "nav.cloud_manage": "Cloud Infra Manage Service",
    "nav.free_event": "Free Event",
    "footer.tagline": "Secure. Automate. Scale",
    "footer.product": "Product",
    "footer.resources": "Resources",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.features": "Features",
    "footer.pricing": "Pricing",
    "footer.free_trial": "Free Trial",
    "footer.event": "Free Event",
    "footer.docs": "Documentation",
    "footer.services": "Services",
    "footer.blogs": "Blogs",
    "footer.insights": "Our Insights",
    "footer.faq": "FAQ",
    "footer.support": "Support",
    "footer.case_study": "Case Study",
    "footer.about": "About",
    "footer.contact": "Contact",
    "footer.careers": "Careers",
    "footer.partners": "Partners",
    "footer.terms": "Terms",
    "footer.sla": "SLA",
    "footer.privacy": "Privacy Policy",
    "footer.copyright": "© 2026 CloFix InfoTech - Global AI-Powered WAF & Cloud Security. All Rights Reserved.",
    "page.flagship": "Flagship product",
    "page.hero_lead": "Global AI-powered Web Application Firewall for APIs, websites, and cloud apps - threat detection, DDoS mitigation, and zero-day defense with sub-millisecond latency.",
    "page.also_from": "Also from CloFix:",
    "page.all_features": "All features",
    "page.cta_kicker_main": "Main product",
    "page.cta_title_trial": "Start CloFix WAF trial",
    "page.cta_note_trial": "14 days. No credit card. Protect a live app.",
    "page.cta_kicker_product": "Product page",
    "page.cta_title_explore": "Explore CloFix WAF",
    "page.cta_note_explore": "AI engines, OWASP coverage, and global edge protection.",
    "page.cta_kicker_plans": "Plans",
    "page.cta_title_pricing": "View WAF pricing",
    "page.cta_note_pricing": "Starter to Enterprise - pick the right seat.",
    "page.stat_ai": "AI engines",
    "page.stat_core": "Core engines",
    "page.stat_uptime": "Uptime SLA",
    "page.stat_threats": "Threats / 24h",
    "page.waf_badge": "Global Web Application Firewall",
    "page.waf_h2": "Enterprise-Grade WAF Protection for Modern Applications",
    "page.waf_lead": "Protect your web applications from OWASP Top 10 threats, DDoS attacks, API exploits, and zero-day vulnerabilities with our AI-powered, cloud-native Web Application Firewall.",
    "page.waf_cta_trial": "Start Free Trial →",
    "page.waf_cta_features": "Explore WAF Features",
    "page.waf_slider_eyebrow": "AI-powered protection",
    "page.waf_slider_title": "Multi-Engine Security Stack"
  };

  /* Per-locale overlays (fallback to EN). Brand names stay English. */
  var LOC = {
    zh: {
      "nav.tagline": "全球 WAF", "nav.home": "首页", "nav.product": "产品", "nav.services": "服务",
      "nav.resources": "资源", "nav.company": "公司", "nav.contact": "联系", "nav.free_trial": "免费试用",
      "nav.overview": "概览", "nav.features": "功能", "nav.pricing": "定价", "nav.platform": "平台",
      "nav.core_services": "核心服务", "nav.all_services": "全部服务", "nav.managed": "托管服务",
      "nav.infrastructure": "基础设施", "nav.learn": "学习", "nav.docs_hub": "文档中心", "nav.blogs": "博客",
      "nav.insights": "洞察", "nav.faq": "常见问题", "nav.support": "支持", "nav.case_study": "案例",
      "nav.documentation": "文档", "nav.tools": "工具", "nav.about": "关于我们", "nav.careers": "招聘",
      "nav.partners_title": "合作伙伴", "nav.our_clients": "客户", "nav.our_partners": "合作伙伴",
      "nav.become_partner": "成为合作伙伴", "nav.devops_manage": "DevOps 托管服务",
      "nav.cloud_manage": "云基础设施托管", "nav.free_event": "免费活动",
      "footer.tagline": "安全. 自动化. 扩展", "footer.product": "产品", "footer.resources": "资源",
      "footer.company": "公司", "footer.legal": "法律", "footer.features": "功能", "footer.pricing": "定价",
      "footer.free_trial": "免费试用", "footer.event": "免费活动", "footer.docs": "文档",
      "footer.services": "服务", "footer.blogs": "博客", "footer.insights": "洞察", "footer.faq": "常见问题",
      "footer.support": "支持", "footer.case_study": "案例", "footer.about": "关于", "footer.contact": "联系",
      "footer.careers": "招聘", "footer.partners": "合作伙伴", "footer.terms": "条款", "footer.sla": "SLA",
      "footer.privacy": "隐私政策",
      "footer.copyright": "© 2026 CloFix InfoTech - 全球 AI 驱动 WAF 与云安全。保留所有权利。",
      "page.flagship": "旗舰产品",
      "page.hero_lead": "面向 API、网站和云应用的全球 AI Web 应用防火墙 - 威胁检测、DDoS 防护与零日防御，亚毫秒级延迟。",
      "page.also_from": "CloFix 还有：", "page.all_features": "全部功能",
      "page.cta_kicker_main": "主产品", "page.cta_title_trial": "开始 CloFix WAF 试用",
      "page.cta_note_trial": "14 天。无需信用卡。保护线上应用。",
      "page.cta_kicker_product": "产品页", "page.cta_title_explore": "了解 CloFix WAF",
      "page.cta_note_explore": "AI 引擎、OWASP 覆盖与全球边缘防护。",
      "page.cta_kicker_plans": "套餐", "page.cta_title_pricing": "查看 WAF 定价",
      "page.cta_note_pricing": "从入门到企业版 - 选择合适方案。",
      "page.stat_ai": "AI 引擎", "page.stat_core": "核心引擎", "page.stat_uptime": "可用性 SLA",
      "page.stat_threats": "威胁 / 24小时",
      "page.waf_badge": "全球 Web 应用防火墙",
      "page.waf_h2": "面向现代应用的企业级 WAF 防护",
      "page.waf_lead": "用 AI 驱动的云原生 WAF 防护 OWASP Top 10、DDoS、API 攻击与零日漏洞。",
      "page.waf_cta_trial": "开始免费试用 →", "page.waf_cta_features": "探索 WAF 功能",
      "page.waf_slider_eyebrow": "AI 防护", "page.waf_slider_title": "多引擎安全栈"
    },
    bn: {
      "nav.tagline": "গ্লোবাল WAF", "nav.home": "হোম", "nav.product": "প্রোডাক্ট", "nav.services": "সার্ভিস",
      "nav.resources": "রিসোর্স", "nav.company": "কোম্পানি", "nav.contact": "যোগাযোগ", "nav.free_trial": "ফ্রি ট্রায়াল",
      "nav.overview": "ওভারভিউ", "nav.features": "ফিচার", "nav.pricing": "প্রাইসিং", "nav.platform": "প্ল্যাটফর্ম",
      "nav.core_services": "কোর সার্ভিস", "nav.all_services": "সব সার্ভিস", "nav.managed": "ম্যানেজড সার্ভিস",
      "nav.infrastructure": "ইনফ্রাস্ট্রাকচার", "nav.learn": "শিখুন", "nav.docs_hub": "ডকুমেন্টেশন হাব",
      "nav.blogs": "ব্লগ", "nav.insights": "ইনসাইটস", "nav.faq": "FAQ", "nav.support": "সাপোর্ট",
      "nav.case_study": "কেস স্টাডি", "nav.documentation": "ডকুমেন্টেশন", "nav.tools": "টুলস",
      "nav.about": "আমাদের সম্পর্কে", "nav.careers": "ক্যারিয়ার", "nav.partners_title": "পার্টনার",
      "nav.our_clients": "ক্লায়েন্ট", "nav.our_partners": "পার্টনার", "nav.become_partner": "পার্টনার হোন",
      "nav.devops_manage": "DevOps ম্যানেজ সার্ভিস", "nav.cloud_manage": "ক্লাউড ইনফ্রা ম্যানেজ সার্ভিস",
      "nav.free_event": "ফ্রি ইভেন্ট",
      "footer.tagline": "সুরক্ষা. অটোমেশন. স্কেল", "footer.product": "প্রোডাক্ট", "footer.resources": "রিসোর্স",
      "footer.company": "কোম্পানি", "footer.legal": "লিগ্যাল", "footer.features": "ফিচার", "footer.pricing": "প্রাইসিং",
      "footer.free_trial": "ফ্রি ট্রায়াল", "footer.event": "ফ্রি ইভেন্ট", "footer.docs": "ডকুমেন্টেশন",
      "footer.services": "সার্ভিস", "footer.blogs": "ব্লগ", "footer.insights": "ইনসাইটস", "footer.faq": "FAQ",
      "footer.support": "সাপোর্ট", "footer.case_study": "কেস স্টাডি", "footer.about": "আমাদের সম্পর্কে",
      "footer.contact": "যোগাযোগ", "footer.careers": "ক্যারিয়ার", "footer.partners": "পার্টনার",
      "footer.terms": "টার্মস", "footer.sla": "SLA", "footer.privacy": "প্রাইভেসি পলিসি",
      "footer.copyright": "© ২০২৬ CloFix InfoTech - গ্লোবাল AI-চালিত WAF ও ক্লাউড সিকিউরিটি। সর্বস্বত্ব সংরক্ষিত।",
      "page.flagship": "ফ্ল্যাগশিপ প্রোডাক্ট",
      "page.hero_lead": "API, ওয়েবসাইট ও ক্লাউড অ্যাপের জন্য গ্লোবাল AI-চালিত Web Application Firewall - থ্রেট ডিটেকশন, DDoS মিটিগেশন ও জিরো-ডে ডিফেন্স, সাব-মিলিসেকেন্ড লেটেন্সি সহ।",
      "page.also_from": "CloFix থেকে আরও:", "page.all_features": "সব ফিচার",
      "page.cta_kicker_main": "মেইন প্রোডাক্ট", "page.cta_title_trial": "CloFix WAF ট্রায়াল শুরু করুন",
      "page.cta_note_trial": "১৪ দিন। ক্রেডিট কার্ড লাগবে না। লাইভ অ্যাপ সুরক্ষিত করুন।",
      "page.cta_kicker_product": "প্রোডাক্ট পেজ", "page.cta_title_explore": "CloFix WAF দেখুন",
      "page.cta_note_explore": "AI ইঞ্জিন, OWASP কভারেজ ও গ্লোবাল এজ প্রোটেকশন।",
      "page.cta_kicker_plans": "প্ল্যান", "page.cta_title_pricing": "WAF প্রাইসিং দেখুন",
      "page.cta_note_pricing": "স্টার্টার থেকে এন্টারপ্রাইজ - সঠিক প্ল্যান বেছে নিন।",
      "page.stat_ai": "AI ইঞ্জিন", "page.stat_core": "কোর ইঞ্জিন", "page.stat_uptime": "আপটাইম SLA",
      "page.stat_threats": "থ্রেট / ২৪ ঘণ্টা",
      "page.waf_badge": "গ্লোবাল Web Application Firewall",
      "page.waf_h2": "আধুনিক অ্যাপের জন্য এন্টারপ্রাইজ-গ্রেড WAF সুরক্ষা",
      "page.waf_lead": "AI-চালিত ক্লাউড-নেটিভ WAF দিয়ে OWASP Top 10, DDoS, API এক্সপ্লয়েট ও জিরো-ডে হুমকি থেকে সুরক্ষা নিন।",
      "page.waf_cta_trial": "ফ্রি ট্রায়াল শুরু →", "page.waf_cta_features": "WAF ফিচার দেখুন",
      "page.waf_slider_eyebrow": "AI-চালিত সুরক্ষা", "page.waf_slider_title": "মাল্টি-ইঞ্জিন সিকিউরিটি স্ট্যাক"
    },
    es: {
      "nav.tagline": "WAF global", "nav.home": "Inicio", "nav.product": "Producto", "nav.services": "Servicios",
      "nav.resources": "Recursos", "nav.company": "Empresa", "nav.contact": "Contacto", "nav.free_trial": "Prueba gratis",
      "nav.overview": "Resumen", "nav.features": "Funciones", "nav.pricing": "Precios", "nav.platform": "Plataforma",
      "nav.core_services": "Servicios principales", "nav.all_services": "Todos los servicios", "nav.managed": "Servicios gestionados",
      "nav.infrastructure": "Infraestructura", "nav.learn": "Aprender", "nav.docs_hub": "Centro de documentación",
      "nav.blogs": "Blogs", "nav.insights": "Ideas", "nav.faq": "FAQ", "nav.support": "Soporte",
      "nav.case_study": "Casos", "nav.documentation": "Documentación", "nav.tools": "Herramientas",
      "nav.about": "Sobre nosotros", "nav.careers": "Carreras", "nav.partners_title": "Partners",
      "nav.our_clients": "Clientes", "nav.our_partners": "Partners", "nav.become_partner": "Sé partner",
      "nav.devops_manage": "Servicio DevOps gestionado", "nav.cloud_manage": "Gestión de infra cloud",
      "nav.free_event": "Evento gratis",
      "footer.tagline": "Seguridad. Automatiza. Escala", "footer.product": "Producto", "footer.resources": "Recursos",
      "footer.company": "Empresa", "footer.legal": "Legal", "footer.features": "Funciones", "footer.pricing": "Precios",
      "footer.free_trial": "Prueba gratis", "footer.event": "Evento gratis", "footer.docs": "Documentación",
      "footer.services": "Servicios", "footer.blogs": "Blogs", "footer.insights": "Ideas", "footer.faq": "FAQ",
      "footer.support": "Soporte", "footer.case_study": "Casos", "footer.about": "Nosotros", "footer.contact": "Contacto",
      "footer.careers": "Carreras", "footer.partners": "Partners", "footer.terms": "Términos", "footer.sla": "SLA",
      "footer.privacy": "Privacidad",
      "footer.copyright": "© 2026 CloFix InfoTech - WAF global con IA y seguridad cloud. Todos los derechos reservados.",
      "page.flagship": "Producto estrella",
      "page.hero_lead": "WAF global con IA para APIs, sitios y apps cloud: detección de amenazas, mitigación DDoS y defensa zero-day con latencia submilisegundo.",
      "page.also_from": "También de CloFix:", "page.all_features": "Todas las funciones",
      "page.cta_kicker_main": "Producto principal", "page.cta_title_trial": "Iniciar prueba CloFix WAF",
      "page.cta_note_trial": "14 días. Sin tarjeta. Protege una app en vivo.",
      "page.cta_kicker_product": "Página del producto", "page.cta_title_explore": "Explorar CloFix WAF",
      "page.cta_note_explore": "Motores IA, cobertura OWASP y protección edge global.",
      "page.cta_kicker_plans": "Planes", "page.cta_title_pricing": "Ver precios WAF",
      "page.cta_note_pricing": "De Starter a Enterprise: elige el plan adecuado.",
      "page.stat_ai": "Motores IA", "page.stat_core": "Motores core", "page.stat_uptime": "SLA de uptime",
      "page.stat_threats": "Amenazas / 24h",
      "page.waf_badge": "WAF web global", "page.waf_h2": "Protección WAF empresarial para apps modernas",
      "page.waf_lead": "Protege tus apps web de OWASP Top 10, DDoS, exploits API y zero-day con nuestro WAF cloud-native con IA.",
      "page.waf_cta_trial": "Empezar prueba gratis →", "page.waf_cta_features": "Explorar funciones WAF",
      "page.waf_slider_eyebrow": "Protección con IA", "page.waf_slider_title": "Stack de seguridad multi-motor"
    },
    hi: {
      "nav.tagline": "ग्लोबल WAF", "nav.home": "होम", "nav.product": "उत्पाद", "nav.services": "सेवाएँ",
      "nav.resources": "संसाधन", "nav.company": "कंपनी", "nav.contact": "संपर्क", "nav.free_trial": "मुफ़्त ट्रायल",
      "nav.overview": "ओवरव्यू", "nav.features": "फ़ीचर", "nav.pricing": "मूल्य", "nav.platform": "प्लेटफ़ॉर्म",
      "nav.core_services": "मुख्य सेवाएँ", "nav.all_services": "सभी सेवाएँ", "nav.managed": "प्रबंधित सेवाएँ",
      "nav.infrastructure": "इंफ्रास्ट्रक्चर", "nav.learn": "सीखें", "nav.docs_hub": "दस्तावेज़ केंद्र",
      "nav.blogs": "ब्लॉग", "nav.insights": "इनसाइट्स", "nav.faq": "FAQ", "nav.support": "सपोर्ट",
      "nav.case_study": "केस स्टडी", "nav.documentation": "दस्तावेज़", "nav.tools": "टूल्स",
      "nav.about": "हमारे बारे में", "nav.careers": "करियर", "nav.partners_title": "पार्टनर",
      "nav.our_clients": "क्लाइंट", "nav.our_partners": "पार्टनर", "nav.become_partner": "पार्टनर बनें",
      "nav.devops_manage": "DevOps मैनेज सेवा", "nav.cloud_manage": "क्लाउड इंफ्रा मैनेज सेवा",
      "nav.free_event": "मुफ़्त इवेंट",
      "footer.tagline": "सुरक्षित. स्वचालित. स्केल", "footer.product": "उत्पाद", "footer.resources": "संसाधन",
      "footer.company": "कंपनी", "footer.legal": "कानूनी", "footer.features": "फ़ीचर", "footer.pricing": "मूल्य",
      "footer.free_trial": "मुफ़्त ट्रायल", "footer.event": "मुफ़्त इवेंट", "footer.docs": "दस्तावेज़",
      "footer.services": "सेवाएँ", "footer.blogs": "ब्लॉग", "footer.insights": "इनसाइट्स", "footer.faq": "FAQ",
      "footer.support": "सपोर्ट", "footer.case_study": "केस स्टडी", "footer.about": "हमारे बारे में",
      "footer.contact": "संपर्क", "footer.careers": "करियर", "footer.partners": "पार्टनर",
      "footer.terms": "नियम", "footer.sla": "SLA", "footer.privacy": "गोपनीयता नीति",
      "footer.copyright": "© 2026 CloFix InfoTech - ग्लोबल AI WAF और क्लाउड सुरक्षा। सर्वाधिकार सुरक्षित।",
      "page.flagship": "फ्लैगशिप उत्पाद",
      "page.hero_lead": "API, वेबसाइट और क्लाउड ऐप्स के लिए ग्लोबल AI WAF - थ्रेट डिटेक्शन, DDoS मिटिगेशन और ज़ीरो-डे डिफेंस, सब-मिलीसेकंड लेटेंसी के साथ।",
      "page.also_from": "CloFix से और:", "page.all_features": "सभी फ़ीचर",
      "page.cta_kicker_main": "मुख्य उत्पाद", "page.cta_title_trial": "CloFix WAF ट्रायल शुरू करें",
      "page.cta_note_trial": "14 दिन। कार्ड नहीं। लाइव ऐप सुरक्षित करें।",
      "page.cta_kicker_product": "उत्पाद पेज", "page.cta_title_explore": "CloFix WAF देखें",
      "page.cta_note_explore": "AI इंजन, OWASP कवरेज और ग्लोबल एज सुरक्षा।",
      "page.cta_kicker_plans": "प्लान", "page.cta_title_pricing": "WAF मूल्य देखें",
      "page.cta_note_pricing": "Starter से Enterprise - सही प्लान चुनें।",
      "page.stat_ai": "AI इंजन", "page.stat_core": "कोर इंजन", "page.stat_uptime": "अपटाइम SLA",
      "page.stat_threats": "थ्रेट / 24घं",
      "page.waf_badge": "ग्लोबल वेब एप्लिकेशन फ़ायरवॉल",
      "page.waf_h2": "आधुनिक ऐप्स के लिए एंटरप्राइज़ WAF सुरक्षा",
      "page.waf_lead": "AI क्लाउड-नेटिव WAF से OWASP Top 10, DDoS, API और ज़ीरो-डे से सुरक्षा।",
      "page.waf_cta_trial": "मुफ़्त ट्रायल शुरू →", "page.waf_cta_features": "WAF फ़ीचर देखें",
      "page.waf_slider_eyebrow": "AI सुरक्षा", "page.waf_slider_title": "मल्टी-इंजन सिक्योरिटी स्टैक"
    },
    ar: {
      "nav.tagline": "WAF عالمي", "nav.home": "الرئيسية", "nav.product": "المنتج", "nav.services": "الخدمات",
      "nav.resources": "الموارد", "nav.company": "الشركة", "nav.contact": "اتصل", "nav.free_trial": "تجربة مجانية",
      "nav.overview": "نظرة عامة", "nav.features": "الميزات", "nav.pricing": "الأسعار", "nav.platform": "المنصة",
      "nav.core_services": "الخدمات الأساسية", "nav.all_services": "كل الخدمات", "nav.managed": "خدمات مُدارة",
      "nav.infrastructure": "البنية التحتية", "nav.learn": "تعلّم", "nav.docs_hub": "مركز التوثيق",
      "nav.blogs": "المدونات", "nav.insights": "رؤى", "nav.faq": "الأسئلة", "nav.support": "الدعم",
      "nav.case_study": "دراسات حالة", "nav.documentation": "التوثيق", "nav.tools": "أدوات",
      "nav.about": "من نحن", "nav.careers": "الوظائف", "nav.partners_title": "الشركاء",
      "nav.our_clients": "عملاؤنا", "nav.our_partners": "شركاؤنا", "nav.become_partner": "كن شريكًا",
      "nav.devops_manage": "خدمة DevOps المُدارة", "nav.cloud_manage": "إدارة بنية السحابة",
      "nav.free_event": "فعالية مجانية",
      "footer.tagline": "أمّن. أتمت. وسّع", "footer.product": "المنتج", "footer.resources": "الموارد",
      "footer.company": "الشركة", "footer.legal": "قانوني", "footer.features": "الميزات", "footer.pricing": "الأسعار",
      "footer.free_trial": "تجربة مجانية", "footer.event": "فعالية مجانية", "footer.docs": "التوثيق",
      "footer.services": "الخدمات", "footer.blogs": "المدونات", "footer.insights": "رؤى", "footer.faq": "الأسئلة",
      "footer.support": "الدعم", "footer.case_study": "دراسات حالة", "footer.about": "من نحن",
      "footer.contact": "اتصل", "footer.careers": "الوظائف", "footer.partners": "الشركاء",
      "footer.terms": "الشروط", "footer.sla": "SLA", "footer.privacy": "الخصوصية",
      "footer.copyright": "© 2026 CloFix InfoTech - WAF عالمي بالذكاء الاصطناعي وأمن سحابي. جميع الحقوق محفوظة.",
      "page.flagship": "المنتج الرئيسي",
      "page.hero_lead": "جدار حماية تطبيقات ويب عالمي بالذكاء الاصطناعي لواجهات API والمواقع والتطبيقات السحابية.",
      "page.also_from": "أيضًا من CloFix:", "page.all_features": "كل الميزات",
      "page.cta_kicker_main": "المنتج الرئيسي", "page.cta_title_trial": "ابدأ تجربة CloFix WAF",
      "page.cta_note_trial": "14 يومًا. بلا بطاقة. احمِ تطبيقًا مباشرًا.",
      "page.cta_kicker_product": "صفحة المنتج", "page.cta_title_explore": "استكشف CloFix WAF",
      "page.cta_note_explore": "محركات AI وتغطية OWASP وحماية طرفية عالمية.",
      "page.cta_kicker_plans": "الخطط", "page.cta_title_pricing": "عرض أسعار WAF",
      "page.cta_note_pricing": "من Starter إلى Enterprise - اختر المناسب.",
      "page.stat_ai": "محركات AI", "page.stat_core": "محركات أساسية", "page.stat_uptime": "اتفاقية التوفر",
      "page.stat_threats": "تهديدات / 24س",
      "page.waf_badge": "جدار حماية تطبيقات ويب عالمي",
      "page.waf_h2": "حماية WAF للمؤسسات للتطبيقات الحديثة",
      "page.waf_lead": "احمِ تطبيقاتك من OWASP Top 10 وDDoS واستغلالات API وهجمات اليوم صفر.",
      "page.waf_cta_trial": "ابدأ تجربة مجانية →", "page.waf_cta_features": "استكشف ميزات WAF",
      "page.waf_slider_eyebrow": "حماية بالذكاء الاصطناعي", "page.waf_slider_title": "مكدس أمان متعدد المحركات"
    },
    pt: {
      "nav.home": "Início", "nav.product": "Produto", "nav.services": "Serviços", "nav.resources": "Recursos",
      "nav.company": "Empresa", "nav.contact": "Contato", "nav.free_trial": "Teste grátis",
      "nav.overview": "Visão geral", "nav.features": "Recursos", "nav.pricing": "Preços", "nav.platform": "Plataforma",
      "nav.core_services": "Serviços principais", "nav.all_services": "Todos os serviços", "nav.managed": "Serviços gerenciados",
      "nav.learn": "Aprender", "nav.docs_hub": "Central de documentação", "nav.about": "Sobre nós",
      "nav.careers": "Carreiras", "nav.partners_title": "Parceiros", "nav.become_partner": "Seja parceiro",
      "footer.tagline": "Segurança. Automatize. Escala", "footer.product": "Produto", "footer.resources": "Recursos",
      "footer.company": "Empresa", "footer.legal": "Legal", "footer.free_trial": "Teste grátis",
      "footer.privacy": "Privacidade",
      "footer.copyright": "© 2026 CloFix InfoTech - WAF global com IA e segurança cloud. Todos os direitos reservados.",
      "page.flagship": "Produto principal", "page.all_features": "Todos os recursos",
      "page.waf_cta_trial": "Começar teste grátis →", "page.waf_cta_features": "Explorar recursos WAF",
      "page.waf_slider_title": "Stack de segurança multi-engine"
    },
    ru: {
      "nav.home": "Главная", "nav.product": "Продукт", "nav.services": "Услуги", "nav.resources": "Ресурсы",
      "nav.company": "Компания", "nav.contact": "Контакты", "nav.free_trial": "Пробный период",
      "nav.overview": "Обзор", "nav.features": "Функции", "nav.pricing": "Цены", "nav.about": "О нас",
      "footer.tagline": "Защита. Автоматизация. Масштаб", "footer.product": "Продукт", "footer.resources": "Ресурсы",
      "footer.company": "Компания", "footer.legal": "Правовая информация",
      "footer.copyright": "© 2026 CloFix InfoTech - глобальный AI WAF и облачная безопасность. Все права защищены.",
      "page.flagship": "Флагманский продукт", "page.all_features": "Все функции",
      "page.waf_cta_trial": "Начать пробный период →", "page.waf_slider_title": "Мультидвижковый стек безопасности"
    },
    ja: {
      "nav.home": "ホーム", "nav.product": "製品", "nav.services": "サービス", "nav.resources": "リソース",
      "nav.company": "会社", "nav.contact": "お問い合わせ", "nav.free_trial": "無料トライアル",
      "nav.overview": "概要", "nav.features": "機能", "nav.pricing": "料金", "nav.about": "会社概要",
      "footer.tagline": "保護. 自動化. 拡張", "footer.product": "製品", "footer.resources": "リソース",
      "footer.company": "会社", "footer.legal": "法務",
      "footer.copyright": "© 2026 CloFix InfoTech - グローバル AI WAF & クラウドセキュリティ。無断転載を禁じます。",
      "page.flagship": "主力製品", "page.all_features": "すべての機能",
      "page.waf_cta_trial": "無料トライアルを開始 →", "page.waf_slider_title": "マルチエンジン・セキュリティスタック"
    },
    fr: {
      "nav.home": "Accueil", "nav.product": "Produit", "nav.services": "Services", "nav.resources": "Ressources",
      "nav.company": "Entreprise", "nav.contact": "Contact", "nav.free_trial": "Essai gratuit",
      "nav.overview": "Aperçu", "nav.features": "Fonctionnalités", "nav.pricing": "Tarifs", "nav.about": "À propos",
      "footer.tagline": "Sécuriser. Automatiser. Scaler", "footer.product": "Produit", "footer.resources": "Ressources",
      "footer.company": "Entreprise", "footer.legal": "Mentions légales",
      "footer.copyright": "© 2026 CloFix InfoTech - WAF mondial IA et sécurité cloud. Tous droits réservés.",
      "page.flagship": "Produit phare", "page.all_features": "Toutes les fonctionnalités",
      "page.waf_cta_trial": "Démarrer l'essai gratuit →", "page.waf_slider_title": "Stack de sécurité multi-moteurs"
    },
    de: {
      "nav.home": "Start", "nav.product": "Produkt", "nav.services": "Dienste", "nav.resources": "Ressourcen",
      "nav.company": "Unternehmen", "nav.contact": "Kontakt", "nav.free_trial": "Kostenlos testen",
      "nav.overview": "Übersicht", "nav.features": "Funktionen", "nav.pricing": "Preise", "nav.about": "Über uns",
      "footer.tagline": "Sichern. Automatisieren. Skalieren", "footer.product": "Produkt", "footer.resources": "Ressourcen",
      "footer.company": "Unternehmen", "footer.legal": "Rechtliches",
      "footer.copyright": "© 2026 CloFix InfoTech - Globale AI-WAF & Cloud-Sicherheit. Alle Rechte vorbehalten.",
      "page.flagship": "Flaggschiff-Produkt", "page.all_features": "Alle Funktionen",
      "page.waf_cta_trial": "Kostenlos testen →", "page.waf_slider_title": "Multi-Engine-Sicherheitsstack"
    },
    ko: {
      "nav.home": "홈", "nav.product": "제품", "nav.services": "서비스", "nav.resources": "리소스",
      "nav.company": "회사", "nav.contact": "문의", "nav.free_trial": "무료 체험",
      "nav.overview": "개요", "nav.features": "기능", "nav.pricing": "요금", "nav.about": "회사 소개",
      "footer.tagline": "보안. 자동화. 확장", "footer.product": "제품", "footer.resources": "리소스",
      "footer.company": "회사", "footer.legal": "법적 고지",
      "footer.copyright": "© 2026 CloFix InfoTech - 글로벌 AI WAF 및 클라우드 보안. 판권 소유.",
      "page.flagship": "대표 제품", "page.all_features": "모든 기능",
      "page.waf_cta_trial": "무료 체험 시작 →", "page.waf_slider_title": "멀티 엔진 보안 스택"
    },
    id: {
      "nav.home": "Beranda", "nav.product": "Produk", "nav.services": "Layanan", "nav.resources": "Sumber daya",
      "nav.company": "Perusahaan", "nav.contact": "Kontak", "nav.free_trial": "Uji coba gratis",
      "nav.overview": "Ikhtisar", "nav.features": "Fitur", "nav.pricing": "Harga", "nav.about": "Tentang kami",
      "footer.tagline": "Amankan. Otomatisasi. Skala", "footer.legal": "Legal",
      "footer.copyright": "© 2026 CloFix InfoTech - WAF AI global & keamanan cloud. Hak cipta dilindungi.",
      "page.flagship": "Produk unggulan", "page.waf_cta_trial": "Mulai uji coba gratis →",
      "page.waf_slider_title": "Stack keamanan multi-engine"
    },
    tr: {
      "nav.home": "Ana sayfa", "nav.product": "Ürün", "nav.services": "Hizmetler", "nav.resources": "Kaynaklar",
      "nav.company": "Şirket", "nav.contact": "İletişim", "nav.free_trial": "Ücretsiz deneme",
      "nav.overview": "Genel bakış", "nav.features": "Özellikler", "nav.pricing": "Fiyatlar", "nav.about": "Hakkımızda",
      "footer.tagline": "Güven. Otomasyon. Ölçek", "footer.legal": "Yasal",
      "footer.copyright": "© 2026 CloFix InfoTech - Küresel AI WAF ve bulut güvenliği. Tüm hakları saklıdır.",
      "page.flagship": "Amiral ürün", "page.waf_cta_trial": "Ücretsiz denemeyi başlat →",
      "page.waf_slider_title": "Çok motorlu güvenlik yığını"
    },
    vi: {
      "nav.home": "Trang chủ", "nav.product": "Sản phẩm", "nav.services": "Dịch vụ", "nav.resources": "Tài nguyên",
      "nav.company": "Công ty", "nav.contact": "Liên hệ", "nav.free_trial": "Dùng thử miễn phí",
      "nav.overview": "Tổng quan", "nav.features": "Tính năng", "nav.pricing": "Giá", "nav.about": "Về chúng tôi",
      "footer.tagline": "Bảo mật. Tự động hóa. Mở rộng", "footer.legal": "Pháp lý",
      "footer.copyright": "© 2026 CloFix InfoTech - WAF AI toàn cầu & bảo mật đám mây. Đã đăng ký bản quyền.",
      "page.flagship": "Sản phẩm chủ lực", "page.waf_cta_trial": "Bắt đầu dùng thử →",
      "page.waf_slider_title": "Stack bảo mật đa engine"
    },
    it: {
      "nav.home": "Home", "nav.product": "Prodotto", "nav.services": "Servizi", "nav.resources": "Risorse",
      "nav.company": "Azienda", "nav.contact": "Contatti", "nav.free_trial": "Prova gratuita",
      "nav.overview": "Panoramica", "nav.features": "Funzionalità", "nav.pricing": "Prezzi", "nav.about": "Chi siamo",
      "footer.tagline": "Sicurezza. Automazione. Scala", "footer.legal": "Note legali",
      "footer.copyright": "© 2026 CloFix InfoTech - WAF globale con AI e sicurezza cloud. Tutti i diritti riservati.",
      "page.flagship": "Prodotto di punta", "page.waf_cta_trial": "Inizia prova gratuita →",
      "page.waf_slider_title": "Stack di sicurezza multi-engine"
    }
  };

  function dictFor(lang) {
    if (!LOC[lang] && lang !== "en") lang = "en";
    if (lang === "en") return EN;
    var out = {};
    var k;
    for (k in EN) if (Object.prototype.hasOwnProperty.call(EN, k)) out[k] = EN[k];
    var over = LOC[lang] || {};
    for (k in over) if (Object.prototype.hasOwnProperty.call(over, k)) out[k] = over[k];
    return out;
  }

  function getLang() {
    if (selectedLanguage) return selectedLanguage;
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return LABELS[stored] ? stored : "en";
    } catch (e) {
      return "en";
    }
  }

  function setLang(code) {
    selectedLanguage = LABELS[code] ? code : "en";
    try {
      localStorage.setItem(STORAGE_KEY, selectedLanguage);
    } catch (e) {}
  }

  function setText(el, text) {
    if (!el) return;
    var named = el.querySelector('[itemprop="name"]');
    if (named) {
      named.textContent = text;
      return;
    }
    var strong = el.querySelector("strong");
    if (strong && el.children.length === 1) {
      strong.textContent = text;
      return;
    }
    if (el.children.length === 0) {
      el.textContent = text;
      return;
    }
    var child = el.firstElementChild;
    if (child && !child.classList.contains("c-dropdown__chev")) {
      if (child.children.length === 0) {
        child.textContent = text;
        return;
      }
    }
    var replaced = false;
    el.childNodes.forEach(function (node) {
      if (node.nodeType === 3 && node.textContent.trim()) {
        node.textContent = text;
        replaced = true;
      }
    });
    if (!replaced) el.textContent = text;
  }

  /* Google Translate codes for full page-body coverage (header/footer use notranslate) */
  var GOOG = {
    en: "",
    zh: "zh-CN",
    es: "es",
    hi: "hi",
    ar: "ar",
    bn: "bn",
    pt: "pt",
    ru: "ru",
    ja: "ja",
    fr: "fr",
    de: "de",
    ko: "ko",
    id: "id",
    tr: "tr",
    vi: "vi",
    it: "it"
  };

  function readGoogCookie() {
    var m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    return m ? decodeURIComponent(m[1]) : "";
  }

  function writeGoogCookie(value) {
    var hosts = [""];
    try {
      var host = location.hostname;
      if (host && host.indexOf(".") !== -1) hosts.push("; domain=." + host);
    } catch (e) {}
    hosts.forEach(function (domainPart) {
      if (!value) {
        document.cookie = "googtrans=; path=/" + domainPart + "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "googtrans=/en/en; path=/" + domainPart + "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        document.cookie = "googtrans=" + value + "; path=/" + domainPart;
      }
    });
  }

  function desiredGoogValue(lang) {
    if (!lang || lang === "en") return "";
    var code = GOOG[lang];
    if (!code) return "";
    return "/en/" + code;
  }

  function syncPageBodyLang(lang) {
    if (isSeoCrawler()) return;
    var want = desiredGoogValue(lang);
    var have = readGoogCookie();
    if (want === have || (want === "" && (!have || have === "/en/en"))) {
      return;
    }
    writeGoogCookie(want);
  }

  function syncTranslateSelection() {
    var select = document.querySelector("#google_translate_element .goog-te-combo");
    var code = GOOG[getLang()] || "en";
    if (!select || !Array.prototype.some.call(select.options, function (option) {
      return option.value === code;
    })) return false;
    if (select.value !== code) {
      select.value = code;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return true;
  }

  function waitForTranslateSelection() {
    if (syncTranslateSelection()) {
      if (translationObserver) translationObserver.disconnect();
      translationObserver = null;
      return;
    }
    var holder = document.getElementById("google_translate_element");
    if (!holder || translationObserver) return;
    translationObserver = new MutationObserver(waitForTranslateSelection);
    translationObserver.observe(holder, { childList: true, subtree: true });
  }

  function isSeoCrawler() {
    try {
      var ua = (navigator.userAgent || "").toLowerCase();
      return /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|bytespider/.test(ua);
    } catch (e) {
      return false;
    }
  }

  function ensureGoogleTranslateLib() {
    // Crawlers must see English source HTML only (best SEO)
    if (isSeoCrawler()) return;
    if (document.documentElement.getAttribute("data-cf-gt") === "1") {
      waitForTranslateSelection();
      return;
    }
    document.documentElement.setAttribute("data-cf-gt", "1");
    if (!document.getElementById("google_translate_element")) {
      var holder = document.createElement("div");
      holder.id = "google_translate_element";
      holder.style.display = "none";
      holder.setAttribute("aria-hidden", "true");
      document.body.appendChild(holder);
    }
    window.googleTranslateElementInit = function () {
      try {
        if (!window.google || !google.translate) return;
        new google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false, includedLanguages: "en,zh-CN,es,hi,ar,bn,pt,ru,ja,fr,de,ko,id,tr,vi,it" },
          "google_translate_element"
        );
        waitForTranslateSelection();
      } catch (e) {}
    };
    if (!document.getElementById("cf-google-translate-script")) {
      var s = document.createElement("script");
      s.id = "cf-google-translate-script";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      s.onerror = function () {
        document.documentElement.removeAttribute("data-cf-gt");
        s.remove();
      };
      document.head.appendChild(s);
    }
    waitForTranslateSelection();
    // Hide Google top banner if injected
    if (!document.getElementById("cf-gt-hide")) {
      var st = document.createElement("style");
      st.id = "cf-gt-hide";
      st.textContent = ".goog-te-banner-frame,.skiptranslate,body{top:0!important}.goog-te-gadget{display:none!important}iframe.skiptranslate{display:none!important}";
      document.head.appendChild(st);
    }
  }

  function applyChrome(lang) {
    if (!LABELS[lang]) lang = "en";
    var dict = dictFor(lang);
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.closest("[data-i18n-ignore]")) return;
      var key = el.getAttribute("data-i18n");
      if (!key || dict[key] == null) return;
      setText(el, dict[key]);
    });

    var btn = document.getElementById("langToggle");
    if (btn) {
      var label = LABELS[lang] || lang.toUpperCase();
      var flagInfo = LANGUAGE_FLAGS[lang] || LANGUAGE_FLAGS.en;
      btn.innerHTML = '<span class="cf-lang__current-flag" aria-hidden="true">' + flagInfo[0] + '</span>' +
        '<span class="cf-lang__current-code">' + label + '</span>' +
        '<span aria-hidden="true">▾</span>';
      btn.setAttribute("aria-label", "Language: " + (LANGUAGE_NAMES[lang] || LANGUAGE_NAMES.en) + ", " + flagInfo[1]);
    }

    document.querySelectorAll(".cf-lang__option").forEach(function (opt) {
      var code = opt.getAttribute("data-lang") || opt.getAttribute("lang");
      opt.setAttribute("aria-current", code === lang ? "true" : "false");
    });
  }

  function apply(lang) {
    if (!LABELS[lang]) lang = "en";
    setLang(lang);
    syncPageBodyLang(lang);
    applyChrome(lang);
    if (lang !== "en") ensureGoogleTranslateLib();
    else if (document.getElementById("cf-google-translate-script")) location.reload();
  }

  function closeLangMenu() {
    var wrap = document.querySelector(".cf-lang");
    var toggle = document.getElementById("langToggle");
    if (wrap) wrap.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function pickLang(code) {
    if (!LABELS[code]) code = "en";
    closeLangMenu();
    apply(code);
  }

  function init() {
    var lang = getLang();
    syncPageBodyLang(lang);
    applyChrome(lang);
    if (lang !== "en") {
      ensureGoogleTranslateLib();
    }

    // Event delegation so every page's lang menu works
    if (document.documentElement.getAttribute("data-cf-i18n-bound") !== "1") {
      document.documentElement.setAttribute("data-cf-i18n-bound", "1");
      document.addEventListener(
        "click",
        function (e) {
          var opt = e.target && e.target.closest && e.target.closest(".cf-lang__option");
          if (!opt) return;
          e.preventDefault();
          e.stopPropagation();
          var code = opt.getAttribute("data-lang") || opt.getAttribute("lang") || "en";
          pickLang(code);
        },
        true
      );
    }
  }

  window.CloFixI18n = {
    apply: apply,
    applyChrome: applyChrome,
    getLang: getLang,
    setLang: setLang,
    pickLang: pickLang,
    dictFor: dictFor
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("pageshow", function () {
    applyChrome(getLang());
  });
})();
