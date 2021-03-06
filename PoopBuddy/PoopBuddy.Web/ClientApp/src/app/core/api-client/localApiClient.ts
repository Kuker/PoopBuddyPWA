import { Injectable } from '@angular/core';
import {HttpClientHelper} from "../../shared/http/httpClientHelper"
import {ApplicationConfiguration} from "../../shared/configuration/applicationConfiguration"
import { GetAllPoopingsResponse }  from "../../shared/dto/GetAllPoopingsResponse";
import { AddSubscriberRequest }  from "../../shared/dto/AddSubscriberRequest";
import { SendNotificationRequest }  from "../../shared/dto/SendNotificationRequest";
import { RecordPoopingRequest }  from "../../shared/dto/RecordPoopingRequest";
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class LocalApiClient {

  private localApiAddress: string;

  constructor(private httpClientHelper: HttpClientHelper, private configuration: ApplicationConfiguration, private logger: NGXLogger) {

    this.localApiAddress = configuration.getString("localApi.address");
  }

  public getAllPoopings(onResponse: (response: GetAllPoopingsResponse) => void): void {
    var action = "getAllPoopings";
    var fullAddress = this.localApiAddress + action;
    this.logger.debug("About to call getAllPoopings on " + fullAddress);
    return this.httpClientHelper.get<GetAllPoopingsResponse>(fullAddress,
      (response) => {
        onResponse(response);
      });
  }

  public recordPooping(request: RecordPoopingRequest, onResponse: () => void): void {
    var action = "recordPooping";
    var fullAddress = this.localApiAddress + action;
    this.logger.debug("About to call recordPooping on " + fullAddress);

    this.httpClientHelper.post(request, fullAddress, onResponse);
  }

  public addSubscriber(request: AddSubscriberRequest, onResponse: () => void): void {
    var action = "AddSubscriber";
    var fullAddress = this.localApiAddress + action;
    this.logger.debug("About to call AddSubscriber on " + fullAddress);

    this.httpClientHelper.post(request, fullAddress, onResponse);
  }

  public sendNotification(request: SendNotificationRequest, onResponse: () => void): void {
    var action = "SendNotification";
    var fullAddress = this.localApiAddress + action;
    this.logger.debug("About to call SendNotification on " + fullAddress);

    this.httpClientHelper.post(request, fullAddress, onResponse);

  }
}

