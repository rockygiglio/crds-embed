import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Http } from '@angular/http';
import { ContentBlock } from '../models/content-block';

@Injectable()
export class ContentService {

  contentBlocks: ContentBlock[];

  constructor(private http: Http) {}

  loadData(categories = Array('common')) {
    this.getContentBlocks(categories).subscribe(contentBlocks => {
      this.contentBlocks = contentBlocks;
      console.log(this.contentBlocks);
    });
  }

  getContentBlocks (categories: Array<string>) {

    let apiUrl = process.env.CRDS_CMS_ENDPOINT + 'api/contentblock';
    if (Array.isArray(categories) && categories.length > 0) {
      for (let i = 0; i < categories.length; i++) {
        let pre = '&';
        if (i === 0) {
          pre = '?';
        }
        apiUrl += pre + 'category[]=' + categories[i];
      }
    }

    return this.http.get(apiUrl)
      .map(res => {
        return res.json().contentblocks;
      })
      .catch(this.handleError);
  }

  getContent (contentBlockTitle) {
    return this.contentBlocks.find(x => x.title === contentBlockTitle).content;
  }

  private handleError (error: any) {
    return Observable.throw(error.json().error || 'Server error');
  }

}
