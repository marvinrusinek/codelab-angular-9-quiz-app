import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Howl } from 'howler';
import cloneDeep from 'lodash.cloneDeep';

import { QUIZ_DATA, QUIZ_RESOURCES } from '@codelab-quiz/shared/quiz-data';
import { Option, Quiz, QuizQuestion, QuizResource, Resource } from '@codelab-quiz/shared/models/';

@Injectable({
  providedIn: "root"
})
export class QuizService implements OnDestroy {
  quizData: Quiz[];
  quizResources: QuizResource[];
  question: QuizQuestion;
  questions: QuizQuestion[];
  currentQuestion: QuizQuestion;
  resources: Resource[];
  answers: number[];
  totalQuestions: number;
  currentQuestionIndex = 1;

  quizName$: Observable<string>;
  quizId: string;
  indexOfQuizId: number;

  startedQuizId: string;
  continueQuizId: string;
  completedQuizId: string;
  quizCompleted: boolean;
  status: string;

  correctAnswers = [];
  correctAnswersForEachQuestion = [];
  correctAnswerOptions: number[] = [];
  numberOfCorrectAnswers: number;
  correctAnswersCountSubject = new BehaviorSubject<number>(0);
  userAnswers = [];

  explanationText: string;
  correctOptions: string;
  correctMessage: string;

  multipleAnswer: boolean;
  checkedShuffle: boolean;

  unsubscribe$ = new Subject<void>();
  quizInitialState: any;

  correctSound = new Howl({
    src: "http://www.marvinrusinek.com/sound-correct.mp3",
    html5: true,
    format: ["mp3"]
  });
  incorrectSound = new Howl({
    src: "http://www.marvinrusinek.com/sound-incorrect.mp3",
    html5: true,
    format: ["mp3"]
  });

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.quizData = QUIZ_DATA;
    this.quizResources = QUIZ_RESOURCES;
    this.quizInitialState = cloneDeep(QUIZ_DATA);

    this.quizName$ = this.activatedRoute.url.pipe(
      map(segments => segments[1].toString())
    );

    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe$))
        .subscribe(params => (this.quizId = params.get('quizId')));

    this.indexOfQuizId = this.quizData.findIndex(
      elem => elem.quizId === this.quizId
    );

    this.returnQuizSelectionParams();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getQuiz(): Quiz[] {
    return this.quizData;
  }

  getResources(): QuizResource[] {
    return this.quizResources;
  }

  getQuizzes(): Observable<Quiz[]> {
    return of(this.quizData);
  }

  getCorrectAnswers(question: QuizQuestion): Option[] {
    if (question) {
      const identifiedCorrectAnswers = question.options.filter(option => option.correct);
      this.numberOfCorrectAnswers = identifiedCorrectAnswers.length;
      this.correctAnswerOptions = identifiedCorrectAnswers.map(
        option => question.options.indexOf(option) + 1
      );

      this.setCorrectAnswers(question);
      this.setExplanationTextAndCorrectMessages(this.correctAnswerOptions.sort(), question);
      return identifiedCorrectAnswers;
    }
  }

  // generically shuffle arrays in-place using Durstenfeld's shuffling algorithm
  shuffle<T>(arg: T[]): void {
    for (let i = arg.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arg[i], arg[j]] = [arg[j], arg[i]];
    }
  }

  returnQuizSelectionParams(): Object {
    return new Object({
      startedQuizId: this.startedQuizId,
      continueQuizId: this.continueQuizId,
      completedQuizId: this.completedQuizId,
      quizCompleted: this.quizCompleted,
      status: this.status
    });
  }

  /********* setter functions ***********/
  setCorrectAnswers(question: QuizQuestion): void {
    const correctAnswerAdded = this.correctAnswers.find(q => q.questionId === question.explanation) !== undefined;
    if (correctAnswerAdded === false) {
      this.correctAnswersForEachQuestion.push(this.correctAnswerOptions);
      this.correctAnswers.push({
        questionId: question.explanation,
        answers: this.correctAnswersForEachQuestion.sort()
      });
    }
  }

  setExplanationTextAndCorrectMessages(correctAnswers: number[], question: QuizQuestion): void {
    this.explanationText = question.explanation;

    for (let i = 0; i < question.options.length; i++) {
      if (correctAnswers[i] && correctAnswers.length === 1) {
        this.correctOptions = correctAnswers[i].toString().concat("");
        this.correctMessage = "The correct answer is Option " + this.correctOptions + ".";
      }

      if (correctAnswers[i] && correctAnswers[i + 1]) {
        this.correctOptions = correctAnswers[i]
                                .toString().concat(" and " + correctAnswers[i + 1]);
        this.correctMessage = "The correct answers are Options " + this.correctOptions + ".";
      }

      if (correctAnswers[i] && correctAnswers[i + 1] && correctAnswers[i + 2]) {
        this.correctOptions = correctAnswers[i].toString().concat(
                                ", ", correctAnswers[i + 1] + " and " + correctAnswers[i + 2]);
        this.correctMessage = "The correct answers are Options " + this.correctOptions + ".";
      }
      if (correctAnswers.length === question.options.length) {
        this.correctOptions = "ALL are correct!";
        this.correctMessage = "ALL are correct!";
      }
    }
  }

  setQuizStatus(value: string): void {
    this.status = value;
  }

  setQuizId(value: string): void {
    this.quizId = value;
  }

  setStartedQuizId(value: string) {
    this.startedQuizId = value;
  }

  setContinueQuizId(value: string) {
    this.continueQuizId = value;
  }

  setCompletedQuizId(value: string) {
    this.completedQuizId = value;
  }

  setQuestion(value: QuizQuestion): void {
    this.question = value;
  }

  setQuestions(value: QuizQuestion[]): void {
    this.questions = value;
  }

  setTotalQuestions(value: number): void {
    this.totalQuestions = value;
  }

  setChecked(value: boolean): void {
    this.checkedShuffle = value;
  }

  setMultipleAnswer(value: boolean): void {
    this.multipleAnswer = value;
  }

  setCurrentQuestion(value: QuizQuestion): void {
    this.currentQuestion = value;
  }

  setResources(value: Resource[]): void {
    this.resources = value;
  }

  sendCorrectCountToResults(value: number): void {
    this.correctAnswersCountSubject.next(value);
  }

  /********* navigation functions ***********/
  navigateToNextQuestion() {
    this.quizCompleted = false;
    this.currentQuestionIndex++;
    const questionIndex = this.currentQuestionIndex;
    this.router.navigate(["/quiz/question/", this.quizId, questionIndex]).then();
    this.resetAll();
  }

  navigateToPreviousQuestion() {
    this.quizCompleted = false;
    this.router.navigate(["/quiz/question/", this.quizId, this.currentQuestionIndex - 1]).then();
    this.resetAll();
  }

  navigateToResults() {
    this.quizCompleted = true;
    this.router.navigate(["/quiz/results/", this.quizId]).then();
  }

  /********* reset functions ***********/
  resetQuestions(): void {
    this.quizData = cloneDeep(this.quizInitialState);
  }

  resetAll(): void {
    this.answers = null;
    this.correctAnswersForEachQuestion = [];
    this.correctAnswerOptions = [];
    this.correctOptions = "";
    this.correctMessage = "";
    this.explanationText = "";
    this.currentQuestionIndex = 0;
  }
}