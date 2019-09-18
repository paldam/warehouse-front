import { Component, OnInit } from '@angular/core';
import {PointScheme} from "../../model/point-scheme.model";
import {PrizeService} from "../prize.service";

@Component({
  selector: 'app-points-scheme',
  templateUrl: './points-scheme.component.html',
  styleUrls: ['./points-scheme.component.css']
})
export class PointsSchemeComponent implements OnInit {


  public pointSchemes : PointScheme[] =[];


  constructor(prizeService: PrizeService) {

    prizeService.getPointScheme().subscribe(value => this.pointSchemes = value)

  }

  ngOnInit() {
  }

}
