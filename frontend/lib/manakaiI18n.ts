/**
 * MANAKAI Internationalization (i18n) Dictionary
 * Ported verbatim from bis-assistant/js/i18n.js
 * Supports: English (en), हिन्दी (hi), मराठी (mr)
 *
 * NOTE: Some values intentionally contain HTML entities / <br> tags
 * (exactly like the original, which injected them via innerHTML).
 * Render those with `html(key)` from ManakaiLanding (dangerouslySetInnerHTML).
 */

export type ManakaiLang = "en" | "hi" | "mr";

export const MANAKAI_LANGS: { code: ManakaiLang; name: string; sub: string }[] = [
  { code: "en", name: "English", sub: "EN" },
  { code: "hi", name: "हिन्दी", sub: "Hindi" },
  { code: "mr", name: "मराठी", sub: "Marathi" },
];

export const MANAKAI_TRANSLATIONS: Record<ManakaiLang, Record<string, string>> = {
  en: {
    langName: "English",
    langCode: "EN",
    // Navigation
    "nav.features": "Features",
    "nav.standards": "Standards",
    "nav.labs": "Labs",
    "nav.company": "Company",
    "nav.login": "Login",
    "nav.backHome": "Back to Home",
    "nav.themeToggle": "Toggle Yin/Yang Mode",

    // Hero
    "hero.title": "Instant BIS Label<br>Verification.",
    "hero.subtext": "Scan ISI marks to check product authenticity and ensure standards compliance in seconds.",
    "hero.btnAsk": "Ask MANAKAI &rarr;",
    "hero.btnExplore": "Explore Standards",
    "hero.trust": "23,866+ Standards &bull; Clause-Level Sources &bull; English &bull; हिन्दी &bull; मराठी",

    // How It Works
    "how.title": "How MANAKAI Works",
    "how.step1.title": "Ask",
    "how.step1.desc": "Ask your BIS-related question in English, Hindi, or Marathi.",
    "how.step2.title": "Search",
    "how.step2.desc": "We search across 23,866+ Indian Standards to find relevant information.",
    "how.step3.title": "Verify",
    "how.step3.desc": "MANAKAI identifies the relevant standard, clause, and requirements.",
    "how.step4.title": "Understand",
    "how.step4.desc": "Get a simple AI-generated answer with source citations and confidence.",
    "how.step5.title": "Take Action",
    "how.step5.desc": "Explore certification, QCOs, testing labs, hallmarking, and applicable standards.",

    // Major Categories
    "cat.sectionTitle": "Major Categories",
    "cat.sectionSubtitle": "Explore key Indian Standards across industry sectors, certification schemes, and mandatory QCOs.",
    "cat.explore": "Explore standards for:",
    "cat.exploreBis": "Explore BIS standards for:",

    // Cat 1: Auto
    "cat1.title": "Automobiles &amp; EV",
    "cat1.f1": "Electric vehicles",
    "cat1.f2": "EV charging equipment",
    "cat1.f3": "Batteries",
    "cat1.f4": "Automotive components",
    "cat1.f5": "Safety and testing requirements",
    "cat1.f6": "Applicable certification schemes",
    "cat1.cta": "Explore Automotive Standards",

    // Cat 2: Home
    "cat2.title": "Home &amp; Electrical Products",
    "cat2.f1": "Electrical appliances",
    "cat2.f2": "Fans",
    "cat2.f3": "Cables and wires",
    "cat2.f4": "Switches",
    "cat2.f5": "Batteries",
    "cat2.f6": "Household equipment",
    "cat2.f7": "Safety and energy requirements",
    "cat2.cta": "Find Product Standards",

    // Cat 3: Food & Water
    "cat3.title": "Food, Water &amp; Consumer Products",
    "cat3.f1": "Packaged drinking water",
    "cat3.f2": "Food-related products",
    "cat3.f3": "Consumer goods",
    "cat3.f4": "Packaging",
    "cat3.f5": "Quality and safety requirements",
    "cat3.f6": "Testing requirements",
    "cat3.cta": "Check Safety Standards",

    // Cat 4: Gold & Jewellery
    "cat4.title": "Gold, Silver &amp; Jewellery",
    "cat4.badge": "Dedicated Hallmarking &amp; HUID",
    "cat4.explore": "Explore:",
    "cat4.f1": "Gold hallmarking",
    "cat4.f2": "Silver hallmarking",
    "cat4.f3": "HUID verification",
    "cat4.f4": "Purity / grades",
    "cat4.f5": "Hallmarking requirements",
    "cat4.f6": "BIS CARE verification",
    "cat4.cta": "Verify Hallmarking",

    // Cat 5: Construction
    "cat5.title": "Construction &amp; Industrial Materials",
    "cat5.f1": "Cement",
    "cat5.f2": "Steel and TMT bars",
    "cat5.f3": "Building materials",
    "cat5.f4": "Construction products",
    "cat5.f5": "Chemical requirements",
    "cat5.f6": "Physical / testing requirements",
    "cat5.f7": "Applicable QCOs",
    "cat5.cta": "Explore Construction Standards",

    // Cat 6: Others
    "cat6.title": "Others",
    "cat6.desc": "Don't see your product? Explore standards across other categories and search directly by product, keyword, or standard number.",
    "cat6.hint": "Search 23,866+ Indian Standards across all scopes",
    "cat6.cta": "Search All Standards",

    // Features Section
    "feat.sectionTitle": "Comprehensive Standards Intelligence",
    "feat1.title": "AI-Powered Assistance",
    "feat1.overview": "Intelligent QA Engine",
    "feat1.desc": "Ask complex questions about standards and compliance in natural language and get precise, instant answers from our intelligent engine.",
    "feat2.title": "Indian Standards Discovery",
    "feat2.overview": "IS Code Search",
    "feat2.desc": "Quickly search and discover relevant Indian Standards (IS) across various domains, materials, and specialized industries.",
    "feat3.title": "Certification Guidance",
    "feat3.overview": "Compliance Rules",
    "feat3.desc": "Receive step-by-step guidance on BIS certification processes, required documentation, and overarching compliance frameworks.",
    "feat4.title": "Testing Laboratories",
    "feat4.overview": "Find Lab Facilities",
    "feat4.desc": "Easily locate BIS recognized and accredited testing laboratories for your specific product categories nationwide.",

    // Footer
    "footer.brandDesc": "Empowering industries, manufacturers, and consumers with intelligent access to Bureau of Indian Standards information.",
    "footer.quickLinks": "Quick Links",
    "footer.searchStandards": "Search Standards",
    "footer.certificationSchemes": "Certification Schemes",
    "footer.labDirectory": "Lab Directory",
    "footer.helpCenter": "Help Center",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.accessibility": "Accessibility",
    "footer.copyright": "&copy; 2026 SIH Project - MANAKAI. All rights reserved.",

    // Login Page
    "login.backHome": "Back to Home",
    "login.subtitle": "Bureau of Indian Standards Assistant",
    "login.quote": "&ldquo;Where authenticity, product safety, and precision intelligence converge across 23,866+ Indian Standards.&rdquo;",
    "login.badge1.title": "ISI Mark &amp; Hallmarking",
    "login.badge1.desc": "Instant Verification Protocol",
    "login.badge2.title": "QCO &amp; Gazette Tracking",
    "login.badge2.desc": "Mandatory Compliance Orders",
    "login.badge3.title": "Clause-Level Intelligence",
    "login.badge3.desc": "Traceable Standards Guidance",
    "login.est": "EST. 2026 &bull; GOV-TECH",
    "login.secureTerminal": "SECURE TERMINAL",
    "login.signInTitle": "Portal Sign In",
    "login.signInSubtitle": "Enter your authorized credentials to open the workspace",
    "login.emailLabel": "Email Address",
    "login.emailPlaceholder": "officer@bis.gov.in",
    "login.emailError": "Please enter a valid email address.",
    "login.passLabel": "Password",
    "login.forgot": "Forgot?",
    "login.passError": "Password must be at least 6 characters.",
    "login.rememberMe": "Remember on this terminal",
    "login.btnSubmit": "Authenticate &amp; Open",
    "login.quickDemo": "Quick Demo Access:",
    "login.chipMsme": "MSME",
    "login.chipAuditor": "Lab Auditor",
    "login.chipCitizen": "Citizen",
    "login.needCreds": "Need credentials?",
    "login.reqAccess": "Request Research Access",
  },

  hi: {
    langName: "हिन्दी",
    langCode: "HI",
    // Navigation
    "nav.features": "विशेषताएं",
    "nav.standards": "मानक",
    "nav.labs": "प्रयोगशालाएं",
    "nav.company": "कंपनी / संगठन",
    "nav.login": "लॉगिन",
    "nav.backHome": "मुख्य पृष्ठ पर वापस",
    "nav.themeToggle": "यिन/यांग मोड बदलें",

    // Hero
    "hero.title": "त्वरित बीआईएस लेबल<br>सत्यापन।",
    "hero.subtext": "उत्पाद प्रामाणिकता जांचने और सेकंडों में मानक अनुपालन सुनिश्चित करने के लिए आईएसआई मार्क स्कैन करें।",
    "hero.btnAsk": "मानकई से पूछें &rarr;",
    "hero.btnExplore": "मानक खोजें",
    "hero.trust": "23,866+ मानक &bull; खंड-स्तरीय स्रोत &bull; English &bull; हिन्दी &bull; मराठी",

    // How It Works
    "how.title": "मानकई कैसे काम करता है",
    "how.step1.title": "पूछें",
    "how.step1.desc": "अंग्रेजी, हिन्दी या मराठी में अपना बीआईएस संबंधित प्रश्न पूछें।",
    "how.step2.title": "खोजें",
    "how.step2.desc": "हम प्रासंगिक जानकारी खोजने के लिए 23,866+ भारतीय मानकों में खोज करते हैं।",
    "how.step3.title": "सत्यापित करें",
    "how.step3.desc": "मानकई प्रासंगिक मानक, खंड और तकनीकी आवश्यकताओं की पहचान करता है।",
    "how.step4.title": "समझें",
    "how.step4.desc": "स्रोत संदर्भ और सटीकता के साथ सरल एआई-जनित उत्तर प्राप्त करें।",
    "how.step5.title": "कार्रवाई करें",
    "how.step5.desc": "प्रमाणीकरण, क्यूसीओ, परीक्षण प्रयोगशालाओं, हॉलमार्किंग और लागू मानकों का पता लगाएं।",

    // Major Categories
    "cat.sectionTitle": "प्रमुख श्रेणियां",
    "cat.sectionSubtitle": "उद्योग क्षेत्रों, प्रमाणन योजनाओं और अनिवार्य क्यूसीओ में प्रमुख भारतीय मानकों का अन्वेषण करें।",
    "cat.explore": "इसके लिए मानक खोजें:",
    "cat.exploreBis": "इसके लिए बीआईएस मानक खोजें:",

    // Cat 1: Auto
    "cat1.title": "ऑटोमोबाइल और ईवी",
    "cat1.f1": "इलेक्ट्रिक वाहन",
    "cat1.f2": "ईवी चार्जिंग उपकरण",
    "cat1.f3": "बैटरी और ऊर्जा भंडारण",
    "cat1.f4": "ऑटोमोटिव घटक",
    "cat1.f5": "सुरक्षा और परीक्षण आवश्यकताएं",
    "cat1.f6": "लागू प्रमाणन योजनाएं",
    "cat1.cta": "ऑटोमोटिव मानक खोजें",

    // Cat 2: Home
    "cat2.title": "घरेलू और विद्युत उत्पाद",
    "cat2.f1": "विद्युत उपकरण",
    "cat2.f2": "पंखे",
    "cat2.f3": "केबल और तार",
    "cat2.f4": "स्विच और सॉकेट",
    "cat2.f5": "बैटरी",
    "cat2.f6": "घरेलू उपकरण",
    "cat2.f7": "सुरक्षा और ऊर्जा दक्षता आवश्यकताएं",
    "cat2.cta": "उत्पाद मानक खोजें",

    // Cat 3: Food & Water
    "cat3.title": "खाद्य, जल और उपभोक्ता उत्पाद",
    "cat3.f1": "पैकेज्ड पेयजल",
    "cat3.f2": "खाद्य संबंधी उत्पाद",
    "cat3.f3": "उपभोक्ता वस्तुएं",
    "cat3.f4": "पैकेजिंग सामग्री",
    "cat3.f5": "गुणवत्ता और सुरक्षा आवश्यकताएं",
    "cat3.f6": "परीक्षण आवश्यकताएं",
    "cat3.cta": "सुरक्षा मानक जांचें",

    // Cat 4: Gold & Jewellery
    "cat4.title": "सोना, चांदी और आभूषण",
    "cat4.badge": "समर्पित हॉलमार्किंग और एचयूआईडी",
    "cat4.explore": "अन्वेषण करें:",
    "cat4.f1": "स्वर्ण हॉलमार्किंग",
    "cat4.f2": "रजत हॉलमार्किंग",
    "cat4.f3": "एचयूआईडी सत्यापन",
    "cat4.f4": "शुद्धता / ग्रेड",
    "cat4.f5": "हॉलमार्किंग आवश्यकताएं",
    "cat4.f6": "बीआईएस केयर सत्यापन",
    "cat4.cta": "हॉलमार्किंग सत्यापित करें",

    // Cat 5: Construction
    "cat5.title": "निर्माण और औद्योगिक सामग्री",
    "cat5.f1": "सीमेंट और कंक्रीट",
    "cat5.f2": "स्टील और टीएमटी बार",
    "cat5.f3": "भवन निर्माण सामग्री",
    "cat5.f4": "निर्माण उत्पाद",
    "cat5.f5": "रासायनिक आवश्यकताएं",
    "cat5.f6": "भौतिक / परीक्षण आवश्यकताएं",
    "cat5.f7": "लागू क्यूसीओ आदेश",
    "cat5.cta": "निर्माण मानक खोजें",

    // Cat 6: Others
    "cat6.title": "अन्य श्रेणियां",
    "cat6.desc": "क्या आपका उत्पाद नहीं दिख रहा? अन्य श्रेणियों में मानक खोजें और उत्पाद, कीवर्ड या मानक संख्या द्वारा सीधे खोजें।",
    "cat6.hint": "सभी कार्यक्षेत्रों में 23,866+ भारतीय मानक खोजें",
    "cat6.cta": "सभी मानक खोजें",

    // Features Section
    "feat.sectionTitle": "व्यापक मानक बुद्धिमत्ता",
    "feat1.title": "एआई-संचालित सहायता",
    "feat1.overview": "बुद्धिमान प्रश्नोत्तर इंजन",
    "feat1.desc": "प्राकृतिक भाषा में मानकों और अनुपालन के बारे में जटिल प्रश्न पूछें और हमारे बुद्धिमान इंजन से सटीक, त्वरित उत्तर प्राप्त करें।",
    "feat2.title": "भारतीय मानक खोज",
    "feat2.overview": "आईएस कोड खोज",
    "feat2.desc": "विभिन्न डोमेन, सामग्रियों और विशिष्ट उद्योगों में प्रासंगिक भारतीय मानकों (आईएस) को तुरंत खोजें और जानें।",
    "feat3.title": "प्रमाणन मार्गदर्शन",
    "feat3.overview": "अनुपालन नियम",
    "feat3.desc": "बीआईएस प्रमाणन प्रक्रियाओं, आवश्यक दस्तावेजों और व्यापक अनुपालन ढांचे पर चरण-दर-चरण मार्गदर्शन प्राप्त करें।",
    "feat4.title": "परीक्षण प्रयोगशालाएं",
    "feat4.overview": "प्रयोगशाला सुविधाएं खोजें",
    "feat4.desc": "देश भर में अपने विशिष्ट उत्पाद श्रेणियों के लिए बीआईएस मान्यता प्राप्त परीक्षण प्रयोगशालाएं आसानी से खोजें।",

    // Footer
    "footer.brandDesc": "भारतीय मानक ब्यूरो की जानकारी तक बुद्धिमान पहुंच के साथ उद्योगों, निर्माताओं और उपभोक्ताओं को सशक्त बनाना।",
    "footer.quickLinks": "त्वरित लिंक",
    "footer.searchStandards": "मानक खोजें",
    "footer.certificationSchemes": "प्रमाणन योजनाएं",
    "footer.labDirectory": "लैब निर्देशिका",
    "footer.helpCenter": "सहायता केंद्र",
    "footer.legal": "कानूनी",
    "footer.privacy": "गोपनीयता नीति",
    "footer.terms": "सेवा की शर्तें",
    "footer.accessibility": "सुगमता",
    "footer.copyright": "&copy; 2026 एसआईएच प्रोजेक्ट - मानकई। सर्वाधिकार सुरक्षित।",

    // Login Page
    "login.backHome": "मुख्य पृष्ठ पर वापस",
    "login.subtitle": "भारतीय मानक ब्यूरो सहायक",
    "login.quote": "&ldquo;जहां 23,866+ भारतीय मानकों पर प्रामाणिकता, उत्पाद सुरक्षा और सटीक बुद्धिमत्ता का संगम होता है।&rdquo;",
    "login.badge1.title": "आईएसआई मार्क और हॉलमार्किंग",
    "login.badge1.desc": "त्वरित सत्यापन प्रोटोकॉल",
    "login.badge2.title": "क्यूसीओ और राजपत्र ट्रैकिंग",
    "login.badge2.desc": "अनिवार्य अनुपालन आदेश",
    "login.badge3.title": "खंड-स्तरीय बुद्धिमत्ता",
    "login.badge3.desc": "अनुरेखणीय मानक मार्गदर्शन",
    "login.est": "स्था. 2026 &bull; सरकारी-तकनीक",
    "login.secureTerminal": "सुरक्षित टर्मिनल",
    "login.signInTitle": "पोर्टल साइन इन",
    "login.signInSubtitle": "कार्यक्षेत्र खोलने के लिए अपने अधिकृत क्रेडेंशियल दर्ज करें",
    "login.emailLabel": "ईमेल पता",
    "login.emailPlaceholder": "officer@bis.gov.in",
    "login.emailError": "कृपया एक मान्य ईमेल पता दर्ज करें।",
    "login.passLabel": "पासवर्ड",
    "login.forgot": "भूल गए?",
    "login.passError": "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    "login.rememberMe": "इस टर्मिनल पर मुझे याद रखें",
    "login.btnSubmit": "सत्यापित करें और खोलें",
    "login.quickDemo": "त्वरित डेमो एक्सेस:",
    "login.chipMsme": "एमएसएमई",
    "login.chipAuditor": "लैब ऑडिटर",
    "login.chipCitizen": "नागरिक",
    "login.needCreds": "क्रेडेंशियल चाहिए?",
    "login.reqAccess": "अनुसंधान पहुंच का अनुरोध करें",
  },

  mr: {
    langName: "मराठी",
    langCode: "MR",
    // Navigation
    "nav.features": "वैशिष्ट्ये",
    "nav.standards": "मानके",
    "nav.labs": "प्रयोगशाळा",
    "nav.company": "कंपनी / संस्था",
    "nav.login": "लॉगिन",
    "nav.backHome": "मुख्य पानावर परत",
    "nav.themeToggle": "यिन/यांग मोड बदला",

    // Hero
    "hero.title": "झटपट बीआयएस लेबल<br>पडताळणी.",
    "hero.subtext": "उत्पादनाची सत्यता तपासण्यासाठी आणि काही सेकंदात मानकांचे पालन सुनिश्चित करण्यासाठी आयएसआय मार्क स्कॅन करा.",
    "hero.btnAsk": "मानकईला विचारा &rarr;",
    "hero.btnExplore": "मानके शोधा",
    "hero.trust": "23,866+ मानके &bull; कलम-स्तरीय स्रोत &bull; English &bull; हिन्दी &bull; मराठी",

    // How It Works
    "how.title": "मानकई कसे काम करते",
    "how.step1.title": "विचारा",
    "how.step1.desc": "इंग्रजी, हिंदी किंवा मराठीमध्ये तुमचा बीआयएस संबंधित प्रश्न विचारा.",
    "how.step2.title": "शोधा",
    "how.step2.desc": "आम्ही संबंधित माहिती शोधण्यासाठी 23,866+ भारतीय मानकांमध्ये शोध घेतो.",
    "how.step3.title": "पडताळणी करा",
    "how.step3.desc": "मानकई संबंधित मानक, कलम आणि तांत्रिक आवश्यकता ओळखतो.",
    "how.step4.title": "समजून घ्या",
    "how.step4.desc": "स्रोत संदर्भ आणि अचूकतेसह साधे एआय-व्युत्पन्न उत्तर मिळवा.",
    "how.step5.title": "कृती करा",
    "how.step5.desc": "प्रमाणीकरण, क्यूसीओ, चाचणी प्रयोगशाळा, हॉलमार्किंग आणि लागू मानके शोधा.",

    // Major Categories
    "cat.sectionTitle": "प्रमुख वर्ग",
    "cat.sectionSubtitle": "उद्योग क्षेत्र, प्रमाणन योजना आणि अनिवार्य क्यूसीओ मधील प्रमुख भारतीय मानके शोधा.",
    "cat.explore": "यासाठी मानके शोधा:",
    "cat.exploreBis": "यासाठी बीआयएस मानके शोधा:",

    // Cat 1: Auto
    "cat1.title": "ऑटोमोबाईल आणि ईव्ही",
    "cat1.f1": "इलेक्ट्रिक वाहने",
    "cat1.f2": "ईव्ही चार्जिंग उपकरणे",
    "cat1.f3": "बॅटरी आणि ऊर्जा साठवण",
    "cat1.f4": "ऑटोमोटिव्ह घटक",
    "cat1.f5": "सुरक्षा आणि चाचणी आवश्यकता",
    "cat1.f6": "लागू प्रमाणन योजना",
    "cat1.cta": "ऑटोमोटिव्ह मानके शोधा",

    // Cat 2: Home
    "cat2.title": "घरगुती आणि विद्युत उत्पादने",
    "cat2.f1": "विद्युत उपकरणे",
    "cat2.f2": "पंखे",
    "cat2.f3": "केबल्स आणि वायर्स",
    "cat2.f4": "स्विचेस आणि सॉकेट्स",
    "cat2.f5": "बॅटरी",
    "cat2.f6": "घरगुती उपकरणे",
    "cat2.f7": "सुरक्षा आणि ऊर्जा कार्यक्षमता आवश्यकता",
    "cat2.cta": "उत्पादन मानके शोधा",

    // Cat 3: Food & Water
    "cat3.title": "अन्न, पाणी आणि ग्राहक उत्पादने",
    "cat3.f1": "पॅकेज केलेले पिण्याचे पाणी",
    "cat3.f2": "खाद्य संबंधी उत्पादने",
    "cat3.f3": "ग्राहक वस्तू",
    "cat3.f4": "पॅकेजिंग साहित्य",
    "cat3.f5": "गुणवत्ता आणि सुरक्षा आवश्यकता",
    "cat3.f6": "चाचणी आवश्यकता",
    "cat3.cta": "सुरक्षा मानके तपासा",

    // Cat 4: Gold & Jewellery
    "cat4.title": "सोने, चांदी आणि दागिने",
    "cat4.badge": "समर्पित हॉलमार्किंग आणि एचयूआयडी",
    "cat4.explore": "शोधा:",
    "cat4.f1": "सुवर्ण हॉलमार्किंग",
    "cat4.f2": "चांदी हॉलमार्किंग",
    "cat4.f3": "एचयूआयडी पडताळणी",
    "cat4.f4": "शुद्धता / श्रेणी",
    "cat4.f5": "हॉलमार्किंग आवश्यकता",
    "cat4.f6": "बीआयएस केअर पडताळणी",
    "cat4.cta": "हॉलमार्किंग पडताळणी करा",

    // Cat 5: Construction
    "cat5.title": "बांधकाम आणि औद्योगिक साहित्य",
    "cat5.f1": "सिमेंट आणि काँक्रीट",
    "cat5.f2": "स्टील आणि टीएमटी बार",
    "cat5.f3": "इमारत बांधकाम साहित्य",
    "cat5.f4": "बांधकाम उत्पादने",
    "cat5.f5": "रासायनिक आवश्यकता",
    "cat5.f6": "भौतिक / चाचणी आवश्यकता",
    "cat5.f7": "लागू क्यूसीओ आदेश",
    "cat5.cta": "बांधकाम मानके शोधा",

    // Cat 6: Others
    "cat6.title": "इतर वर्ग",
    "cat6.desc": "तुमचे उत्पादन दिसत नाही का? इतर श्रेणींमध्ये मानके शोधा आणि उत्पादन, कीवर्ड किंवा मानक क्रमांकाद्वारे थेट शोधा.",
    "cat6.hint": "सर्व कार्यक्षेत्रांमध्ये 23,866+ भारतीय मानके शोधा",
    "cat6.cta": "सर्व मानके शोधा",

    // Features Section
    "feat.sectionTitle": "सर्वसमावेशक मानक बुद्धिमत्ता",
    "feat1.title": "एआय-चालित सहाय्य",
    "feat1.overview": "स्मार्ट प्रश्नोत्तरे इंजिन",
    "feat1.desc": "नैसर्गिक भाषेत मानके आणि अनुपालनाबद्दल गुंतागुंतीचे प्रश्न विचारा आणि आमच्या बुद्धिमान इंजिनकडून अचूक, झटपट उत्तरे मिळवा.",
    "feat2.title": "भारतीय मानके शोध",
    "feat2.overview": "आयएस कोड शोध",
    "feat2.desc": "विविध क्षेत्रे, साहित्य आणि विशेष उद्योगांमध्ये संबंधित भारतीय मानके (आयएस) त्वरित शोधा.",
    "feat3.title": "प्रमाणन मार्गदर्शन",
    "feat3.overview": "अनुपालन नियम",
    "feat3.desc": "बीआयएस प्रमाणन प्रक्रिया, आवश्यक कागदपत्रे आणि सर्वसमावेशक अनुपालन नियमांवर टप्प्याटप्प्याने मार्गदर्शन मिळवा.",
    "feat4.title": "चाचणी प्रयोगशाळा",
    "feat4.overview": "प्रयोगशाळा सुविधा शोधा",
    "feat4.desc": "देशभरात तुमच्या विशिष्ट उत्पादन श्रेणींसाठी बीआयएस मान्यताप्राप्त चाचणी प्रयोगशाळा सहज शोधा.",

    // Footer
    "footer.brandDesc": "भारतीय मानक ब्युरोच्या माहितीवर बुद्धिमान प्रवेशासह उद्योग, उत्पादक आणि ग्राहकांना सक्षम करणे.",
    "footer.quickLinks": "महत्त्वाचे दुवे",
    "footer.searchStandards": "मानके शोधा",
    "footer.certificationSchemes": "प्रमाणन योजना",
    "footer.labDirectory": "प्रयोगशाळा निर्देशिका",
    "footer.helpCenter": "मदत केंद्र",
    "footer.legal": "कायदेशीर",
    "footer.privacy": "गोपनीयता धोरण",
    "footer.terms": "सेवेच्या अटी",
    "footer.accessibility": "सुलभता",
    "footer.copyright": "&copy; 2026 एसआयएच प्रकल्प - मानकई. सर्व हक्क राखीव.",

    // Login Page
    "login.backHome": "मुख्य पानावर परत",
    "login.subtitle": "भारतीय मानक ब्युरो सहाय्यक",
    "login.quote": "&ldquo;जिथे 23,866+ भारतीय मानकांवर सत्यता, उत्पादन सुरक्षा आणि अचूक बुद्धिमत्ता एकत्र येते.&rdquo;",
    "login.badge1.title": "आयएसआय मार्क आणि हॉलमार्किंग",
    "login.badge1.desc": "झटपट पडताळणी प्रोटोकॉल",
    "login.badge2.title": "क्यूसीओ आणि राजपत्र ट्रॅकिंग",
    "login.badge2.desc": "अनिवार्य अनुपालन आदेश",
    "login.badge3.title": "कलम-स्तरीय बुद्धिमत्ता",
    "login.badge3.desc": "शोधण्यायोग्य मानक मार्गदर्शन",
    "login.est": "स्था. 2026 &bull; शासकीय तंत्रज्ञान",
    "login.secureTerminal": "सुरक्षित टर्मिनल",
    "login.signInTitle": "पोर्टल साइन इन",
    "login.signInSubtitle": "कार्यक्षेत्र उघडण्यासाठी तुमचे अधिकृत क्रेडेन्शियल प्रविष्ट करा",
    "login.emailLabel": "ईमेल पत्ता",
    "login.emailPlaceholder": "officer@bis.gov.in",
    "login.emailError": "कृपया वैध ईमेल पत्ता प्रविष्ट करा.",
    "login.passLabel": "पासवर्ड",
    "login.forgot": "विसरलात?",
    "login.passError": "पासवर्ड किमान 6 अक्षरांचा असावा.",
    "login.rememberMe": "या टर्मिनलवर मला लक्षात ठेवा",
    "login.btnSubmit": "प्रमाणीकृत करा आणि उघडा",
    "login.quickDemo": "झटपट डेमो ॲक्सेस:",
    "login.chipMsme": "एमएसएमई",
    "login.chipAuditor": "प्रयोगशाळा ऑडिटर",
    "login.chipCitizen": "नागरिक",
    "login.needCreds": "क्रेडेन्शियल हवे आहेत?",
    "login.reqAccess": "संशोधन प्रवेशाची विनंती करा",
  },
};

/** Returns the dictionary for a language code (falls back to English). */
export function getManakaiDict(lang: string): Record<string, string> {
  return MANAKAI_TRANSLATIONS[(lang as ManakaiLang)] || MANAKAI_TRANSLATIONS.en;
}

/** Decodes the small set of HTML entities used in the dictionary into plain text. */
export function decodeEntities(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&copy;/g, "\u00A9")
    .replace(/&bull;/g, "\u2022")
    .replace(/&rarr;/g, "\u2192")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&nbsp;/g, "\u00A0");
}
