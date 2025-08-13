import { EnumTypeName } from "@/shared/core/types/common.type";

export enum SearchField {
  EMAIL = 'email',
  EMAIL_EXCLUDE = 'emailExclude',
  CREATED_AT = 'createdAt',
  NUMBER_OF_ERROR = 'numberOfError',
  NAME = 'name'
}

export const SearchFieldEnumUsingName: EnumTypeName = {
  [SearchField.EMAIL]: 'E-Mail',
  [SearchField.EMAIL_EXCLUDE]: 'E-Mail（除外するもの）',
  [SearchField.CREATED_AT]: '新規登録日時',
  [SearchField.NUMBER_OF_ERROR]: 'エラー数',
  [SearchField.NAME]: '氏名'
}


