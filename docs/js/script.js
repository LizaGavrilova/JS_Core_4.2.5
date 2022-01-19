const input = document.querySelector('.input_search');
const list = document.querySelector('.search_list');
const infoList = document.querySelector('.info_list');
const map = new Map();

// Задержка выполнения
const debounce = (fn, debounceTime) => {
  let timeout;

  function wrapper() {
    const fnCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  }

  return wrapper;
};

// Получение данных
const getInfoGitHub = async (search) => {
  const url = `https://api.github.com/search/repositories?q=${search}&per_page=5`;
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    return;
  }
}

// 5 найденных элементов
const addSearchItem = async () => {
  let search = input.value;
  let repositories = await getInfoGitHub(search);
  let fragment = new DocumentFragment();
  let item;

  document
    .querySelectorAll('.search_item')
    .forEach((element) => element.remove());

  if (repositories.total_count === 0) {
    item = document.createElement('li');
    item.classList.add('search_item');
    item.append('Не найдено');
    fragment.append(item);
  }

  for (let i = 0; i < repositories.items.length; i++) {
    item = document.createElement('li');
    item.classList.add('search_item');
    item.append(repositories.items[i]['name']);
    item.id = repositories.items[i]['id'];
    map.set(item.id, repositories.items[i]);
    fragment.append(item);
  }

  list.append(fragment);
}

// Добавление выбранного элемента в новый список
const addInfoItem = async (item) => {
  let fragment = new DocumentFragment();

  let infoItem = document.createElement('li');
  infoItem.classList.add('info_item');

  let text = document.createElement('div');
  text.classList.add('left-text');

  let name = document.createElement('div');
  name.classList.add('text');
  name.textContent = `Name: ${map.get(item.id).name}`;
  text.append(name);

  let owner = document.createElement('div');
  owner.classList.add('text');
  owner.textContent = `Owner: ${map.get(item.id).owner.login}`;
  text.append(owner);

  let stars = document.createElement('div');
  stars.classList.add('text');
  stars.textContent = `Stars: ${map.get(item.id).stargazers_count}`;
  text.append(stars);

  let button = document.createElement('button');
  button.classList.add('button_close');
  button.addEventListener('click', () => {
    button.parentNode.remove();
  });

  infoItem.append(text);
  infoItem.append(button);
  fragment.append(infoItem);
  infoList.append(fragment);

  input.value = "";
  document
    .querySelectorAll('.search_item')
    .forEach((element) => element.remove());
}

input.addEventListener('input', debounce(addSearchItem, 200));

list.addEventListener('click', (evt) => {
  let target = evt.target;

  addInfoItem(target);
});
