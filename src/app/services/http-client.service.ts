import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

@Injectable()
export class HttpClientService {

  private readonly accessToken: string = (process.env.CRDS_ENV || '') + 'sessionId';
  private readonly refreshToken: string = (process.env.CRDS_ENV || '') + 'refreshToken';
  private cookieOptions: CookieOptionsArgs;

  constructor(private http: Http, private cookieService: CookieService) {
    if (process.env.CRDS_COOKIE_DOMAIN) {
      this.cookieOptions = { domain: process.env.CRDS_COOKIE_DOMAIN };
    }
  }

  get(url: string, options?: RequestOptions) {
    let requestOptions = this.getRequestOption(options);
    return this.http.get(url, requestOptions).map(this.extractAuthToken);
  }

  put(url: string, data: any, options?: RequestOptions) {
    let requestOptions = this.getRequestOption(options);
    return this.http.put(url, data, requestOptions).map(this.extractAuthToken);
  }

  post(url: string, data: any, options?: RequestOptions) {
    let requestOptions = this.getRequestOption(options);
    return this.http.post(url, data, requestOptions).map(this.extractAuthToken);
  }

  private extractAuthToken = (res: Response) => {
    if (res.headers != null && res.headers.get('Authorization')) {
      this.setAccessToken(res.headers.get('Authorization'));
    };
    if (res.headers != null && res.headers.get('RefreshToken')) {
      this.setRefreshToken(res.headers.get('RefreshToken'));
    }

    let body = res.json();
    if (body != null && body.userToken) {
      this.setAccessToken(body.userToken);
    }
    if (body != null && body.refreshToken) {
      this.setRefreshToken(body.refreshToken);
    }

    return body || {};
  }

  hasToken(): boolean {
    return !!this.cookieService.get(this.accessToken);
  }

  clearTokens(): void {
    this.cookieService.remove(this.accessToken, this.cookieOptions);
    this.cookieService.remove(this.refreshToken, this.cookieOptions);
  }

  getAccessToken(): string {
    return this.cookieService.get(this.accessToken);
  }

  getRefreshToken(): string {
    return this.cookieService.get(this.refreshToken);
  }

  setAccessToken(value: string): void {
    this.cookieService.put(this.accessToken, value, this.cookieOptions);
  }

  setRefreshToken(value: string): void {
    this.cookieService.put(this.refreshToken, value, this.cookieOptions);
  }

  getRequestOption(options?: RequestOptions):  RequestOptions {
    let reqOptions = options || new RequestOptions();
    reqOptions.headers = this.createAuthorizationHeader(reqOptions.headers);
    return reqOptions;
  }

  private createAuthorizationHeader(headers?: Headers) {
    let reqHeaders =  headers || new Headers();
    reqHeaders.set('Authorization', this.getAccessToken());
    reqHeaders.set('Content-Type', 'application/json');
    reqHeaders.set('Accept', 'application/json, text/plain, */*');
    return reqHeaders;
  }

}
