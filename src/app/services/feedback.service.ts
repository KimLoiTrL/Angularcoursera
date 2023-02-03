import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { Feedback } from '../shared/feedback';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  // submitFeedback(feedback: Feedback): Observable<Feedback>{
  //   // return this.http.get<Feedback>(baseURL + 'feedback')
  //   //   .pipe(catchError(this.processHTTPMsgService.handleError));
  //   return this.restangular.all('feedback').post(feedback);
  // }

  /** POST: add a new feedback to the database */
  submitFeedback(feedback: Feedback): Observable<Feedback> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'feedback', feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
