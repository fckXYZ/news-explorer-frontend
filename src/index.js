import './index.css';
import Header from './js/components/Header';
import PopupLogin from './js/components/PopupLogin';
import NewsApi from './js/api/NewsApi';
import MainForm from './js/components/MainForm';
import NewsCardList from './js/components/NewsCardList';
import MainAPI from './js/api/MainApi';

// Если авторизации нет, либо истекла, создаем пустой массив с данными сохраненных статей,
// чтобы проверять статьи из NewsApi на наличие их у пользователя без запросов на MainApi.
if (!localStorage.jwt) {
  localStorage.setItem('userArticles', '[]');
}

const SearchResSection = document.querySelector('.results');
const searchForm = new MainForm(
  new NewsApi(),
  document.querySelector('.search__form'),
  new NewsCardList(SearchResSection, new MainAPI()),
);
searchForm.setFormListeners();

const popup = new PopupLogin();
const header = new Header(popup);

header.onLoadRender();

export default header;
