import { type SetStorage } from '@/data/protocols/storage/local-storage'

export class LocalStorageAdapter implements SetStorage {
  async set(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
    await Promise.resolve()
  }
}
