export type Reservation = {
  id: number
  userId: number
  sourceAddress: string
  addressTo: string
  addressToId: number
  addressToType: string
  subject: string
  content: string
  emailType: string
  deliveryType: string
  deliveryStatus: string
  numberOfDelivery: number
  isDraft: number
  isSent: number
  isClickMeasure: number
  date: string
  hour: string
  minute: string
  createdAt: string
  updatedAt: string
}