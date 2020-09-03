import { Component, OnInit } from '@angular/core';
import { DateService } from '../shared/date.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../shared/tasks.service';
import { Task } from '../shared/task.model';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  constructor(public dateService: DateService,
              private tasksService: TasksService) {
  }

  form: FormGroup;
  tasks: Task[] = [];

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap(value => this.tasksService.loadTasks(value)),
      tap(tasks => this.tasks = tasks)
    ).subscribe();
    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit() {
    console.log(this.tasks);
    const { title } = this.form.value;
    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    };

    this.tasksService.create(task)
      .pipe(
        tap((createdTask: Task) => {
          this.tasks.push(createdTask);
          this.form.reset();
        }),
        catchError(err => throwError(err))
      )
      .subscribe();
  }

  remove(task: Task) {
    this.tasksService.remove(task).pipe(
      tap( () => this.tasks = this.tasks.filter( t => t.id !== task.id)),
      catchError( err => throwError(err))
    ).subscribe();
  }
}
