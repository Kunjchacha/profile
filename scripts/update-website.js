#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { convertBlocksToHTML, extractStructuredData } = require('./fetch-notion-content');

async function updateWebsite() {
  try {
    console.log('🔄 Updating website content...');
    
    // Load content from Notion
    const contentPath = path.join(__dirname, '../data/content.json');
    const contentData = JSON.parse(await fs.readFile(contentPath, 'utf8'));
    const content = contentData.content;
    
    // Load current HTML template
    const htmlPath = path.join(__dirname, '../index.html');
    let html = await fs.readFile(htmlPath, 'utf8');
    
    // Update each section
    html = await updateHeroSection(html, content.hero);
    html = await updateAboutSection(html, content.about);
    html = await updateExperienceSection(html, content.experience);
    html = await updateProjectsSection(html, content.projects);
    html = await updateContactSection(html, content.contact);
    
    // Save updated HTML
    await fs.writeFile(htmlPath, html);
    
           console.log('✅ Profile website updated successfully');
    
  } catch (error) {
    console.error('❌ Error updating website:', error);
    throw error;
  }
}

async function updateHeroSection(html, heroContent) {
  if (!heroContent) return html;
  
  const data = extractStructuredData(heroContent.properties);
  
  // Update hero title
  html = html.replace(
    /<span class="name">.*?<\/span>/,
    `<span class="name">${data.name || 'Kunj Chacha'}</span>`
  );
  
  // Update hero subtitle
  html = html.replace(
    /<h2 class="hero-subtitle">.*?<\/h2>/,
    `<h2 class="hero-subtitle">${data.title || 'Program Manager & Process Transformation Expert'}</h2>`
  );
  
  // Update hero description
  html = html.replace(
    /<p class="hero-description">.*?<\/p>/,
    `<p class="hero-description">${data.description || 'Transforming processes, maximizing efficiency & driving strategic growth.'}</p>`
  );
  
  // Update statistics
  const stats = data.stats ? JSON.parse(data.stats) : null;
  if (stats) {
    const statsHtml = generateStatsHTML(stats);
    html = html.replace(
      /<div class="hero-stats">[\s\S]*?<\/div>/,
      statsHtml
    );
  }
  
  return html;
}

async function updateAboutSection(html, aboutContent) {
  if (!aboutContent) return html;
  
  const data = extractStructuredData(aboutContent.properties);
  const blocksHtml = convertBlocksToHTML(aboutContent.blocks);
  
  // Update about text
  html = html.replace(
    /<div class="about-text">[\s\S]*?<\/div>/,
    `<div class="about-text">${blocksHtml}</div>`
  );
  
  // Update skills
  const skills = data.skills ? JSON.parse(data.skills) : null;
  if (skills) {
    const skillsHtml = generateSkillsHTML(skills);
    html = html.replace(
      /<div class="skills-section">[\s\S]*?<\/div>/,
      skillsHtml
    );
  }
  
  return html;
}

async function updateExperienceSection(html, experienceContent) {
  if (!experienceContent) return html;
  
  const experiences = experienceContent.experiences || [];
  const timelineHtml = generateTimelineHTML(experiences);
  
  html = html.replace(
    /<div class="timeline">[\s\S]*?<\/div>/,
    `<div class="timeline">${timelineHtml}</div>`
  );
  
  return html;
}

async function updateProjectsSection(html, projectsContent) {
  if (!projectsContent) return html;
  
  const projects = projectsContent.projects || [];
  const projectsHtml = generateProjectsHTML(projects);
  
  html = html.replace(
    /<div class="projects-grid">[\s\S]*?<\/div>/,
    `<div class="projects-grid">${projectsHtml}</div>`
  );
  
  return html;
}

async function updateContactSection(html, contactContent) {
  if (!contactContent) return html;
  
  const data = extractStructuredData(contactContent.properties);
  
  // Update contact information
  html = html.replace(
    /<span class="value">.*?<\/span>/g,
    (match) => {
      if (match.includes('kunjnikhilchacha@gmail.com')) {
        return `<span class="value">${data.email || 'kunjnikhilchacha@gmail.com'}</span>`;
      }
      if (match.includes('7304042382')) {
        return `<span class="value">${data.phone || '+91 7304042382'}</span>`;
      }
      if (match.includes('linkedin.com')) {
        return `<span class="value">${data.linkedin || 'linkedin.com/in/kunjchacha'}</span>`;
      }
      return match;
    }
  );
  
  // Update references
  const references = data.references ? JSON.parse(data.references) : null;
  if (references) {
    const referencesHtml = generateReferencesHTML(references);
    html = html.replace(
      /<div class="reference-list">[\s\S]*?<\/div>/,
      referencesHtml
    );
  }
  
  return html;
}

function generateStatsHTML(stats) {
  return `
    <div class="hero-stats">
      ${stats.map(stat => `
        <div class="stat">
          <span class="stat-number">${stat.value}</span>
          <span class="stat-label">${stat.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function generateSkillsHTML(skills) {
  return `
    <div class="skills-section">
      <h3>Core Competencies</h3>
      <div class="skills-grid">
        ${Object.entries(skills).map(([category, skillList]) => `
          <div class="skill-category">
            <h4>${category}</h4>
            <div class="skill-items">
              ${skillList.map(skill => `
                <span class="skill-tag">${skill}</span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function generateTimelineHTML(experiences) {
  return experiences.map(exp => `
    <div class="timeline-item">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <h3>${exp.title}</h3>
          <span class="company">${exp.company}</span>
          <span class="duration">${exp.duration}</span>
        </div>
        <div class="timeline-body">
          <p class="role-focus">${exp.focus}</p>
          ${exp.reporting ? `<p class="reporting">${exp.reporting}</p>` : ''}
          <ul class="achievements">
            ${exp.achievements.map(achievement => `
              <li>${achievement}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `).join('');
}

function generateProjectsHTML(projects) {
  return projects.map(project => `
    <div class="project-card">
      <div class="project-icon">
        <i class="${project.icon || 'fas fa-project-diagram'}"></i>
      </div>
      <h3>${project.title}</h3>
      <p class="project-company">${project.company}</p>
      <p class="project-description">${project.description}</p>
      <div class="project-metrics">
        ${project.metrics.map(metric => `
          <span class="metric">${metric}</span>
        `).join('')}
      </div>
      <div class="project-tech">
        ${project.technologies.map(tech => `
          <span class="tech-tag">${tech}</span>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function generateReferencesHTML(references) {
  return `
    <div class="reference-list">
      ${references.map(ref => `
        <div class="reference-item">
          <h4>${ref.name}</h4>
          <p>${ref.title}, ${ref.company}</p>
          <span class="reference-email">${ref.email}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// Validate HTML structure
function validateHTML(html) {
  const requiredElements = [
    'hero-section',
    'about-section', 
    'experience-section',
    'projects-section',
    'contact-section'
  ];
  
  const missingElements = requiredElements.filter(element => 
    !html.includes(`id="${element}"`)
  );
  
  if (missingElements.length > 0) {
    console.warn('⚠️ Missing required sections:', missingElements);
  }
  
  return missingElements.length === 0;
}

// Main execution
if (require.main === module) {
  updateWebsite()
    .then(() => {
      console.log('Website update completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Website update failed:', error);
      process.exit(1);
    });
}

module.exports = {
  updateWebsite,
  generateStatsHTML,
  generateSkillsHTML,
  generateTimelineHTML,
  generateProjectsHTML,
  generateReferencesHTML,
  validateHTML
};
