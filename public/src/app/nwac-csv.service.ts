import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NwacCsvService {

  constructor(private _http: HttpClient) { }

  getData(location: string, days: number = 45) {
    return this._http.get(`/api/nwac/${location}/${days}`);
  }

  getDemoData() {
    return this._http.get('api/nwac/demo');
  }
}

