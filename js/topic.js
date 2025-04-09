function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const chapter = getQueryParam('chapter');

const topicParam = getQueryParam('topic')

fetch('../static/data/topic.json')
    .then(res => res.json())
    .then(data => {

        const topic = data.find(t => t.topic === topicParam);
        if (!topic) return

        document.getElementById('breadcrumb').innerHTML = chapter + '/';
        document.getElementById('chapter').innerHTML = topic.topic + '/ '
        document.getElementById('chapter').href = "../html/chapters.html?chapter=" + chapter

        const container = document.getElementById('chapter-content');

        topic.content.forEach(item => {
            let element;

            switch (item.type) {
                case 'paragraph':
                    element = document.createElement('p');
                    element.textContent = item.text;
                    break;
                case 'image':
                    element = document.createElement('img');
                    element.src = item.src;
                    element.alt = item.alt || '';
                    element.className = 'chapter-img';
                    break;
                case 'video':
                    element = document.createElement('div');

                    const card = document.createElement('div');
                    card.className = 'paragraph-card';
                    card.innerHTML = `
                        <div class="paragraph-bar"></div>
                        <p>
                            Video Lesson
                        </p>
                    `
                    element.appendChild(card)
                    child = document.createElement('iframe');
                    child.className = 'paragraph-box'
                    child.src = item.src;
                    child.width = "560";
                    child.height = "315";
                    child.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    child.allowFullscreen = true;
                    element.appendChild(child)
                    break;
            }

            container.appendChild(element);
        });
    })
    .catch(err => console.error('Error loading chapter:', err));
