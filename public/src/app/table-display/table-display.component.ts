import { Component, OnInit } from "@angular/core";
import { NwacCsvService } from "../nwac-csv.service";
import * as d3 from "d3";

@Component({
  selector: "app-table-display",
  templateUrl: "./table-display.component.html",
  styleUrls: ["./table-display.component.css"]
})
export class TableDisplayComponent implements OnInit {

  dataOptions = [
    "temperature",
    "precipitation",
    "snowfall_24_hour",
    "wind_direction",
    "wind_speed_average"
  ];
  chartData: object = {};
  nwac: any = [];
  tables = {};

  constructor(private _nwac: NwacCsvService) {}

  ngOnInit(){}

  ngAfterViewInit(): void {
    this.getData();
  }

  getData() {
    this._nwac.getData("snoqualmie-pass").subscribe(data => {
      console.log(data);
      this.drawTable(data, this.dataOptions);
    })
  }

  arrObjToMatrix(data) {
    let row = [];
    let matrix = [];
    for(let i in data) {
      let test = 0
      for(let j in data[i]) {
        if(test == 0) {
          row.push(data[i][j])
        }
        else {
          if(data[i][j]> 0) {
            row.push(Math.floor(data[i][j]));
          }
          else {
            row.push(Math.ceil(data[i][j]));
          }
        }
        test++;
      }
      matrix.push(row);
      row = [];
    }
    return matrix;
  }

  drawTable(data: Object, keys: string[]) {

    keys.forEach((option, i) => {

      let headers: string[] = [];
      for (let key in data[option][0]) {
        headers.push(key);
      }

      //create tables and headers
      this.tables[option] = 
        d3.select("#tableWrapper")
          .append("div")
            .attr("class", "col")
            .selectAll("div")
            .data([option])
            .join("table")
              .attr("class", "table");
      this.tables[option]
        .append("thead")
          .append("tr")
            .selectAll("th")
            .data(headers)
            .join("th")
              .text(d => d);
      
      //bind and write table data
      this.tables[option]
        .append("tbody")
          .selectAll("tr")
          .data(this.arrObjToMatrix(data[option]))
          .join("tr")
            .selectAll("td")
            .data(d => d)
            .join("td")
              .text(d => d);
    })

    
        
    

  }
}
