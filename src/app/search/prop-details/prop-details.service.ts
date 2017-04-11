import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../config/app.config';

@Injectable()
export class PropDetailsService {

  constructor(private http: Http, private config: AppConfig) { }

  getPropDetailsURL() {
    return this.config.get('protocol') + "://"
      + this.config.get('front-end-host') + ':' + this.config.get('front-end-port') + '/'
      + this.config.get("property-uri");
  }

  getPropDetails(propId: number): Observable<any> {
    let url = this.getPropDetailsURL() + '?id=' + propId;
    return this.http.get(url)
      .map(this.extractPropData)
      .catch(this.handleError);
  }

  private extractPropData(res: Response) {
    let body = res.json(); 
    return body || {};
  }

  private handleError(error: Response | any) {
    // TODO: use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error("errMsg");
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}