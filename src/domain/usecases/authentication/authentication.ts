import { AuthParams, AuthToken } from "@/domain/models/auth-models";


export interface Authentication {
    auth(params: AuthParams): Promise<AuthToken> 
}