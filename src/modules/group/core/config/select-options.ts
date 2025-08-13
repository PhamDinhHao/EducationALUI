import { SearchField } from '@/modules/group/core/enum/search-field.enum'
import { SearchFieldEnumUsingName } from '@/modules/group/core/enum/search-field.enum'
import { TypeSearchDefault, TypeSearchDefaultEnumUsingName, TypeSearchExcludeEnumUsingName } from '@/modules/group/core/enum/type-search.enum'
import { OptionSelect } from '@/shared/core/types'

export const searchFieldOptions: OptionSelect[] = [
  { value: SearchField.EMAIL, label: SearchFieldEnumUsingName[SearchField.EMAIL] },
  { value: SearchField.EMAIL_EXCLUDE, label: SearchFieldEnumUsingName[SearchField.EMAIL_EXCLUDE] },
  { value: SearchField.CREATED_AT, label: SearchFieldEnumUsingName[SearchField.CREATED_AT] },
  { value: SearchField.NUMBER_OF_ERROR, label: SearchFieldEnumUsingName[SearchField.NUMBER_OF_ERROR] },
  { value: SearchField.NAME, label: SearchFieldEnumUsingName[SearchField.NAME] }
]

export const typeSearchDefaultOptions: OptionSelect[] = [
  { value: TypeSearchDefault.INCLUDES, label: TypeSearchDefaultEnumUsingName[TypeSearchDefault.INCLUDES] },
  { value: TypeSearchDefault.MATCHES, label: TypeSearchDefaultEnumUsingName[TypeSearchDefault.MATCHES] },
]

export const typeSearchExcludeOptions: OptionSelect[] = [
  { value: TypeSearchDefault.DOES_NOT_INCLUDES, label: TypeSearchExcludeEnumUsingName[TypeSearchDefault.DOES_NOT_INCLUDES] },
  { value: TypeSearchDefault.DOES_NOT_MATCHES, label: TypeSearchExcludeEnumUsingName[TypeSearchDefault.DOES_NOT_MATCHES] },
]

