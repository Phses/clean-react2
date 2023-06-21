import { AuthParams, AuthToken } from "@/domain/models";


export interface Authentication {
    auth(params: AuthParams): Promise<AuthToken> 
}