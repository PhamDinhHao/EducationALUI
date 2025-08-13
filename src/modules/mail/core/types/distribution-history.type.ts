export type Distribution = {
  id: number
  subject: string
  type: string
  address: string
  sourceAddress: string
  deliveryStatus: Delivery
  trackingStatus: Tracking
  createdAt: string
  updatedAt: string
}

export type Delivery = {
  numberOfDelivery: number
  successCount: number
  failedCount: number
}

export type Tracking = {
  openCount: number
  openRate: string
  totalUrls: number
  clickCount: number
  clickDetails: ClickDetail[]
}

export type ClickDetail = {
  url: string
  totalClicks: number
}
