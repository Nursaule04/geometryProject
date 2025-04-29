function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const chapter = getQueryParam('chapter');
const topicParam = getQueryParam('topic');

fetch('../static/data/task.json')
    .then(res => res.json())
    .then(data => {
        const topic = data.find(t => t.topic === topicParam);
        if (!topic) return;

        document.getElementById('breadcrumb').innerHTML = chapter;
        document.getElementById('chapter').innerHTML = topic.topic;
        document.getElementById('chapter').href = "../html/chapters.html?chapter=" + chapter;
        document.getElementById('topic').href = `../html/topic.html?chapter=${chapter}&topic=${topicParam}`;

        let correctAnswerCount = 0;
        let currentQuestionIndex = 0;
        const totalQuestions = topic.questions.length;

        function renderQuestion(index) {
            const questionData = topic.questions[index];

            const container = document.getElementById('question-container');
            container.innerHTML = `
                <h3>${questionData.question}</h3>
                <div class="answers">
                    ${questionData.answers.map((answer, i) => `
                        <button class="answer-btn" data-index="${i}">
                            ${answer}
                        </button>
                    `).join('')}
                </div>
                <button id="submit-answer" class="submit-btn">Done</button>
            `;

            // Выбор ответа
            document.querySelectorAll('.answer-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                });
            });

            // Обработка ответа
            document.getElementById('submit-answer').onclick = () => {
                const selected = document.querySelector('.answer-btn.selected');
                if (!selected) return;

                const selectedIndex = parseInt(selected.dataset.index);
                const isCorrect = selectedIndex === (questionData.correct);
                correctAnswerCount = selectedIndex === (questionData.correct) ? correctAnswerCount + 1 : correctAnswerCount;

                selected.style.backgroundColor = isCorrect ? 'lightgreen' : 'red';

                setTimeout(() => {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < totalQuestions) {
                        renderQuestion(currentQuestionIndex);
                        updateProgress(currentQuestionIndex);
                    } else {
                        document.getElementById('question-container').innerHTML = `
                            <h3>You've completed the exercise 🎉</h3>
                            <h5>Points: ${correctAnswerCount}/${totalQuestions}</h5>
                            <div class="finish-buttons">
                                <button id="restart-btn" class="action-btn">Restart</button>
                                <button id="back-btn" class="action-btn">Back to Topics</button>
                            </div>
                        `;
                        document.getElementById('restart-btn').onclick = () => {
                            currentQuestionIndex = 0;
                            correctAnswerCount = 0;
                            renderQuestion(currentQuestionIndex);
                            updateProgress(currentQuestionIndex);
                        };

                        document.getElementById('back-btn').onclick = () => {
                            window.location.href = `../html/topic.html?chapter=${chapter}&topic=${topicParam}`;
                        };
                    }
                }, 500);
            };
        }

        function updateProgress(currentIndex) {
            const circles = document.querySelectorAll('.circle');
            circles.forEach((circle, i) => {
                circle.classList.toggle('active', i === currentIndex);
            });
        }

        renderQuestion(currentQuestionIndex);
    });
