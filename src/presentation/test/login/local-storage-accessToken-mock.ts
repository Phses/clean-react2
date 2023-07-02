import { AccessTokenStorage } from "@/domain/usecases/local-storage/local-store-token";

export class LocalStorageAccessTokenMock implements AccessTokenStorage {
    accessToken: string 
    async save(accessToken: string): Promise<void> {
        this.accessToken = accessToken
        return Promise.resolve()
    }
}