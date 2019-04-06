import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NwacCsvService {
  // data:any

  constructor(
    private _http:HttpClient,
  ) { }
  // getWeatherData(){
  //   return this._http.get("http://samples.openweathermap.org/data/2.5/history/city?q=Warren,OH&appid=b6907d289e10d714a6e88b30761fae22")
  //     // .pipe(map(result=> result))
  // }

  getData(location:String, days:Number = 45){
    return this._http.get(`/api/nwac/${location}/${days}`);
  }
}

