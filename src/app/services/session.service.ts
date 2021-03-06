import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

@Injectable()
export class SessionService {

  private readonly accessToken: string = (process.env.CRDS_ENV || '') + 'sessionId';
  private readonly refreshToken: string = (process.env.CRDS_ENV || '') + 'refreshToken';
  private cookieOptions: CookieOptionsArgs;

  private readonly contactId: string = (process.env.CRDS_ENV || '') + 'contactId';
  
  private readonly userId: string = 'userId';

  constructor(private http: Http, public cookieService: CookieService, private defaultRequestOptions: RequestOptions) {
    if (process.env.CRDS_COOKIE_DOMAIN) {
      this.cookieOptions = { domain: process.env.CRDS_COOKIE_DOMAIN };
    }
  }

  public get(url: string, options?: RequestOptions) {
    let requestOptions = this.getRequestOption(options);
    return this.http.get(url, requestOptions).map(this.extractAuthToken);
  }

  public put(url: string, data: any, options?: RequestOptions) {
    let requestOptions = this.getRequestOption(options);
    return this.http.put(url, data, requestOptions).map(this.extractAuthToken);
  }

  public post(url: string, data: any, options?: RequestOptions) {
    let requestOptions = this.getRequestOption(options);
    return this.http.post(url, data, requestOptions).map(this.extractAuthToken);
  }

  private extractAuthToken = (res: Response) => {
    if (res.headers != null && res.headers.get('Authorization')) {
      this.setAccessToken(res.headers.get('Authorization'));
    }

    if (res.headers != null && res.headers.get('RefreshToken')) {
      this.setRefreshToken(res.headers.get('RefreshToken'));
    }

    let body: any;

    try {
      body = res.json();
    } catch (err) {
      body = '';
    }

    if (body != null && body.userToken) {
      this.setAccessToken(body.userToken);
    }
    if (body != null && body.refreshToken) {
      this.setRefreshToken(body.refreshToken);
    }

    return body || {};
  }

  public hasToken(): boolean {
    return !!this.cookieService.get(this.accessToken);
  }

  public clearTokens(): void {
    this.cookieService.remove(this.accessToken, this.cookieOptions);
    this.cookieService.remove(this.refreshToken, this.cookieOptions);
  }

  public getAccessToken(): string {
    return this.cookieService.get(this.accessToken);
  }

  public getRefreshToken(): string {
    return this.cookieService.get(this.refreshToken);
  }

  public setAccessToken(value: string): void {
    this.cookieService.put(this.accessToken, value, this.cookieOptions);
  }

  public setRefreshToken(value: string): void {
    this.cookieService.put(this.refreshToken, value, this.cookieOptions);
  }

  public getRequestOption(options?: RequestOptions):  RequestOptions {
    let reqOptions = options || new RequestOptions();
    reqOptions.headers = this.createAuthorizationHeader(reqOptions.headers);
    return reqOptions;
  }

  public getContactId(): number {
    return +this.cookieService.get(this.contactId);
  }

    public getUserId(): number {
    return +this.cookieService.get(this.userId);
  }

  public setContactId(contactId: string): void {
    this.cookieService.put(this.contactId, contactId, this.cookieOptions);
  }

  private createAuthorizationHeader(headers?: Headers) {
    let reqHeaders =  headers || new Headers(this.defaultRequestOptions.headers);
    reqHeaders.set('Authorization', this.getAccessToken());
    return reqHeaders;
  }

}
