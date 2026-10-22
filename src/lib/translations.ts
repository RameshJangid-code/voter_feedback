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
  navContact: string;
  navPrivacy: string;
  navAdmin: string;
  navLanguageToggle: string;

  // Hero Section
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  btnGiveOpinion: string;
  btnReportProblem: string;
  btnContactTeam: string;
  btnShareExpectations: string;
  btnOpinionPoll: string;
  statFeedbackCount: string;
  statAddressedCount: string;
  statActiveCitizens: string;
  publicSurveyCountText: (count: number) => string;

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

  // Simplified Survey Flow
  surveyTitle: string;
  surveySubtitle: string;
  surveyQ1: string;
  surveyVoteYes: string;
  surveyVoteNo: string;
  surveyYesQ2: string;
  surveyBiggestExpectationLabel: string;
  surveyBiggestExpectationPlaceholder: string;
  surveyNoQ2: string;
  surveyNoReasonPlaceholder: string;
  btnBack: string;
  btnContinue: string;
  btnSkip: string;
  btnSubmitSurvey: string;
  surveySubmittedTitle: string;
  surveySubmittedMsg: string;
  surveyPrivacyNote: string;

  // Contact Form (Separate)
  contactFormTitle: string;
  contactFormSubtitle: string;
  labelFullName: string;
  labelFatherName: string;
  labelMobileNumber: string;
  labelLocality: string;
  labelPreferredContactMethod: string;
  methodPhone: string;
  methodWhatsapp: string;
  methodInPerson: string;
  labelSubjectOrProblem: string;
  labelContactConsent: string;
  btnSubmitContact: string;
  contactSuccessTitle: string;
  contactSuccessMsg: string;
  contactFormDisclaimer: string;

  // Opinion Poll (Legacy/compat)
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
    siteTitle: "janawaaz.in — बुड़ीवाड़ा जन-संवाद पोर्टल",
    candidateName: "श्री मोहन सिंह जी",
    villageName: "ग्राम पंचायत बुड़ीवाड़ा",
    candidateCategory: "निर्दलीय (Independent) सरपंच प्रत्याशी",
    navHome: "मुख्य पृष्ठ",
    navAbout: "प्रत्याशी परिचय",
    navFeedback: "गाँव की समस्याएँ बताएं",
    navIssues: "गाँव की प्राथमिकताएँ",
    navOpinion: "अपनी राय दें",
    navContact: "संपर्क अनुरोध",
    navPrivacy: "गोपनीयता नीति",
    navAdmin: "प्रशासन लॉगिन",
    navLanguageToggle: "English",

    // Hero Section
    heroBadge: "janawaaz.in • राजस्थान जन-संवाद एवं जनमत मंच",
    heroHeadline: "जनता की आवाज़, राजस्थान का फैसला",
    heroSubheadline: "राजस्थान के नागरिकों की समस्याओं, सुझावों एवं चुनावी जनमत का स्वतंत्र मंच। वर्तमान सक्रिय जनमत पोल: श्री मोहन सिंह जी (निर्दलीय सरपंच प्रत्याशी, बुड़ीवाड़ा)।",
    btnGiveOpinion: "अपनी राय दें",
    btnReportProblem: "गाँव की समस्याएँ बताएं",
    btnContactTeam: "समस्या समाधान हेतु संपर्क करें",
    btnShareExpectations: "अपनी अपेक्षाएँ साझा करें",
    btnOpinionPoll: "अपनी राय दर्ज करें",
    statFeedbackCount: "कुल प्राप्त समस्याएँ",
    statAddressedCount: "समीक्षित व दर्ज मुद्दे",
    statActiveCitizens: "सक्रिय ग्रामवासी सहभागिता",
    publicSurveyCountText: (count: number) =>
      `अब तक ${count} लोगों ने सर्वे में अपनी राय साझा की है।`,

    // Introduction Section
    introTitle: "श्री मोहन सिंह जी का परिचय एवं दृष्टिकोण",
    introSubtitle: "स्वच्छ, पारदर्शी और जन-भागीदारी आधारित बुड़ीवाड़ा का निर्माण",
    introDescription: "श्री मोहन सिंह जी, बुड़ीवाड़ा ग्राम पंचायत से निर्दलीय सरपंच प्रत्याशी हैं। हमारा दृढ़ विश्वास है कि सरपंच का कार्य केवल वादे करना नहीं, बल्कि हर मोहल्ले और ढाणी की वास्तविक समस्याओं को समझकर गाँव के विकास की प्राथमिकताएं तय करना है।",
    introPledgeTitle: "हमारा संकल्प",
    introPledgeDesc: "जनता की राय से तैयार कार्ययोजना, पेयजल-सड़क-स्वास्थ्य की प्राथमिकता और हर वर्ग के लिए पारदर्शी सेवा।",
    readMore: "विस्तार से जानें",

    // Primary Issues Section
    primaryIssuesTitle: "हमारे गाँव की प्राथमिक समस्याएँ",
    primaryIssuesSubtitle: "ग्रामवासियों द्वारा दर्ज की गई प्रमुख बुनियादी आवश्यकताएँ",
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
    feedbackFormTitle: "गाँव की समस्या या रचनात्मक सुझाव दर्ज करें",
    feedbackFormSubtitle: "अपनी समस्या या सुझाव निःसंकोच दर्ज करें। यह विवरण गाँव की विकास कार्ययोजना में सम्मिलित किया जाएगा।",
    labelCategory: "मुख्य समस्या का विषय चुनें *",
    labelDescription: "समस्या का विस्तारपूर्वक विवरण दें *",
    placeholderDescription: "कृपया समस्या का स्थान (मोहल्ला/गली) और क्या कठिनाई आ रही है, स्पष्ट लिखें...",
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
    feedbackSuccessMsg: "आपकी समस्या और सुझाव साझा करने के लिए धन्यवाद। आपके सुझाव गाँव की विकास प्राथमिकताओं को निर्धारित करने में मदद करेंगे।",
    btnSubmitAnother: "एक और समस्या दर्ज करें",

    // Simplified Survey Flow
    surveyTitle: "बुड़ीवाड़ा ग्राम पंचायत जनमत सर्वे 2026",
    surveySubtitle: "स्वैच्छिक एवं 100% गोपनीय • आपकी राय हमारे गाँव के विकास की दिशा तय करेगी",
    surveyQ1: "क्या आप आगामी सरपंच चुनाव में श्री मोहन सिंह जी को वोट देने पर विचार कर रहे हैं?",
    surveyVoteYes: "हाँ (YES)",
    surveyVoteNo: "नहीं (NO)",
    surveyYesQ2: "अगर श्री मोहन सिंह जी सरपंच बनते हैं, तो आप उनसे क्या अपेक्षा रखते हैं?",
    surveyBiggestExpectationLabel: "आपकी सबसे बड़ी अपेक्षा क्या है? (वैकल्पिक)",
    surveyBiggestExpectationPlaceholder: "गाँव के लिए आपकी सबसे मुख्य अपेक्षा या प्राथमिकता यहाँ लिखें...",
    surveyNoQ2: "आप वोट क्यों नहीं देना चाहते? (कारण देना वैकल्पिक है)",
    surveyNoReasonPlaceholder: "यदि आप कोई सुझाव या कारण साझा करना चाहें (वैकल्पिक)...",
    btnBack: "वापस जाएँ",
    btnContinue: "आगे बढ़ें",
    btnSkip: "छोड़ें और सबमिट करें",
    btnSubmitSurvey: "सर्वे सबमिट करें",
    surveySubmittedTitle: "धन्यवाद! आपकी राय सफलतापूर्वक दर्ज कर ली गई है।",
    surveySubmittedMsg: "आपकी प्रतिक्रिया सुरक्षित रूप से संकलित आंकड़ों में जोड़ दी गई है।",
    surveyPrivacyNote: "पूर्ण गोपनीयता गारंटी: यह सर्वे पूर्णतः अनाम है। कोई नाम, फोन नंबर या व्यक्तिगत पहचान दर्ज नहीं की जाती।",

    // Contact Form (Separate)
    contactFormTitle: "ग्राम विकास एवं संवाद संपर्क फॉर्म",
    contactFormSubtitle: "यदि आप गाँव की समस्याओं, सुझावों या स्थल निरीक्षण के संबंध में श्री मोहन सिंह जी की टीम से संपर्क चाहते हैं, तो कृपया नीचे अपना विवरण दर्ज करें।",
    labelFullName: "पूरा नाम *",
    labelFatherName: "पिता का नाम (वैकल्पिक)",
    labelMobileNumber: "मोबाइल नंबर *",
    labelLocality: "गाँव / ढाणी / मोहल्ला / वार्ड (वैकल्पिक)",
    labelPreferredContactMethod: "संपर्क का पसंदीदा माध्यम",
    methodPhone: "फ़ोन कॉल (Phone Call)",
    methodWhatsapp: "व्हाट्सएप (WhatsApp)",
    methodInPerson: "व्यक्तिगत भेंट (In-Person)",
    labelSubjectOrProblem: "संक्षेप में विषय या समस्या (वैकल्पिक)",
    labelContactConsent: "हाँ, मैं गाँव की समस्याओं या सुझावों के समाधान हेतु श्री मोहन सिंह जी की टीम द्वारा संपर्क किए जाने की सहमति देता/देती हूँ।",
    btnSubmitContact: "संपर्क अनुरोध सबमिट करें",
    contactSuccessTitle: "अनुरोध सफलतापूर्वक दर्ज!",
    contactSuccessMsg: "आपका संपर्क विवरण प्राप्त हो गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।",
    contactFormDisclaimer: "गोपनीयता सूचना: यह संपर्क फॉर्म सर्वे से पूर्णतः अलग है। यहाँ दर्ज जानकारी केवल व्यक्तिगत संवाद हेतु उपयोग होगी, इसे कभी भी किसी राजनीतिक राय या हाँ/नहीं उत्तर से नहीं जोड़ा जाएगा।",

    // Opinion Poll (Legacy/compat)
    opinionTitle: "ग्रामवासी स्वैच्छिक राय-शुमारी",
    opinionSubtitle: "पूर्णतः गोपनीय • बिना किसी पहचान के अपनी राय दें",
    opinionQuestion: "आपकी वर्तमान राय क्या है?",
    opinionOptSupport: "मैं श्री मोहन सिंह जी का समर्थन करता/करती हूँ।",
    opinionOptUndecided: "मैं अभी निर्णय नहीं ले पाया/पाई हूँ।",
    opinionOptOther: "मैं अन्य विकल्प पर विचार कर रहा/रही हूँ।",
    btnSubmitOpinion: "अपनी राय गोपनीय रूप से दर्ज करें",
    opinionSubmittedMsg: "आपकी राय सफलतापूर्वक दर्ज कर ली गई है। धन्यवाद!",
    opinionDisclaimer: "महत्वपूर्ण सूचना: यह स्वैच्छिक राय-शुमारी है। यहाँ कोई नाम, नंबर या व्यक्तिगत डेटा एकत्रित नहीं किया जाता। यह किसी नागरिक की व्यक्तिगत पहचान प्रदर्शित नहीं करता।",
    opinionLiveResultsTitle: "संकलित जनमत रुझान (अनाम आंकड़े)",
    opinionTotalVotes: "कुल प्राप्त गोपनीय राय",

    // Public Issues Page
    issuesTitle: "गाँव की समस्याएँ एवं विकास प्राथमिकताएँ",
    issuesSubtitle: "ग्रामवासियों से प्राप्त संकलित रुझान एवं प्राथमिकताओं का पारदर्शी विवरण",
    filterAll: "सभी श्रेणियां",
    recentSuggestionsTitle: "ग्रामवासियों के हालिया रचनात्मक सुझाव (समीक्षित)",
    noSuggestionsFound: "इस श्रेणी में अभी कोई सुझाव उपलब्ध नहीं है।",

    // Footer & Contact
    footerTitle: "श्री मोहन सिंह जी – निर्दलीय सरपंच प्रत्याशी",
    footerAboutText: "ग्राम पंचायत बुड़ीवाड़ा के समग्र, पारदर्शी और निष्पक्ष विकास के लिए समर्पित। गाँव का हर नागरिक हमारा सम्मानित मार्गदर्शक है।",
    quickLinks: "त्वरित लिंक्स",
    contactTitle: "कार्यालय एवं जन-सुनवाई",
    officeAddress: "कार्यालय: मुख्य बस स्टैंड, ग्राम पंचायत बुड़ीवाड़ा",
    visitingHours: "जन-सुनवाई समय: प्रतिदिन प्रातः 8:00 से 11:00 बजे एवं सायं 5:00 से 8:00 बजे",
    helplinePhone: "हेल्पलाइन / संपर्क: +91 98290 XXXXX",
    privacyNoticeSummary: "इस पोर्टल पर प्रविष्टियाँ सुरक्षित हैं। राजनीतिक राय को कभी भी संपर्क डेटा के साथ नहीं मिलाया जाता।",
    copyrightText: "© 2026 janawaaz.in | बुड़ीवाड़ा जन-संवाद पोर्टल | सर्वाधिकार सुरक्षित।",
  },
  en: {
    // Navigation
    siteTitle: "janawaaz.in — Budivada Citizen Portal",
    candidateName: "Shri Mohan Singh Ji",
    villageName: "Gram Panchayat Budivada",
    candidateCategory: "Independent Sarpanch Candidate",
    navHome: "Home",
    navAbout: "About Candidate",
    navFeedback: "Report Village Issues",
    navIssues: "Village Priorities",
    navOpinion: "Give Your Opinion",
    navContact: "Request Contact",
    navPrivacy: "Privacy Policy",
    navAdmin: "Admin Login",
    navLanguageToggle: "हिंदी",

    // Hero Section
    heroBadge: "janawaaz.in • Rajasthan Public Opinion Platform",
    heroHeadline: "Voice of Citizens, Verdict of Rajasthan",
    heroSubheadline: "Independent digital platform for citizen issues and election polls across Rajasthan. Featured active poll: Shri Mohan Singh Ji (Independent Sarpanch Candidate, Budivada).",
    btnGiveOpinion: "Give Your Opinion",
    btnReportProblem: "Report Village Issues",
    btnContactTeam: "Contact for Grievance Redressal",
    btnShareExpectations: "Share Expectations",
    btnOpinionPoll: "Cast Your Opinion",
    statFeedbackCount: "Total Issues Reported",
    statAddressedCount: "Addressed & Recorded",
    statActiveCitizens: "Active Citizen Participation",
    publicSurveyCountText: (count: number) =>
      `So far ${count} residents have shared their views in the survey.`,

    // Introduction Section
    introTitle: "Introduction & Vision of Shri Mohan Singh Ji",
    introSubtitle: "Building a Clean, Transparent & Participatory Budivada",
    introDescription: "Shri Mohan Singh Ji is an Independent Sarpanch Candidate from Gram Panchayat Budivada. We believe the true duty of a Sarpanch is not to make false promises, but to listen closely to every ward and dhanis to prioritize village needs.",
    introPledgeTitle: "Our Pledge",
    introPledgeDesc: "A development roadmap crafted by citizen feedback, prioritizing drinking water, roads, health, and transparent governance.",
    readMore: "Read More",

    // Primary Issues Section
    primaryIssuesTitle: "Primary Needs of Our Village",
    primaryIssuesSubtitle: "Key civic infrastructure needs highlighted by village residents",
    viewAllIssues: "View All Priorities & Charts",

    // Statistics Section
    statsTitle: "Transparent Community Statistics",
    statsSubtitle: "Confidential and aggregated resident feedback analytics",
    statsDisclaimer: "These figures are strictly aggregated and do not reveal any personal identities.",

    // Categories
    catWater: "Drinking Water",
    catRoads: "Roads & Street Repairs",
    catDrainage: "Drainage & Sanitation",
    catStreetlights: "Streetlights & Lighting",
    catEducation: "Education & Schools",
    catHealth: "Healthcare & Dispensaries",
    catEmployment: "Employment & Livelihood",
    catGovSchemes: "Government Schemes",
    catCleanliness: "Cleanliness & Waste Management",
    catOther: "Other Issues",

    // Priorities
    priorityLow: "Low Priority",
    priorityMedium: "Medium Priority",
    priorityHigh: "High Priority",

    // Feedback Form
    feedbackFormTitle: "Report a Village Problem or Creative Suggestion",
    feedbackFormSubtitle: "Submit your problem or constructive suggestion freely. It will be incorporated into the village development roadmap.",
    labelCategory: "Select Main Problem Category *",
    labelDescription: "Detailed Description of the Issue *",
    placeholderDescription: "Please specify the location (locality/street) and what difficulty is being faced...",
    labelImprovement: "What Improvement or Solution Do You Expect? *",
    placeholderImprovement: "In your opinion, what is the best solution for this issue?",
    labelPriority: "Urgency Level of this Problem *",
    labelDevelopmentSuggestion: "Additional Village Development Suggestions (Optional)",
    placeholderDevelopmentSuggestion: "Share any visionary ideas for the village...",
    labelConsentSectionTitle: "Voluntary Contact Details (Strictly Optional)",
    labelConsentSectionDesc: "Only fill in details below if you wish the candidate's team to contact you for site inspection or grievance follow-up. This is strictly segregated from political opinions.",
    labelConsentCheckbox: "Yes, I consent to sharing my contact details for site inspection or progress updates.",
    labelContactName: "Your Full Name (Optional)",
    labelContactPhone: "Mobile Number (Optional)",
    labelWard: "Ward Number / Locality (Optional)",
    btnSubmitFeedback: "Submit Problem / Suggestion",
    submittingText: "Submitting...",
    feedbackSuccessTitle: "Successfully Submitted!",
    feedbackSuccessMsg: "Thank you for sharing your feedback. Your input helps us understand our village priorities.",
    btnSubmitAnother: "Submit Another Issue",

    // Simplified Survey Flow
    surveyTitle: "Budivada Gram Panchayat Survey 2026",
    surveySubtitle: "Voluntary & 100% Confidential • Your voice shapes our village development roadmap",
    surveyQ1: "Are you considering voting for Shri Mohan Singh Ji in the upcoming Sarpanch election?",
    surveyVoteYes: "YES — हाँ",
    surveyVoteNo: "NO — नहीं",
    surveyYesQ2: "If Shri Mohan Singh Ji becomes Sarpanch, what are your key expectations from him?",
    surveyBiggestExpectationLabel: "What is your single biggest expectation? (Optional)",
    surveyBiggestExpectationPlaceholder: "Write your highest priority for the village here...",
    surveyNoQ2: "Why do you not wish to vote? (Reason is completely optional)",
    surveyNoReasonPlaceholder: "If you wish to share a reason or suggestion (optional)...",
    btnBack: "Back",
    btnContinue: "Continue",
    btnSkip: "Skip & Submit",
    btnSubmitSurvey: "Submit Survey",
    surveySubmittedTitle: "Thank You! Your feedback has been recorded.",
    surveySubmittedMsg: "Your response has been safely added to the aggregated community metrics.",
    surveyPrivacyNote: "Strict Privacy Guarantee: This survey is 100% anonymous. No name, phone number, or personal identity is recorded.",

    // Contact Form (Separate)
    contactFormTitle: "Village Development & Dialogue Contact Form",
    contactFormSubtitle: "If you want Shri Mohan Singh Ji's team to contact you regarding village issues, suggestions, or site visits, please submit your details below.",
    labelFullName: "Full Name *",
    labelFatherName: "Father's Name (Optional)",
    labelMobileNumber: "Mobile Number *",
    labelLocality: "Village / Locality / Ward (Optional)",
    labelPreferredContactMethod: "Preferred Contact Method",
    methodPhone: "Phone Call",
    methodWhatsapp: "WhatsApp",
    methodInPerson: "In-Person Visit",
    labelSubjectOrProblem: "Brief Subject or Village Problem (Optional)",
    labelContactConsent: "Yes, I consent to being contacted by Shri Mohan Singh Ji's team regarding village problems or suggestions.",
    btnSubmitContact: "Submit Contact Request",
    contactSuccessTitle: "Request Submitted Successfully!",
    contactSuccessMsg: "Your contact details have been received. Our team will contact you shortly.",
    contactFormDisclaimer: "Privacy Notice: This contact form is completely separate from the survey. Your details will only be used for dialogue and will never be linked to any political opinion or YES/NO vote.",

    // Opinion Poll (Legacy/compat)
    opinionTitle: "Citizen Voluntary Opinion Survey",
    opinionSubtitle: "100% Confidential • Express your opinion anonymously",
    opinionQuestion: "What is your current view?",
    opinionOptSupport: "I support Shri Mohan Singh Ji.",
    opinionOptUndecided: "I am currently undecided.",
    opinionOptOther: "I am considering other options.",
    btnSubmitOpinion: "Submit Confidential Opinion",
    opinionSubmittedMsg: "Your opinion has been recorded safely. Thank you!",
    opinionDisclaimer: "Important Notice: This is a voluntary citizen survey. No personal identifiable information is collected. It does not represent every citizen's ballot nor forecast official election outcomes.",
    opinionLiveResultsTitle: "Aggregated Community Trends (Anonymous)",
    opinionTotalVotes: "Total Confidential Responses",

    // Public Issues Page
    issuesTitle: "Village Issues & Development Priorities",
    issuesSubtitle: "Transparent summary of citizen grievances and development needs",
    filterAll: "All Categories",
    recentSuggestionsTitle: "Recent Constructive Suggestions from Residents",
    noSuggestionsFound: "No suggestions found in this category.",

    // Footer & Contact
    footerTitle: "Shri Mohan Singh Ji – Independent Sarpanch Candidate",
    footerAboutText: "Dedicated to transparent, inclusive, and unbiased development of Gram Panchayat Budivada. Every citizen is our esteemed mentor.",
    quickLinks: "Quick Links",
    contactTitle: "Office & Citizen Hours",
    officeAddress: "Office: Main Bus Stand, Gram Panchayat Budivada",
    visitingHours: "Citizen Hours: Daily 8:00 AM - 11:00 AM & 5:00 PM - 8:00 PM",
    helplinePhone: "Helpline / Contact: +91 98290 XXXXX",
    privacyNoticeSummary: "Entries on this portal are protected. Political views are strictly segregated from personal contact details.",
    copyrightText: "© 2026 janawaaz.in | Budivada Citizen Feedback Portal | All Rights Reserved.",
  },
};
