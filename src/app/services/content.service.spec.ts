/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SessionService } from './session.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, RequestOptions, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { ContentService } from './content.service';
import { ContentBlock } from '../models/content-block';

describe('Service: Content', () => {

  const mockContent1 = {
    'id': 1,
    'title': 'sampleContentBlockTitle1',
    'content': 'blah blah blah',
    'type': 'error',
    'category': 'mycategory',
    'className': 'myclassname'
  };

  const mockContent2 = {
    'id': 1,
    'title': 'sampleContentBlockTitle2',
    'content': 'more blah blah blah',
    'type': 'error',
    'category': 'mycategory',
    'className': 'myclassname'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContentService,
        MockBackend,
        BaseRequestOptions,
        CookieService,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }]
    });
  });

  it('should create an instance', inject([ContentService], (service: ContentService) => {
    expect(service).toBeTruthy();
  }));

  it('should get content', inject([ContentService], (service: ContentService) => {
    let title = 'sampleContentBlockTitle1';
    service.contentBlocks = new Array<ContentBlock>();
    service.contentBlocks.push(mockContent1);
    service.contentBlocks.push(mockContent2);

    let content = service.getContent(title);

    expect(content).toBeDefined;
    expect(content).toBe('blah blah blah');
  }));

});
