export type Language = 'en'|'hi'|'te';
export const languages: {id:Language;label:string}[] = [
  {id:'en',label:'English'}, {id:'hi',label:'हिन्दी'}, {id:'te',label:'తెలుగు'}
];

const copy = {
  en: {
    home:'Home', bookings:'Bookings', records:'Records', profile:'Profile',
    heroEyebrow:'CARE THAT COMES HOME', heroSub:'Your family’s health, all in one place.', heroCta:'View health records  →',
    needs:'What do you need today?', care:'Your care, at a glance', services:'Popular services', doctors:'Doctors near you',
    book:'Book a visit', prescriptions:'Prescriptions', reminders:'Reminders', family:'Family',
    bookingsTitle:'Your bookings', bookingsSub:'Upcoming appointments with your care team.', nextVisit:'Your next visit starts here',
    findDoctor:'Find a doctor', recordsTitle:'Health records', recordsSub:'Your prescriptions and daily care plan.',
    noRecords:'No prescriptions yet', noRecordsSub:'Your doctor’s prescriptions will appear here.',
    reminderTitle:'Medicine reminders', reminderSub:'Today’s doses from your active prescriptions.', noDoses:'No doses to remind you about',
    profileTitle:'Your family’s care', language:'Language', chooseLanguage:'Choose the language that feels right.',
    selectDate:'SELECT A DATE', availableTimes:'AVAILABLE TIMES', noSlots:'No appointments available. Choose another day.',
    retry:'Tap to retry', confirm:'Confirm booking', booked:'You’re all booked!', seeBooking:'See booking',
    freeCancel:'Free cancellation up to 2 hours before', taken:'Taken', markTaken:'Mark taken',
    demo:'Demo controls · Change the home experience', morning:'Morning', afternoon:'Afternoon', night:'Night',
    loading:'Getting things ready for you…', errorConfig:'Home layout could not be refreshed.'
  },
  hi: {
    home:'होम', bookings:'बुकिंग', records:'रिकॉर्ड', profile:'प्रोफ़ाइल',
    heroEyebrow:'देखभाल, आपके घर तक', heroSub:'आपके पूरे परिवार की सेहत, एक ही जगह।', heroCta:'स्वास्थ्य रिकॉर्ड देखें  →',
    needs:'आज आपको किस चीज़ की ज़रूरत है?', care:'आपकी देखभाल, एक नज़र में', services:'लोकप्रिय सेवाएँ', doctors:'आपके पास के डॉक्टर',
    book:'अपॉइंटमेंट लें', prescriptions:'प्रिस्क्रिप्शन', reminders:'दवा रिमाइंडर', family:'परिवार',
    bookingsTitle:'आपकी बुकिंग', bookingsSub:'आपकी देखभाल टीम के साथ आने वाले अपॉइंटमेंट।', nextVisit:'आपकी अगली मुलाक़ात यहीं से शुरू होती है',
    findDoctor:'डॉक्टर खोजें', recordsTitle:'स्वास्थ्य रिकॉर्ड', recordsSub:'आपके प्रिस्क्रिप्शन और रोज़ की देखभाल।',
    noRecords:'अभी कोई प्रिस्क्रिप्शन नहीं', noRecordsSub:'डॉक्टर के प्रिस्क्रिप्शन यहाँ दिखेंगे।',
    reminderTitle:'दवा रिमाइंडर', reminderSub:'आपके प्रिस्क्रिप्शन के अनुसार आज की दवाएँ।', noDoses:'आज के लिए कोई दवा नहीं',
    profileTitle:'आपके परिवार की देखभाल', language:'भाषा', chooseLanguage:'वह भाषा चुनें जिसमें बात करना आसान लगे।',
    selectDate:'तारीख चुनें', availableTimes:'उपलब्ध समय', noSlots:'इस दिन समय नहीं है। कोई और दिन चुनें।',
    retry:'फिर से कोशिश करें', confirm:'बुकिंग पक्की करें', booked:'आपकी बुकिंग हो गई!', seeBooking:'बुकिंग देखें',
    freeCancel:'अपॉइंटमेंट से 2 घंटे पहले तक मुफ़्त रद्द करें', taken:'ले ली', markTaken:'दवा ली',
    demo:'डेमो सेटिंग · होम स्क्रीन बदलें', morning:'सुबह', afternoon:'दोपहर', night:'रात',
    loading:'आपके लिए तैयार हो रहा है…', errorConfig:'होम स्क्रीन अभी अपडेट नहीं हो सकी।'
  },
  te: {
    home:'హోమ్', bookings:'బుకింగ్‌లు', records:'రికార్డులు', profile:'ప్రొఫైల్',
    heroEyebrow:'మీ ఇంటి వద్దకే వైద్యం', heroSub:'మీ కుటుంబ ఆరోగ్యం, ఒకేచోట.', heroCta:'ఆరోగ్య రికార్డులు చూడండి  →',
    needs:'ఈరోజు మీకు ఏం కావాలి?', care:'మీ సంరక్షణ, ఒక్క చూపులో', services:'ప్రజాదరణ పొందిన సేవలు', doctors:'మీ దగ్గర వైద్యులు',
    book:'అపాయింట్‌మెంట్ తీసుకోండి', prescriptions:'ప్రిస్క్రిప్షన్‌లు', reminders:'మందుల రిమైండర్‌లు', family:'కుటుంబం',
    bookingsTitle:'మీ బుకింగ్‌లు', bookingsSub:'మీ వైద్య బృందంతో రాబోయే అపాయింట్‌మెంట్‌లు.', nextVisit:'మీ తదుపరి సందర్శన ఇక్కడ మొదలవుతుంది',
    findDoctor:'వైద్యుడిని వెతకండి', recordsTitle:'ఆరోగ్య రికార్డులు', recordsSub:'మీ ప్రిస్క్రిప్షన్‌లు, రోజువారీ సంరక్షణ.',
    noRecords:'ఇంకా ప్రిస్క్రిప్షన్‌లు లేవు', noRecordsSub:'వైద్యుని ప్రిస్క్రిప్షన్‌లు ఇక్కడ కనిపిస్తాయి.',
    reminderTitle:'మందుల రిమైండర్‌లు', reminderSub:'మీ ప్రిస్క్రిప్షన్‌ల ప్రకారం ఈరోజు మందులు.', noDoses:'ఈరోజు మందులు ఏవీ లేవు',
    profileTitle:'మీ కుటుంబ సంరక్షణ', language:'భాష', chooseLanguage:'మీకు సౌకర్యంగా అనిపించే భాషను ఎంచుకోండి.',
    selectDate:'తేదీని ఎంచుకోండి', availableTimes:'అందుబాటులో ఉన్న సమయాలు', noSlots:'ఈ రోజున సమయాలు లేవు. మరో రోజును ఎంచుకోండి.',
    retry:'మళ్లీ ప్రయత్నించండి', confirm:'బుకింగ్‌ను నిర్ధారించండి', booked:'మీ బుకింగ్ పూర్తైంది!', seeBooking:'బుకింగ్ చూడండి',
    freeCancel:'2 గంటల ముందు వరకు ఉచితంగా రద్దు చేయవచ్చు', taken:'తీసుకున్నాను', markTaken:'తీసుకున్నట్టు గుర్తించండి',
    demo:'డెమో నియంత్రణలు · హోమ్ అనుభవాన్ని మార్చండి', morning:'ఉదయం', afternoon:'మధ్యాహ్నం', night:'రాత్రి',
    loading:'మీ కోసం సిద్ధం చేస్తున్నాం…', errorConfig:'హోమ్ స్క్రీన్‌ను ఇప్పుడే అప్‌డేట్ చేయలేకపోయాం.'
  }
} satisfies Record<Language,Record<string,string>>;

export type CopyKey = keyof typeof copy.en;
export const t = (language:Language,key:CopyKey):string => copy[language][key];

const content: Record<Language,Record<string,string>> = {
  en:{'Consult':'Consult','Lab tests':'Lab tests','Pharmacy':'Pharmacy','Vaccines':'Vaccines','Book a visit':'Book a visit','Prescriptions':'Prescriptions','Reminders':'Reminders','Family':'Family','Good morning, Shashank':'Good morning, Shashank','A brighter, healthier Diwali':'A brighter, healthier Diwali','Full body check':'Full body check','70+ tests · Home collection':'70+ tests · Home collection','Blood tests':'Blood tests','Certified labs near you':'Certified labs near you','Video consult':'Video consult','Talk to a doctor today':'Talk to a doctor today','Vaccination':'Vaccination','For every age, at home':'For every age, at home'},
  hi:{'Consult':'डॉक्टर से मिलें','Lab tests':'लैब जाँच','Pharmacy':'दवाइयाँ','Vaccines':'टीके','Book a visit':'अपॉइंटमेंट लें','Prescriptions':'प्रिस्क्रिप्शन','Reminders':'दवा रिमाइंडर','Family':'परिवार','Good morning, Shashank':'शुभ प्रभात, शशांक','A brighter, healthier Diwali':'रोशन और सेहतमंद दिवाली','Full body check':'पूरे शरीर की जाँच','70+ tests · Home collection':'70+ जाँच · घर से सैंपल','Blood tests':'खून की जाँच','Certified labs near you':'पास की प्रमाणित लैब','Video consult':'वीडियो परामर्श','Talk to a doctor today':'आज ही डॉक्टर से बात करें','Vaccination':'टीकाकरण','For every age, at home':'हर उम्र के लिए, घर पर'},
  te:{'Consult':'వైద్య సంప్రదింపు','Lab tests':'ల్యాబ్ పరీక్షలు','Pharmacy':'మందులు','Vaccines':'టీకాలు','Book a visit':'అపాయింట్‌మెంట్','Prescriptions':'ప్రిస్క్రిప్షన్‌లు','Reminders':'మందుల రిమైండర్‌లు','Family':'కుటుంబం','Good morning, Shashank':'శుభోదయం, శశాంక్','A brighter, healthier Diwali':'ఆరోగ్యకరమైన దీపావళి','Full body check':'పూర్తి ఆరోగ్య పరీక్ష','70+ tests · Home collection':'70+ పరీక్షలు · ఇంటి వద్ద నమూనా','Blood tests':'రక్త పరీక్షలు','Certified labs near you':'మీ దగ్గర గుర్తింపు పొందిన ల్యాబ్‌లు','Video consult':'వీడియో సంప్రదింపు','Talk to a doctor today':'ఈరోజే వైద్యునితో మాట్లాడండి','Vaccination':'టీకాలు','For every age, at home':'అన్ని వయసుల వారికి, ఇంటి వద్ద'}
};
export const localizeContent = (language:Language,value:string):string => content[language][value]??value;
