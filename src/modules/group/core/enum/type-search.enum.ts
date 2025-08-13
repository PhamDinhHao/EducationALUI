import { EnumTypeName } from "@/shared/core/types/common.type";

export enum TypeSearchDefault {
  INCLUDES = 'includes',
  DOES_NOT_INCLUDES = 'notIncludes',
  MATCHES = 'equals',
  DOES_NOT_MATCHES = 'notEquals',
  RANGE = 'range',
  PERIOD = 'period'
}

export const TypeSearchDefaultEnumUsingName: EnumTypeName = {
  [TypeSearchDefault.INCLUDES]: 'を含む',
  [TypeSearchDefault.MATCHES]: 'と一致する',
};

export const TypeSearchExcludeEnumUsingName: EnumTypeName = {
  [TypeSearchDefault.DOES_NOT_INCLUDES]: 'を含まない',
  [TypeSearchDefault.DOES_NOT_MATCHES]: 'と一致しない',
};
