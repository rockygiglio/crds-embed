import { Injectable } from '@angular/core';

@Injectable()
export class IFrameParentService {

  constructor() { }

  public getIFrameParentUrl(): any {
    let url: any = (window.location !== window.parent.location)
      ? document.referrer
      : document.location.href;
    console.log('Get iframe parent called');
    console.log(url);
  };

}
