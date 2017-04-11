import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class REListingService {

  constructor(private http: Http) { }

  getREListing(bounds: any, listingURL:string, filterVal: any, sortBy:number): Observable<any[]> {

    let url = listingURL + "?" +
      "nelon=" + bounds['b']['f'] +
      "&nelat=" + bounds['f']['b'] +
      "&swlon=" + bounds['b']['b'] +
      "&swlat=" + bounds['f']['f'] +
      "&page=1&pageSize=50" +
      "&sort=" + sortBy +
      "&lprice=" + filterVal.lprice +
      "&uprice=" + filterVal.uprice +
      "&nobed=" + filterVal.nobed +
      "&nobath=" + filterVal.nobath +
      '&'+filterVal.ptype;

    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.items || {};
  }

  getMaxPrice(bounds: any, listingURL:string, filterVal: any): Observable<any[]> {

    let url = listingURL + "?" +
      "nelon=" + bounds['b']['f'] +
      "&nelat=" + bounds['f']['b'] +
      "&swlon=" + bounds['b']['b'] +
      "&swlat=" + bounds['f']['f'] +
      "&getItemCount=1" +
      "&lprice=" + filterVal.lprice +
      "&uprice=" + filterVal.uprice;

    return this.http.get(url)
      .map(this.extractMax)
      .catch(this.handleError);
  }

  private extractMax(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: Response | any) {
    // use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}