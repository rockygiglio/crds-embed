import { Injectable } from '@angular/core';

export interface PageState {
  path: string;
  show: boolean;
}

@Injectable()
export class StateManagerService {

  public authenticationIndex: number = 2;
  public billingIndex: number = 4;
  public confirmationIndex: number = 6;
  public fundIndex: number = 1;
  public is_loading: boolean = false;
  public paymentIndex: number = 0;
  public registrationIndex: number = 3;
  public summaryIndex: number = 5;
  public watcherInterval: any = undefined;

  public paymentState: PageState[] = [
    { path: '/payment', show: true },
    { path: '/fund', show: false },
    { path: '/auth', show: true },
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
    return this.paymentState[nextPage].path;
  }

  public getPage(pageIndex: number) {
    this.unhidePage(pageIndex);
    return this.paymentState[pageIndex].path;
  }

  public getPrevPageToShow(currentPage: number): string {
    let prevPage = currentPage - 1;
    while (!this.paymentState[prevPage].show && prevPage !== this.paymentIndex) {
      prevPage--;
    }
    return this.paymentState[prevPage].path;
  }

  public hidePage(pageIndex: number) {
    this.paymentState[pageIndex].show = false;
  }

  public unhidePage(pageIndex: number) {
      this.paymentState[pageIndex].show = true;
  }

  public watchState() {
    this.watcherInterval = setInterval(function(){}, 1000);
  }

  public stopWatchingState() {
    clearInterval(this.watcherInterval);
  }

  public setLoading(val: boolean) {
    this.is_loading = val;
  }

}
