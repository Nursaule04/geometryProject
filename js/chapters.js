function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const chapter = getQueryParam('chapter');


fetch('../static/data/mock.json')
    .then(res => res.json())
    .then(data => {
        const topic = data.find(t => t.chapter === chapter);
        if (!topic) return;

        document.getElementById('breadcrumb').innerText = topic.chapter + '/';

        const container = document.getElementById('chapter-list');

        topic.body.topics.forEach(title => {
            const card = document.createElement('div');
            card.className = 'chapter-card';
            card.innerHTML = `
            <div class="chapter-bar"></div>
            <a href="../html/topic.html?chapter=${topic.chapter}&topic=${title}" class='at'>${title}</a>
      `;
            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });


const calculator = document.getElementById('calculator')


