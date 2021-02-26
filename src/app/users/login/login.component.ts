import { Component, OnDestroy, OnInit, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import {loginAction, lssfLoginAction} from "state-management/actions/user.actions";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import {
  getIsLoggedIn,
  getIsLoggingIn
} from "state-management/selectors/user.selectors";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { MatDialog } from "@angular/material/dialog";
import { PrivacyDialogComponent } from "users/privacy-dialog/privacy-dialog.component";
import {DOCUMENT} from "@angular/common";
import {LssfAuthService} from "../lssf-auth.service";
import {addGroupFilterAction} from "../../state-management/actions/datasets.actions";

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Component to handle user login. Allows for AD and
 * functional account login.
 * @export
 * @class LoginComponent
 */
@Component({
  selector: "login-form",
  templateUrl: "./login.component.html",
  styleUrls: ["login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  private proceedSubscription: Subscription;
  private hasUser$ = this.store.pipe(
    select(getIsLoggedIn),
    filter(is => is)
  );

  returnUrl: string;
  hide = true;

  public loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
    rememberMe: true
  });

  loading$ = this.store.pipe(select(getIsLoggingIn));

  openPrivacyDialog() {
    this.dialog.open(PrivacyDialogComponent, {
      width: "auto"
    });
  }

  /**
   * Default to an Active directory login attempt initially. Fallback to `local`
   * accounts if fails
   * @memberof LoginComponent
   */
  onLogin() {
    console.log("formValue: ", this.loginForm.value);
    const form: LoginForm = this.loginForm.value;
    this.store.dispatch(loginAction({ form }));
  }

  /**
   * Creates an instance of LoginComponent.
   * @param {FormBuilder} fb - generates model driven user login form
   * @param {Router} router - handles page nav
   * @param {ActivatedRoute} route - access parameters in URL
   * @param {Store<any>} store
   * @memberof LoginComponent
   */
  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    @Inject(DOCUMENT) private doc: Document,

  ) {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";

    // 通过referrer判断是否是从中科院平台重定向过来的，是的话触发lssfLoginAction，以URL为参数传递
    console.log("url: ", this.doc.URL);
    if (this.doc.referrer.indexOf("4200") !== -1) {
      const redirectUrl: string = this.doc.URL;
      // const group = "P2021-HLS-PT-002434";
      // this.store.dispatch(addGroupFilterAction({ group }));
      this.store.dispatch(lssfLoginAction({redirectUrl}));
    }

  }

  ngOnInit() {
    this.proceedSubscription = this.hasUser$.subscribe(() => {
      console.log(this.returnUrl);
      this.router.navigateByUrl("/datasets");
    });
  }

  ngOnDestroy() {
    this.proceedSubscription.unsubscribe();
  }
}
