import { SanityImageObject } from '@sanity/image-url/lib/types/types'

export interface Customer {
  _id: string
  _type: 'customer'
  _createdAt: string
  _updatedAt: string
  _rev: string
  name: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  workTitle: string
  personalInterests: string[]
  profileImage: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    hotspot?: {
      height: number
      width: number
      x: number
      y: number
    }
  }
}

export interface CustomerWithImageUrl extends Omit<Customer, 'profileImage'> {
  profileImage: {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    hotspot?: {
      height: number
      width: number
      x: number
      y: number
    }
    url?: string
  }
} 