export interface Task {
  id: string
  title: string
  done: boolean
  dueDate?: string | null // YYYY-MM-DD
}

export type Filter = 'all' | 'active' | 'done'
export type Language = 'en' | 'uk' | 'de'
export type Theme = 'light' | 'dark' | 'system'
