import { fetchJSON, renderProjects, fetchGitHubData} from './global.js';

const projectsContainer = document.querySelector('.projects');

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);

renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('mfjacobsen');

const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
    profileStats.innerHTML = `
    <dl class="stats-grid">
      <div><dt>Followers</dt><dd>${githubData.followers}</dd></div>
      <div><dt>Following</dt><dd>${githubData.following}</dd></div>
      <div><dt>Public Repos</dt><dd>${githubData.public_repos}</dd></div>
      <div><dt>Public Gists</dt><dd>${githubData.public_gists}</dd></div>
    </dl>
  `;
}