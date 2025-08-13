import { SearchField, SearchFieldEnumUsingName } from "@/modules/mngRecipients/core/enum/search-field.enum"
import { SituationEnumUsingName } from "@/modules/mngRecipients/core/enum/situation.enum"
import { TypeSearchDate, TypeSearchDefault, TypeSearchDefaultEnumUsingName } from "@/modules/mngRecipients/core/enum/type-search.enum"

export const getDefaultSearchType = (fieldType: string) => {
  switch (fieldType) {
    case 'createdAt':
      return TypeSearchDate.PERIOD;
    case 'email':
    case 'name':
    default:
      return TypeSearchDefault.INCLUDES;
  }
};

export const getSituationName = (situation: number) => {
  if (!situation) return 'すべて'
  return SituationEnumUsingName[situation]
}

export const getSearchFieldName = (field: string) => {
  if (!field) return ''
  return SearchFieldEnumUsingName[field]
}

export const getSearchTypeName = (type: string, value: string) => {
  if (!type || !value) return ''
  if (type === SearchField.NUMBER_OF_ERROR || type === SearchField.CREATED_AT) {
    return ''
  } else {
    return TypeSearchDefaultEnumUsingName[value]
  }
}

