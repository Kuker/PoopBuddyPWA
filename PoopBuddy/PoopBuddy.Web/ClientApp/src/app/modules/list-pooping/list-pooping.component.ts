import { Component, OnInit } from '@angular/core';
import { Pooping } from '../../core/models/pooping';
import { LocalApiClient } from "../../core/api-client/localApiClient";
import { Time } from "../../shared/time/Time";
import { NGXLogger } from "ngx-logger";
import { EarningHelper } from "../../shared/earnings/earningHelper";


@Component({
  selector: 'list-pooping',
  templateUrl: './list-pooping.component.html',
  styleUrls: ['./list-pooping.component.scss']
})
export class ListPoopingComponent implements OnInit {
  displayedColumns: string[] = ['position','authorName', 'poopingDuration', 'wagePerHour', 'totalEarnings'];
  poopingList: PoopingWithOrder[];

  constructor(private apiClient: LocalApiClient, private logger: NGXLogger, private earningHelper: EarningHelper) {  }

  ngOnInit() {
    this.apiClient.getAllPoopings((response) => {
      this.logger.debug("parsing response from getAllPoopings");
      response.poopingList.forEach((pooping) => {
        pooping.duration = new Time();
        pooping.duration.addMs(pooping.durationInMs);
      });

      this.poopingList = this.getBestPoopings(999, response.poopingList);
    });
  }

  private getBestPoopings(count: number, poopingList: Pooping[]): PoopingWithOrder[] {
    var unorderedPoopingList = poopingList;
    var orderedPoopingList = unorderedPoopingList.sort((left, right) => {

      if (this.earningHelper.calculateEarning(left.duration, left.wagePerHour) <
        this.earningHelper.calculateEarning(right.duration, right.wagePerHour))
        return -1;
      if (this.earningHelper.calculateEarning(left.duration, left.wagePerHour) >
        this.earningHelper.calculateEarning(right.duration, right.wagePerHour))
        return 1;
      return 0;
    });

    orderedPoopingList.reverse(); // we want the array to be from highest earner to lowest

    if (count > orderedPoopingList.length) // we don't want to go out of bounds
      count = orderedPoopingList.length;
    var poopingsWithOrder = [];
    for (var i = 0; i < count; i++) {
      var newPooping = new PoopingWithOrder();
      newPooping.position = i+1;
      newPooping.duration = orderedPoopingList[i].duration;
      newPooping.wagePerHour = orderedPoopingList[i].wagePerHour;
      newPooping.authorName = orderedPoopingList[i].authorName;
      newPooping.externalId = orderedPoopingList[i].externalId;
      newPooping.earnings = this.earningHelper.calculateEarning(orderedPoopingList[i].duration, orderedPoopingList[i].wagePerHour);
      poopingsWithOrder.push(newPooping);
    }

    return poopingsWithOrder;
  }



}

export class PoopingWithOrder extends Pooping {
  position: number;
  earnings: number;
}
