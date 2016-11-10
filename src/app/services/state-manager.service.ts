import { Injectable } from '@angular/core';

export interface PageState {
  path: string;
  show: boolean;
}

@Injectable()
export class StateManagerService {

  public is_loading: boolean = false;

  public paymentIndex: number = 0;
  public authenticationIndex: number = 1;
  public billingIndex: number = 2;
  public summaryIndex: number = 3;
  public confirmationIndex: number = 4;

  public paymentState: PageState[] = [
    { path: '/payment', show: true },
    { path: '/auth', show: true },
    { path: '/billing', show: true },
    { path: '/summary', show: true },
    { path: '/confirmation', show: true}
  ];

  public hidePage(pageIndex: number) {
      this.paymentState[this.authenticationIndex].show = false;
  }

  public unhidePage(pageIndex: number) {
      this.paymentState[this.authenticationIndex].show = true;
  }

  public getNextPageToShow(currentPage: number): string {
    let nextPage = currentPage + 1;
    while (!this.paymentState[nextPage].show && nextPage !== this.confirmationIndex) {
      nextPage++;
    }
    return this.paymentState[nextPage].path;
  }

  public getPrevPageToShow(currentPage: number): string {
    let prevPage = currentPage - 1;
    while (!this.paymentState[prevPage].show && prevPage !== this.paymentIndex) {
      prevPage--;
    }
    return this.paymentState[prevPage].path;
  }

  public getPage(pageIndex: number) {
    this.unhidePage(pageIndex);
    return this.paymentState[pageIndex].path;
  }
}