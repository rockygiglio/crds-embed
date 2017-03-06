import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

  // HACK ALERT! This is specific to copying the add me to the map functionality


@Injectable()
export class LoginRedirectService {
  private DefaultAuthenticatedRoute = '/'; // HACK ALERT! Original value was '/host-signup
  private SigninRoute = '/signin';

  private originalTarget: string;

  constructor(private router: Router) { }

  // HACK ALERT! Function added to expose private member to Authentication component
  public originalTargetIsSet() {
    return (this.originalTarget !== null && this.originalTarget !== undefined);
  }

  public getOriginalTarget() {
    return this.originalTarget;
  }

  // HACK ALERT! Added '?type=donation' to query string
  public redirectToLogin(target = this.DefaultAuthenticatedRoute): void {
    this.originalTarget = target;
    this.router.navigate([this.SigninRoute], {queryParams: {type: 'donation'}});
  }

  // HACK ALERT! Added '?type=donation' to query string
  public redirectToTarget(target = this.DefaultAuthenticatedRoute): void {
    if (this.originalTarget) {
      this.router.navigate([this.originalTarget], {queryParams: {type: 'donation'}});
    } else {
      this.router.navigate([target]);
    }
  }
}
