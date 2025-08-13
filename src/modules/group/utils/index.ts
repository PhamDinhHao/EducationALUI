import _ from 'lodash'
import dayjs from 'dayjs'
import { TypeSearchDefault } from '@/modules/group/core/enum/type-search.enum'

export const getDefaultSearchType = (fieldType: string) => {
  switch (fieldType) {
    case 'email':
    case 'name':
      return TypeSearchDefault.INCLUDES
    case 'emailExclude':
      return TypeSearchDefault.DOES_NOT_INCLUDES
    case 'numberOfError':
      return TypeSearchDefault.RANGE
    case 'createdAt':
      return TypeSearchDefault.PERIOD
    default:
      return TypeSearchDefault.INCLUDES
  }
}

export const transformToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(transformToSnakeCase)
  }
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [_.snakeCase(key)]: (key === 'field' || key === 'searchType') && typeof value === 'string' 
          ? _.snakeCase(value) 
          : transformToSnakeCase(value)
      }),
      {}
    )
  }
  return obj
}

export const handleTransformCondition = (item: any) => {
  switch (item.field) {
    case 'createdAt':
      const startDate = dayjs(item.searchValue[0])
      const endDate = dayjs(item.searchValue[1])

      const result = {
        ...item,
        start: startDate.format('YYYY/MM/DD'),
        end: endDate.format('YYYY/MM/DD')
      }

      delete result.searchValue
      return result
    case 'numberOfError':
      const [min, max] = item.searchValue.split(',')
      const numberResult = {
        ...item,
        min: parseInt(min),
        max: parseInt(max)
      }
      
      delete numberResult.searchValue
      return numberResult
    default:
      return item
  }
}