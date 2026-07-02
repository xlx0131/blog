declare module '@/data/contents.js' {
  export const projects: {
    id: number
    title: string
    subtitle: string
    description: string
    url: string
    tags: string[]
    tech: string[]
    cover: string
    year: string
    highlights: string[]
  }[]

  export const projectDetails: Record<number, {
    title: string
    subtitle: string
    description: string
    url: string
    tags: string[]
    tech: string[]
    year: string
    highlights: string[]
    details: string
  }>

  export const articles: {
    id: number
    title: string
    date: string
    category: string
    readingTime: string
    words: string
    summary: string
    tags: string[]
  }[]

  export const articleDetails: Record<string, {
    id: number
    title: string
    date: string
    category: string
    content: string
  }>
}
