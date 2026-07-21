// favorites.js
const STORAGE_KEY = 'favorites';

function getAll() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function add(id) {
  const list = getAll();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

function remove(id) {
  let list = getAll();
  list = list.filter(item => item !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function isFavorite(id) {
  return getAll().includes(id);
}

export { add, remove, isFavorite, getAll };