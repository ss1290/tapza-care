import { Doctor, LayoutConfig, Prescription, Theme } from './types';

export const everydayTheme: Theme = {
  primary:'#147D70', secondary:'#DDF2EB', background:'#F5F8F6', surface:'#FFFFFF',
  textPrimary:'#18332F', textSecondary:'#71817D', accent:'#EBA247', hero:'#DDF2EB',
  heroText:'#173D36', heroGradientEnd:'#BCE2D8', soft:'#EDF6F2', border:'#E5ECE9', white:'#FFFFFF',
  success:'#187B55', danger:'#A43A42', art:['#EDF6F2','#FDF1E2','#E9F0F8','#F9E7E7']
};
export const diwaliTheme: Theme = {
  primary:'#9B3B4A', secondary:'#F9E1D4', background:'#FFF8F2', surface:'#FFFFFF',
  textPrimary:'#43252B', textSecondary:'#8C7374', accent:'#E6A83F', hero:'#7D293F',
  heroText:'#FFF7E8', heroGradientEnd:'#A64250', soft:'#FCEFE6', border:'#F0DFD8', white:'#FFFFFF',
  success:'#187B55', danger:'#A43A42', art:['#FCEFE6','#FDF1E2','#E9F0F8','#F9E7E7']
};
const doctors: Doctor[] = [
  {id:'d1',name:'Dr. Ananya Rao',specialty:'General physician',photoUrl:'https://randomuser.me/api/portraits/women/68.jpg',feeInr:500,languages:['English','Telugu']},
  {id:'d2',name:'Dr. Vivek Reddy',specialty:'Cardiologist',photoUrl:'https://randomuser.me/api/portraits/men/32.jpg',feeInr:800,languages:['English','Hindi']},
  {id:'d3',name:'Dr. Meera Iyer',specialty:'Dermatologist',photoUrl:'https://randomuser.me/api/portraits/women/44.jpg',feeInr:650,languages:['English','Tamil']},
  {id:'d4',name:'Dr. Farah Khan',specialty:'Paediatrician',photoUrl:'https://randomuser.me/api/portraits/women/65.jpg',feeInr:600,languages:['English','Hindi','Urdu']},
  {id:'d5',name:'Dr. Arjun Menon',specialty:'Orthopaedic',photoUrl:'https://randomuser.me/api/portraits/men/46.jpg',feeInr:750,languages:['English','Malayalam']},
  {id:'d6',name:'Dr. Kavya Sharma',specialty:'Gynaecologist',photoUrl:'https://randomuser.me/api/portraits/women/26.jpg',feeInr:700,languages:['English','Hindi']}
];
const services = [
  {id:'s1',name:'Full body check',subtitle:'70+ tests - Home collection',priceInr:999,icon:'+',badge:'Popular',imageUrl:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'},
  {id:'s2',name:'Blood tests',subtitle:'Certified labs near you',priceInr:299,icon:'O',imageUrl:'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80'},
  {id:'s3',name:'Video consult',subtitle:'Talk to a doctor today',priceInr:399,icon:'*',imageUrl:'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=600&q=80'},
  {id:'s4',name:'Vaccination',subtitle:'For every age, at home',priceInr:599,icon:'+',imageUrl:'https://images.unsplash.com/photo-1618015358954-3caaccd3c60c?auto=format&fit=crop&w=600&q=80'},
  {id:'s5',name:'Thyroid profile',subtitle:'At-home sample collection',priceInr:449,icon:'O',badge:'Quick test',imageUrl:'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'},
  {id:'s6',name:'Diabetes care',subtitle:'HbA1c and glucose tests',priceInr:549,icon:'O',imageUrl:'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80'},
  {id:'s7',name:'Dental check-up',subtitle:'Consult a nearby dentist',priceInr:350,icon:'*',imageUrl:'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=600&q=80'},
  {id:'s8',name:'Senior wellness',subtitle:'Preventive care for family',priceInr:799,icon:'+',badge:'For family',imageUrl:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'}
];
const tabs = [
  {id:'home' as const,label:'Home',icon:'⌂',screen:'home' as const},
  {id:'bookings' as const,label:'Bookings',icon:'▦',screen:'bookings' as const},
  {id:'prescriptions' as const,label:'Records',icon:'▤',screen:'prescriptions' as const},
  {id:'profile' as const,label:'Profile',icon:'◉',screen:'profile' as const}
];
const homeSections: LayoutConfig['sections'] = [
  {id:'hero',type:'hero_banner',background:{kind:'gradient',value:'hero'},items:[{id:'greeting',title:'Good morning, Shashank'}]},
  {id:'categories',type:'category_chips',title:'What do you need today?',background:{kind:'color',value:'surface'},items:[
    {id:'consult',title:'Consult',icon:'＋'},{id:'lab',title:'Lab tests',icon:'⚗'},
    {id:'pharmacy',title:'Pharmacy',icon:'✚'},{id:'vaccines',title:'Vaccines',icon:'♡'}
  ]},
  {id:'actions',type:'quick_actions',title:'Your care, at a glance',background:{kind:'color',value:'background'},items:[
    {id:'book',title:'Book a visit',icon:'▦'},{id:'prescriptions',title:'Prescriptions',icon:'▤'},
    {id:'reminders',title:'Reminders',icon:'◷'},{id:'family',title:'Family',icon:'♧'}
  ]},
  {id:'offer',type:'offer_strip',background:{kind:'color',value:'secondary'},items:[
    {id:'offer1',title:'A little care goes a long way',subtitle:'Book a routine health check · from ₹499',icon:'✦'}
  ]},
  {id:'services',type:'service_grid',title:'Popular services',background:{kind:'color',value:'surface'},items:services},
  {id:'doctors',type:'doctor_carousel',title:'Doctors near you',background:{kind:'color',value:'background'},items:doctors.map(d=>({
    id:d.id,name:d.name,specialty:d.specialty,photoUrl:d.photoUrl,feeInr:d.feeInr,languages:d.languages,nextSlot:'Today, 4:30 PM'
  }))}
];
export function buildConfig(festival:boolean): LayoutConfig {
  if(!festival) return {version:1,theme:everydayTheme,tabs,sections:homeSections};
  const festSections = [
    {...homeSections[0],items:[{id:'greeting',title:'A brighter, healthier Diwali'}]},
    {id:'diwali-offer',type:'offer_strip',background:{kind:'color' as const,value:'secondary'},items:[
      {id:'fest1',title:'✨ Diwali wellness days',subtitle:'Save on preventive checks · from ₹699',icon:'✦'}
    ]},
    homeSections[1],homeSections[4],homeSections[2],homeSections[5],homeSections[3],
    {id:'future-demo',type:'future_section',background:{kind:'color' as const,value:'surface'},items:[]}
  ];
  return {version:2,theme:diwaliTheme,festival:{name:'Diwali',greeting:'A brighter, healthier Diwali',bannerImageUrl:''},tabs,sections:festSections};
}
export const sampleDoctors = doctors;
export const samplePrescriptions: Prescription[] = [
  {id:'rx-1',issuedAt:'18 Nov 2026',doctorName:'Dr. Ananya Rao',clinicName:'Tapza Care - Banjara Hills',medicines:[
    {id:'m1',name:'Paracetamol 500 mg',dose:'1 tablet after food',days:3,timing:['morning','afternoon','night']},
    {id:'m2',name:'Cetirizine 10 mg',dose:'1 tablet',days:5,timing:['night']},
    {id:'m3',name:'Vitamin C',dose:'1 tablet after breakfast',days:7,timing:['morning']}
  ]},
  {id:'rx-2',issuedAt:'02 Nov 2026',doctorName:'Dr. Vivek Reddy',clinicName:'Tapza Care - Jubilee Hills',medicines:[
    {id:'m4',name:'Vitamin D3 60K',dose:'1 capsule after food',days:4,timing:['afternoon']},
    {id:'m5',name:'Amlodipine 5 mg',dose:'As directed by your doctor',days:30,timing:['morning']}
  ]},
  {id:'rx-3',issuedAt:'24 Oct 2026',doctorName:'Dr. Meera Iyer',clinicName:'Tapza Care - Kondapur',medicines:[
    {id:'m6',name:'Moisturising lotion',dose:'Apply as prescribed',days:14,timing:['morning','night']},
    {id:'m7',name:'Skin care review',dose:'Follow your clinician instructions',days:7,timing:['night']}
  ]},
  {id:'rx-4',issuedAt:'11 Oct 2026',doctorName:'Dr. Farah Khan',clinicName:'Tapza Care - Madhapur',medicines:[
    {id:'m8',name:'Oral rehydration salts',dose:'Use as directed by your clinician',days:2,timing:['morning','afternoon']},
    {id:'m9',name:'Follow-up visit',dose:'Book a review if symptoms continue',days:7,timing:['afternoon']}
  ]}
];
