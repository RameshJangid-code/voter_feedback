export type Language = "hi" | "en";

export interface Translations {
  // Navigation
  siteTitle: string;
  candidateName: string;
  villageName: string;
  candidateCategory: string;
  navHome: string;
  navAbout: string;
  navFeedback: string;
  navIssues: string;
  navOpinion: string;
  navPrivacy: string;
  navAdmin: string;
  navLanguageToggle: string;

  // Hero Section
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  btnReportProblem: string;
  btnShareExpectations: string;
  btnOpinionPoll: string;
  statFeedbackCount: string;
  statAddressedCount: string;
  statActiveCitizens: string;

  // Introduction Section
  introTitle: string;
  introSubtitle: string;
  introDescription: string;
  introPledgeTitle: string;
  introPledgeDesc: string;
  readMore: string;

  // Primary Issues Section
  primaryIssuesTitle: string;
  primaryIssuesSubtitle: string;
  viewAllIssues: string;

  // Statistics Section
  statsTitle: string;
  statsSubtitle: string;
  statsDisclaimer: string;

  // Categories
  catWater: string;
  catRoads: string;
  catDrainage: string;
  catStreetlights: string;
  catEducation: string;
  catHealth: string;
  catEmployment: string;
  catGovSchemes: string;
  catCleanliness: string;
  catOther: string;

  // Priorities
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;

  // Feedback Form
  feedbackFormTitle: string;
  feedbackFormSubtitle: string;
  labelCategory: string;
  labelDescription: string;
  placeholderDescription: string;
  labelImprovement: string;
  placeholderImprovement: string;
  labelPriority: string;
  labelDevelopmentSuggestion: string;
  placeholderDevelopmentSuggestion: string;
  labelConsentSectionTitle: string;
  labelConsentSectionDesc: string;
  labelConsentCheckbox: string;
  labelContactName: string;
  labelContactPhone: string;
  labelWard: string;
  btnSubmitFeedback: string;
  submittingText: string;
  feedbackSuccessTitle: string;
  feedbackSuccessMsg: string;
  btnSubmitAnother: string;

  // Opinion Poll
  opinionTitle: string;
  opinionSubtitle: string;
  opinionQuestion: string;
  opinionOptSupport: string;
  opinionOptUndecided: string;
  opinionOptOther: string;
  btnSubmitOpinion: string;
  opinionSubmittedMsg: string;
  opinionDisclaimer: string;
  opinionLiveResultsTitle: string;
  opinionTotalVotes: string;

  // Public Issues Page
  issuesTitle: string;
  issuesSubtitle: string;
  filterAll: string;
  recentSuggestionsTitle: string;
  noSuggestionsFound: string;

  // Footer & Contact
  footerTitle: string;
  footerAboutText: string;
  quickLinks: string;
  contactTitle: string;
  officeAddress: string;
  visitingHours: string;
  helplinePhone: string;
  privacyNoticeSummary: string;
  copyrightText: string;
}

export const translations: Record<Language, Translations> = {
  hi: {
    // Navigation
    siteTitle: "बुड़ीवाड़ा जन-संवाद पोर्टल",
    candidateName: "श्री मोहन सिंह जी",
    villageName: "ग्राम पंचायत बुड़ीवाड़ा",
    candidateCategory: "निर्दलीय सरपंच प्रत्याशी",
    navHome: "मुख्य पृष्ठ",
    navAbout: "प्रत्याशी परिचय",
    navFeedback: "समस्या व सुझाव दर्ज करें",
    navIssues: "गाँव की प्राथमिकताएँ",
    navOpinion: "जनमत (राय-शुमारी)",
    navPrivacy: "गोपनीयता नीति",
    navAdmin: "प्रशासन लॉगिन",
    navLanguageToggle: "English",

    // Hero Section
    heroBadge: "निर्दलीय सरपंच प्रत्याशी • बुड़ीवाड़ा",
    heroHeadline: "गाँव की आवाज, गाँव का विकास",
    heroSubheadline: "श्री मोहन सिंह जी की पहल — बुड़ीवाड़ा के प्रत्येक नागरिक की समस्या, सुझाव और अपेक्षा को सुनना और निष्पक्ष विकास की प्राथमिकता तय करना।",
    btnReportProblem: "गाँव की समस्याएँ बताएं",
    btnShareExpectations: "अपनी अपेक्षाएँ साझा करें",
    btnOpinionPoll: "अपनी राय दर्ज करें",
    statFeedbackCount: "कुल प्राप्त समस्याएँ",
    statAddressedCount: "समीक्षित व दर्ज मुद्दे",
    statActiveCitizens: "सक्रिय ग्रामवासी सहभागिता",

    // Introduction Section
    introTitle: "हमारा उद्देश्य एवं परिचय",
    introSubtitle: "स्वच्छ, पारदर्शी और जन-भागीदारी आधारित ग्राम पंचायत निर्माण",
    introDescription: "श्री मोहन सिंह जी, बुड़ीवाड़ा ग्राम पंचायत से निर्दलीय सरपंच प्रत्याशी हैं। हमारा मानना है कि सरपंच का काम वादों की झड़ी लगाना नहीं, बल्कि गाँव के प्रत्येक मोहल्ले और वार्ड की वास्तविक समस्याओं को समझकर प्राथमिकताओं के आधार पर कार्य करना है।",
    introPledgeTitle: "हमारा संकल्प",
    introPledgeDesc: "जनता की राय से तैयार कार्ययोजना, पेयजल-सड़क-स्वास्थ्य की प्राथमिकता और हर वर्ग के लिए पारदर्शी सेवा।",
    readMore: "विस्तार से जानें",

    // Primary Issues Section
    primaryIssuesTitle: "हमारे गाँव की प्राथमिक समस्याएँ",
    primaryIssuesSubtitle: "ग्रामवासियों द्वारा अब तक दर्ज की गई प्रमुख बुनियादी आवश्यकताएँ",
    viewAllIssues: "समस्त प्राथमिकताएं व विश्लेषण देखें",

    // Statistics Section
    statsTitle: "पारदर्शी जन-आंकड़े",
    statsSubtitle: "गोपनीय एवं संकलित ग्रामवासी प्रतिक्रिया विश्लेषण",
    statsDisclaimer: "यह आंकड़े पूर्णतः गोपनीय हैं और किसी भी नागरिक की व्यक्तिगत पहचान प्रदर्शित नहीं करते।",

    // Categories
    catWater: "पेयजल व्यवस्था",
    catRoads: "सड़क एवं गली मरम्मत",
    catDrainage: "नाली व जल निकासी",
    catStreetlights: "स्ट्रीट लाइट / प्रकाश व्यवस्था",
    catEducation: "शिक्षा एवं विद्यालय सुविधाएँ",
    catHealth: "स्वास्थ्य सुविधाएँ एवं औषधालय",
    catEmployment: "रोजगार एवं आजीविका",
    catGovSchemes: "सरकारी योजनाओं का लाभ",
    catCleanliness: "सफाई एवं कचरा प्रबंधन",
    catOther: "अन्य समस्या",

    // Priorities
    priorityLow: "सामान्य (Low)",
    priorityMedium: "मध्यम (Medium)",
    priorityHigh: "अति आवश्यक (High Priority)",

    // Feedback Form
    feedbackFormTitle: "अगर गाँव की समस्याएँ हल हों, तो हमारी प्राथमिकताएँ क्या होंगी?",
    feedbackFormSubtitle: "अपनी समस्या या सुझाव निःसंकोच दर्ज करें। यह विवरण गाँव की विकास कार्ययोजना में सम्मिलित किया जाएगा।",
    labelCategory: "मुख्य समस्या का विषय चुनें *",
    labelDescription: "समस्या का विस्तारपूर्वक विवरण दें *",
    placeholderDescription: "कृपया समस्या का स्थान (मोहल्ला/गली) और क्या कठिनाई आ रही है, स्पष्ट लिखें (अधिकतम 1000 शब्द)...",
    labelImprovement: "आप इसमें क्या सुधार या समाधान देखना चाहते हैं? *",
    placeholderImprovement: "आपके अनुसार इस समस्या का सही समाधान क्या हो सकता है?",
    labelPriority: "यह समस्या कितनी जरूरी / गंभीर है? *",
    labelDevelopmentSuggestion: "गाँव के समग्र विकास के लिए कोई अतिरिक्त सुझाव (वैकल्पिक)",
    placeholderDevelopmentSuggestion: "यदि गाँव के विकास के लिए आपका कोई विशेष विचार हो तो यहाँ साझा करें...",
    labelConsentSectionTitle: "स्वैच्छिक संपर्क विवरण (पूरी तरह ऐच्छिक)",
    labelConsentSectionDesc: "यदि आप चाहते हैं कि प्रत्याशी की टीम इस समस्या के समाधान या स्थल निरीक्षण हेतु आपसे संपर्क करे, तो ही नीचे विवरण दें। यह विवरण गोपनीय रखा जाएगा और राजनीतिक राय से बिल्कुल पृथक रहेगा।",
    labelConsentCheckbox: "हाँ, मैं स्थल निरीक्षण या अद्यतन जानकारी हेतु संपर्क विवरण साझा करने की सहमति देता/देती हूँ।",
    labelContactName: "आपका नाम (वैकल्पिक)",
    labelContactPhone: "मोबाइल नंबर (वैकल्पिक)",
    labelWard: "वार्ड नंबर / मोहल्ला (वैकल्पिक)",
    btnSubmitFeedback: "समस्या / सुझाव सबमिट करें",
    submittingText: "दर्ज किया जा रहा है...",
    feedbackSuccessTitle: "सफलतापूर्वक दर्ज किया गया!",
    feedbackSuccessMsg: "आपकी समस्या और सुझाव साझा करने के लिए धन्यवाद। आपके सुझाव गाँव की विकास संबंधी प्राथमिकताओं को समझने में मदद करेंगे।",
    btnSubmitAnother: "एक और समस्या दर्ज करें",

    // Opinion Poll
    opinionTitle: "ग्रामवासी स्वैच्छिक राय-शुमारी",
    opinionSubtitle: "पूर्णतः गोपनीय • बिना किसी पहचान के अपनी राय दें",
    opinionQuestion: "आपकी वर्तमान राय क्या है?",
    opinionOptSupport: "मैं श्री मोहन सिंह जी का समर्थन करता/करती हूँ।",
    opinionOptUndecided: "मैं अभी निर्णय नहीं ले पाया/पाई हूँ।",
    opinionOptOther: "मैं अन्य विकल्प पर विचार कर रहा/रही हूँ।",
    btnSubmitOpinion: "अपनी राय गोपनीय रूप से दर्ज करें",
    opinionSubmittedMsg: "आपकी राय सफलतापूर्वक दर्ज कर ली गई है। धन्यवाद!",
    opinionDisclaimer: "महत्वपूर्ण सूचना: यह स्वैच्छिक राय-शुमारी है। यहाँ कोई नाम, नंबर या व्यक्तिगत डेटा एकत्रित नहीं किया जाता। यह प्रतिक्रिया प्रत्येक ग्रामवासी के मत का प्रतिनिधित्व नहीं करती और न ही चुनावी परिणाम की भविष्यवाणी करती है।",
    opinionLiveResultsTitle: "संकलित जनमत रुझान (अनाम आंकड़े)",
    opinionTotalVotes: "कुल प्राप्त गोपनीय राय",

    // Public Issues Page
    issuesTitle: "गाँव की समस्याएँ एवं विकास प्राथमिकताएँ",
    issuesSubtitle: "ग्रामवासियों से प्राप्त संकलित रुझान एवं प्राथमिकताओं का पारदर्शी विवरण",
    filterAll: "सभी श्रेणियां",
    recentSuggestionsTitle: "ग्रामवासियों के हालिया रचनात्मक सुझाव (समीक्षित)",
    noSuggestionsFound: "इस श्रेणी में अभी कोई सुझाव उपलब्ध नहीं है।",

    // Footer & Contact
    footerTitle: "श्री मोहन सिंह जी – स्वतंत्र सरपंच प्रत्याशी",
    footerAboutText: "ग्राम पंचायत बुड़ीवाड़ा के समग्र, पारदर्शी और निष्पक्ष विकास के लिए समर्पित। गाँव का हर नागरिक हमारा सम्मानित मार्गदर्शक है।",
    quickLinks: "त्वरित लिंक्स",
    contactTitle: "संपर्क एवं जन-सुनवाई",
    officeAddress: "कार्यालय: मुख्य बस स्टैंड, ग्राम पंचायत बुड़ीवाड़ा",
    visitingHours: "जन-सुनवाई समय: प्रतिदिन प्रातः 8:00 से 11:00 बजे एवं सायं 5:00 से 8:00 बजे",
    helplinePhone: "हेल्पलाइन / संपर्क: +91 98290 XXXXX",
    privacyNoticeSummary: "इस पोर्टल पर प्रविष्टियाँ सुरक्षित हैं। राजनीतिक राय को कभी भी संपर्क डेटा के साथ नहीं मिलाया जाता।",
    copyrightText: "© 2026 ग्राम पंचायत बुड़ीवाड़ा जन-संवाद पोर्टल | सर्वाधिकार सुरक्षित।",
  },
  en: {
    // Navigation
    siteTitle: "Budivada Jan-Samvad Portal",
    candidateName: "Shri Mohan Singh Ji",
    villageName: "Gram Panchayat Budivada",
    candidateCategory: "Independent Sarpanch Candidate",
    navHome: "Home",
    navAbout: "About Candidate",
    navFeedback: "Submit Grievance / Suggestion",
    navIssues: "Village Priorities",
    navOpinion: "Opinion Poll",
    navPrivacy: "Privacy Policy",
    navAdmin: "Admin Login",
    navLanguageToggle: "हिन्दी",

    // Hero Section
    heroBadge: "Independent Sarpanch Candidate • Budivada",
    heroHeadline: "Voice of the Village, Progress of the Village",
    heroSubheadline: "An initiative by Shri Mohan Singh Ji — Listening to every resident's grievance, expectation, and suggestion to establish fair community priorities.",
    btnReportProblem: "Report Village Problems",
    btnShareExpectations: "Share Your Expectations",
    btnOpinionPoll: "Cast Your Opinion",
    statFeedbackCount: "Total Problems Logged",
    statAddressedCount: "Issues Reviewed & Registered",
    statActiveCitizens: "Active Citizen Participants",

    // Introduction Section
    introTitle: "Our Purpose & Overview",
    introSubtitle: "Building a Clean, Transparent, and Participatory Panchayat",
    introDescription: "Shri Mohan Singh Ji is an Independent Sarpanch Candidate for Gram Panchayat Budivada. We believe the role of a Sarpanch is not to make false promises, but to listen closely to ground problems across every mohalla and ward, prioritizing development based on real resident input.",
    introPledgeTitle: "Our Pledge",
    introPledgeDesc: "A village action plan driven by citizen consensus, prioritizing clean drinking water, road connectivity, healthcare, and transparent service.",
    readMore: "Read More Details",

    // Primary Issues Section
    primaryIssuesTitle: "Our Village's Primary Concerns",
    primaryIssuesSubtitle: "Core fundamental requirements reported by residents so far",
    viewAllIssues: "View All Priorities & Analytics",

    // Statistics Section
    statsTitle: "Transparent Community Metrics",
    statsSubtitle: "Anonymized and aggregated citizen feedback insights",
    statsDisclaimer: "All statistics are fully anonymized and never display any resident's personal identity.",

    // Categories
    catWater: "Drinking Water Supply",
    catRoads: "Roads & Street Repairs",
    catDrainage: "Drainage & Sanitation",
    catStreetlights: "Street Lighting",
    catEducation: "Education & School Facilities",
    catHealth: "Healthcare & Dispensaries",
    catEmployment: "Employment & Livelihood",
    catGovSchemes: "Government Welfare Schemes",
    catCleanliness: "Waste Management & Cleanliness",
    catOther: "Other Issues",

    // Priorities
    priorityLow: "Low Priority",
    priorityMedium: "Medium Priority",
    priorityHigh: "High Priority (Urgent)",

    // Feedback Form
    feedbackFormTitle: "If Village Problems Are Solved, What Should Be Our Priorities?",
    feedbackFormSubtitle: "Submit your problem or constructive suggestion freely. This directly shapes our community action plan.",
    labelCategory: "Select Main Problem Category *",
    labelDescription: "Describe your problem in detail *",
    placeholderDescription: "Please mention the location (mohalla/ward) and explain the issue clearly (up to 1000 characters)...",
    labelImprovement: "What improvement or solution would you like to see? *",
    placeholderImprovement: "What in your opinion is the most effective solution?",
    labelPriority: "How urgent is this problem? *",
    labelDevelopmentSuggestion: "Optional suggestion for the village master plan",
    placeholderDevelopmentSuggestion: "Share any visionary ideas for the overall development of Budivada...",
    labelConsentSectionTitle: "Voluntary Follow-up Contact (Strictly Optional)",
    labelConsentSectionDesc: "If you wish for the candidate's team to contact you for a site visit or clarification, provide your details below. This is strictly voluntary, kept confidential, and never combined with political opinions.",
    labelConsentCheckbox: "Yes, I explicitly consent to sharing contact details for site verification or status updates.",
    labelContactName: "Your Name (Optional)",
    labelContactPhone: "Phone Number (Optional)",
    labelWard: "Ward / Mohalla (Optional)",
    btnSubmitFeedback: "Submit Grievance / Suggestion",
    submittingText: "Submitting...",
    feedbackSuccessTitle: "Submitted Successfully!",
    feedbackSuccessMsg: "Thank you for sharing your problem and suggestions. Your input will help us understand and prioritize development needs for Budivada.",
    btnSubmitAnother: "Submit Another Issue",

    // Opinion Poll
    opinionTitle: "Resident Voluntary Opinion Poll",
    opinionSubtitle: "100% Anonymous • Express your view without any tracking",
    opinionQuestion: "What is your current opinion?",
    opinionOptSupport: "I support Shri Mohan Singh Ji.",
    opinionOptUndecided: "I have not made a decision yet.",
    opinionOptOther: "I am considering other options.",
    btnSubmitOpinion: "Submit Opinion Anonymously",
    opinionSubmittedMsg: "Your opinion has been recorded anonymously. Thank you!",
    opinionDisclaimer: "Notice: This voluntary opinion poll is completely anonymous. No names, phone numbers, or identifiers are collected. This does not represent the view of every resident or predict election results.",
    opinionLiveResultsTitle: "Aggregated Public Sentiment (Anonymous)",
    opinionTotalVotes: "Total Anonymous Responses",

    // Public Issues Page
    issuesTitle: "Village Problems & Development Priorities",
    issuesSubtitle: "Transparent aggregated trends and community priorities gathered from residents",
    filterAll: "All Categories",
    recentSuggestionsTitle: "Recent Constructive Suggestions (Moderated)",
    noSuggestionsFound: "No suggestions found in this category yet.",

    // Footer & Contact
    footerTitle: "Shri Mohan Singh Ji – Independent Sarpanch Candidate",
    footerAboutText: "Dedicated to transparent, fair, and holistic development of Gram Panchayat Budivada. Every citizen is our valued guide.",
    quickLinks: "Quick Navigation",
    contactTitle: "Contact & Community Sessions",
    officeAddress: "Office: Main Bus Stand, Gram Panchayat Budivada",
    visitingHours: "Citizen Hours: Daily 8:00 AM – 11:00 AM & 5:00 PM – 8:00 PM",
    helplinePhone: "Helpline: +91 98290 XXXXX",
    privacyNoticeSummary: "All data submitted here is securely maintained. Political opinions are strictly segregated from contact inquiries.",
    copyrightText: "© 2026 Gram Panchayat Budivada Jan-Samvad Portal | All Rights Reserved.",
  },
};
