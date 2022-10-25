const $ = document.querySelector.bind(document);
    
const body = $('body');
const themeButton = $('#theme');
const contentField = $('#content');
const characterCount = $('#counter');

let theme = body.classList.contains('dark') ? 'dark' : 'light';

const pageUUID = window.location.pathname.split('/').pop();

const updateCounter = () => {
  const text = contentField.value;
  characterCount.innerText = `${ text.length }, ${ text.split(/\s+/).filter(Boolean).length }`
}

const setTheme = (theme) => {
  theme === 'dark'
  ? body.classList.add('dark')
  : body.classList.remove('dark');
  
  document.cookie = `theme=${ theme }; path=/; max-age=31536000`;
}

const cycleTheme = () => {
  theme = theme === 'light' ? 'dark' : 'light';
  setTheme(theme);
}

updateCounter();
setTheme(theme);

themeButton.addEventListener('click', cycleTheme);

window.onbeforeunload = () => {
  theme = theme === 'dark' ? 'dark' : 'light';

  fetch(`/save/${ pageUUID }?theme=${ theme }`, {
    body: contentField.value,
    method: 'POST',
  });
};