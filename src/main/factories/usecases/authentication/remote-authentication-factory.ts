import { RemoteAuthentication } from '@/data/usecases/authentication'
import { makeHttpClient } from '../../http/http-client-factory'
import { type Authentication } from '@/domain/usecases/authentication'
import { makeUrl } from '@/main/factories/http/http-url-factory'

export const makeRemoteAuthentication = (): Authentication => {
  const url = makeUrl('conta/login')
  return new RemoteAuthentication(url, makeHttpClient())
}
