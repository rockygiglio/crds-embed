import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ContentService {

  contentBlocks: Array<any> = new Array();

  constructor(private http: Http) {}

  loadData(categories = Array('common')) {
    this.getContentBlocks(categories).subscribe(contentBlocks => {
      this.contentBlocks = contentBlocks;
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

  getContent(contentBlockTitle) {
    let block;
    if (Array.isArray(this.contentBlocks) && this.contentBlocks.length > 0) {
      for (let i = 0; i < this.contentBlocks.length; i++) {
        if (this.contentBlocks[i] !== undefined 
          && this.contentBlocks[i].title !== undefined
          && this.contentBlocks[i].title === contentBlockTitle) {
            block = this.contentBlocks[i];
            break;  
          }
      }
    }
    if (block !== undefined && block.content !== undefined) {
      return block.content;
    }
    return '';
  }

  private handleError (error: any) {
    return [[]];
  }

}
