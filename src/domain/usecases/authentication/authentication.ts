import { AuthParams, AuthToken } from "@/domain/models/auth-models";


export interface authentication {
    auth(params: AuthParams): Promise<AuthToken>; 
}