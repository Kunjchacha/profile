const fs = require('fs');
const path = require('path');

class PortfolioUpdater {
    constructor() {
        this.resumeDataPath = path.join(__dirname, '..', 'data', 'resume-specific-data.json');
        this.indexPath = path.join(__dirname, '..', 'index.html');
    }

    async updatePortfolio() {
        console.log('🚀 Starting portfolio update from resume data...');
        
        try {
            // Load resume data
            const resumeData = this.loadResumeData();
            if (!resumeData) {
                console.error('❌ No resume data found. Please run resume-specific-fetch.js first.');
                return;
            }

            // Load current index.html
            let indexContent = fs.readFileSync(this.indexPath, 'utf8');
            
            // Update specific sections
            indexContent = this.updateAboutSection(indexContent, resumeData);
            indexContent = this.updateSkillsSection(indexContent, resumeData);
            indexContent = this.updateProjectsSection(indexContent, resumeData);
            indexContent = this.updateAwardsSection(indexContent, resumeData);
            indexContent = this.updateEducationSection(indexContent, resumeData);
            
            // Save updated index.html
            fs.writeFileSync(this.indexPath, indexContent);
            
            console.log('✅ Portfolio updated successfully from resume data!');
            
        } catch (error) {
            console.error('❌ Error updating portfolio:', error);
        }
    }

    loadResumeData() {
        if (!fs.existsSync(this.resumeDataPath)) {
            return null;
        }
        
        const data = fs.readFileSync(this.resumeDataPath, 'utf8');
        return JSON.parse(data);
    }

    updateAboutSection(content, data) {
        console.log('📝 Updating About section...');
        
        if (data.currentRole) {
            const currentRoleText = `<strong>Currently, I'm a ${data.currentRole.position} at ${data.currentRole.company}</strong>, where I lead process automation initiatives and operational excellence across multiple business units. I specialize in building cross-functional teams, optimizing workflows, and implementing data-driven solutions that enhance business performance.`;
            
            // Update the first paragraph of about section
            content = content.replace(
                /<strong>Currently, I'm a Program Manager at Blenheim Chalcot India<\/strong>.*?business performance\./s,
                currentRoleText
            );
        }
        
        return content;
    }

    updateSkillsSection(content, data) {
        console.log('🎯 Updating Skills section...');
        
        if (data.coreSkills && data.coreSkills.length > 0) {
            // Categorize skills
            const categorizedSkills = this.categorizeSkills(data.coreSkills);
            
            // Update skills HTML
            const skillsHtml = this.generateSkillsHTML(categorizedSkills);
            
            // Replace the skills section
            content = content.replace(
                /<div class="skills-horizontal">[\s\S]*?<\/div>/,
                skillsHtml
            );
        }
        
        return content;
    }

    categorizeSkills(skills) {
        const categories = {
            'Leadership & Management': [],
            'Business & Operations': [],
            'Technology & Tools': []
        };
        
        skills.forEach(skill => {
            const skillLower = skill.toLowerCase();
            
            if (skillLower.includes('leadership') || skillLower.includes('management') || 
                skillLower.includes('planning') || skillLower.includes('stakeholder')) {
                categories['Leadership & Management'].push(skill);
            } else if (skillLower.includes('sales') || skillLower.includes('business') || 
                      skillLower.includes('operations') || skillLower.includes('revenue')) {
                categories['Business & Operations'].push(skill);
            } else if (skillLower.includes('salesforce') || skillLower.includes('data') || 
                      skillLower.includes('analytics') || skillLower.includes('automation') ||
                      skillLower.includes('power bi') || skillLower.includes('sql')) {
                categories['Technology & Tools'].push(skill);
            } else {
                // Default to Business & Operations
                categories['Business & Operations'].push(skill);
            }
        });
        
        return categories;
    }

    generateSkillsHTML(categorizedSkills) {
        let html = '<div class="skills-horizontal">';
        
        Object.entries(categorizedSkills).forEach(([category, skills]) => {
            if (skills.length > 0) {
                const icon = this.getCategoryIcon(category);
                html += `
                    <div class="skill-category-horizontal">
                        <h3 class="category-title-horizontal">
                            <i class="${icon}"></i>
                            ${category}
                        </h3>
                        <div class="skills-tags">
                `;
                
                skills.forEach(skill => {
                    const level = this.getSkillLevel(skill);
                    html += `<span class="skill-tag ${level}">${skill}</span>`;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
        });
        
        html += '</div>';
        return html;
    }

    getCategoryIcon(category) {
        const icons = {
            'Leadership & Management': 'fas fa-users',
            'Business & Operations': 'fas fa-chart-line',
            'Technology & Tools': 'fas fa-tools'
        };
        return icons[category] || 'fas fa-star';
    }

    getSkillLevel(skill) {
        const skillLower = skill.toLowerCase();
        
        if (skillLower.includes('strategic') || skillLower.includes('leadership') || 
            skillLower.includes('management') || skillLower.includes('expert')) {
            return 'expert';
        } else if (skillLower.includes('salesforce') || skillLower.includes('data') || 
                  skillLower.includes('analytics') || skillLower.includes('advanced')) {
            return 'advanced';
        } else {
            return 'intermediate';
        }
    }

    updateProjectsSection(content, data) {
        console.log('🚀 Updating Projects section...');
        
        if (data.projects && data.projects.length > 0) {
            // Update project descriptions with real data
            const projectUpdates = this.generateProjectUpdates(data);
            
            projectUpdates.forEach(update => {
                content = content.replace(update.pattern, update.replacement);
            });
        }
        
        return content;
    }

    generateProjectUpdates(data) {
        const updates = [];
        
        // Update project descriptions based on resume data
        if (data.keyAchievements) {
            data.keyAchievements.forEach(achievement => {
                if (achievement.includes('40%') && achievement.includes('automation')) {
                    updates.push({
                        pattern: /Led comprehensive automation initiatives.*?automated systems\./s,
                        replacement: achievement
                    });
                }
            });
        }
        
        return updates;
    }

    updateAwardsSection(content, data) {
        console.log('🏆 Updating Awards section...');
        
        if (data.awards && data.awards.length > 0) {
            // Update awards with real data from resume
            const awardsHtml = this.generateAwardsHTML(data.awards);
            
            // Replace awards section
            content = content.replace(
                /<div class="awards-timeline">[\s\S]*?<\/div>/,
                awardsHtml
            );
        }
        
        return content;
    }

    generateAwardsHTML(awards) {
        let html = '<div class="awards-timeline">';
        
        awards.forEach((award, index) => {
            const icon = this.getAwardIcon(index);
            const parts = award.split('–');
            const title = parts[0]?.trim() || award;
            const company = parts[1]?.trim() || '';
            const year = this.extractYear(award);
            
            html += `
                <div class="award-item">
                    <div class="award-icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="award-content">
                        <h3 class="award-title">${title}</h3>
                        <h4 class="award-company">${company}</h4>
                        <span class="award-year">${year}</span>
                        <p class="award-description">Recognized for exceptional performance and leadership excellence</p>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    getAwardIcon(index) {
        const icons = ['fas fa-star', 'fas fa-trophy', 'fas fa-medal', 'fas fa-lightbulb'];
        return icons[index % icons.length];
    }

    extractYear(text) {
        const yearMatch = text.match(/(\d{4})/);
        return yearMatch ? yearMatch[1] : '2024';
    }

    updateEducationSection(content, data) {
        console.log('🎓 Updating Education section...');
        
        if (data.education && data.education.length > 0) {
            // Update education with real data
            const educationHtml = this.generateEducationHTML(data.education);
            
            // Replace education section
            content = content.replace(
                /<div class="education-timeline">[\s\S]*?<\/div>/,
                educationHtml
            );
        }
        
        return content;
    }

    generateEducationHTML(education) {
        let html = '<div class="education-timeline">';
        
        education.forEach((edu, index) => {
            const parts = edu.split('–');
            const degree = parts[0]?.trim() || edu;
            const institution = parts[1]?.trim() || '';
            const year = this.extractYear(edu);
            
            html += `
                <div class="timeline-item">
                    <div class="timeline-number">${index + 1}</div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <div class="timeline-title-section">
                                <div class="timeline-date">${year}</div>
                                <h3 class="timeline-title">${degree}</h3>
                                <p class="timeline-company">${institution}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
}

// Run the updater
async function main() {
    const updater = new PortfolioUpdater();
    await updater.updatePortfolio();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = PortfolioUpdater;
