import { EnumTypeName } from "@/shared/core/types/common.type";

export enum Situation {
  NOW_AVAILABLE = 1,
  UN_SUBSCRIBE = 2,
  ERROR_STOP = 3,
  RELEASE = 4,
  DELETE = 5
};
export const SituationEnumUsingName: EnumTypeName = {
  [Situation.NOW_AVAILABLE]: '配信中',
  [Situation.UN_SUBSCRIBE]: '配信停止',
  [Situation.ERROR_STOP]: 'エラー停止',
  [Situation.RELEASE]: '解除',
  [Situation.DELETE]: '削除'
};
