# codelab-angular-10-quiz-app
This application was created for the open-source Angular Codelab (https://www.codelab.fun)

<div align="center">
  <img src="http://www.marvinrusinek.com/images/codelab-quiz-app.png" alt="Angular Codelab Quiz App" width="550" height="600">
</div>

# TODO:

# Immediate:
- duplicate code in question components - could use a service here...
- fix scoring issue - in a multiple-answer question, if one correct answer is selected and one incorrect, the score still increases by 1; it should only increase if ALL correct answers have been selected (there also seems to be an issue with switching Observable to BehaviorSubject)
   - if correct, then incorrect, then correct, score doesn't increment
   - similarly if incorrect, then correct, then correct, score doesn't increment
- checking and then unchecking of mat-checkbox in IntroductionComponent sets checkedShuffle back to false but loads a shuffled quiz instead
- add previous user answers text for single-answer questions in QuizQuestionComponent template
  - make sure that the previous answers only get applied to the completed quiz, not any other quizzes
  
# Long-Term:
- convert app with Ionic and Apache Cordova for usability on mobile devices
- add state management with NgRx

# FEATURES:
- App developed using HTML5; CSS3/SCSS; Angular using TypeScript, JavaScript ES6 and NPM
- Uses a basic, clean, modern and aesthetically pleasing UI for the quiz
- Employs familiar Angular concepts such as services/dependency injection, routing and reactive form
- Features a simple API and quiz data is retrieved from external file using RxJS and HttpClient
- Includes routing to different Angular milestone quizzes on a quiz-selection screen
- Form display is toggled depending on the type of question in the quiz service (either multiple-answer (mat-checkbox) question or single-answer (mat-radio-button) question)
- Supports advanced routing features with paging 1 question at a time using an inferred questionIndex (instead of using questionId)
- Utilizes Angular packages such as Angular Material/CDK, Angular animation library as well as Bootstrap, FontAwesome, hover.css and external 3rd party packages for progressbars (ngb-progressbar) and audio (Howler)
- Displays innovative scoreboard in which score (numerical/percentage) and countdown/stopwatch clock are both fully controlled with RxJS
- Uses SVG buttons for paging and quiz statuses
- Results page shows user score (with percentage) and computes time taken to complete the quiz and utilizes an expandable/collapsable Angular Material accordion (mat-accordion) which shows a detailed quiz summary (user answer(s), correct answer(s), explanation and elapsedTime for each question)
- Results page displays last 10 high scores using localStorage
- Results page features buttons to share percentage on social media (Twitter) or by e-mail
- Utilizes Javascript ES6 arrow functions to store the correct answers stored in an array and user answers are also kept in an array
- When there is more than one answer to a question, the number of correct answers is shown
- Utilizes clean import paths via path aliasing
- Supports internationalization (i18n)
- App is being finalized to convert to NgRx

# Author
  # Marvin Rusinek
    Web/App Developer in NYC
