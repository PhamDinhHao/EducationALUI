import { EnumTypeName } from "@/shared/core/types/common.type";

export enum TypeSearchDefault {
  INCLUDES = 'includes',
  DOES_NOT_INCLUDES = 'not_includes',
  MATCHES = 'equals',
  DOES_NOT_MATCHES = 'not_equals',
  ONLY_BLANK = 'empty',
  EXCLUDE_BLANK = 'not_empty'
}

export const TypeSearchDefaultEnumUsingName: EnumTypeName = {
  [TypeSearchDefault.INCLUDES]: 'を含む',
  [TypeSearchDefault.DOES_NOT_INCLUDES]: 'を含まない',
  [TypeSearchDefault.MATCHES]: 'と一致する',
  [TypeSearchDefault.DOES_NOT_MATCHES]: 'と一致しない',
  [TypeSearchDefault.ONLY_BLANK]: '空欄のみ',
  [TypeSearchDefault.EXCLUDE_BLANK]: '空欄を除外'
};

export enum TypeSearchDate {
  PERIOD = 'period',
  ONLY_BLANK = 'only_blank',
  EXCLUDE_BLANK = 'exclude_blank'
}

export const TypeSearchDateEnumUsingName: EnumTypeName = {
  [TypeSearchDate.PERIOD]: '期間',
  [TypeSearchDate.ONLY_BLANK]: '空欄のみ',
  [TypeSearchDate.EXCLUDE_BLANK]: '空欄を除外'
};
