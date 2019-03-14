import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

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

  @Input() idx:number
  @Input() issue:object

  constructor() { }

  ngOnInit() {
    this.compass = {};
    this.aspects = ["N","NE","E","SE","S","SW","W","NW"];
    this.elevations = ["above", "near", "below"];
    this.divWrapper = `compass${this.idx}`
  }
  ngAfterViewInit() {
    console.log(this.issue["compass"]);
    // this.drawCompass([{aspect:"NE", elevation: "near"}, {aspect:"NE", elevation: "below"}]);
    this.drawCompass([this.issue["compass"]]);
  }

  drawCompass(issues:object[] = []) {
    
    //create SVG element
    let compass = d3.select(`#compass${this.idx}`)
      .append("svg")
        .attr("width", "600px")
        .attr("height", "500px")
      .append("g")
        .attr("fill", "none")
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
        for (let i of issues) {
          this.compass[i["aspect"]][i["elevation"]].attr("fill", "red");
        }
  }

}
