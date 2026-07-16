export const WHATSAPP_NUMBER = '255712345678'

export const WHATSAPP_DISPLAY = '+255 712 345 678'

export const CONTACT = {
  phone: '+255 712 345 678',
  phoneTel: '+255712345678',
  email: 'hello@glamandglow.co',
  address: 'Mlimani City Mall, Ground Floor, Sam Nujoma Road, Dar es Salaam',
  hours: 'Mon - Sat: 9:00 AM - 8:00 PM · Sun: 11:00 AM - 6:00 PM',
  instagram: 'https://instagram.com/glamandglow',
  facebook: 'https://facebook.com/glamandglow',
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
}

export const DELIVERY_FEE = 5000

export const DELIVERY_AREAS = [
  'Dar es Salaam — City Centre',
  'Dar es Salaam — Upanga',
  'Dar es Salaam — Mikocheni',
  'Dar es Salaam — Masaki',
  'Dar es Salaam — Kinondoni',
  'Dar es Salaam — Mbezi Beach',
  'Dar es Salaam — Kijitonyama',
  'Dar es Salaam — Tegeta',
  'Dar es Salaam — Mbeya',
  'Other (Specify in notes)',
]

export const CURRENCY = 'TZS'

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-TZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
