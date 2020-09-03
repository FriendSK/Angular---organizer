import { Component, OnInit } from '@angular/core';
import { Day, Week } from './calendar.model';
import { DateService } from '../shared/date.service';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  calendar: Week[];

  constructor(private dateService: DateService) {
  }

  ngOnInit(): void {
    this.dateService.date.pipe(
      tap((now: moment.Moment) => this.generate.bind(this)(now))
    ).subscribe();
  }

  generate(now: moment.Moment): void {
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');

    const date = startDay.clone().subtract(1, 'day');

    const calendar = [];

    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !now.isSame(value, 'month');
            const selected = now.isSame(value, 'date');

            return {
              value,
              active,
              disabled,
              selected
            };
          })
      });
    }

    this.calendar = calendar;
  }

  onSelect(day: moment.Moment) {
    this.dateService.changeDate(day);
  }
}
