const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Notion API Integration Script
 * Uses Notion API to extract portfolio data and update website
 */
class NotionAPISync {
    constructor() {
        this.notion = new Client({
            auth: process.env.NOTION_API_KEY,
        });
        
        this.profileData = {
            name: '',
            headline: '',
            location: '',
            about: '',
            experience: [],
            education: [],
            skills: [],
            lastUpdated: new Date().toISOString()
        };
    }

    async extractProfileData() {
        console.log('📝 Extracting Notion portfolio data...');
        
        try {
            // Extract basic profile data
            await this.extractBasicProfile();
            
            // Extract experience data
            await this.extractExperience();
            
            // Extract education data
            await this.extractEducation();
            
            // Extract skills data
            await this.extractSkills();
            
            console.log('✅ Notion data extracted successfully');
            return this.profileData;
            
        } catch (error) {
            console.error('❌ Error extracting Notion data:', error);
            throw error;
        }
    }

    async extractBasicProfile() {
        try {
            const response = await this.notion.databases.query({
                database_id: process.env.NOTION_DATABASE_ID,
            });

            if (response.results.length > 0) {
                const page = response.results[0];
                const properties = page.properties;

                this.profileData.name = this.getPropertyValue(properties, 'Title') || '';
                this.profileData.headline = this.getPropertyValue(properties, 'Headline') || '';
                this.profileData.location = this.getPropertyValue(properties, 'Location') || '';
                this.profileData.about = this.getPropertyValue(properties, 'About') || '';
            }
            
        } catch (error) {
            console.error('❌ Error extracting basic profile:', error);
        }
    }

    async extractExperience() {
        try {
            const response = await this.notion.databases.query({
                database_id: process.env.NOTION_EXPERIENCE_DB_ID,
            });

            this.profileData.experience = response.results.map(page => {
                const properties = page.properties;
                return {
                    title: this.getPropertyValue(properties, 'Title') || '',
                    company: this.getPropertyValue(properties, 'Company') || '',
                    duration: this.getPropertyValue(properties, 'Duration') || '',
                    description: this.getPropertyValue(properties, 'Description') || '',
                    startDate: this.getPropertyValue(properties, 'Start Date') || '',
                    endDate: this.getPropertyValue(properties, 'End Date') || '',
                    current: this.getPropertyValue(properties, 'Current') || false
                };
            });
            
        } catch (error) {
            console.error('❌ Error extracting experience:', error);
        }
    }

    async extractEducation() {
        try {
            const response = await this.notion.databases.query({
                database_id: process.env.NOTION_EDUCATION_DB_ID,
            });

            this.profileData.education = response.results.map(page => {
                const properties = page.properties;
                return {
                    school: this.getPropertyValue(properties, 'Title') || '',
                    degree: this.getPropertyValue(properties, 'Degree') || '',
                    duration: this.getPropertyValue(properties, 'Duration') || '',
                    startDate: this.getPropertyValue(properties, 'Start Date') || '',
                    endDate: this.getPropertyValue(properties, 'End Date') || ''
                };
            });
            
        } catch (error) {
            console.error('❌ Error extracting education:', error);
        }
    }

    async extractSkills() {
        try {
            const response = await this.notion.databases.query({
                database_id: process.env.NOTION_SKILLS_DB_ID,
            });

            this.profileData.skills = response.results.map(page => {
                const properties = page.properties;
                return {
                    name: this.getPropertyValue(properties, 'Title') || '',
                    category: this.getPropertyValue(properties, 'Category') || '',
                    proficiency: this.getPropertyValue(properties, 'Proficiency') || 0
                };
            });
            
        } catch (error) {
            console.error('❌ Error extracting skills:', error);
        }
    }

    getPropertyValue(properties, propertyName) {
        const property = properties[propertyName];
        if (!property) return '';

        switch (property.type) {
            case 'title':
                return property.title?.[0]?.text?.content || '';
            case 'rich_text':
                return property.rich_text?.[0]?.text?.content || '';
            case 'select':
                return property.select?.name || '';
            case 'number':
                return property.number || 0;
            case 'checkbox':
                return property.checkbox || false;
            case 'date':
                return property.date?.start || '';
            case 'url':
                return property.url || '';
            default:
                return '';
        }
    }

    async updatePortfolio() {
        console.log('🔄 Updating portfolio with Notion data...');
        
        try {
            const indexPath = path.join(__dirname, '..', 'index.html');
            let htmlContent = fs.readFileSync(indexPath, 'utf8');

            // Update name and headline
            if (this.profileData.name) {
                htmlContent = htmlContent.replace(/<h1[^>]*>.*?<\/h1>/s, `<h1>${this.profileData.name}</h1>`);
            }

            if (this.profileData.headline) {
                htmlContent = htmlContent.replace(/<p class="headline"[^>]*>.*?<\/p>/s, `<p class="headline">${this.profileData.headline}</p>`);
            }

            if (this.profileData.location) {
                htmlContent = htmlContent.replace(/<p class="location"[^>]*>.*?<\/p>/s, `<p class="location">${this.profileData.location}</p>`);
            }

            // Update about section
            if (this.profileData.about) {
                const aboutSection = `
                    <section class="about">
                        <h2>About</h2>
                        <p>${this.profileData.about}</p>
                    </section>
                `;
                htmlContent = htmlContent.replace(/<section class="about"[^>]*>.*?<\/section>/s, aboutSection);
            }

            // Update experience section
            if (this.profileData.experience.length > 0) {
                const experienceHTML = this.profileData.experience.map(exp => `
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <h3>${exp.title}</h3>
                            <h4>${exp.company}</h4>
                            <p class="timeline-date">${exp.duration}</p>
                            <p>${exp.description}</p>
                        </div>
                    </div>
                `).join('');

                const experienceSection = `
                    <section class="experience">
                        <h2>Experience</h2>
                        <div class="timeline">
                            ${experienceHTML}
                        </div>
                    </section>
                `;
                htmlContent = htmlContent.replace(/<section class="experience"[^>]*>.*?<\/section>/s, experienceSection);
            }

            // Update education section
            if (this.profileData.education.length > 0) {
                const educationHTML = this.profileData.education.map(edu => `
                    <div class="education-card">
                        <h3>${edu.school}</h3>
                        <h4>${edu.degree}</h4>
                        <p class="education-date">${edu.duration}</p>
                    </div>
                `).join('');

                const educationSection = `
                    <section class="education">
                        <h2>Education</h2>
                        <div class="education-grid">
                            ${educationHTML}
                        </div>
                    </section>
                `;
                htmlContent = htmlContent.replace(/<section class="education"[^>]*>.*?<\/section>/s, educationSection);
            }

            // Update skills section
            if (this.profileData.skills.length > 0) {
                const skillsHTML = this.profileData.skills.map(skill => `
                    <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <div class="skill-proficiency">
                            <div class="skill-bar" style="width: ${skill.proficiency * 10}%"></div>
                        </div>
                    </div>
                `).join('');

                const skillsSection = `
                    <section class="skills">
                        <h2>Skills</h2>
                        <div class="skills-grid">
                            ${skillsHTML}
                        </div>
                    </section>
                `;
                htmlContent = htmlContent.replace(/<section class="skills"[^>]*>.*?<\/section>/s, skillsSection);
            }

            // Write updated HTML
            fs.writeFileSync(indexPath, htmlContent);
            console.log('✅ Portfolio updated successfully');
            
        } catch (error) {
            console.error('❌ Error updating portfolio:', error);
            throw error;
        }
    }

    async saveData() {
        console.log('💾 Saving Notion data...');
        
        try {
            const dataPath = path.join(__dirname, '..', 'data', 'notion-profile.json');
            const dataDir = path.dirname(dataPath);
            
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            
            fs.writeFileSync(dataPath, JSON.stringify(this.profileData, null, 2));
            console.log('✅ Notion data saved to data/notion-profile.json');
            
        } catch (error) {
            console.error('❌ Error saving data:', error);
            throw error;
        }
    }

    async run() {
        try {
            console.log('🚀 Starting Notion API sync...');
            console.log('==============================');
            
            await this.extractProfileData();
            await this.updatePortfolio();
            await this.saveData();
            
            console.log('🎉 Notion API sync completed successfully!');
            console.log(`📊 Updated: ${this.profileData.experience.length} experiences, ${this.profileData.education.length} education entries, ${this.profileData.skills.length} skills`);
            
        } catch (error) {
            console.error('❌ Notion API sync failed:', error);
            process.exit(1);
        }
    }
}

// Run the sync
if (require.main === module) {
    const sync = new NotionAPISync();
    sync.run();
}

module.exports = NotionAPISync;




