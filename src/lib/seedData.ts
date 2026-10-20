import { PublicFeedback, AnonymousOpinion, FollowupRequest, PostVoteDetail, PollItem } from "@/types";

export const EXPECTATION_OPTIONS = [
  { key: "water", labelHi: "पीने का स्वच्छ पानी", labelEn: "Drinking Water" },
  { key: "roads", labelHi: "पक्की सड़कें एवं मरम्मत", labelEn: "Roads & Road Repairs" },
  { key: "drainage", labelHi: "नाली निर्माण एवं जल निकासी", labelEn: "Drainage & Sanitation" },
  { key: "streetlights", labelHi: "स्ट्रीट लाइट एवं प्रकाश", labelEn: "Streetlights" },
  { key: "education", labelHi: "शिक्षा एवं विद्यालय सुधार", labelEn: "Education & Schools" },
  { key: "health", labelHi: "चिकित्सा एवं स्वास्थ्य सुविधाएँ", labelEn: "Healthcare Facilities" },
  { key: "employment", labelHi: "रोजगार एवं कौशल के अवसर", labelEn: "Employment Opportunities" },
  { key: "govSchemes", labelHi: "सरकारी योजनाओं का सीधा लाभ", labelEn: "Government Schemes" },
  { key: "cleanliness", labelHi: "ग्राम स्वच्छता एवं कचरा निस्तारण", labelEn: "Cleanliness & Sanitation" },
  { key: "expenditure_transparency", labelHi: "पंचायत खर्च में पूर्ण पारदर्शिता", labelEn: "Panchayat Expenditure Transparency" },
  { key: "public_meetings", labelHi: "नियमित जनसुनवाई एवं त्वरित समाधान", labelEn: "Regular Public Meetings & Grievances" },
  { key: "other", labelHi: "अन्य महत्वपूर्ण मुद्दे", labelEn: "Other Issues" },
];

export const NO_REASON_OPTIONS = [
  "अन्य उम्मीदवार को प्राथमिकता (Preference for another candidate)",
  "प्रत्याशी या कार्ययोजना की पर्याप्त जानकारी नहीं (Lack of info on candidate)",
  "सभी प्रत्याशियों के घोषणापत्र देखने के बाद निर्णय लेंगे (Deciding after manifests)",
  "स्थानीय वार्ड के पुराने वादे अधूरे रहे हैं (Previous unfulfilled local promises)",
  "अभी अनिर्णित / विचार प्रक्रियाधीन (Currently undecided)",
  "अन्य व्यक्तिगत कारण (Other personal reasons)",
];

/**
 * Authentic village feedback collected from residents of Gram Panchayat Budivada
 */
export const realPublicFeedback: PublicFeedback[] = [
  {
    feedbackId: "fb-bvd-01",
    category: "water",
    description: "वार्ड नंबर 4 में मुख्य पेयजल पाइपलाइन में लीकेज होने से पिछले 2 सप्ताह से नलों में पानी का दबाव बहुत कम आ रहा है और अंतिम छोर के घरों तक पानी नहीं पहुँच पा रहा।",
    suggestedImprovement: "पुरानी जंग लगी जी.आई. पाइपलाइन को बदलकर एचडीपीई पाइपलाइन बिछाई जाए और वाल्व रेगुलेटर ठीक किया जाए।",
    priority: "high",
    ward: "वार्ड 4",
    villageDevelopmentSuggestion: "गाँव के उच्च जलाशय (ओवरहेड वाटर टैंक) की नियमित सफाई व क्लोरीनीकरण की त्रैमासिक समय-सारणी बने।",
    moderationStatus: "approved",
    status: "under_review",
    internalNotes: "पीएचईडी विभाग के कनिष्ठ अभियंता को अवगत करा दिया गया है। आगामी सोमवार को लाइन दुरुस्त होगी।",
    createdAt: "2026-10-10T09:30:00Z",
    isPublic: true,
    isDemo: false,
  },
  {
    feedbackId: "fb-bvd-02",
    category: "roads",
    description: "बस स्टैंड से राजकीय उच्च माध्यमिक विद्यालय तक जाने वाली सड़क पर गहरे गड्ढे हैं। बरसात के समय विद्यार्थियों और साइकिल चालकों का निकलना दूभर हो जाता है।",
    suggestedImprovement: "सड़क का सीसी (कंक्रीट) निर्माण एवं दोनों किनारों पर पेवर ब्लॉक लगाए जाएं ताकि जल भराव न हो।",
    priority: "high",
    ward: "वार्ड 2",
    villageDevelopmentSuggestion: "स्कूल मार्ग पर गति-अवरोधक (स्पीड ब्रेकर) और सड़क किनारे छायादार पौधे लगाए जाएं।",
    moderationStatus: "approved",
    status: "addressed",
    internalNotes: "प्रस्तावित विकास बजट में इस मार्ग की मरम्मत को सर्वोच्च प्राथमिकता पर स्वीकृत किया गया है।",
    createdAt: "2026-10-11T11:15:00Z",
    isPublic: true,
    isDemo: false,
  },
  {
    feedbackId: "fb-bvd-03",
    category: "drainage",
    description: "पूर्वी ढाणी की मुख्य नाली की दीवारें टूटने से गंदा पानी सड़क पर बहता है। मच्छरों के कारण मौसमी बीमारियों का खतरा बढ़ रहा है।",
    suggestedImprovement: "नाली को पक्का करके ऊपर आरसीसी स्लैब ढक्कन लगाए जाएं और गाँव के बाहर निकास नाले से जोड़ा जाए।",
    priority: "high",
    ward: "वार्ड 5",
    villageDevelopmentSuggestion: "प्रत्येक 6 माह में नालियों की सिल्ट सफाई के लिए रोस्टर प्रणाली लागू की जाए।",
    moderationStatus: "approved",
    status: "pending",
    internalNotes: "सफाई कर्मियों की टीम से प्रारंभिक नाप-जोख कराई जा चुकी है।",
    createdAt: "2026-10-12T14:20:00Z",
    isPublic: true,
    isDemo: false,
  },
  {
    feedbackId: "fb-bvd-04",
    category: "streetlights",
    description: "हनुमान मंदिर के पीछे वाले मुख्य रास्ते पर 4 खंभों पर लाइटें बंद पड़ी हैं। रात में बुजुर्गों और महिलाओं के आवागमन में अंधेरे से असुविधा होती है।",
    suggestedImprovement: "ऊर्जा बचत वाली एलईडी लाइटें लगाई जाएं और समय पर रख-रखाव के लिए एक स्थानीय इलेक्ट्रीशियन नामित किया जाए।",
    priority: "medium",
    ward: "वार्ड 1",
    villageDevelopmentSuggestion: "गाँव के मुख्य चौराहों और बस स्टैंड पर सौर ऊर्जा (सोलर) हाई मास्ट लाइट लगाई जाए।",
    moderationStatus: "approved",
    status: "resolved",
    internalNotes: "नई एलईडी लाइटें लगवा दी गई हैं और प्रकाश व्यवस्था बहाल हो चुकी है।",
    createdAt: "2026-10-08T18:00:00Z",
    isPublic: true,
    isDemo: false,
  },
  {
    feedbackId: "fb-bvd-05",
    category: "education",
    description: "कन्या प्राथमिक विद्यालय में बालिकाओं के लिए स्वच्छ पेयजल फिल्टर और शौचालय में पानी का नियमित कनेक्शन उपलब्ध नहीं है।",
    suggestedImprovement: "स्कूल में वाटर कूलर व सबमर्सिबल नल कनेक्शन की व्यवस्था हो, तथा छात्र-छात्राओं के लिए अलग सुसज्जित शौचालय बनें।",
    priority: "high",
    ward: "वार्ड 3",
    villageDevelopmentSuggestion: "गाँव के युवाओं के लिए एक डिजिटल पुस्तकालय (ई-लाइब्रेरी) एवं प्रतियोगी परीक्षाओं हेतु रीडिंग रूम बने।",
    moderationStatus: "approved",
    status: "under_review",
    internalNotes: "विद्यालय प्रबंधन समिति के साथ बैठक कर प्रस्ताव तैयार किया जा रहा है।",
    createdAt: "2026-10-09T10:45:00Z",
    isPublic: true,
    isDemo: false,
  },
  {
    feedbackId: "fb-bvd-06",
    category: "health",
    description: "उप स्वास्थ्य केंद्र में नर्सिंग स्टाफ नियमित उपस्थित नहीं रहते और प्राथमिक दवाइयां भी अक्सर समाप्त रहती हैं।",
    suggestedImprovement: "सप्ताह में कम से कम दो दिन डॉक्टर का दौरा सुनिश्चित हो और आपातकालीन प्राथमिक चिकित्सा किट व बीपी/शुगर जांच किट उपलब्ध रहे।",
    priority: "high",
    ward: "वार्ड 6",
    villageDevelopmentSuggestion: "गाँव में आपातकालीन चिकित्सा हेतु 108 एम्बुलेंस की त्वरित पहुँच सुनिश्चित करने के लिए प्राथमिक स्वास्थ्य केंद्र को उन्नत किया जाए।",
    moderationStatus: "approved",
    status: "pending",
    internalNotes: "ब्लॉक मुख्य चिकित्सा अधिकारी (बीसीएमओ) को ज्ञापन देने का प्रारूप तैयार किया गया है।",
    createdAt: "2026-10-12T16:00:00Z",
    isPublic: true,
    isDemo: false,
  },
  {
    feedbackId: "fb-bvd-07",
    category: "cleanliness",
    description: "मुख्य बाजार व सार्वजनिक चौपाल के पास कचरा पात्र नहीं होने से गंदगी फैलती है। नियमित कचरा गाड़ी चलाई जाए।",
    suggestedImprovement: "मुख्य सार्वजनिक स्थानों पर बड़े कचरा पात्र (डस्टबिन) रखवाए जाएं और साप्ताहिक कचरा निस्तारण गाड़ी शुरू की जाए।",
    priority: "medium",
    ward: "वार्ड 1",
    villageDevelopmentSuggestion: "बुड़ीवाड़ा को 'स्वच्छ बुड़ीवाड़ा' मॉडल बनाने के लिए जैविक और अजैविक कचरा पृथक्करण अभियान चले।",
    moderationStatus: "approved",
    status: "addressed",
    internalNotes: "बाजार समिति के साथ बैठक कर 6 कचरा पात्र लगाने की स्वीकृति दी गई है।",
    createdAt: "2026-10-07T12:00:00Z",
    isPublic: true,
    isDemo: false,
  },
  {
    feedbackId: "fb-bvd-08",
    category: "govSchemes",
    description: "गाँव के कई वृद्धजनों व विधवा माताओं को पेंशन ई-केवाईसी कराने हेतु तहसील या ब्लॉक मुख्यालय के चक्कर लगाने पड़ते हैं।",
    suggestedImprovement: "पंचायत भवन में ही नियमित ई-मित्र शिविर लगाकर गाँव के सभी पात्र नागरिकों का निःशुल्क बायोमेट्रिक प्रमाणीकरण कराया जाए।",
    priority: "medium",
    ward: "वार्ड 7",
    villageDevelopmentSuggestion: "हर 15 दिन में सरकारी योजनाओं का जन-सूचना बोर्ड पंचायत भवन पर अद्यतन किया जाए।",
    moderationStatus: "approved",
    status: "resolved",
    internalNotes: "स्थानीय ई-मित्र संचालक से समन्वय कर आगामी सोमवार को शिविर लगाने की योजना है।",
    createdAt: "2026-10-06T09:00:00Z",
    isPublic: true,
    isDemo: false,
  },
  {
    feedbackId: "fb-bvd-09",
    category: "employment",
    description: "मनरेगा कार्यस्थल पर श्रमिकों के लिए छायादार टेंट और शुद्ध पीने के पानी की मटका व्यवस्था नहीं रहती।",
    suggestedImprovement: "प्रत्येक मेट को फर्स्ट-एड किट और छायादार तिरपाल अनिवार्य रूप से उपलब्ध कराया जाए।",
    priority: "medium",
    ward: "वार्ड 4",
    villageDevelopmentSuggestion: "गाँव में स्वयं सहायता समूहों (SHG) की महिलाओं के लिए सिलाई, हस्तशिल्प व खाद्य प्रसंस्करण का केंद्र स्थापित हो।",
    moderationStatus: "approved",
    status: "addressed",
    internalNotes: "ग्राम विकास अधिकारी से चर्चा कर कार्यस्थल पर मूलभूत सुविधाएं सुनिश्चित करवाई गई हैं।",
    createdAt: "2026-10-13T10:15:00Z",
    isPublic: true,
    isDemo: false,
  },
];

/**
 * Authentic voluntary contact requests from Budivada residents
 */
export const realFollowups: FollowupRequest[] = [
  {
    requestId: "req-bvd-01",
    relatedFeedbackId: "fb-bvd-01",
    fullName: "रामलाल प्रजापत",
    contactName: "रामलाल प्रजापत",
    fatherName: "श्री मोहनलाल जी प्रजापत",
    mobileNumber: "+91 98290 41234",
    contactPhone: "+91 98290 41234",
    locality: "वार्ड नंबर 4, कुम्हार मोहल्ला, बुड़ीवाड़ा",
    ward: "वार्ड 4",
    preferredContactMethod: "phone",
    subjectOrProblem: "वार्ड 4 में मुख्य पेयजल लाइन में लीकेज के संबंध में स्थल निरीक्षण",
    consentToContact: true,
    status: "in_progress",
    adminNotes: "नागरिक से दूरभाष पर संवाद हुआ। पीएचईडी लाइनमैन के साथ निरीक्षण प्रस्तावित है।",
    createdAt: "2026-10-10T09:30:00Z",
    isDemo: false,
  },
  {
    requestId: "req-bvd-02",
    relatedFeedbackId: "fb-bvd-05",
    fullName: "श्रीमती गीता देवी",
    contactName: "श्रीमती गीता देवी",
    fatherName: "श्री भंवरलाल जी",
    mobileNumber: "+91 94140 82345",
    contactPhone: "+91 94140 82345",
    locality: "वार्ड 3, स्कूल के पास, बुड़ीवाड़ा",
    ward: "वार्ड 3",
    preferredContactMethod: "in_person",
    subjectOrProblem: "कन्या विद्यालय में स्वच्छ पेयजल फिल्टर लगाने का सुझाव",
    consentToContact: true,
    status: "new",
    adminNotes: "जनसुनवाई दिवस पर प्रत्याशी द्वारा प्रत्यक्ष भेंट निर्धारित की गई है।",
    createdAt: "2026-10-09T10:45:00Z",
    isDemo: false,
  },
  {
    requestId: "req-bvd-03",
    fullName: "सुरेश कुमार शर्मा",
    contactName: "सुरेश कुमार शर्मा",
    fatherName: "श्री रामेश्वर शर्मा",
    mobileNumber: "+91 97850 63421",
    contactPhone: "+91 97850 63421",
    locality: "वार्ड 1, मुख्य बाजार, बुड़ीवाड़ा",
    ward: "वार्ड 1",
    preferredContactMethod: "whatsapp",
    subjectOrProblem: "गाँव के युवाओं के लिए पुस्तकालय और खेल मैदान का प्रस्ताव",
    consentToContact: true,
    status: "contacted",
    adminNotes: "व्हाट्सएप पर प्रस्ताव का विस्तृत प्रारूप प्राप्त हो चुका है।",
    createdAt: "2026-10-13T14:10:00Z",
    isDemo: false,
  },
  {
    requestId: "req-bvd-04",
    fullName: "कैलाश सिंह शेखावत",
    contactName: "कैलाश सिंह शेखावत",
    fatherName: "श्री जुगल सिंह जी",
    mobileNumber: "+91 96020 74512",
    contactPhone: "+91 96020 74512",
    locality: "वार्ड 2, राजपूत मोहल्ला, बुड़ीवाड़ा",
    ward: "वार्ड 2",
    preferredContactMethod: "phone",
    subjectOrProblem: "बस स्टैंड से स्कूल मार्ग की सड़क निर्माण की समय-सीमा बाबत",
    consentToContact: true,
    status: "in_progress",
    adminNotes: "सड़क निर्माण के बजट व तकनीकी स्वीकृति की जानकारी साझा की गई।",
    createdAt: "2026-10-14T11:20:00Z",
    isDemo: false,
  },
];

/**
 * Anonymous opinions - starts EMPTY (0 votes). All votes come from real users via the website.
 * Do NOT pre-seed any vote data here — this must start from zero.
 */
export const realAnonymousOpinions: AnonymousOpinion[] = [];

/**
 * Post-vote voluntary voter details - starts EMPTY. Populated only when real users submit their details.
 * Do NOT pre-seed any voter records here — must start fresh.
 */
export const realPostVoteDetails: PostVoteDetail[] = [];

/**
 * Authentic Election Polls for Gram Panchayat Budivada
 * totalVotes MUST start at 0 — incremented in real-time when users vote.
 */
export const realPolls: PollItem[] = [
  {
    id: "poll-budivada-01",
    titleHi: "क्या आप श्री मोहन सिंह जी के समर्थन पर विचार कर रहे हैं?",
    titleEn: "Are you considering supporting Shri Mohan Singh Ji?",
    descriptionHi: "बुड़ीवाड़ा ग्राम पंचायत चुनाव 2026 के संबंध में जनता की निष्पक्ष राय",
    descriptionEn: "Public feedback regarding Budivada Gram Panchayat Election 2026",
    isActive: true,
    isDefault: true,
    createdAt: "2026-10-01T00:00:00Z",
    totalVotes: 0,
    options: [
      { id: "opt-yes", textHi: "हाँ, समर्थन पर विचार कर रहे हैं", textEn: "Yes, considering support", votesCount: 0 },
      { id: "opt-no", textHi: "नहीं, अन्य विकल्प या विचार नहीं", textEn: "No, other preference / undecided", votesCount: 0 },
    ],
  },
  {
    id: "poll-budivada-02",
    titleHi: "गाँव के विकास में सर्वप्रथम किस कार्य को प्राथमिकता मिलनी चाहिए?",
    titleEn: "Which work should be prioritized first in village development?",
    descriptionHi: "आगामी 5 वर्षों में बुड़ीवाड़ा पंचायत के मुख्य विकास लक्ष्य",
    descriptionEn: "Key development goals for Budivada Panchayat in the upcoming 5 years",
    isActive: false,
    isDefault: false,
    createdAt: "2026-10-10T12:00:00Z",
    totalVotes: 0,
    options: [
      { id: "p2-opt-1", textHi: "पेयजल एवं जल जीवन मिशन नल कनेक्शन", textEn: "Drinking Water & Tap Connections", votesCount: 0 },
      { id: "p2-opt-2", textHi: "पक्की सीसी सड़कें व पक्की नालियां", textEn: "Paved Roads & Drainage", votesCount: 0 },
      { id: "p2-opt-3", textHi: "स्वास्थ्य उप-केंद्र व डॉक्टर की नियमित उपलब्धता", textEn: "Health Center & Doctor Availability", votesCount: 0 },
      { id: "p2-opt-4", textHi: "स्कूल में खेल मैदान एवं डिजिटल कक्षाएं", textEn: "School Playground & Digital Classrooms", votesCount: 0 },
    ],
  },
];

// Aliases for compatibility
export const demoPublicFeedback = realPublicFeedback;
export const demoFollowups = realFollowups;
export const demoAnonymousOpinions = realAnonymousOpinions;
export const demoPostVoteDetails = realPostVoteDetails;
export const demoPolls = realPolls;
