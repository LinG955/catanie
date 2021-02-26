import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { UserApi } from "shared/sdk";

@Injectable({
  providedIn: "root",
})
export class DatasetsGuard implements CanActivate {
  constructor(private router: Router, private userApi: UserApi) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.userApi
      .getCurrent()
      .toPromise()
      .catch(() => {
        // this.router.navigateByUrl("/anonymous" + state.url);
        // 登录超时后返回登录页面
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
      .then(() => true);
  }
}
