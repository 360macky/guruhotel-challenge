export interface Business {
  name: string
  id: string
  review_count?: number
  rating: number
  photos: string[]
  phone: string
  display_phone: string
  location: {
    address1: string
    city: string
    formatted_address: string
  }
}

export interface BusinessDetails extends Business {
  price: string
  hours: [
    {
      open: {
        start: string
        end: string
        day: number
      }
      hours_type: string
      is_open_now: boolean
    }
  ]
  categories: {
    alias: string
    title: string
  }
  coordinates: {
    latitude: number
    longitude: number
  }
  is_closed: boolean
  url: string
  transactions: string[]
  distance: number
  alias: string
  review_count: number
  rating: number
  photos: string[]
  phone: string
  reviews: any[]
}
