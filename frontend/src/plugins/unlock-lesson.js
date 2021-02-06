export function unlockLesson(overLesson, overQuestions) {
  const QUESTIONS = [[3, 1], [6, 2], [4, 1, 2, 1], [2, 4], [4, 2, 1], [3, 2, 1]];

  function createOverQuestions(overLesson) {
    var complitedOverQuestions = [];
    var exercise = 1;

    QUESTIONS[overLesson].forEach(length => {
      for (var i = 0; i < length; i++) {
        var questionID = 'l' + String(overLesson+1) + 'e' + String(exercise) + 'q';
        questionID += String(i+1);
        complitedOverQuestions.push(questionID);
      }
      exercise++;
    });

    return complitedOverQuestions;
  }

  const complitedOverQuestions = createOverQuestions(overLesson);
  if (complitedOverQuestions.length === overQuestions.length) {
    overQuestions.sort();

    var index = 0;
    for(var questionID of overQuestions) {
      if (questionID !== complitedOverQuestions[index]) {
        break;
      }
      index++
    }

    if (index === overQuestions.length) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
