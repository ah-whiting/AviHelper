import { Component, OnInit, Input} from '@angular/core';
import { NwacCsvService} from '../nwac-csv.service';
import { Chart } from 'chart.js';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-graph-display',
  templateUrl: './graph-display.component.html',
  styleUrls: ['./graph-display.component.css']
})
export class GraphDisplayComponent implements OnInit {

  dataOptions = [
      "temperature",
      "precipitation",
      "snowfall_24_hour",
      "wind_direction",
      "wind_speed_average"
  ]
  chartData:object = {}
  nwac:any = []
  charts = {}

  @Input() start: number
  @Input() issue: object[]

  constructor(
    private _nwac:NwacCsvService
  ) { }

  ngOnInit() {
    this.getData("snoqualmie-pass");
  }
  getData(location:string){
    this._nwac.getData(location).subscribe(data => {

      //establish data categories
      for(let i of this.dataOptions){
        this.nwac.push(data[i]);
      }
      this.nwac.forEach((option, i) => {

        let dateTime = option.map(x => x["Date/Time (PST)"])
        let locations = [];
        for(let loc in option[0]){
          if(loc == "Date/Time (PST)"){
            continue;
          }
          locations.push(loc);
        }

        //build chart datasets
        let locDataSets = []
        let colors = [
          'green',
          'red',
          'blue',
          'orange',
          'purple',
          'yellow'
        ]
        locations.forEach((loc, i) => {
          let locSet = option.map(x => x[loc]);
          locDataSets[i] = {
            data: locSet,
            borderColor: colors[i],
            fill: false,
            label: loc
          }
        })
        console.log(locDataSets)

        //build chart scale labels **FIX**
        let scaleY = {};
        for(let dOption of this.dataOptions) {
          // console.log(dOption)
          scaleY = {
            scaleLabel: {
              display: true,
              labelString: dOption
            }
          };
        }
        console.log(scaleY)
        
        //build charts 
        this.charts[i] = new Chart( `chart${i}`, {
          type: 'line',
          data: {
            labels: dateTime,
            datasets: locDataSets
          },
          options: {
            legend: {
              display: true
            },
            scales: {
              xAxes: [{
                labelString: "Date",
                display: true
              }],
              yAxes: scaleY,
            }
          }
        });

      });
    }, (err) => console.log(err))
  }

}
