import { SetStorage } from "@/data/protocols/storage/local-storage"

export class LocalStorageAdapter implements SetStorage {
    set(key: string, value: string): Promise<void> {
        localStorage.setItem(key, value)
        return Promise.resolve()
    }
}