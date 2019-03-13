import { Component, OnInit } from '@angular/core';
import {NwacCsvService} from '../nwac-csv.service'

@Component({
  selector: 'app-table-display',
  templateUrl: './table-display.component.html',
  styleUrls: ['./table-display.component.css']
})
export class TableDisplayComponent implements OnInit {

  constructor(private _nwac: NwacCsvService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this._nwac.getData("snoqualmie-pass")
      .subscribe(data => console.log(data));
  }

}
