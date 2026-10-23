export const MODALITIES = ["presencial", "virtual", "hibrida"] as const;
export type Modality = (typeof MODALITIES)[number];

export const INQUIRY_STATUSES = ["nueva", "contactada", "inscrita"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const PAYMENT_STATUSES = ["sin_comprobante", "en_revision", "aprobado", "rechazado"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const CATEGORIES = ["programa", "seminario", "otro"] as const;
export type Category = (typeof CATEGORIES)[number];
export const CATEGORY_LABEL: Record<Category, string> = {
  programa: "Programas",
  seminario: "Seminarios",
  otro: "Otros",
};

export type CourseModule = { title: string; description: string };

export type Teacher = {
  id: string;
  name: string;
  photo_url: string | null;
  headline: string | null;
  bio: string | null;
  experience: string | null;
  specialty: string | null;
  visible: boolean;
  sort: number;
};

export type CourseLink = { id: string; slug: string; title: string };

export type TeacherWithCourses = Teacher & { courses: CourseLink[] };

export type Course = {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  category: Category;
  modality: Modality;
  short_description: string | null;
  summary: string | null;
  objectives: string[];
  audience: string | null;
  requirements: string[];
  modules: CourseModule[];
  teacher_id: string | null;
  duration: string | null;
  schedule: string | null;
  start_date: string | null;
  price: number | null;
  currency: string;
  payment_methods: string[];
  includes: string[];
  certificate: string | null;
  brief_url: string | null;
  brief_public: boolean;
  visible: boolean;
  featured: boolean;
  sort: number;
  created_at: string;
};

export type CourseWithTeacher = Course & { teacher: Teacher | null };

export type Inquiry = {
  id: string;
  created_at: string;
  kind: "consulta" | "reserva";
  full_name: string;
  email: string;
  phone: string;
  course_id: string | null;
  course_title: string | null;
  message: string | null;
  status: InquiryStatus;
  payment_status: PaymentStatus;
  receipt_path: string | null;
  cedula: string | null;
  username: string | null;
  credentials_sent_at: string | null;
  notes: string | null;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  visible: boolean;
  sort: number;
};

export type Testimonial = {
  id: string;
  name: string;
  course: string | null;
  quote: string;
  photo_url: string | null;
  authorized: boolean;
  visible: boolean;
  sort: number;
};

export type BankAccount = {
  bank: string;
  holder: string;
  idNumber: string;
  accountType: string;
  account: string;
};

export type TitledText = { title: string; text: string };

export type Stat = { value: string; prefix: string; suffix: string; label: string };

export type SiteSettings = {
  whatsapp: string;
  salesWhatsapp: string;
  campusUrl: string;
  promoLabel: string;
  countryCode: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
  mapEmbed: string;
  socials: {
    instagram: string;
    facebook: string;
    tiktok: string;
    linkedin: string;
    youtube: string;
  };
  bankAccounts: BankAccount[];
  paymentNote: string;
  hero: { eyebrow: string; title: string; highlight: string; subtitle: string };
  benefits: TitledText[];
  stats: Stat[];
  about: {
    intro: string;
    history: string;
    mission: string;
    vision: string;
    methodology: TitledText[];
    gallery: string[];
  };
  privacy: string;
  seoDescription: string;
};
