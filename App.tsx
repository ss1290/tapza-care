import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator, Animated, Modal, PanResponder, Pressable, SafeAreaView, ScrollView,
  StatusBar, StyleSheet, Switch, Text, View, ViewToken
} from 'react-native';
import { buildConfig } from './src/config';
import { mockApi, MockSettings, FailureTarget } from './src/mockApi';
import SectionRenderer from './src/SectionRenderer';
import { Booking, Doctor, LayoutConfig, Page, Prescription, Section, Slot, Theme } from './src/types';
import { addOptimisticBooking, reconcileBooking, rollbackBooking } from './src/bookingState';
import { Language, languages, t } from './src/i18n';

const initialSettings:MockSettings={latencyMs:250,failureTarget:'none',emptyPrescriptions:false};
const dates=['Today','Tomorrow','Wed','Thu','Fri','Sat','Sun'];
const timeLabel=(date:Date)=>date.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});

export default function App() {
  const [config,setConfig]=useState<LayoutConfig>(mockApi.getLastGoodConfig());
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [configError,setConfigError]=useState('');
  const [settings,setSettings]=useState<MockSettings>(initialSettings);
  const [page,setPage]=useState<Page>('home');
  const [language,setLanguage]=useState<Language>('en');
  const [admin,setAdmin]=useState(false);
  const [doctors,setDoctors]=useState<Doctor[]>([]);
  const [doctorError,setDoctorError]=useState('');
  const [bookings,setBookings]=useState<Booking[]>([]);
  const [doctor,setDoctor]=useState<Doctor|null>(null);
  const [selectedDay,setSelectedDay]=useState(0);
  const [slots,setSlots]=useState<Slot[]>([]);
  const [slot,setSlot]=useState<Slot|null>(null);
  const [slotsLoading,setSlotsLoading]=useState(false);
  const [slotsError,setSlotsError]=useState('');
  const [slotRetry,setSlotRetry]=useState(0);
  const [bookingBusy,setBookingBusy]=useState(false);
  const [bookingError,setBookingError]=useState('');
  const [success,setSuccess]=useState(false);
  const [prescriptions,setPrescriptions]=useState<Prescription[]>([]);
  const [rxLoading,setRxLoading]=useState(false);
  const [rxError,setRxError]=useState('');
  const [rxLoaded,setRxLoaded]=useState(false);
  const [openRx,setOpenRx]=useState<string|null>(null);
  const [taken,setTaken]=useState<Record<string,boolean>>({});
  const scrollY=useRef(new Animated.Value(0)).current;
  const successScale=useRef(new Animated.Value(0.55)).current;
  const visibleSections=useRef(new Set<string>());
  const [visibilityTick,forceRender]=useState(0);
  const theme=config.theme;
  const s=useMemo(()=>makeStyles(theme),[theme]);
  const sheetPan=useRef(PanResponder.create({
    onMoveShouldSetPanResponder:(_,gesture)=>gesture.dy>8,
    onPanResponderRelease:(_,gesture)=>{if(gesture.dy>80)setDoctor(null);}
  })).current;

  const loadConfig=useCallback(async(festival:boolean,showRefreshIndicator=true)=>{
    setLoading(true);setRefreshing(showRefreshIndicator);setConfigError('');
    try{const fresh=await mockApi.getConfig(festival,settings);setConfig(fresh);}
    catch(e){setConfigError(e instanceof Error?e.message:'Could not refresh home.');}
    finally{setLoading(false);setRefreshing(false);}
  },[settings]);
  useEffect(()=>{void loadConfig(false,false);},[]);
  const loadDoctors=useCallback(async()=>{
    setDoctorError('');
    try{setDoctors(await mockApi.getDoctors(settings));}
    catch(e){setDoctorError(e instanceof Error?e.message:'Doctors could not be loaded.');}
  },[settings]);
  useEffect(()=>{void loadDoctors();},[]);
  const loadPrescriptions=useCallback(async()=>{
    setRxLoading(true);setRxError('');
    try{setPrescriptions(await mockApi.getPrescriptions(settings));setRxLoaded(true);}
    catch(e){setRxError(e instanceof Error?e.message:'Records could not be loaded.');}
    finally{setRxLoading(false);}
  },[settings]);
  useEffect(()=>{if(page==='prescriptions'&&!rxLoaded)void loadPrescriptions();},[page,rxLoaded,loadPrescriptions]);
  useEffect(()=>{
    if(!doctor)return;
    let active=true;
    setSlotsLoading(true);setSlotsError('');setSlot(null);
    const date=new Date();date.setDate(date.getDate()+selectedDay);
    void mockApi.getSlots(doctor.id,date,settings).then(result=>{if(active)setSlots(result);})
      .catch(e=>{if(active)setSlotsError(e instanceof Error?e.message:'Times could not be loaded.');})
      .finally(()=>{if(active)setSlotsLoading(false);});
    return()=>{active=false;};
  },[doctor,selectedDay,slotRetry,settings]);

  const openBooking=useCallback((candidate:{id:string;name:string;specialty:string;feeInr:number})=>{
    setDoctor({id:candidate.id,name:candidate.name,specialty:candidate.specialty,feeInr:candidate.feeInr,photoUrl:'',languages:['English']});
    setSelectedDay(0);setSuccess(false);successScale.setValue(0.55);setBookingError('');
  },[]);
  const confirmBooking=async()=>{
    if(!doctor||!slot)return;
    setBookingBusy(true);setBookingError('');
    const selected=slot;
    const date=new Date();date.setDate(date.getDate()+selectedDay);
    const dateText=timeLabel(date);
    const temporaryId='pending-'+Date.now();
    const optimistic:Booking={id:temporaryId,doctorId:doctor.id,doctorName:doctor.name,specialty:doctor.specialty,slotId:selected.id,date:dateText,time:selected.startsAt,feeInr:doctor.feeInr,status:'confirmed'};
    setBookings(current=>addOptimisticBooking(current,optimistic));
    setSlots(current=>current.map(item=>item.id===selected.id?{...item,available:false}:item));
    try{
      const confirmed=await mockApi.postBooking(doctor,selected,dateText,settings);
      setBookings(current=>reconcileBooking(current,temporaryId,confirmed));
      setSuccess(true);
      Animated.spring(successScale,{toValue:1,useNativeDriver:true}).start();
    }catch(e){
      setBookings(current=>rollbackBooking(current,temporaryId));
      setSlots(current=>current.map(item=>item.id===selected.id?{...item,available:true}:item));
      setBookingError(e instanceof Error?e.message:'Booking failed. Choose another time.');
    }finally{setBookingBusy(false);}
  };

  const onViewableItemsChanged=useRef(({viewableItems}:{viewableItems:Array<ViewToken>} )=>{
    let changed=false;
    viewableItems.forEach(token=>{const item=token.item as Section;if(item?.id&&!visibleSections.current.has(item.id)){visibleSections.current.add(item.id);changed=true;}});
    if(changed)forceRender(value=>value+1);
  }).current;
  const viewabilityConfig=useRef({itemVisiblePercentThreshold:10}).current;
  const renderSection=useCallback(({item}:{item:Section})=><SectionRenderer
    section={item} theme={theme} styles={s} scrollY={scrollY} language={language}
    visible={visibleSections.current.has(item.id)}
    onNavigate={next=>setPage(next)} onBook={openBooking}
  />, [theme,s,scrollY,openBooking]);

  const chooseFailure=(value:FailureTarget)=>setSettings(current=>({...current,failureTarget:value}));
  const setTab=(next:Page)=>{setPage(next);scrollY.setValue(0);};
  const renderDose=(rx:Prescription)=>{
    return <View key={rx.id} style={s.rxCard}>
      <Pressable accessibilityRole="button" accessibilityState={{expanded:openRx===rx.id}} style={s.rxHead} onPress={()=>setOpenRx(openRx===rx.id?null:rx.id)}>
        <View style={s.rxIcon}><Text style={[s.primary,{fontSize:21}]}>▤</Text></View>
        <View style={{flex:1}}><Text style={s.cardTitle}>{rx.doctorName}</Text><Text style={s.mutedSmall}>{rx.clinicName} · {rx.issuedAt}</Text></View>
        <Text style={s.primary}>{openRx===rx.id?'⌃':'⌄'}</Text>
      </Pressable>
      {openRx===rx.id&&rx.medicines.map(medicine=><View key={medicine.id} style={s.medicine}>
        <View style={{flex:1}}><Text style={s.cardTitle}>{medicine.name}</Text><Text style={s.mutedSmall}>{medicine.dose} · {medicine.days} days</Text>
          <View style={s.timingRow}>{medicine.timing.map(time=><Text key={time} style={[s.timingPill,{backgroundColor:theme.background,color:theme.textSecondary}]}>{time==='morning'?'☀ ':time==='afternoon'?'◉ ':'☾ '}{t(language,time)}</Text>)}</View>
        </View>
        <Pressable accessibilityRole="checkbox" accessibilityState={{checked:!!taken[medicine.id]}} onPress={()=>setTaken(current=>({...current,[medicine.id]:!current[medicine.id]}))} style={[s.doseButton,{backgroundColor:taken[medicine.id]?theme.primary:theme.surface}]}>
          <Text style={{color:taken[medicine.id]?theme.white:theme.primary,fontWeight:'700',fontSize:10}}>{taken[medicine.id]?'✓ '+t(language,'taken'):t(language,'markTaken')}</Text>
        </Pressable>
      </View>)}
    </View>;
  };

  const todayMedicines=prescriptions.flatMap(rx=>rx.medicines.map(medicine=>({medicine,doctorName:rx.doctorName})));
  return <SafeAreaView style={[s.safe,{backgroundColor:theme.background}]}>
    <StatusBar barStyle={config.festival?'light-content':'dark-content'} backgroundColor={theme.background}/>
    <Animated.View style={[s.topBar,{height:scrollY.interpolate({inputRange:[0,80],outputRange:[66,52],extrapolate:'clamp'}),backgroundColor:theme.background}]}>
      <Pressable accessibilityRole="button" onPress={()=>setTab('home')}><Text style={[s.brand,{color:theme.primary}]}>✚  tapza<Text style={{color:theme.textPrimary}}> care</Text></Text></Pressable>
      <Pressable accessibilityRole="button" onPress={()=>setAdmin(true)} style={[s.locationChip,{backgroundColor:theme.surface,borderColor:theme.border}]}>
        <Text style={{color:theme.textPrimary,fontSize:12}}>⌖  Hyderabad⌄</Text>
      </Pressable>
    </Animated.View>
    {configError?<Pressable accessibilityRole="button" onPress={()=>void loadConfig(!!config.festival)} style={[s.errorBanner,{backgroundColor:theme.soft}]}><Text style={{color:theme.danger}}>{configError}  ·  Tap to retry</Text></Pressable>:null}
    {refreshing&&page==='home'?<View style={s.refreshState}><ActivityIndicator size='small' color={theme.primary}/></View>:null}
    {page==='home'?<View style={{flex:1}}>
      {loading&&config.sections.length===0?<Skeleton styles={s}/>:null}
      <Animated.FlatList
        data={config.sections} extraData={visibilityTick} keyExtractor={item=>item.id} renderItem={renderSection}
        contentContainerStyle={{paddingBottom:96}} showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollY}}}],{useNativeDriver:false})} scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={viewabilityConfig}
        ListFooterComponent={<Pressable style={[s.demoLink,{backgroundColor:theme.soft}]} onPress={()=>setAdmin(true)}><Text style={{color:theme.primary,fontWeight:'700'}}>✦  {t(language,'demo')}</Text></Pressable>}
      />
    </View>:page==='bookings'?<ScrollView contentContainerStyle={s.page}>
      <Text style={s.pageTitle}>{t(language,'bookingsTitle')}</Text><Text style={s.bodyMuted}>{t(language,'bookingsSub')}</Text>
      {doctorError?<Pressable onPress={()=>void loadDoctors()} style={s.emptyCard}><Text style={s.cardTitle}>Doctors could not load</Text><Text style={{color:theme.primary}}>Tap to retry</Text></Pressable>:null}
      {bookings.length===0?<View style={s.emptyCard}><Text style={s.emptyIcon}>▦</Text><Text style={s.heading}>{t(language,'nextVisit')}</Text><Text style={s.bodyMuted}>Find a doctor who understands you and book a time that works.</Text><Pressable style={[s.primaryButton,{backgroundColor:theme.primary}]} onPress={()=>setTab('home')}><Text style={{color:theme.white,fontWeight:'800'}}>{t(language,'findDoctor')}</Text></Pressable></View>:bookings.map(booking=><View key={booking.id} style={s.bookingCard}><Text style={s.cardTitle}>{booking.doctorName}</Text><Text style={s.mutedSmall}>{booking.specialty}</Text><Text style={[s.nextSlot,{backgroundColor:theme.soft,color:theme.primary}]}>◷  {booking.date} · {booking.time}</Text><Text style={s.price}>₹{booking.feeInr} · Confirmed</Text></View>)}
    </ScrollView>:page==='prescriptions'?<ScrollView contentContainerStyle={s.page}>
      <View style={s.titleRow}><Text style={s.pageTitle}>{t(language,'recordsTitle')}</Text><Pressable accessibilityRole="button" accessibilityLabel={t(language,'retry')} onPress={()=>void loadPrescriptions()}><Text style={{color:theme.primary,fontSize:20}}>↻</Text></Pressable></View>
      <Text style={s.bodyMuted}>{t(language,'recordsSub')}</Text>
      {rxLoading?<View style={s.stateBox}><ActivityIndicator color={theme.primary}/><Text style={s.bodyMuted}>{t(language,'loading')}</Text></View>:rxError?<Pressable onPress={()=>void loadPrescriptions()} style={s.emptyCard}><Text style={s.heading}>Couldn’t load records</Text><Text style={{color:theme.primary,marginTop:8}}>{t(language,'retry')}</Text></Pressable>:prescriptions.length===0?<View style={s.emptyCard}><Text style={s.emptyIcon}>▤</Text><Text style={s.heading}>{t(language,'noRecords')}</Text><Text style={s.bodyMuted}>{t(language,'noRecordsSub')}</Text></View>:prescriptions.map(renderDose)}
    </ScrollView>:page==='reminders'?<ScrollView contentContainerStyle={s.page}>
      <Text style={s.pageTitle}>{t(language,'reminderTitle')}</Text><Text style={s.bodyMuted}>{t(language,'reminderSub')}</Text>
      {rxLoading?<View style={s.stateBox}><ActivityIndicator color={theme.primary}/><Text style={s.bodyMuted}>{t(language,'loading')}</Text></View>:rxError?<Pressable onPress={()=>void loadPrescriptions()} style={s.emptyCard}><Text style={s.heading}>Reminders could not load</Text><Text style={{color:theme.primary}}>{t(language,'retry')}</Text></Pressable>:todayMedicines.length===0?<View style={s.emptyCard}><Text style={s.heading}>{t(language,'noDoses')}</Text></View>:todayMedicines.map(({medicine,doctorName})=><View key={medicine.id} style={s.reminderCard}><View style={{flex:1}}><Text style={s.cardTitle}>{medicine.name}</Text><Text style={s.mutedSmall}>{medicine.dose} · {doctorName}</Text><Text style={[s.timingPill,{backgroundColor:theme.background,color:theme.textSecondary,alignSelf:'flex-start',marginTop:8}]}>{medicine.timing.map(time=>t(language,time)).join(' · ')}</Text></View><Pressable accessibilityRole="checkbox" accessibilityState={{checked:!!taken[medicine.id]}} onPress={()=>setTaken(current=>({...current,[medicine.id]:!current[medicine.id]}))} style={[s.doseButton,{backgroundColor:taken[medicine.id]?theme.primary:theme.surface}]}><Text style={{color:taken[medicine.id]?theme.white:theme.primary,fontWeight:'700'}}>{taken[medicine.id]?'✓ '+t(language,'taken'):t(language,'markTaken')}</Text></Pressable></View>)}
    </ScrollView>:<ScrollView contentContainerStyle={s.page}>
      <Text style={s.pageTitle}>{t(language,'profileTitle')}</Text><View style={s.profileCard}><Text style={[s.profileAvatar,{backgroundColor:theme.secondary,color:theme.primary}]}>S</Text><Text style={s.heading}>Shashank</Text><Text style={s.bodyMuted}>Patient · Hyderabad</Text></View>
      <Text style={s.heading}>{t(language,'language')}</Text><Text style={[s.bodyMuted,{marginTop:5,marginBottom:10}]}>{t(language,'chooseLanguage')}</Text>
      <View style={{flexDirection:'row',gap:9,marginBottom:18}}>{languages.map(option=><Pressable key={option.id} accessibilityRole="radio" accessibilityState={{selected:language===option.id}} onPress={()=>setLanguage(option.id)} style={{minHeight:46,flex:1,alignItems:'center',justifyContent:'center',borderWidth:1,borderRadius:12,borderColor:language===option.id?theme.primary:theme.border,backgroundColor:language===option.id?theme.secondary:theme.surface}}><Text style={{fontWeight:'700',color:language===option.id?theme.primary:theme.textPrimary}}>{option.label}</Text></Pressable>)}</View>
      <Pressable style={s.profileRow} onPress={()=>setPage('prescriptions')}><Text style={s.cardTitle}>Prescriptions & reminders</Text><Text style={{color:theme.primary}}>›</Text></Pressable><Pressable style={s.profileRow} onPress={()=>setAdmin(true)}><Text style={s.cardTitle}>Demo settings</Text><Text style={{color:theme.primary}}>›</Text></Pressable>
    </ScrollView>}
    <View style={[s.tabBar,{backgroundColor:theme.surface,borderColor:theme.border}]}>
      {config.tabs.map(tab=><Pressable accessibilityRole="tab" accessibilityState={{selected:page===tab.screen}} key={tab.id} style={s.tab} onPress={()=>setTab(tab.screen)}>
        <Text style={[s.tabIcon,{color:page===tab.screen?theme.primary:theme.textSecondary}]}>{tab.icon}</Text>
        <Text style={[s.tabLabel,{color:page===tab.screen?theme.primary:theme.textSecondary}]}>{t(language,tab.id==='prescriptions'?'records':tab.id)}</Text>
      </Pressable>)}
    </View>

    <Modal transparent animationType="slide" visible={!!doctor} onRequestClose={()=>setDoctor(null)}>
      <View style={s.shade}><Pressable style={{flex:1}} onPress={()=>setDoctor(null)}/><View style={[s.sheet,{backgroundColor:theme.surface}]}>
        <View {...sheetPan.panHandlers} style={[s.grabber,{backgroundColor:theme.border}]}/><View style={s.titleRow}><View><Text style={s.pageTitle}>{t(language,'book')}</Text><Text style={s.bodyMuted}>{doctor?.name} · ₹{doctor?.feeInr}</Text></View><Pressable accessibilityRole="button" style={s.closeButton} onPress={()=>setDoctor(null)}><Text style={s.close}>×</Text></Pressable></View>
        {success?<View style={s.success}><Animated.Text style={[s.successMark,{backgroundColor:theme.secondary,color:theme.success,transform:[{scale:successScale}]}]}>✓</Animated.Text><Text style={s.pageTitle}>{t(language,'booked')}</Text><Text style={s.bodyMuted}>{doctor?.name} · {bookings[0]?.date} at {bookings[0]?.time}</Text><Pressable style={[s.primaryButton,{backgroundColor:theme.primary}]} onPress={()=>{setDoctor(null);setTab('bookings')}}><Text style={{color:theme.white,fontWeight:'800'}}>{t(language,'seeBooking')}</Text></Pressable></View>:<>
          <Text style={s.label}>{t(language,'selectDate')}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontal}>{dates.map((label,index)=>{const date=new Date();date.setDate(date.getDate()+index);return <Pressable accessibilityRole="button" accessibilityState={{selected:selectedDay===index}} key={label} onPress={()=>setSelectedDay(index)} style={[s.dateChip,{backgroundColor:index===selectedDay?theme.primary:theme.background,borderColor:index===selectedDay?theme.primary:theme.border}]}><Text style={{fontSize:10,color:index===selectedDay?theme.white:theme.textSecondary}}>{label}</Text><Text style={{fontSize:18,fontWeight:'800',color:index===selectedDay?theme.white:theme.textPrimary}}>{date.getDate()}</Text></Pressable>;})}</ScrollView>
          <Text style={s.label}>{t(language,'availableTimes')}</Text>
          {slotsLoading?<View style={s.stateBox}><ActivityIndicator color={theme.primary}/></View>:slotsError?<Pressable accessibilityRole="button" onPress={()=>setSlotRetry(value=>value+1)} style={s.stateBox}><Text style={{color:theme.danger}}>{slotsError}</Text><Text style={{color:theme.primary,fontWeight:'700',marginTop:8}}>{t(language,'retry')}</Text></Pressable>:slots.filter(item=>item.available).length===0?<View style={s.stateBox}><Text style={s.bodyMuted}>{t(language,'noSlots')}</Text></View>:<View style={s.slotGrid}>{slots.filter(item=>item.available).map(item=><Pressable accessibilityRole="button" accessibilityState={{selected:slot?.id===item.id}} key={item.id} onPress={()=>setSlot(item)} style={[s.slotChip,{borderColor:slot?.id===item.id?theme.primary:theme.border,backgroundColor:slot?.id===item.id?theme.soft:theme.surface}]}><Text style={s.cardTitle}>{item.startsAt}</Text></Pressable>)}</View>}
          {bookingError?<Text style={{color:theme.danger,marginTop:8}}>{bookingError}</Text>:null}
          <View style={s.sheetBottom}><Text style={s.mutedSmall}>{t(language,'freeCancel')}</Text><Pressable accessibilityRole="button" disabled={!slot||bookingBusy} onPress={()=>void confirmBooking()} style={[s.primaryButton,{backgroundColor:theme.primary,opacity:(!slot||bookingBusy)?0.5:1}]}>{bookingBusy?<ActivityIndicator color={theme.white}/>:<Text style={{color:theme.white,fontWeight:'800'}}>{t(language,'confirm')}  ·  ₹{doctor?.feeInr}</Text>}</Pressable></View>
        </>}
      </View></View>
    </Modal>

    <Modal transparent animationType="fade" visible={admin} onRequestClose={()=>setAdmin(false)}>
      <View style={s.shade}><Pressable style={{flex:1}} onPress={()=>setAdmin(false)}/><ScrollView style={[s.adminSheet,{backgroundColor:theme.surface}]} contentContainerStyle={{paddingBottom:25}}>
        <View style={s.titleRow}><Text style={s.pageTitle}>Home preview</Text><Pressable style={s.closeButton} onPress={()=>setAdmin(false)}><Text style={s.close}>×</Text></Pressable></View>
        <Text style={s.bodyMuted}>Switch the remote layout and mock network conditions.</Text><Text style={s.label}>REMOTE CONFIG</Text>
        {['Everyday','Diwali'].map((label,index)=><Pressable key={label} onPress={()=>void loadConfig(index===1)} style={[s.configButton,{borderColor:(!!config.festival)===(index===1)?theme.primary:theme.border,backgroundColor:theme.background}]}><Text style={s.cardTitle}>{index?'✨  Diwali celebration':'☀  Everyday care'}</Text></Pressable>)}
        <View style={s.settingRow}><View style={{flex:1}}><Text style={s.cardTitle}>Slow network</Text><Text style={s.mutedSmall}>Delay endpoint responses by 2 seconds</Text></View><Switch value={settings.latencyMs>500} onValueChange={value=>setSettings(current=>({...current,latencyMs:value?2000:250}))} trackColor={{true:theme.primary}}/></View>
        <Text style={s.label}>FORCE AN ENDPOINT FAILURE</Text>
        {(['none','config','slots','booking','prescriptions'] as FailureTarget[]).map(target=><Pressable key={target} accessibilityRole="radio" accessibilityState={{selected:settings.failureTarget===target}} onPress={()=>chooseFailure(target)} style={[s.failureOption,{borderColor:settings.failureTarget===target?theme.primary:theme.border}]}><Text style={{color:theme.textPrimary}}>{settings.failureTarget===target?'◉':'○'}  {target==='none'?'No failure':target==='config'?'Home config':target==='slots'?'Appointment slots':target==='booking'?'Booking confirmation':'Prescriptions and reminders'}</Text></Pressable>)}
        <View style={s.settingRow}><View style={{flex:1}}><Text style={s.cardTitle}>Empty prescriptions</Text><Text style={s.mutedSmall}>Preview the designed empty state</Text></View><Switch value={settings.emptyPrescriptions} onValueChange={value=>{setSettings(current=>({...current,emptyPrescriptions:value}));setRxLoaded(false);}} trackColor={{true:theme.primary}}/></View>
        <Pressable onPress={()=>void loadConfig(!!config.festival)} style={s.refresh}><Text style={{color:theme.primary,fontWeight:'800'}}>↻  Refresh current config</Text></Pressable>
        <Text style={s.mutedSmall}>Unknown section types are ignored. The last good home config remains available if refresh fails.</Text>
      </ScrollView></View>
    </Modal>
  </SafeAreaView>;
}

function Skeleton({styles:s}:{styles:ReturnType<typeof makeStyles>}) {
  return <View style={s.skeleton}><View style={s.skeletonHero}/><View style={s.skeletonLine}/><View style={s.skeletonCards}><View style={s.skeletonCard}/><View style={s.skeletonCard}/></View></View>;
}
function makeStyles(t:Theme) { return StyleSheet.create({
  safe:{flex:1},topBar:{paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between',zIndex:2},
  brand:{fontSize:20,fontWeight:'900'},locationChip:{minHeight:44,borderWidth:1,borderRadius:22,paddingHorizontal:12,justifyContent:'center'},errorBanner:{padding:10,alignItems:'center'},refreshState:{height:38,alignItems:'center',justifyContent:'center'},
  hero:{paddingHorizontal:20,paddingTop:20,paddingBottom:24,minHeight:250,overflow:'hidden'},heroOrb:{position:'absolute',right:-35,top:40,width:200,height:200,borderRadius:100,backgroundColor:'rgba(255,255,255,0.18)'},
  heroLocation:{fontSize:12,fontWeight:'700',marginBottom:22},heroEyebrow:{fontSize:10,fontWeight:'800',letterSpacing:1.3,opacity:.7},heroTitle:{fontSize:27,lineHeight:34,fontWeight:'900',marginTop:7,maxWidth:320},heroSubtitle:{fontSize:15,marginTop:5,opacity:.85},
  heroButton:{minHeight:44,justifyContent:'center',alignSelf:'flex-start',backgroundColor:t.white,paddingHorizontal:14,borderRadius:24,marginTop:18},heroButtonText:{fontSize:12,color:t.textPrimary,fontWeight:'700'},
  band:{paddingHorizontal:20,paddingTop:21,paddingBottom:17},horizontal:{gap:10,paddingTop:14,paddingBottom:3},heading:{fontSize:19,color:t.textPrimary,fontWeight:'800'},
  chip:{minHeight:44,flexDirection:'row',alignItems:'center',borderRadius:25,borderWidth:1,borderColor:t.border,paddingHorizontal:14,backgroundColor:t.background},primary:{color:t.primary,fontWeight:'800'},body:{color:t.textPrimary,fontSize:13,fontWeight:'600'},
  actions:{flexDirection:'row',justifyContent:'space-between',marginTop:16},action:{width:'23%',alignItems:'center',minHeight:72},actionIcon:{width:54,height:54,borderRadius:18,textAlign:'center',textAlignVertical:'center',overflow:'hidden',fontSize:24,paddingTop:12},actionLabel:{fontSize:10,color:t.textPrimary,marginTop:7,textAlign:'center',fontWeight:'600'},
  offer:{flexDirection:'row',alignItems:'center',marginHorizontal:14,marginVertical:5,padding:15,borderRadius:15,gap:12},offerIcon:{fontSize:24},offerTitle:{color:t.textPrimary,fontWeight:'800',fontSize:13},mutedSmall:{color:t.textSecondary,fontSize:10,marginTop:4},offerArrow:{fontSize:25},
  grid:{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',marginTop:14},service:{width:'48.3%',backgroundColor:t.surface,borderRadius:15,padding:9,borderColor:t.border,borderWidth:1,marginBottom:10,minHeight:190},serviceArt:{height:82,borderRadius:11,alignItems:'center',justifyContent:'center',marginBottom:9,overflow:'hidden'},servicePhoto:{position:'absolute',left:0,top:0,right:0,bottom:0,opacity:.82},serviceIcon:{fontSize:33,color:t.white,textShadowColor:'rgba(0,0,0,.45)',textShadowRadius:5},badge:{position:'absolute',top:6,left:6,fontSize:9,fontWeight:'800',backgroundColor:t.white,paddingHorizontal:7,paddingVertical:4,borderRadius:8},cardTitle:{fontSize:13,color:t.textPrimary,fontWeight:'800'},price:{fontSize:14,color:t.textPrimary,fontWeight:'800',marginTop:7},
  doctorCard:{width:275,backgroundColor:t.surface,borderColor:t.border,borderWidth:1,borderRadius:15,padding:14},doctorHead:{flexDirection:'row',alignItems:'center',gap:10},doctorAvatar:{width:44,height:44,borderRadius:22,textAlign:'center',textAlignVertical:'center',fontWeight:'900'},doctorPhoto:{width:44,height:44,borderRadius:22},nextSlot:{padding:9,borderRadius:9,marginTop:13,fontSize:11,fontWeight:'700'},doctorFoot:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:7},bookButton:{minHeight:44,justifyContent:'center',paddingHorizontal:18,borderRadius:9},bookButtonText:{color:t.white,fontWeight:'800'},
  demoLink:{margin:18,padding:14,borderRadius:12,alignItems:'center'},skeleton:{padding:20},skeletonHero:{height:220,backgroundColor:t.secondary,borderRadius:18},skeletonLine:{height:18,width:'65%',backgroundColor:t.border,borderRadius:8,marginTop:25},skeletonCards:{flexDirection:'row',gap:12,marginTop:16},skeletonCard:{width:'48%',height:140,backgroundColor:t.border,borderRadius:14},
  page:{padding:20,paddingBottom:110},pageTitle:{fontSize:26,fontWeight:'900',color:t.textPrimary},bodyMuted:{color:t.textSecondary,fontSize:14,lineHeight:21},titleRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},emptyCard:{marginTop:25,backgroundColor:t.surface,borderRadius:18,padding:22,alignItems:'center',borderWidth:1,borderColor:t.border},emptyIcon:{fontSize:36,color:t.primary,marginBottom:12},primaryButton:{minHeight:48,alignItems:'center',justifyContent:'center',borderRadius:13,paddingHorizontal:18,marginTop:17},
  bookingCard:{backgroundColor:t.surface,borderRadius:15,borderWidth:1,borderColor:t.border,padding:15,marginTop:14},stateBox:{minHeight:90,alignItems:'center',justifyContent:'center',padding:15,gap:8},rxCard:{backgroundColor:t.surface,borderRadius:15,borderWidth:1,borderColor:t.border,marginTop:14,overflow:'hidden'},rxHead:{minHeight:68,flexDirection:'row',alignItems:'center',padding:13,gap:11},rxIcon:{width:42,height:42,borderRadius:13,backgroundColor:t.soft,alignItems:'center',justifyContent:'center'},medicine:{flexDirection:'row',alignItems:'center',gap:8,padding:14,borderTopWidth:1,borderColor:t.border},timingRow:{flexDirection:'row',flexWrap:'wrap',gap:5,marginTop:8},timingPill:{fontSize:9,paddingHorizontal:8,paddingVertical:5,borderRadius:8,overflow:'hidden'},doseButton:{minHeight:42,justifyContent:'center',borderWidth:1,borderColor:t.primary,paddingHorizontal:9,borderRadius:9},
  reminderCard:{backgroundColor:t.surface,borderRadius:15,borderWidth:1,borderColor:t.border,padding:14,marginTop:12,flexDirection:'row',alignItems:'center',gap:10},profileCard:{alignItems:'center',padding:24,backgroundColor:t.surface,borderRadius:18,marginVertical:20},profileAvatar:{width:64,height:64,borderRadius:32,textAlign:'center',textAlignVertical:'center',fontSize:25,fontWeight:'900',overflow:'hidden'},profileRow:{flexDirection:'row',justifyContent:'space-between',padding:16,borderRadius:13,borderWidth:1,borderColor:t.border,backgroundColor:t.surface,marginBottom:10},
  tabBar:{position:'absolute',bottom:0,left:0,right:0,height:74,borderTopWidth:1,flexDirection:'row',paddingBottom:8},tab:{flex:1,alignItems:'center',justifyContent:'center',minHeight:44},tabIcon:{fontSize:20},tabLabel:{fontSize:10,marginTop:3,fontWeight:'700'},
  shade:{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(15,28,26,.42)'},sheet:{maxHeight:'84%',minHeight:'62%',borderTopLeftRadius:24,borderTopRightRadius:24,padding:20,paddingBottom:25},grabber:{width:40,height:4,borderRadius:4,alignSelf:'center',marginBottom:17},closeButton:{minWidth:44,minHeight:44,alignItems:'center',justifyContent:'center'},close:{fontSize:28,color:t.textSecondary},label:{fontSize:10,fontWeight:'900',letterSpacing:1,color:t.textSecondary,marginTop:20,marginBottom:10},dateChip:{width:64,minHeight:68,borderWidth:1,borderRadius:12,alignItems:'center',justifyContent:'center',marginRight:8,gap:4},slotGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},slotChip:{minHeight:44,borderWidth:1,borderRadius:10,paddingHorizontal:12,justifyContent:'center'},sheetBottom:{marginTop:'auto',paddingTop:18},success:{alignItems:'center',paddingTop:36,gap:10},successMark:{width:76,height:76,borderRadius:40,textAlign:'center',textAlignVertical:'center',overflow:'hidden',fontSize:38,fontWeight:'900',marginBottom:8},
  adminSheet:{maxHeight:'88%',borderTopLeftRadius:24,borderTopRightRadius:24,padding:20},configButton:{minHeight:48,justifyContent:'center',borderWidth:1,borderRadius:12,padding:12,marginTop:8},settingRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:11,borderTopWidth:1,borderColor:t.border,gap:10},failureOption:{minHeight:44,borderWidth:1,borderRadius:10,justifyContent:'center',paddingHorizontal:12,marginTop:7},refresh:{paddingVertical:16}
}); }
