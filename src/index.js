import './sass/main.scss';
import APIsearch from './js/get-API.js';
import getRefs from './js/get-refs';
import pictureCardTpl from './templates/pictureCardTpl.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { forEach } from 'lodash';

const refs = getRefs();

const userSearch = new APIsearch();
let currentSearchInput = '';


refs.form.addEventListener('submit', onSubmit)
refs.loadMore.addEventListener('click', onClick)
refs.infScroll.addEventListener('click', onClickInfScroll)
refs.gallery.addEventListener('click', createLightboxOnClick)


function onSubmit(event) {
    event.preventDefault()
    const userInput = event.currentTarget.elements.searchQuery.value.trim()

    if (!userInput || currentSearchInput === userInput) {
        Notify.info('Please enter new search');
        return
    }
    if (currentSearchInput !== userInput) {
        userSearch.resetPages()
        window.removeEventListener('scroll', infiniteScroll)
    }

    console.log('this is userInput :', userInput);
    clearAdjacentHTML()

    currentSearchInput = userInput
    userSearch.query = userInput

    userSearch.fetchPictures()
        .then(emptySearchResult)
        .then(SearchResult)
        .catch(error => {
            console.log(error);
        })
}


function emptySearchResult(fetchPictures) {
    if (fetchPictures.totalHits === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        hideLoadButtons()
    }
    return fetchPictures
}
function SearchResult(fetchPictures) {
    if (fetchPictures.totalHits > 0) {
        createMarkup(fetchPictures, refs.gallery, pictureCardTpl)
        successMessage(fetchPictures)
        showLoadButtons()
    }
    if (fetchPictures.hits.length < 40) {
        hideLoadButtons()
    }
}

function successMessage(fetchPictures) {
    Notify.success(`Hooray! We found ${fetchPictures.total} images.`);
}

function createMarkup(fetchPictures, element, template) {
    element.insertAdjacentHTML('beforeend', template(fetchPictures))
    refreshLightBox()
}

function clearAdjacentHTML() {
    refs.gallery.innerHTML = ''
}
export function showLoadButtons() {
    refs.loadMore.classList.remove('visually-hidden')
    refs.infScroll.classList.remove('visually-hidden')
}

export function hideLoadButtons() {
    refs.loadMore.classList.add('visually-hidden')
    refs.infScroll.classList.add('visually-hidden')
}

function onClick(event) {
    event.preventDefault()
    loadMore()
}

function scroll() {
    const { height: cardHeight } = refs.gallery
        .firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 2.2,
        behavior: "smooth",
    });
}

function loadMore() {
    refreshLightBox()
    hideLoadButtons()
    userSearch.fetchPictures().then(fetchPictures => {
        createMarkup(fetchPictures, refs.gallery, pictureCardTpl)
        if (fetchPictures.hits.length < 40) {
            Notify.warning(`We're sorry, but you've reached the end of search results.`);
            hideLoadButtons()
            window.removeEventListener('scroll', infiniteScroll)
            refreshLightBox()
            return
        };
        showLoadButtons()
    }).then(scroll)
}

function onClickInfScroll() {
    window.addEventListener('scroll', infiniteScroll)
    loadMore()
}

export function infiniteScroll() {
    if (window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight) {
        refreshLightBox()
        loadMore()
    }
}

export function refreshLightBox() {
    if (!refs.lightbox) {
        refs.lightbox = new SimpleLightbox('.gallery a', refs.boxOptions);
    }
    refs.lightbox.refresh()
}

function createLightboxOnClick(event) {
    const lightboxLink = document.querySelectorAll('.gallery__link')
    if (event.target === lightboxLink) {
        refreshLightBox()
    }
}

