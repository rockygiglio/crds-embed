import { Injectable } from '@angular/core';

export interface PageState {
  path: string;
  show: boolean;
}

@Injectable()
export class StateService {

  public amountIndex: number = 0;
  public authenticationIndex: number = 2;
  public billingIndex: number = 4;
  public confirmationIndex: number = 6;
  public fundIndex: number = 1;
  public is_loading: boolean = false;
  public registrationIndex: number = 3;
  public summaryIndex: number = 5;
  public currentIndex = 0;

  public paymentState: PageState[] = [
    { path: '/amount', show: true },
    { path: '/fund', show: false },
    { path: '/authentication', show: true },
    { path: '/registration', show: false },
    { path: '/billing', show: true },
    { path: '/summary', show: true },
    { path: '/confirmation', show: true}
  ];

  public getNextPageToShow(currentPage: number): string {
    let nextPage = currentPage + 1;
    while (!this.paymentState[nextPage].show && nextPage !== this.confirmationIndex) {
      nextPage++;
    }
    this.currentIndex = nextPage;
    return this.paymentState[nextPage].path;
  }

  public getPage(pageIndex: number) {
    this.unhidePage(pageIndex);
    return this.paymentState[pageIndex].path;
  }

  public getPrevPageToShow(currentPage: number): string {
    let prevPage = currentPage - 1;
    while (!this.paymentState[prevPage].show && prevPage !== this.amountIndex) {
      prevPage--;
    }
    this.currentIndex = prevPage;
    return this.paymentState[prevPage].path;
  }

  public hidePage(pageIndex: number) {
    this.paymentState[pageIndex].show = false;
  }

  public unhidePage(pageIndex: number) {
      this.paymentState[pageIndex].show = true;
  }

  public setLoading(val: boolean) {
    this.is_loading = val;
  }

}
