export interface Course {
  value: any
  id: number
  title: string
    description: string
  img: string
  url?: string
  customFields?: Record<string, string | number | boolean>
    courseType?: string // <-- thêm dòng này
    lessons?: Lesson[]
    price: number;
  priceDiscount?: number; // 👈 thêm dòng này
  teacher: string;
  students: number;
  duration: string;
introductions?: string[];

}
export interface Lesson {
  id: number
  title: string
  description: string
  updatedAt?: string; // <-- thêm dòng này
  duration: number
  src: string
}