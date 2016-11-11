import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';

@Injectable()
export class UserAuthenticationService {

  constructor(private http: HttpClientService, private crdsCookies: CrdsCookieService) { }


}
