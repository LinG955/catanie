import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { APP_CONFIG, AppConfig } from "../app-config.module";

/**
 * Handles log in requests for AD and Functional users
 * @export
 * @class LssfAuthService
 */

export interface LssfAccessToken {
  id: string;
  userId: string;
  searchGroup: string;
}

@Injectable()
export class LssfAuthService {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {}

  /**
   * @param redirectUrl
   */
  login(
    redirectUrl: string
  ): Observable<HttpResponse<LssfAccessToken>> {
    const creds = {};
    creds["redirectUrl"] = redirectUrl;
    const headers = new HttpHeaders();
    // const url = LoopBackConfig.getPath() + this.config.externalAuthEndpoint;
    const url = this.config.externalAuthEndpoint;
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    return this.http.post<LssfAccessToken>(url, creds, { observe: "response" });
  }
}
