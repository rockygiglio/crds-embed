import { Injectable } from '@angular/core';

@Injectable()
export class IFrameParentService {

  constructor() { }

  public getIFrameParentUrl(): string {

    let url: any = (window.location !== window.parent.location)
      ? document.referrer
      : document.location.href;

    return url;
  };

}
