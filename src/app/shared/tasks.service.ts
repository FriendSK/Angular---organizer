import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataResponse, Task } from '../shared/task.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  static url = 'https://angular-organizer-85b4b.firebaseio.com/tasks';

  constructor(private http: HttpClient) {
  }

  loadTasks(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${ TasksService.url }/${ date.format('DD-MM-YYYY') }.json`)
      .pipe(
        map(tasks => {
          if (!tasks) {
            return [];
          }
          return Object.keys(tasks).map(key => ({
            ...tasks[key],
            id: key
          }));
        })
      );
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<DataResponse>(`${TasksService.url}/${task.date }.json`, task)
      .pipe(
        map(res => {
          return { ...task, id: res.name };
        })
      );
  }

  remove(task: Task): Observable<void> {
    return this.http
      .delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`);
  }
}
