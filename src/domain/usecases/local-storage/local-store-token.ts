export interface AccessTokenStorage {
  save: (accessToken: string) => Promise<void>
}
