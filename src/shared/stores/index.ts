import { createAuthSlice, IAuthSlice } from '@/shared/stores/authSlice';
import { IInfoSendMail } from '@/shared/stores/infoSendMailSlice';
import { createInfoSendmailSlice } from '@/shared/stores/infoSendMailSlice';
import { createLoadingSlice, ILoadingSlice } from '@/shared/stores/loadingSlice';
import { createExamSlice, IExamSlice } from '@/shared/stores/examSlice';
import { create } from 'zustand';

export type CommonState = IAuthSlice & ILoadingSlice & IInfoSendMail  & IExamSlice;

export const useBoundStore = create<CommonState>((...a) => ({
  ...createAuthSlice(...a),
  ...createLoadingSlice(...a),
  ...createInfoSendmailSlice(...a),
  ...createExamSlice(...a),
}));
