/* eslint-disable @typescript-eslint/no-unused-expressions */
import { type HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/erros'
import { type AuthParams, type AuthAccount } from '@/domain/models'
import { type Authentication } from '@/domain/usecases/authentication'

export class RemoteAuthentication implements Authentication {
  private readonly url: string
  private readonly httpPostClient: HttpPostClient<AuthParams, AuthAccount>
  constructor(url: string, httpPostClient: HttpPostClient<AuthParams, AuthAccount>) {
    this.url = url
    this.httpPostClient = httpPostClient
  }

  async auth(params: AuthParams): Promise<AuthAccount> {
    const response = await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    switch (response.StatusCode) {
      case (HttpStatusCode.ok):
        return response.Body
      case (HttpStatusCode.unauthorized):
        throw new InvalidCredentialsError()
      default:
        throw new UnexpectedError()
    }
  }
}
