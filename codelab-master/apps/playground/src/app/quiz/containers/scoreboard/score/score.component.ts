import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { QuizService } from '@codelab-quiz/shared/services/*';


@Component({
  selector: 'codelab-scoreboard-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  totalQuestions: number;
  correctAnswersCount$: Observable<number>;

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.correctAnswersCount$ = this.quizService.correctAnswersCountSubject;
    this.totalQuestions = this.quizService.totalQuestions;
  }
}
