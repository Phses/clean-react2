export enum HttpStatusCode {
    unauthorized,
    noContent
}

export type HttpResponse ={
    StatusCode: HttpStatusCode
}