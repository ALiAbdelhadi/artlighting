import type { Order, Product } from "@repo/database"

export interface ProductWithRelations extends Product {
  category: { name: string }
  lightingtype: { name: string }
}

export interface ConfigurationData {
  id: string
  ProductId: string
  configPrice: number
  priceIncrease: number
  shippingPrice: number
  discount: number
  quantity: number
  lampPriceIncrease: number | null
  totalPrice: number
}

export interface SpecificationsTable {
  [key: string]: string | number | null | undefined
  Input?: string
  "Maximum wattage"?: string
  "Brand Of Led"?: string
  "Luminous Flux"?: string
  "Main Material"?: string
  CRI?: string
  "Beam Angle"?: string
  "Working Temperature"?: string
  "Fixture Dimmable"?: string
  Electrical?: string
  "Power Factor"?: string
  "Color Temperature"?: string
  IP?: string
  "Energy Saving"?: string
  "Life Time"?: string
}

export interface ProductMainInfoProps {
  productName: string
  price: number
  quantity: number
  increaseQuantity: () => void
  decreaseQuantity: () => void
  specificationsTable: SpecificationsTable
  ProductId: string
  configId: string
  discount: number
  colorTemperature: string
  order: Order
  ChandelierLightingType: string
  Brand: string
  ip: number
  maxIP?: number
  hNumber?: number | null
  configuration?: ConfigurationData
  sectionTypes: string[]
  sectionType: string
  maximumWattage?: number
  mainMaterial?: string
  beamAngle?: string
  spotlightType?: string
  luminousFlux?: string
  lifeTime?: string
  energySaving?: string
  cri?: string
  brandOfLed?: string
  electrical?: string
  finish?: string | undefined // Changed from string | null
  input?: string | undefined // Changed from string | null
  lampBase?: string | undefined // Changed from string | null
}
