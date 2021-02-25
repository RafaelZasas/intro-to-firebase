firebase.auth().onAuthStateChanged(populateQuestions)
listenToQuestionUpdates(populateQuestions)

async function populateQuestions() {
    const questionList = document.getElementById('questions')
    const questions = await getAllQuestions()
    const questionCards = await Promise.all(questions.map(userDoc => getQuestionCard({ id: userDoc.id, ...userDoc.data()})))
    questionList.innerHTML = questionCards.join('\n')
}

async function getQuestionCard(question) {
    const content = question.question;
    const author = question.author || 'Anonymous';
    const isAdmin = await hasPermission('admin');

    const actions = `
    <footer class="card-footer">
        <button class="card-footer-item button is-danger" onClick="deleteQuestion('${question.id}')">Delete</button>
    </footer>
    `;

    return `
    <div class="card block">
        <div class="card-content">
            <div class="content">
                <h2 class="is-size-4">${content}</h2>
                <p class="is-size-6">${author}</p>
            </div>
        </div>
        ${isAdmin ? actions : ''}
    </div>
    `
}

async function handleQuestionSubmit() {
    const questionInput = document.getElementById('questionInput');
    const question = questionInput.value;
    const userName = getCurrentUser().displayName;
    await addQuestion(question, userName);
    questionInput.value = '';
}