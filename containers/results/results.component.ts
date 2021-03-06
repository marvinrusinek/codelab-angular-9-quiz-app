import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { QUIZ_DATA } from '@codelab-quiz/shared/quiz-data';
import { Quiz } from '@codelab-quiz/shared/models/';
import { QuizService } from '@codelab-quiz/shared/services/*';

@Component({
  selector: 'codelab-quiz-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsComponent implements OnInit, OnDestroy {
  quizData: Quiz[] = QUIZ_DATA;
  quizId: string;
  indexOfQuizId: number;
  unsubscribe$ = new Subject<void>();

  constructor(
    private quizService: QuizService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.quizService.setPreviousUserAnswersText(this.quizService.questions, this.quizService.userAnswers);
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe$))
        .subscribe(params => this.quizId = params.get('quizId'));
    this.sendCompletedQuizIdToQuizService(this.quizId);
    this.indexOfQuizId = this.quizData.findIndex(elem => elem.quizId === this.quizId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  selectQuiz(): void {
    this.quizService.resetAll();
    this.quizService.resetQuestions();
    this.quizId = '';
    this.indexOfQuizId = 0;
    this.router.navigate(['/quiz/select/']).then();
  }

  private sendCompletedQuizIdToQuizService(quizId: string): void {
    this.quizService.setCompletedQuizId(quizId);
  }
}

