import { ApiService } from '@/shared/services'

const BaseUrl = 'blogs'
const BaseUrlTags = 'blog-tags'
export function getBlogList(params: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}`, params).then((resp) => resp)
}

export function getBlogTags() {
  return ApiService.get(`${BaseUrlTags}`).then((resp) => resp)
}

export function getRecentPosts(params?: { [key: string]: any }) {
  return ApiService.get(`${BaseUrl}/recent-posts`,params).then((resp) => resp)
}

export function getBlogDetail(id: number | string) {
  return ApiService.get(`${BaseUrl}/${id}`).then((resp) => resp)
}

export function createBlog(body: { [key: string]: any }) {
  return ApiService.upload(`${BaseUrl}`, body).then((resp) => resp)
}

export function updateBlog(id: number | string, body: { [key: string]: any }) {
  return ApiService.putUpload(`${BaseUrl}/${id}`, body).then((resp) => resp)
}

export function deleteBlog(id: string) {
  return ApiService.delete(`${BaseUrl}/${id}`).then((resp) => resp)
}
const BaseUrlRelatedPosts = 'related-posts'
export function getRelatedPosts(id: number | string) {
  return ApiService.get(`${BaseUrl}/${BaseUrlRelatedPosts}/${id}`).then((resp) => resp)
}

const BaseUrlComments = 'comments'
export function getComments(id: number | string) {
  return ApiService.get(`blog-comments/${BaseUrl}/${id}/${BaseUrlComments}`).then((resp) => resp)
}
export function createComment(id: number | string, body: { [key: string]: any }) {
  return ApiService.post(`blog-comments/${BaseUrl}/${id}/${BaseUrlComments}`, body).then((resp) => resp)
}
export function updateComment(id: number | string, body: { [key: string]: any }) {
  return ApiService.put(`blog-comments/${BaseUrl}/${id}/${BaseUrlComments}`, body).then((resp) => resp)
}
export function deleteComment(id: number | string) {
  return ApiService.delete(`blog-comments/${BaseUrl}/${id}/${BaseUrlComments}`).then((resp) => resp)
}




