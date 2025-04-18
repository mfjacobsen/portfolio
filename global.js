const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                  // Local server
    : "/portfolio/";         // GitHub Pages repo name

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
};

function setColorScheme(scheme) {
    if (scheme) {
        document.documentElement.style.setProperty('color-scheme', scheme);
    } else {
        document.documentElement.style.removeProperty('color-scheme');
    }
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/mfjacobsen', title: 'GitHub' }

]

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;

    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    };

    let title = p.title;
    let a = document.createElement('a');

    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        a.target = "_blank";
    }
    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  `
);

const select = document.querySelector('.color-scheme select');

// Apply saved preference if it exists
if ("colorScheme" in localStorage) {
    const savedScheme = localStorage.colorScheme;
    select.value = savedScheme;
    setColorScheme(savedScheme);
}

// When user changes selection, apply and save
select.addEventListener('input', function (event) {
    const scheme = event.target.value;
    localStorage.colorScheme = scheme;
    setColorScheme(scheme);
});

