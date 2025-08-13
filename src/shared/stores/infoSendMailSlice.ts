import { StateCreator } from 'zustand';
import dayjs, { Dayjs } from 'dayjs';
import { DEFAULT_TIME, Measurement } from '@/modules/editor/core/enum/distribution-setting.enum';
import { DELIVERY_TYPES } from '@/modules/editor/core/enum/distribution-setting.enum';

export interface IInfoSendMail {
  subject: string;
  addressTo: string | number;
  addressToId: string | number;
  addressToType: string;
  fromAddress: string | number;
  deliveryType: string;
  isClickMeasure: number;
  date: Dayjs;
  hours: string | number;
  minutes: string | number;
  nameAddressTo: string;
  nameFromAddress: string;
  signature: string;
  setSubject: (subject: string) => void;
  setAddressTo: (addressTo: string | number) => void;
  setAddressToId: (addressToId: string | number) => void;
  setAddressToType: (addressToType: string) => void;
  setFromAddress: (fromAddress: string | number) => void;
  setDeliveryType: (deliveryType: string) => void;
  setDate: (date: Dayjs) => void;
  setHours: (hours: string | number) => void;
  setMinutes: (minutes: string | number) => void;
  setIsClickMeasure: (isClickMeasure: number) => void;
  reset: () => void;
  setNameAddressTo: (nameAddressTo: string) => void;
  setNameFromAddress: (nameFromAddress: string) => void;
  setSignature: (signature: string) => void;
}

export const createInfoSendmailSlice: StateCreator<IInfoSendMail, [], [], IInfoSendMail> = (set) => ({
  subject: '',
  addressTo: 'all',
  addressToId: '',
  addressToType: 'all',
  fromAddress: '',
  deliveryType: DELIVERY_TYPES.SCHEDULED,
  date: dayjs(new Date()),
  hours: DEFAULT_TIME.HOURS,
  minutes: DEFAULT_TIME.MINUTES,
  isClickMeasure: Measurement.OFF,
  nameAddressTo: '全登録者',
  nameFromAddress: '',
  signature: '',
  setIsClickMeasure: (isClickMeasure: number) => set({ isClickMeasure }),
  setSubject: (subject: string) => set({ subject }),
  setAddressTo: (addressTo: string | number) => set({ addressTo }),
  setAddressToId: (addressToId: string | number) => set({ addressToId }),
  setFromAddress: (fromAddress: string | number) => set({ fromAddress }),
  setDeliveryType: (deliveryType: string) => set({ deliveryType }),
  setDate: (date: Dayjs) => set({ date }),
  setHours: (hours: string | number) => set({ hours }),
  setMinutes: (minutes: string | number) => set({ minutes }),
  setAddressToType: (addressToType: string) => set({ addressToType }),
  setNameAddressTo: (nameAddressTo: string) => set({ nameAddressTo }),
  setNameFromAddress: (nameFromAddress: string) => set({ nameFromAddress }),
  reset: () =>
    set({
      subject: '',
      addressTo: 'all',
      addressToId: '',
      addressToType: 'all',
      fromAddress: '',
      deliveryType: DELIVERY_TYPES.SCHEDULED,
      date: dayjs(new Date()),
      hours: DEFAULT_TIME.HOURS,
      minutes: DEFAULT_TIME.MINUTES,
      isClickMeasure: Measurement.OFF,
      nameAddressTo: '全登録者',
      nameFromAddress: '',
      signature: '',
    }),
  setSignature: (signature: string) => set({ signature }),
});
