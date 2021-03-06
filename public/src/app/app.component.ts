import { Component, SimpleChanges, ChangeDetectorRef, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router'
import { NwacCsvService } from './nwac-csv.service';
import { DataSelectionService } from './data-selection.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  issues = [];
  types = [];
  days = 45;
  selectDay: number = this.days;
  selectedDate: string;
  data = {};
  activeData;
  selectedIssue;

  dataOptions = [
    'temperature',
    'precipitation',
    'snowfall_24_hour',
    'wind_direction',
    'wind_speed_average'
  ];

  constructor(
    private _nwac: NwacCsvService,
    private _cdr: ChangeDetectorRef,
    private _data: DataSelectionService,
    private _route: ActivatedRoute
    ) {}

  ngOnInit() {
    console.log(this._route.snapshot.params);
    this._route.params.subscribe((p:Params) => {
      console.log(p);
      if (p['version'] && p['version'] === 'demo' ) { this.getDemoData(); } else { this.getData(); }
    })
  }

  receiveIssue($event) {
    this.selectedIssue = $event;
    this._cdr.detectChanges();
  }

  problemReset() {
    for (const i of Object.keys(this.types)) {
      this.issues[i] = [];
      this._cdr.detectChanges();
    }
    this.issues = [];
    this.types = [];
  }

  generateProblems() {
    this.selectedIssue = null;
    this.issues = [];
    this.types = [];
    // this.problemReset();
    this.getActiveData();
    this.windSlab(this.activeData);
    // this._cdr.detectChanges();
  }

  getActiveData() {
    this.activeData = {};
    this._cdr.detectChanges();
    const start = (45 - this.selectDay) * 24;
    for (const option of this.dataOptions) {
      if (!this.activeData[option]) {
        this.activeData[option] = [];
      }
      for (let i = start; i < start + 241; i++) {
      this.activeData[option].push(this.data[option][i]);
      }
    }
    this.selectedDate = moment(this.activeData[this.dataOptions[0]][0]['Date/Time (PST)']).format('MMMM Do YYYY');
    this._data.activeData = this.activeData;
  }

  getData() {
    this._nwac.getData('snoqualmie-pass', this.days).subscribe(data => {
      this.data = data;
      this._data.updateData(data);
      this.generateProblems();
    });
  }

  getDemoData() {
    this._nwac.getDemoData().subscribe(data => {
      this.data = data;
      this._data.updateData(data);
      this.generateProblems();
    });
  }

  windSlab(data) {
    this.issues['wind'] = [];
    this._cdr.detectChanges();
    const directionDict = {
      N: 0,
      NE: 45,
      E: 90,
      SE: 135,
      S: 180,
      SW: 225,
      W: 270,
      NW: 315
    };
    const keys = ['wind_direction', 'snowfall_24_hour', 'wind_speed_average'];
    const winds = this.findTransportWinds(data);
    const windSlabs = [];
    for (let i = 0; i < winds.length; i++) {
      if (this.isSnowForTransfer(data, winds[i]['start'])) {
        windSlabs.push(winds[i]);
      }
    }
    if (windSlabs.length > 0) {
      this.types.push('wind');
    }
    for (const wind of windSlabs) {
      let oppWind = wind['dir'] + 180;
      const oppWinds = [];
      oppWinds.push(oppWind);
      oppWinds.push(oppWind - 45);
      oppWinds.push(oppWind + 45);

      for (oppWind of oppWinds) {
        if (oppWind > 360) {
          oppWind = oppWind - 360;
        }
        for (const key of Object.keys(directionDict)) {
          let a = directionDict[key];
          const b = directionDict[key];
          let findCondition = oppWind >= a - 45 / 2 && oppWind < b + 45 / 2;
          if (key === 'N') {
            a = 360;
            findCondition = oppWind >= a - 45 / 2 || oppWind < b + 45 / 2;
          }
          if (findCondition) {
            this.issues['wind'].push({
              compass: {
                type: 'wind',
                aspect: key,
                elevation: 'above',
                date: ''
              },
              issue: wind
            });
            // break;
          }
        }
      }
    }
  }

  findTransportWinds(data) {
    const winds = [];
    let ws = data['wind_speed_average'];
    let wd = data['wind_direction'];
    ws = this.arrObjToMatrix(ws);
    wd = this.arrObjToMatrix(wd);
    const isTransportSpeed = datapoint => {
      if (10 < datapoint && datapoint < 30) {
        return true;
      }
    };
    for (let i = 0; i < wd.length; i++) {
      let tDir;
      if (isTransportSpeed(ws[i][2])) {
        tDir = wd[i][3];
        let curDir = tDir;
        let curWs = ws[i][2];
        let hours = 0;
        let j = 0;
        // console.log("dirTest", (Math.abs(tDir-curDir) < 60));
        // console.log("ws test", isTransportSpeed(curWs));
        // console.log("range test", ((i + j )< wd.length));
        // console.log("i:", i, "j:", j, "i + j", i + j, "wd.length", wd.length)
        while (
          Math.abs(tDir - curDir) < 45 &&
          isTransportSpeed(curWs) &&
          i + j + 1 < wd.length
        ) {
          hours++;
          j++;
          curDir = wd[i + j][3];
          curWs = ws[i + j][2];
        }
        if (hours > 3) {
          // console.log("4 hour wind found")
          winds.push({
            start: i,
            startDate: ws[i][0],
            length: hours,
            dir: tDir
          });
          i += hours - 1;
        }
      }
    }
    return winds;
  }

  isSnowForTransfer(data, idx): boolean {
    let s24 = data['snowfall_24_hour'];
    s24 = this.arrObjToMatrix(s24);
    let s72Arr = [];
    let s72Sum = 0;
    for (let i = idx; i < idx + 72; i++) {
      if (i >= s24.length) {
        break;
      }
      if (s24[i][3] === 0 && Math.max.apply(Math, s72Arr) > 0) {
        s72Sum += Math.max.apply(Math, s72Arr);
        s72Arr = [];
      }
      s72Arr.push(s24[i][3]);
    }
    if (s72Sum > 3) {
      return true;
    }
    return false;
  }

  arrObjToMatrix(data) {
    let row = [];
    const matrix = [];
    for (const i of Object.keys(data)) {
      let test = 0;
      for (const j in data[i]) {
        if (test === 0) {
          row.push(data[i][j]);
        } else {
          if (data[i][j] > 0) {
            row.push(Math.floor(data[i][j]));
          } else {
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
}
