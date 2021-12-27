import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { showLoadButtons, hideLoadButtons, infiniteScroll, refreshLightBox } from '../index'
const axios = require('axios').default;
const BASE_URL_KEY = 'https://pixabay.com/api/?key=24998702-9371049f7cd7825ac8bbafe8e';

const options = {
    image_type: 'image_type=photo',
    orientation: 'orientation=horizontal',
    safesearch: 'safesearch=true',
    language: 'language=en',
    per_page: '40'
}

export default class APIsearch {
    constructor() {
        this.shearchQuery = '';
        this.page = 1;
    }
    async fetchPictures() {
        try {
            console.time()
            const url = `${BASE_URL_KEY}&q=${this.shearchQuery}&${this.language}&${options.image_type}
            &${options.orientation}&${options.safesearch}&page=${this.page}&per_page=${options.per_page}`;
            console.log(url);
            const fetchPictures = (await axios.get(`${url}`)).data
            console.log(fetchPictures);
            console.log('current page', this.page);
            this.incrementPages()
            console.log('incremented page', this.page);
            console.timeEnd()
            return fetchPictures
        } catch (e) {
            if (e.toJSON().message ===
                'Request failed with status code 400') {
                refreshLightBox()
                window.removeEventListener('scroll', infiniteScroll)
                Notify.warning(`We're sorry, but you've reached the end of search results.`);
                hideLoadButtons()
                return
            }
            console.log(e);
        }
    }
    get query() {
        return this.shearchQuery
    }
    set query(value) {
        this.shearchQuery = value
    }
    incrementPages() {
        return this.page += 1
    }
    resetPages() {
        return this.page = 1
    }
}

// key - твой уникальный ключ доступа к API.
// q - термин для поиска.То, что будет вводить пользователь.
// image_type - тип изображения.Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии.Задай значение horizontal.
// safesearch - фильтр по возрасту.Задай значение true.