import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Section, Theme } from './types';
import { isKnownSectionType } from './configValidation';
import { Language, localizeContent, t } from './i18n';

type Props = {
  section:Section; theme:Theme; visible:boolean; scrollY:Animated.Value;
  language:Language;
  onNavigate:(page:'prescriptions'|'reminders')=>void;
  onBook:(target:{id:string;name:string;specialty:string;feeInr:number})=>void;
  styles:Record<string,any>;
};
export default function SectionRenderer({section,theme,visible,scrollY,language,onNavigate,onBook,styles:s}:Props) {
  if(!isKnownSectionType(section.type)) return null;
  const entranceY=useRef(new Animated.Value(14)).current;
  useEffect(()=>{ Animated.timing(entranceY,{toValue:0,duration:360,useNativeDriver:true}).start();},[entranceY]);
  const bg=section.background.value==='hero'?theme.hero:theme[section.background.value as keyof Theme];
  const backgroundColor=typeof bg==='string'?bg:theme.surface;
  const entrance={transform:[{translateY:entranceY}]};
  const Band=({children,style}:{children:React.ReactNode;style:any})=>{
    if(section.background.kind==='image'&&section.background.value){
      return <Animated.View style={entrance}><ImageBackground source={{uri:section.background.value}} resizeMode="cover" imageStyle={{opacity:0.2}} style={[style,{backgroundColor:theme.surface}]}>{children}</ImageBackground></Animated.View>;
    }
    if(section.background.kind==='gradient'){
      return <Animated.View style={entrance}><LinearGradient colors={[theme.hero,theme.heroGradientEnd]} style={style}>{children}</LinearGradient></Animated.View>;
    }
    return <Animated.View style={[style,{backgroundColor},entrance]}>{children}</Animated.View>;
  };
  const pressAction=(id:string)=>{
    if(id==='prescriptions') onNavigate('prescriptions');
    else if(id==='reminders') onNavigate('reminders');
    else if(id==='book'||id==='consult') onBook({id:'d1',name:'Dr. Ananya Rao',specialty:'General physician',feeInr:500});
  };
  if(section.type==='hero_banner') return <Band style={s.hero}>
    <Animated.View style={[s.heroOrb,{transform:[{translateY:scrollY.interpolate({inputRange:[0,240],outputRange:[0,38],extrapolate:'clamp'})}]}]}/>
    <Text style={[s.heroLocation,{color:theme.heroText}]}>⌖  Banjara Hills, Hyderabad⌄</Text>
    <Text style={[s.heroEyebrow,{color:theme.heroText}]}>{t(language,'heroEyebrow')}</Text>
    <Text style={[s.heroTitle,{color:theme.heroText}]}>{localizeContent(language,section.items[0]?.title??'Good morning, Shashank')}</Text>
    <Text style={[s.heroSubtitle,{color:theme.heroText}]}>{t(language,'heroSub')}</Text>
    <Pressable accessibilityRole="button" style={s.heroButton} onPress={()=>onNavigate('prescriptions')}>
      <Text style={s.heroButtonText}>{t(language,'heroCta')}</Text>
    </Pressable>
  </Band>;
  if(section.type==='category_chips') return <Band style={s.band}>
    <Text style={s.heading}>{section.title==='What do you need today?'?t(language,'needs'):section.title}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontal}>
      {section.items.map(item=><Pressable accessibilityRole="button" key={item.id} style={s.chip} onPress={()=>pressAction(item.id)}>
        <Text style={s.primary}>{item.icon}  </Text><Text style={s.body}>{localizeContent(language,item.title??'')}</Text>
      </Pressable>)}
    </ScrollView>
  </Band>;
  if(section.type==='quick_actions') return <Band style={s.band}>
    <Text style={s.heading}>{t(language,'care')}</Text><View style={s.actions}>{section.items.map((item,index)=><Pressable accessibilityRole="button" key={item.id} style={s.action} onPress={()=>pressAction(item.id)}>
      <Text style={[s.actionIcon,{backgroundColor:theme.art[index%theme.art.length],color:theme.primary}]}>{item.icon}</Text>
      <Text style={s.actionLabel}>{localizeContent(language,item.title??'')}</Text>
    </Pressable>)}</View>
  </Band>;
  if(section.type==='offer_strip') return <Band style={s.offer}>
    <Text style={[s.offerIcon,{color:theme.primary}]}>{section.items[0]?.icon??'✦'}</Text>
    <View style={{flex:1}}><Text style={s.offerTitle}>{section.items[0]?.title}</Text><Text style={s.mutedSmall}>{section.items[0]?.subtitle}</Text></View>
    <Text style={[s.offerArrow,{color:theme.primary}]}>›</Text>
  </Band>;
  if(section.type==='service_grid') return <Band style={s.band}>
    <Text style={s.heading}>{t(language,'services')}</Text><View style={s.grid}>{section.items.map((item,index)=><Pressable accessibilityRole="button" key={item.id} style={s.service} onPress={()=>onBook({id:item.id,name:item.name??'Clinic service',specialty:'Clinic service',feeInr:item.priceInr??499})}>
      <View style={[s.serviceArt,{backgroundColor:theme.art[index%theme.art.length]}]}>{item.imageUrl?<Image source={{uri:item.imageUrl}} resizeMode="cover" style={s.servicePhoto}/>:null}<Text style={[s.serviceIcon,{color:theme.primary}]}>{item.icon}</Text>{item.badge?<Text style={[s.badge,{color:theme.primary}]}>{item.badge}</Text>:null}</View>
      <Text style={s.cardTitle}>{localizeContent(language,item.name??'')}</Text><Text style={s.mutedSmall}>{localizeContent(language,item.subtitle??'')}</Text><Text style={s.price}>₹{item.priceInr}<Text style={s.mutedSmall}> onwards</Text></Text>
    </Pressable>)}</View>
  </Band>;
  if(section.type==='doctor_carousel') return <Band style={s.band}>
    <Text style={s.heading}>{t(language,'doctors')}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.horizontal}>
      {section.items.map(item=><View key={item.id} style={s.doctorCard}><View style={s.doctorHead}>
        {item.photoUrl?<Image accessibilityLabel={item.name+' portrait'} source={{uri:item.photoUrl}} resizeMode="cover" style={s.doctorPhoto}/>:<Text style={[s.doctorAvatar,{backgroundColor:theme.secondary,color:theme.primary}]}>{item.name?.replace('Dr. ','').split(' ').map(x=>x[0]).join('')}</Text>}
        <View style={{flex:1}}><Text style={s.cardTitle}>{item.name}</Text><Text style={s.mutedSmall}>{item.specialty}</Text></View>
      </View><Text style={[s.nextSlot,{backgroundColor:theme.soft,color:theme.primary}]}>◷  {item.nextSlot??'Next available today'}</Text>
      <View style={s.doctorFoot}><Text style={s.price}>₹{item.feeInr}<Text style={s.mutedSmall}> / visit</Text></Text>
        <Pressable accessibilityRole="button" style={[s.bookButton,{backgroundColor:theme.primary}]} onPress={()=>onBook({id:item.id,name:item.name??'Doctor',specialty:item.specialty??'Physician',feeInr:item.feeInr??500})}><Text style={s.bookButtonText}>Book</Text></Pressable>
      </View></View>)}
    </ScrollView>
  </Band>;
  return null;
}
