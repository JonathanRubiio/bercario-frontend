export type Product = {
  id: string
  title: string
  price: string
  description: string
  image: string
  tags: string[]
}

export type Testimonial = {
  id: string
  name: string
  role: string
  quote: string
  rating: number
}

export type Faq = {
  id: string
  question: string
  answer: string
}

export type BusinessProfile = {
  name: string
  tagline: string
  description: string
  phone: string
  email: string
  address: string
  banner: string
  logo: string
  slug: string
  products: Product[]
  testimonials: Testimonial[]
  faqs: Faq[]
  gallery: string[]
}

export type SectionType =
  | 'banner'
  | 'about'
  | 'products'
  | 'contact'
  | 'testimonials'
  | 'faq'
  | 'gallery'

export type LandingSection = {
  id: string
  type: SectionType
  label: string
  description: string
}

export const initialProfile: BusinessProfile = {
  name: 'Calzado La Frontera',
  tagline: 'Mayoristas de calzado y moda en Cúcuta',
  description:
    'Somos una empresa familiar con más de 15 años surtiendo a comerciantes del Norte de Santander. Ofrecemos calzado, marroquinería y accesorios al por mayor con despacho a toda Colombia y garantía en cada pedido.',
  phone: '+57 315 482 9021',
  email: 'ventas@calzadolafrontera.co',
  address: 'Av. 5 #10-42, Centro, Cúcuta',
  banner: '/images/company-banner.png',
  logo: '/images/company-logo.png',
  slug: 'calzado-la-frontera',
  products: [
    {
      id: 'p1',
      title: 'Tenis Urbanos Blanco Arena',
      price: '$68.000',
      description: 'Par x mayor desde 12 unidades. Tallas 35-42.',
      image: '/images/product-sneakers.png',
      tags: ['#Calzado', '#Mayorista', '#Cúcuta'],
    },
    {
      id: 'p2',
      title: 'Bolso Cuero Camel',
      price: '$95.000',
      description: 'Marroquinería premium, costuras reforzadas.',
      image: '/images/product-handbag.png',
      tags: ['#Marroquinería', '#Mayorista', '#Mujer'],
    },
    {
      id: 'p3',
      title: 'Botines Cuero Café',
      price: '$120.000',
      description: 'Suela antideslizante. Ideal temporada fría.',
      image: '/images/product-boots.png',
      tags: ['#Calzado', '#Cuero', '#Unisex'],
    },
    {
      id: 'p4',
      title: 'Suéter Tejido Beige',
      price: '$54.000',
      description: 'Docena surtida en tallas. Tela térmica.',
      image: '/images/product-jacket.png',
      tags: ['#Textil', '#Mayorista', '#Invierno'],
    },
    {
      id: 'p5',
      title: 'Reloj Correa Cuero',
      price: '$78.000',
      description: 'Accesorio unisex, empaque individual.',
      image: '/images/product-watch.png',
      tags: ['#Accesorios', '#Mayorista', '#Regalo'],
    },
  ],
  testimonials: [
    {
      id: 't1',
      name: 'Marisol Peña',
      role: 'Tienda El Buen Precio · Pamplona',
      quote:
        'Desde que compro con ellos mis márgenes mejoraron. Los despachos llegan completos y a tiempo.',
      rating: 5,
    },
    {
      id: 't2',
      name: 'Jorge Ramírez',
      role: 'Distribuidora JR · Ocaña',
      quote:
        'Excelente calidad al por mayor. El catálogo en línea me facilita hacer pedidos desde el celular.',
      rating: 5,
    },
    {
      id: 't3',
      name: 'Diana Vega',
      role: 'Almacén La Moda · Cúcuta',
      quote:
        'Atención cercana y precios justos. Llevo dos años surtiendo mi almacén con ellos.',
      rating: 4,
    },
  ],
  faqs: [
    {
      id: 'f1',
      question: '¿Cuál es el pedido mínimo al por mayor?',
      answer:
        'El pedido mínimo es de 12 unidades por referencia. Para docenas surtidas consulta disponibilidad con nuestro equipo.',
    },
    {
      id: 'f2',
      question: '¿Hacen despachos a todo el país?',
      answer:
        'Sí, despachamos a toda Colombia a través de transportadoras aliadas. El costo de envío depende de la ciudad de destino.',
    },
    {
      id: 'f3',
      question: '¿Qué métodos de pago aceptan?',
      answer:
        'Aceptamos transferencia, consignación y pago contra entrega en Cúcuta. Próximamente pagos en línea desde tu perfil.',
    },
  ],
  gallery: [
    '/images/company-banner.png',
    '/images/hero.png',
    '/images/product-sneakers.png',
    '/images/product-handbag.png',
    '/images/product-boots.png',
    '/images/product-watch.png',
  ],
}

export const defaultSections: LandingSection[] = [
  {
    id: 'banner',
    type: 'banner',
    label: 'Banner principal',
    description: 'Imagen destacada, logo y nombre del negocio.',
  },
  {
    id: 'about',
    type: 'about',
    label: 'Quiénes somos',
    description: 'Descripción y propuesta de valor del negocio.',
  },
  {
    id: 'products',
    type: 'products',
    label: 'Catálogo de productos',
    description: 'Grilla de productos con precios y etiquetas.',
  },
  {
    id: 'contact',
    type: 'contact',
    label: 'Formulario de contacto',
    description: 'Datos de contacto y formulario para clientes.',
  },
]

export type SectionTemplate = {
  type: SectionType
  label: string
  description: string
  repeatable: boolean
}

export const sectionTemplates: SectionTemplate[] = [
  {
    type: 'testimonials',
    label: 'Testimonios / Reseñas',
    description: 'Opiniones de clientes con calificación en estrellas.',
    repeatable: false,
  },
  {
    type: 'faq',
    label: 'Preguntas frecuentes',
    description: 'Acordeón con dudas comunes de tus clientes.',
    repeatable: false,
  },
  {
    type: 'gallery',
    label: 'Galería de fotos',
    description: 'Muestra tu establecimiento y productos en imágenes.',
    repeatable: false,
  },
]

export const availableTags = [
  '#Calzado',
  '#Mayorista',
  '#Cúcuta',
  '#Cuero',
  '#Textil',
  '#Marroquinería',
  '#Accesorios',
  '#Mujer',
  '#Hombre',
  '#Unisex',
  '#Invierno',
  '#Regalo',
]
