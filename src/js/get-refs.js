export default function getRefs() {
    return {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input[name="searchQuery"]'),
    button: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
    infScroll: document.querySelector('#inf-scroll'),
    boxOptions: {
        overlay: true,
        animationSpeed: 150,
        captionSelector: 'img',
        captionType: 'attr',
        captionsData: 'alt',
        captionDelay: 250,
    },
    lightbox: null
    };
}