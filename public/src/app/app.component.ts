import { Component } from '@angular/core'; 
import { NwacCsvService } from './nwac-csv.service'
import { Chart } from 'chart.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chart = null;
  constructor(
    private _nwac:NwacCsvService,
    // private _chart:Chart
  ){}

  ngOnInit(){}
  //   this._nwac.getWeatherData().subscribe(res => {
  //     // console.log(data))
  //     let temp_max = res['list'].map(res => res.main.temp_max);
  //     let temp_min = res['list'].map(res => res.main.temp_min);
  //     let alldates = res['list'].map(res => res.dt)

  //     let weatherDates = []
  //     alldates.forEach((res) => {
  //     let jsdate = new Date(res * 1000)
  //     weatherDates.push(jsdate.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }))
  //     })
      
  //     this.chart = new Chart('canvas', {
  //       type: 'line',
  //       data: {
  //         labels: weatherDates,
  //         datasets: [
  //           { 
  //             data: temp_max,
  //             borderColor: "#3cba9f",
  //             fill: false
  //           },
  //           { 
  //             data: temp_min,
  //             borderColor: "#ffcc00",
  //             fill: false
  //           },
  //         ]
  //       },
  //       options: {
  //         legend: {
  //           display: false
  //         },
  //         scales: {
  //           xAxes: [{
  //             display: true
  //           }],
  //           yAxes: [{
  //             display: true
  //           }],
  //         }
  //       }
  //     });
      
  //   })
  // }
}
