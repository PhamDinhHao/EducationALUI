// src/modules/Course/Service/course.service.ts
import { http } from '@/shared/lib/http'
import { Course } from '../types/Course'

export async function getCourses(): Promise<Course[]> {
  const { data } = await http.get<Course[]>('/api/v1/courses')
  return data
}

export async function updateCourseFields(
  courseId: number,
    fieldId: number,

  fields: Record<string, any>
): Promise<Course> {
  const { data } = await http.put(`/api/v1/courses/${courseId}/fields/${fieldId}`, {
    customFields: fields,
  })
  return data
}
export async function getCourseById(courseId: number): Promise<Course> {
  const { data } = await http.get<Course>(`/api/v1/courses/${courseId}`);
  return data;
}