import { fetchJSON, renderProjects} from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');

renderProjects(projects, projectsContainer, 'h2');

if (titleElement) {
    titleElement.textContent = `${projects.length} Projects`;
}


let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let selectedIndex = -1;
const highlightColor = 'oklch(60% 45% 0)';

function renderPieChart(projectsGiven) {
    // Recompute rolled data
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let newData = newRolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    let newArcData = d3.pie().value((d) => d.value)(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));

    // Clear old arcs
    let svg = d3.select('svg');
    svg.selectAll('path').remove();

    // Add arcs with click and class handling
    newArcs.forEach((arc, i) => {
        svg.append('path')
            .attr('d', arc)
            .attr('fill', i === selectedIndex ? highlightColor : colors(i))
            .attr('class', i === selectedIndex ? 'selected' : null)
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;

                // Filter project data and render it
                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, 'h2');
                } else {
                    const selectedLabel = newData[selectedIndex].label;
                    const filtered = projects.filter(p => p.year === selectedLabel);
                    renderProjects(filtered, projectsContainer, 'h2');
                }

                renderPieChart(projectsGiven); // Re-render chart + legend
            });
    });

    // Clear and render legend
    let legend = d3.select('.legend');
    legend.selectAll('li').remove();

    newData.forEach((d, i) => {
        legend.append('li')
            .attr('class', i === selectedIndex ? 'legend-item selected' : 'legend-item')
            .attr('style', `--color:${colors(i)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
}

// Call this function on page load
renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
    // update query value
    query = event.target.value;
    // filter projects
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    // render filtered projects
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

