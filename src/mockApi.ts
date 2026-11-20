import { buildConfig, sampleDoctors, samplePrescriptions } from './config';
import { Booking, Doctor, LayoutConfig, Prescription, Slot } from './types';
import { validateLayoutConfig } from './configValidation';

export type FailureTarget = 'none'|'config'|'doctors'|'slots'|'booking'|'prescriptions';
export type MockSettings = { latencyMs:number; failureTarget:FailureTarget; emptyPrescriptions:boolean };
export const API_PATHS = {
  config:'/config', doctors:'/doctors', slots:'/slots', bookings:'/bookings', prescriptions:'/prescriptions'
} as const;
let lastGoodConfig: LayoutConfig = buildConfig(false);
const delay = (ms:number) => new Promise<void>(resolve => setTimeout(resolve, ms));
async function respond<T>(settings:MockSettings, target:FailureTarget, result:()=>T, error:string):Promise<T> {
  await delay(settings.latencyMs);
  if(settings.failureTarget===target) throw new Error(error);
  return result();
}
export const mockApi = {
  getLastGoodConfig:()=>lastGoodConfig,
  getConfig:async(festival:boolean,settings:MockSettings)=>respond(settings,'config',()=>{
    lastGoodConfig=validateLayoutConfig(buildConfig(festival)); return lastGoodConfig;
  },'Home layout could not be refreshed.'),
  getDoctors:(settings:MockSettings):Promise<Doctor[]>=>respond(settings,'doctors',()=>sampleDoctors,'Doctors could not be loaded.'),
  getSlots:(doctorId:string,date:Date,settings:MockSettings):Promise<Slot[]>=>respond(settings,'slots',()=>{
    const emptyDemoDate=new Date();
    emptyDemoDate.setDate(emptyDemoDate.getDate()+6);
    if(date.toDateString()===emptyDemoDate.toDateString()) return [];
    return ['09:30 AM','10:15 AM','11:00 AM','02:30 PM','04:30 PM','05:15 PM'].map((time,index)=>({
      id:doctorId+'-'+date.toISOString().slice(0,10)+'-'+index,doctorId,startsAt:time,endsAt:time,available:index!==2
    }));
  },'Appointment times could not be loaded.'),
  postBooking:async(doctor:Doctor,slot:Slot,date:string,settings:MockSettings):Promise<Booking>=>respond(settings,'booking',()=>({
    id:'booking-'+Date.now(),doctorId:doctor.id,doctorName:doctor.name,specialty:doctor.specialty,
    slotId:slot.id,date,time:slot.startsAt,feeInr:doctor.feeInr,status:'confirmed'
  }), 'That time was just taken. Please choose another slot.'),
  getPrescriptions:(settings:MockSettings):Promise<Prescription[]>=>respond(settings,'prescriptions',()=>{
    return settings.emptyPrescriptions?[]:samplePrescriptions;
  },'Your prescriptions could not be loaded.')
};
