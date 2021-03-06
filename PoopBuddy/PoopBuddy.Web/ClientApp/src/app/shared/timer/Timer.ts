import {Time} from "../time/Time"
import { Injectable, ApplicationRef } from '@angular/core';
import  * as WorkerTimers  from "worker-timers";

@Injectable({
  providedIn: 'root',
})
export class Timer {


  private _time: Time;
  get time(): Time {
    return this._time;
  }



  private timerInterval = 50;
  private interval;

  public get isRunning(): boolean {
    return this.interval;
  }

  constructor(
    private changeDetector: ApplicationRef) {
    //console.log("Timer constructor");
    this.reset();
  }

  reset() {
    //console.log("Timer reset");
    this._time = new Time();

    if (this.interval) {
      //console.log("Timer reset - this.interval !== null");
      this.clearAllIntervalAndTimeout();
      if (this.interval != undefined) {
        throw "Timer interval not properly cleared! Interval: " + this.interval;
      }
        
    }
      
  }

  private clearAllIntervalAndTimeout() {
    WorkerTimers.clearTimeout(this.interval);
    //clearTimeout(this.interval);
    this.interval = null;
  }

  start() {
    //console.log("Timer start");
    if (this.time === null) {
      //console.log("Timer start - this.time === null");
      this.reset();
    }

    if (this.interval) {
      //console.log("Timer start - this.interval");
      this.clearAllIntervalAndTimeout();
    }

    this.setTimeout();
  }

  stop() {
    //console.log("Timer stop");
    this.clearAllIntervalAndTimeout();
  }

  private updateTime(self) {
    //console.log("Timer updateTime: " + self.time.miliSeconds + " ms " + self.time.seconds + " s");
    self.time.addMs(this.timerInterval);
  }

  private setTimeout() {
    var that = this;

    //this.interval = setTimeout(() => {
    //  this.updateTime(that);
    //  this.setTimeout();
    //}, this.timerInterval);

    this.interval = WorkerTimers.setTimeout(() => {
        this.updateTime(that);
        this.setTimeout();
        this.changeDetector.tick();
      },
      this.timerInterval);
  }
}
