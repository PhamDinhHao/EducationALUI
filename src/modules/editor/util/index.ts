import dayjs from 'dayjs'

export const formatDateTime = (date: string, hours: number, minutes: number): string => {
  return dayjs(date).hour(hours).minute(minutes).format('YYYY/MM/DD HH:mm')
}
