import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router'
import * as d3 from 'd3';
import {DataSelectionService} from '../data-selection.service'

@Component({
  selector: 'app-compass',
  templateUrl: './compass.component.html',
  styleUrls: ['./compass.component.css']
})
export class CompassComponent implements OnInit {
  aspects:string[];
  elevations:string[];
  compass:object;
  divWrapper:string;
  selectedIssue:object;
  toolTip:string
  toolTipText:string
  toolTipBool:boolean = false;

  @Input() type:string
  @Input() issues:object[]
  @Output() selectIssue = new EventEmitter<object>();

  constructor(
    private _router: Router,
    private _data:DataSelectionService
    ) { }

  ngOnInit() {
    this.compass = {};
    this.aspects = ["N","NE","E","SE","S","SW","W","NW"];
    this.elevations = ["above", "near", "below"];
    this.divWrapper = `compass-${this.type}`
    this.toolTip = `tip-${this.type}`
  }
  ngAfterViewInit() {
    this.drawCompass(this.issues);
  }

  drawCompass(issues:object[] = []) {
    
    //create SVG element
    let compass = d3.select(`#compass-${this.type}`)
      .append("svg")
        // .attr("fill", "white")
        .attr("width", "500px")
        .attr("height", "400px")
        .attr("viewBox", "0 0 600 500")
      .append("g")
        .attr("fill", "white")
        .attr("transform", "translate(300, 200)")
        .attr("stroke", "black")
        .attr("stroke-width", "3px");
    
    //draw compass arcs
    let tempGen;
    for(let j = 0; j < this.elevations.length; j++) {
        for(let i = 0; i < this.aspects.length; i++) {
            if(!this.compass[this.aspects[i]]) {
                this.compass[this.aspects[i]] = {};
            }
            tempGen = d3.arc()
                    .innerRadius(j*50)
                    .outerRadius((j+1)*50)
                    .startAngle((i)* Math.PI / 4)
                    .endAngle((i + 1) * Math.PI / 4);
            this.compass[this.aspects[i]][this.elevations[j]] = 
                    compass
                      .append("path")
                        .attr("d", tempGen());
                    
            //draw lines and labels
            let cen = tempGen.centroid();
            if(i == 4) {
                compass
                  .append("path")
                    .attr("d", `M ${cen[0]} ${cen[1]}, v 175`)
                    .attr("stroke", "black")
                    .attr("stroke-width", "1px");
                compass
                  .append("text")
                    .attr("x", `${cen[0]}`)
                    .attr("y", `${cen[1] + 180}`)
                    .attr("stroke-width", "1px")
                    .text(`${this.elevations[j]} treeline`);
            }
            if(j == 2) {
                compass
                  .append("text")
                    .attr("transform", "translate(-8,8)")
                    .attr("x", `${cen[0]*1.5}`)
                    .attr("y", `${cen[1]*1.5}`)
                    .attr("stroke-width", "2px")
                    .attr("font-size", "1.2em")
                    .text(`${this.aspects[i]}`);
            }
        }
    }
    //fill and add eventlisteners
    for (let i of issues) {
      let aspect = i["compass"]["aspect"];
      let elevation = i["compass"]["elevation"];
      this.compass[aspect][elevation]
        .attr("fill", "red")
        .datum(i)
        .on("mouseover", handleMouseover)
        .on("mouseout", handleMouseout)
        .on("click", handleClick)
    }

    let toolTipID = this.toolTip;
    function handleMouseover(d, i) {
      this.toolTipText = d;
      this.toolTipBool = true;
      // let iconPos = this.getBoundingClientRect();

      d3.select(`#${toolTipID}`)
        .style("left", `${event["offsetX"] + 40}px`) 
        .style("top", `${event["offsetY"]}px`) 
        .style("display", "block")
        .selectAll(".tipText")
          .text(`Event Start:${d["issue"]["startDate"]}\n\r
                Length: ${d["issue"]["length"]} hours`)
    }
    function handleMouseout() {
      d3.select(`#${toolTipID}`)
        .style("display", "none");
    }
    let _this = this;
    function handleClick(d, i) {
      _this.selectedIssue =  d;
      _this._data.selectIssue(d);
      _this.selectIssue.emit(d);
    }
    
  }

}
