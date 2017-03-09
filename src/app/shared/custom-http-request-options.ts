import { Injectable } from '@angular/core';
import { BaseRequestOptions, Headers } from '@angular/http';

/** 
 * Extend BaseRequestOptions to add custom HTTP request headers.  This is only instantiated
 * once during application initialization, so do NOT use this for headers that might change
 * during the course of an application (like an authorization token).
 */
@Injectable()
export class CustomHttpRequestOptions extends BaseRequestOptions {
  constructor () {
    super();
    this.headers = new Headers();
    let apiToken: string = process.env.EMBED_API_TOKEN || '';
    if (apiToken.length > 0) {
      this.headers.set('Crds-Api-Key', apiToken);
    }

    this.headers.set('Content-Type', 'application/json');
    this.headers.set('Accept', 'application/json, text/plain, */*');
  }
}