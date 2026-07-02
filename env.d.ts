/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/data/network-levels' {
  export const levels: any
  export type Device = any
  export type Connection = any
}

declare module '@/data/network-levels.js' {
  export const levels: any
  export type Device = any
  export type Connection = any
}

declare module '@/data/bookmarks.js' {
  export const bookmarks: any
}

declare module '@/data/admin-store.js' {
  export function getArticles(): Promise<any[]>
  export function saveArticle(article: any): Promise<any>
  export function deleteArticle(id: string): Promise<void>
  export function getBookmarkCats(): Promise<any[]>
  export function saveBookmarkCats(cats: any[]): Promise<void>
  export function addBookmark(item: any): Promise<any>
  export function updateBookmark(item: any): Promise<any>
  export function deleteBookmark(id: string, type?: string): Promise<void>
}
