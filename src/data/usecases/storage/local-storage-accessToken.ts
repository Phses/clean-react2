import { SetStorage } from "@/data/protocols/storage/local-storage"
import { AccessTokenStorage } from "@/domain/usecases/local-storage/local-store-token"

export class AccessTokenLocalStorage implements AccessTokenStorage {
    constructor(private setStorage: SetStorage) {}
    save(accessToken: string): Promise<void> {
        this.setStorage.set('accessToken', accessToken)
        return Promise.resolve()
    }
}