import axios from 'axios';
import { Notify } from 'notiflix';
const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
let page = 1;
const IMG_PER_PAGE = 40;
let totalPage;
const btnLoadMoreEl = document.querySelector('.load-more');
let inputText = '';

formEl.addEventListener('submit', ev => {
  ev.preventDefault();
  page = 1;
  galleryEl.innerHTML = '';
  inputText = ev.currentTarget.searchQuery.value;
  if (!btnLoadMoreEl.classList.contains('is-hidden')) {
    btnLoadMoreEl.classList.add('is-hidden');
  }
  fetchData(inputText, page);
});

const axios = require('axios');
async function fetchData(inputText, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '36234067-70acfbfc80ca70cd9e73eaaab',
        q: inputText,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: IMG_PER_PAGE,
      },
    });
    const {
      data: { totalHits },
    } = response;
    totalPage = Math.ceil(totalHits / IMG_PER_PAGE);

    if (totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (page === totalPage) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      btnLoadMoreEl.classList.add('is-hidden');
    } else if (page < totalPage) {
      btnLoadMoreEl.classList.remove('is-hidden');
    }
    renderPage(response);
  } catch (error) {
    console.error(error);
  }
}

function renderPage(response) {
  for (const hit of response.data.hits) {
    const divFototEl = document.createElement('div');
    divFototEl.classList.add('photo-card');
    divFototEl.innerHTML = `<img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
     <div class="info">
        <p class="info-item">
          <b>Likes</b> <br>${hit.likes}
        </p>
        <p class="info-item">
          <b>Views</b><br>${hit.views}
        </p>
        <p class="info-item">
          <b>Comments</b><br>${hit.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b><br>${hit.downloads}
        </p>
      </div>`;
    galleryEl.append(divFototEl);
  }
}

btnLoadMoreEl.addEventListener('click', () => {
  if (page < totalPage) {
    page++;
    return fetchData(inputText, page);
  } else {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
});
