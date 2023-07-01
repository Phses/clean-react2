import { SetStorage } from "../protocols/storage/local-storage"

export class SetStorageSpy implements SetStorage {
    key: string
    value: string
    set(key: string, value: string): Promise<void> {
        this.key = key
        this.value = value
        return Promise.resolve()
    }
}