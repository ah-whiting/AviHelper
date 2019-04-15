import { Component, OnInit, Input } from "@angular/core";
import { NwacCsvService } from "../nwac-csv.service";
import { DataSelectionService } from "../data-selection.service";
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
  windOptions = [
    "wind_direction",
    "wind_speed_average"
  ]
  chartData: object = {};
  nwac: any = [];
  tables = {};
  activeData;
  selectedIssue;

  @Input() selectDay: number
  // @Input() data: object
  // @Input() issue: object

  constructor(
    private _nwac: NwacCsvService,
    private _data: DataSelectionService
    ) {}

  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
    this.selectedIssue = this._data.selectedIssue;
    this.activeData = this._data.activeData;
    this.drawTable(this.activeData, this.windOptions, this.selectedIssue);
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

  drawTable(data: object, keys: string[], selectedIssue) {
    if(!data) {
      return;
    }
    keys.forEach((option, i) => {
      let headers: string[] = [];
      for (let key in data[option][0]) {
        headers.push(key);
      }

      //create tables and headers
      this.tables[option] = 
        d3.select("#tableWrapper")
          .append("div")
            .attr("class", "col-6")
            .selectAll("div")
            .data([option])
            .join("table")
              .attr("class", "table")
              .attr("id", "custom")
              .attr("height", "300px")
              // .style("background-color", "white")
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
      .style("white-space", "nowrap")
      .selectAll("td")
        .data(d => d)
        .join("td")
        .text(d => d);
      
      //highlight problematic table rows
      let start;
      this.tables[option]
        .selectAll("tr")
        .filter(
          function(d, i) { 
            if(d[0] == selectedIssue["issue"]["startDate"]) {
              start = i;
            }
            if(start != null && i <= start + selectedIssue["issue"]["length"]) {
              return d
            }
          })
          // .attr("fill", "red")
          .style("background-color", "red")
          .style("font-weight", "bold")
          
    })
  }
}
