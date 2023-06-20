import { authParams, authToken } from "../models/models";


export interface authentication {
    auth(params: authParams): Promise<authToken>; 
}