import BaseComponent from './BaseComponent';
import defaultPics from '../utils/defaultPics';
import profileTitle from '../../secondary/index';
import cardsTemplates from '../utils/cardsTemplates';
import serverErrors from '../constants/serverErrors';

export default class SavedArticle extends BaseComponent {
  constructor(article, mainApi) {
    super();
    this._id = article.article._id;
    this._api = mainApi;
    this._keyWord = article.article.keyword;
    this._source = article.article.source;
    this._title = article.article.title;
    this._description = article.article.text;
    this._url = article.article.link;
    this._image = article.article.image;
    this._date = new Date(Date.parse(article.article.date));
    this._card = null;
  }

  render() {
    this._template = cardsTemplates.cardSaved(
      this._image,
      defaultPics[Math.floor(Math.random() * defaultPics.length)],
      this._keyWord,
      this._date.toLocaleString('ru', { day: 'numeric', month: 'long', year: 'numeric' }),
      this._title,
      this._description,
      this._url,
      this._source,
    );
    this._card = this._makeContentForDOM(this._template);
    this._icon = this._card.querySelector('.button_small-square');
    this._hoverBanner = this._card.querySelector('.card__button-hover-banner');
    this._setListeners([
      {
        element: this._icon,
        event: 'click',
        callback: (evt) => this._removeClickHandler(evt),
      },
      {
        element: this._icon,
        event: 'mouseover',
        callback: (evt) => this._templHoverHandler(evt, 'over'),
      },
      {
        element: this._icon,
        event: 'mouseout',
        callback: (evt) => this._templHoverHandler(evt, 'out'),
      },
    ]);
    return this._card;
  }

  _removeClickHandler() {
    this._getArticlesFromStorage();
    const cardId = this._userArticles.find((el) => el.title === this._title)._id;

    this._api
      .removeArticle(cardId)
      .then((res) => {
        const resp = res;
        if (resp.message && !resp.message.includes('удалён')) {
          throw new Error(res.message);
        }
        const indexForRemove = this._userArticles.findIndex((el) => el._id === cardId);
        this._userArticles.splice(indexForRemove, 1);
        this._clearListeners();
        this._removeFromDOM();
        this._putArticlesToStorage();
      })
      .catch((err) => alert(`${serverErrors.DEFAULT_ENG} Текст ошибки: ${err}`))
      .finally(() => profileTitle.render());
  }

  _removeFromDOM() {
    this._clearListeners();
    this._card.remove();
  }

  _templHoverHandler(event, mouseAction) {
    if (mouseAction === 'over') {
      this._hoverBanner.classList.add('_is-displayed');
    } else {
      this._hoverBanner.classList.remove('_is-displayed');
    }
  }
}
