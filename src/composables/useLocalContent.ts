import { readonly } from 'vue'
import { useStorage } from '@vueuse/core'
import type { Content } from '@/data/content'

const STORAGE_KEY = 'local-contents'

export function useLocalContent() {
  // Initialize localStorage with empty array if not exists
  const contents = useStorage<Content[]>(STORAGE_KEY, [])

  const saveContent = (content: Omit<Content, 'id' | 'published_on' | 'updated_on'>) => {
    const now = new Date().toISOString()
    const newContent: Content = {
      ...content,
      id: crypto.randomUUID(),
      published_on: now,
      updated_on: now,
      author: 'Local User' // You can customize this based on your auth system
    }

    contents.value = [...contents.value, newContent]
    return newContent
  }

  const updateContent = (id: string, updates: Partial<Omit<Content, 'id' | 'published_on'>>) => {
    const index = contents.value.findIndex(content => content.id === id)
    if (index !== -1) {
      contents.value[index] = {
        ...contents.value[index],
        ...updates,
        updated_on: new Date().toISOString()
      }
      return contents.value[index]
    }
    return null
  }

  const deleteContent = (id: string) => {
    contents.value = contents.value.filter(content => content.id !== id)
  }

  const getContent = (id: string): Content | undefined => {
    return contents.value.find(content => content.id === id)
  }

  const getAllContents = (): Content[] => {
    return contents.value
  }

  return {
    contents: readonly(contents),
    saveContent,
    updateContent,
    deleteContent,
    getContent,
    getAllContents
  }
}
