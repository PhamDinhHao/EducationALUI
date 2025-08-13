import { SearchFieldEnumUsingName } from '@/modules/mngRecipients/core/enum/search-field.enum'
import { SearchField } from '@/modules/mngRecipients/core/enum/search-field.enum'
import { Situation, SituationEnumUsingName } from '@/modules/mngRecipients/core/enum/situation.enum'
import { TypeImport } from '@/modules/mngRecipients/core/enum/type-import.enum'
import { TypeImportEnumUsingName } from '@/modules/mngRecipients/core/enum/type-import.enum'
import { TypeSearchDate, TypeSearchDateEnumUsingName, TypeSearchDefault, TypeSearchDefaultEnumUsingName } from '@/modules/mngRecipients/core/enum/type-search.enum'
import { OptionSelect } from '@/shared/core/types/common.type'

export const situationOptions: OptionSelect[] = [
  {
    label: 'すべて',
    value: ''
  },
  { value: Situation.NOW_AVAILABLE, label: SituationEnumUsingName[Situation.NOW_AVAILABLE] },
  { value: Situation.UN_SUBSCRIBE, label: SituationEnumUsingName[Situation.UN_SUBSCRIBE] },
  { value: Situation.ERROR_STOP, label: SituationEnumUsingName[Situation.ERROR_STOP] },
  { value: Situation.RELEASE, label: SituationEnumUsingName[Situation.RELEASE] },
  { value: Situation.DELETE, label: SituationEnumUsingName[Situation.DELETE] }
]

export const typeSearchDefaultOptions: OptionSelect[] = [
  { value: TypeSearchDefault.INCLUDES, label: TypeSearchDefaultEnumUsingName[TypeSearchDefault.INCLUDES] },
  { value: TypeSearchDefault.DOES_NOT_INCLUDES, label: TypeSearchDefaultEnumUsingName[TypeSearchDefault.DOES_NOT_INCLUDES] },
  { value: TypeSearchDefault.MATCHES, label: TypeSearchDefaultEnumUsingName[TypeSearchDefault.MATCHES] },
  { value: TypeSearchDefault.DOES_NOT_MATCHES, label: TypeSearchDefaultEnumUsingName[TypeSearchDefault.DOES_NOT_MATCHES] },
  { value: TypeSearchDefault.ONLY_BLANK, label: TypeSearchDefaultEnumUsingName[TypeSearchDefault.ONLY_BLANK] },
  { value: TypeSearchDefault.EXCLUDE_BLANK, label: TypeSearchDefaultEnumUsingName[TypeSearchDefault.EXCLUDE_BLANK] }
]

export const typeSearchDateOptions: OptionSelect[] = [
  { value: TypeSearchDate.PERIOD, label: TypeSearchDateEnumUsingName[TypeSearchDate.PERIOD] },
  { value: TypeSearchDate.ONLY_BLANK, label: TypeSearchDateEnumUsingName[TypeSearchDate.ONLY_BLANK] },
  { value: TypeSearchDate.EXCLUDE_BLANK, label: TypeSearchDateEnumUsingName[TypeSearchDate.EXCLUDE_BLANK] }
]

export const searchFieldOptions: OptionSelect[] = [
  { value: SearchField.EMAIL, label: SearchFieldEnumUsingName[SearchField.EMAIL] },
  { value: SearchField.CREATED_AT, label: SearchFieldEnumUsingName[SearchField.CREATED_AT] },
  { value: SearchField.NUMBER_OF_ERROR, label: SearchFieldEnumUsingName[SearchField.NUMBER_OF_ERROR] },
  { value: SearchField.NAME, label: SearchFieldEnumUsingName[SearchField.NAME] },
]

export const typeImportOptions: OptionSelect[] = [
  { value: TypeImport.INSERT, label: TypeImportEnumUsingName[TypeImport.INSERT] },
  { value: TypeImport.UPDATE, label: TypeImportEnumUsingName[TypeImport.UPDATE] },
  { value: TypeImport.INSERT_OR_UPDATE, label: TypeImportEnumUsingName[TypeImport.INSERT_OR_UPDATE] },
]
