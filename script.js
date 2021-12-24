let input = document.querySelector(".input_search");
let list = document.querySelector(".search_list");
let item = document.querySelectorAll(".search_item");
let infoList = document.querySelector(".info_list");
let infoItem = document.querySelector(".info_item");
let map = new Map();

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
async function getInfoGitHub(search) {
    const url = `https://api.github.com/search/repositories?q=${search}`;
    try {
        let response = await fetch(url);
        return await response.json();

    } catch(error) {
        console.log(error);
    }
}

// 5 найденных элементов
async function addSearchItem() {
    let search = input.value;    
    let repositories = await getInfoGitHub(search);
    let fragment = new DocumentFragment();

    document.querySelectorAll(".search_item").forEach(element => element.remove());

    if (repositories.total_count > 5) {
        for (let i = 0; i < 5; i++) {
            item = document.createElement("li");
            item.classList.add("search_item");
            item.append(repositories.items[i]["name"]);        
            item.id = repositories.items[i]["id"];
            map.set(item.id, repositories.items[i]);
            fragment.append(item);
        }
    } else {
        for (let i = 0; i < repositories.total_count; i++) {
            item = document.createElement("li");
            item.classList.add("search_item");
            item.append(repositories.items[i]["name"]);        
            item.id = repositories.items[i]["id"];
            map.set(item.id, repositories.items[i]);
            fragment.append(item);
        }
    }
    
    list.append(fragment);
}

// Добавление выбранного элемента в новый список
function addInfoItem(item) {
    let fragment = new DocumentFragment();

    infoItem = document.createElement("li");
    infoItem.classList.add("info_item");

    let text = document.createElement("div");
    text.classList.add("left-text");

    let name = document.createElement("div");
    name.classList.add("text");
    name.textContent = `Name: ${map.get(item.id).name}`;
    text.append(name);

    let owner = document.createElement("div");
    owner.classList.add("text");
    owner.textContent = `Owner: ${map.get(item.id).owner.login}`;
    text.append(owner);

    let stars = document.createElement("div");
    stars.classList.add("text");
    stars.textContent = `Stars: ${map.get(item.id).stargazers_count}`;
    text.append(stars);

    let button = document.createElement("button");
    button.classList.add("button_close");
    button.addEventListener('click', () => {
        button.parentNode.remove();
    })

    infoItem.append(text);
    infoItem.append(button);
    fragment.append(infoItem);
    infoList.append(fragment);     
}


input.addEventListener('keyup', debounce(addSearchItem, 200));

list.addEventListener('click', (evt) => {
    let target = evt.target;

    addInfoItem(target);    
})
