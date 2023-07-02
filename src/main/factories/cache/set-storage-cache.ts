import { SetStorage } from "@/data/protocols/storage/local-storage"
import { LocalStorageAdapter } from "@/infra/cache/local-storage-adapter"

export const makeSetStorage = (): SetStorage => {
    return new LocalStorageAdapter()
}