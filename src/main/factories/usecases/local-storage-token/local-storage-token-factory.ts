import { AccessTokenLocalStorage } from '@/data/usecases/storage/local-storage-accessToken'
import { type AccessTokenStorage } from '@/domain/usecases/local-storage/local-store-token'
import { makeSetStorage } from '../../cache/set-storage-cache'

export const makeLocalStorageAcessToken = (): AccessTokenStorage => {
  return new AccessTokenLocalStorage(makeSetStorage())
}
