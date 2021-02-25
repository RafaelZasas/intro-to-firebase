firebase.auth().onAuthStateChanged(populateQuestions)

async function populateQuestions() {
    const questionList = document.getElementById('questions')
    const questions = await getAllQuestions()
    const questionCards = questions.map(userDoc => getQuestionCard(userDoc.data()))
    questionList.innerHTML = questionCards.join('\n')
}

function getQuestionCard(question) {
    return question.question;
}