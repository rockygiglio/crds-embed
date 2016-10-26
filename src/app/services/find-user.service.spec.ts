/* tslint:disable:max-line-length */

import { FindUserService } from './find-user.service';

describe('FindUserService', () => {

  it('should successfully get a user when given their email', () => {
    let response = http.get('assets/mock-data/user-get.json');
    fixture.getUserByEmail('example@example.com').subscribe((res: Response) => {
      expect(res.json()).toEqual(response);
    });
  });
});