const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"  // Local server
    : "/portfolio/";  // GitHub Pages repo name

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

export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        console.log(response)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}
window.fetchJSON = fetchJSON;

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';

    const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const headingTag = validHeadings.includes(headingLevel) ? headingLevel : 'h2';

    projects.forEach(project => {
        const article = document.createElement('article');

        article.innerHTML = `
            <${headingTag}>${project.title}</${headingTag}>
            <img src="${project.image}" alt="${project.title}">
            <div>
            <p>${project.description}</p>
            <p>c. ${project.year}</p>
            </div>        
        `;

        containerElement.appendChild(article);
    });
}

window.renderProjects = renderProjects;

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'contact/', title: 'Contact' },
    { url: 'meta/', title: 'Meta'},
    { url: 'https://github.com/mfjacobsen', title: 'GitHub' }
]

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;

    url = !url.startsWith('http') ? BASE_PATH + url : url;

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

