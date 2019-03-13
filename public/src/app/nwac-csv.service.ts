import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
// import * as csvjson from 'csvjson'
// const csvjson = require('csvjson')
// import { Papa } from 'ngx-papaparse'


@Injectable({
  providedIn: 'root'
})
export class NwacCsvService {
  // data:any

  constructor(
    private _http:HttpClient,
    // private _papa:Papa
  ) { }
  // getWeatherData(){
  //   return this._http.get("http://samples.openweathermap.org/data/2.5/history/city?q=Warren,OH&appid=b6907d289e10d714a6e88b30761fae22")
  //     // .pipe(map(result=> result))
  // }

  getData(location:String){
    return this._http.get(`/api/nwac/${location}`)
      // .pipe(map(data => this._papa.parse(data))
  }
}

