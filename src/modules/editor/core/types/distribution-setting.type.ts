import { DELIVERY_TYPES } from "@/modules/editor/core/enum/distribution-setting.enum";

export type DeliveryType = (typeof DELIVERY_TYPES)[keyof typeof DELIVERY_TYPES]