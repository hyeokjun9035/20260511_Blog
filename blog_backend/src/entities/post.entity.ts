export interface Post {
  id: number
  title: string
  content: string
  author?: string
  published: boolean
  created_at: string | Date
  updated_at: string | Date
}
