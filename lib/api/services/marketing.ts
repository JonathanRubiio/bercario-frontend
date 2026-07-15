import { apiClient } from '../client'

export type SuccessStory = {
  id: string
  merchant: string
  location: string
  owner: string
  niche: string
  metric: string
  metricLabel: string
  growth: string
  growthLabel: string
  quote: string
  avatar: string
}

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  readTime: string
  category: string
}

export const marketingService = {
  getSuccessStories: async (): Promise<SuccessStory[]> => {
    return apiClient.get('/api/public/success-stories')
  },
  getBlogPosts: async (): Promise<BlogPost[]> => {
    return apiClient.get('/api/public/blog-posts')
  },
}
