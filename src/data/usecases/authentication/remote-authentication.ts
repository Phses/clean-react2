/* eslint-disable @typescript-eslint/no-unused-expressions */
import { type HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/erros'
import { type AuthParams, type AuthToken } from '@/domain/models'
import { type Authentication } from '@/domain/usecases/authentication'

export class RemoteAuthentication implements Authentication {
  private readonly url: string
  private readonly httpPostClient: HttpPostClient<AuthParams, AuthToken>
  constructor(url: string, httpPostClient: HttpPostClient<AuthParams, AuthToken>) {
    this.url = url
    this.httpPostClient = httpPostClient
  }

  async auth(params: AuthParams): Promise<AuthToken> {
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
