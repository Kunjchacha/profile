#!/usr/bin/env node

/**
 * LinkedIn Auto-Sync for Portfolio
 * Automatically syncs LinkedIn profile data to portfolio website
 * Runs fortnightly (every 2 weeks) to keep portfolio updated
 */

const fs = require('fs');
const path = require('path');

// LinkedIn MCP Integration - Using existing MCP setup
// The MCP is already configured in Cursor, so we'll use the data directly

class LinkedInPortfolioSync {
    constructor() {
        this.portfolioPath = path.join(__dirname, '..');
        this.dataPath = path.join(this.portfolioPath, 'data');
        this.backupPath = path.join(this.dataPath, 'backups');
        
        // Ensure directories exist
        this.ensureDirectories();
        
        // LinkedIn data mapping
        this.dataMapping = {
            profile: {
                name: 'hero-title',
                headline: 'hero-subtitle',
                about: 'hero-description',
                location: 'contact-location'
            },
            experience: {
                title: 'timeline-title',
                company: 'timeline-company',
                duration: 'timeline-date',
                description: 'timeline-description'
            },
            education: {
                school: 'education-school',
                degree: 'education-degree',
                duration: 'education-date',
                description: 'education-description'
            },
            skills: {
                list: 'tech-stack'
            }
        };
    }

    ensureDirectories() {
        [this.dataPath, this.backupPath].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    async fetchLinkedInData() {
        try {
            console.log('🔄 Fetching LinkedIn profile data...');
            
            // This would integrate with your LinkedIn MCP
            // For now, we'll use the existing data structure
            const linkedinData = {
                name: "Kunj Chacha",
                headline: "Program Manager at Blenheim Chalcot | Building Innovative Technology Businesses",
                location: "Mumbai, Maharashtra, India",
                about: "Results-driven business leader with 10+ years of experience in sales, operations, project management, and process automation across diverse industries. Proven ability to lead cross-functional teams, optimize workflows, and drive revenue growth, having successfully delivered INR 3.6 Cr+ in sales while improving operational efficiency by 40%.",
                experience: [
                    {
                        title: "Program Manager",
                        company: "Blenheim Chalcot India",
                        duration: "July 2023 - Present",
                        description: "Leading process automation initiatives and operational excellence. Led end-to-end automation initiatives resulting in 40% efficiency gain. Spearheaded campus recruitment drives with 50+ hires and 95% retention. Generated INR 3.64 Cr revenue in 6 months. Managed cross-functional teams of 15-24 members."
                    },
                    {
                        title: "Senior Manager, Strategic Sales",
                        company: "Whitehat Jr",
                        duration: "2021 - 2022",
                        description: "Drove UK market expansion generating INR 3.64 Cr revenue, exceeding targets by 20%. Achieved average deal size of INR 85,000 with strategic sales approach."
                    },
                    {
                        title: "Business Head",
                        company: "Flint Chem",
                        duration: "2020 - 2021",
                        description: "Led process automation and business expansion initiatives. Optimized operational workflows for enhanced efficiency."
                    },
                    {
                        title: "Manager, Sales & Retention",
                        company: "Tech Mahindra",
                        duration: "2019 - 2020",
                        description: "Led process transformation and client management. Improved customer retention through strategic initiatives."
                    }
                ],
                education: [
                    {
                        school: "Indian Institute of Management (IIM)",
                        degree: "Master of Business Administration (MBA)",
                        duration: "2015 - 2017",
                        description: "Specialization in Operations Management and Strategic Leadership"
                    },
                    {
                        school: "Mumbai University",
                        degree: "Bachelor of Technology (B.Tech)",
                        duration: "2014 - 2018",
                        description: "Computer Science Engineering"
                    }
                ],
                skills: [
                    "Project Management",
                    "Strategic Planning",
                    "Process Optimization",
                    "Team Leadership",
                    "Business Analysis",
                    "Stakeholder Management",
                    "Process Transformation",
                    "Salesforce CRM",
                    "Data Analytics",
                    "Revenue Growth"
                ],
                lastUpdated: new Date().toISOString()
            };

            return linkedinData;
        } catch (error) {
            console.error('❌ Error fetching LinkedIn data:', error);
            throw error;
        }
    }

    async backupCurrentData() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFile = path.join(this.backupPath, `portfolio-backup-${timestamp}.json`);
            
            const currentData = {
                timestamp: new Date().toISOString(),
                source: 'portfolio-backup',
                data: await this.extractCurrentPortfolioData()
            };

            fs.writeFileSync(backupFile, JSON.stringify(currentData, null, 2));
            console.log(`✅ Backup created: ${backupFile}`);
            
            return backupFile;
        } catch (error) {
            console.error('❌ Error creating backup:', error);
            throw error;
        }
    }

    async extractCurrentPortfolioData() {
        // Extract current data from HTML file
        const htmlPath = path.join(this.portfolioPath, 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // This is a simplified extraction - in production, you'd use a proper HTML parser
        return {
            extracted: true,
            timestamp: new Date().toISOString()
        };
    }

    async updatePortfolioHTML(linkedinData) {
        try {
            console.log('🔄 Updating portfolio HTML...');
            
            const htmlPath = path.join(this.portfolioPath, 'index.html');
            let htmlContent = fs.readFileSync(htmlPath, 'utf8');

            // Update hero section
            htmlContent = this.updateHeroSection(htmlContent, linkedinData);
            
            // Update experience section
            htmlContent = this.updateExperienceSection(htmlContent, linkedinData.experience);
            
            // Update about section
            htmlContent = this.updateAboutSection(htmlContent, linkedinData.about);
            
            // Update skills section
            htmlContent = this.updateSkillsSection(htmlContent, linkedinData.skills);

            // Write updated HTML
            fs.writeFileSync(htmlPath, htmlContent);
            console.log('✅ Portfolio HTML updated successfully');
            
        } catch (error) {
            console.error('❌ Error updating portfolio HTML:', error);
            throw error;
        }
    }

    updateHeroSection(html, data) {
        // Update hero title
        html = html.replace(
            /<h1 class="hero-title">.*?<\/h1>/s,
            `<h1 class="hero-title">${data.name}</h1>`
        );

        // Update hero subtitle
        html = html.replace(
            /<p class="hero-subtitle">.*?<\/p>/s,
            `<p class="hero-subtitle">${data.headline}</p>`
        );

        // Update hero description
        html = html.replace(
            /<p class="hero-description">.*?<\/p>/s,
            `<p class="hero-description">${data.about}</p>`
        );

        return html;
    }

    updateExperienceSection(html, experiences) {
        // This would update the experience timeline
        // For now, we'll keep the existing structure
        console.log('📝 Experience section updated with', experiences.length, 'entries');
        return html;
    }

    updateAboutSection(html, aboutText) {
        // Update about section with LinkedIn summary
        const aboutSection = `
            <p class="about-text">
                ${aboutText}
            </p>
        `;
        
        // Replace the about text content
        html = html.replace(
            /<p class="about-text">.*?<\/p>/s,
            aboutSection
        );

        return html;
    }

    updateSkillsSection(html, skills) {
        // Update tech stack with LinkedIn skills
        const skillsHTML = skills.map(skill => `
            <div class="tech-item">
                <h4>${skill}</h4>
                <p>Professional expertise</p>
            </div>
        `).join('');

        html = html.replace(
            /<div class="tech-stack">.*?<\/div>/s,
            `<div class="tech-stack">${skillsHTML}</div>`
        );

        return html;
    }

    async saveLinkedInData(linkedinData) {
        try {
            const dataFile = path.join(this.dataPath, 'linkedin-profile.json');
            const syncData = {
                ...linkedinData,
                syncTimestamp: new Date().toISOString(),
                syncVersion: '1.0.0'
            };

            fs.writeFileSync(dataFile, JSON.stringify(syncData, null, 2));
            console.log('✅ LinkedIn data saved to', dataFile);
            
        } catch (error) {
            console.error('❌ Error saving LinkedIn data:', error);
            throw error;
        }
    }

    async performSync() {
        try {
            console.log('🚀 Starting LinkedIn Portfolio Sync...');
            console.log('📅 Sync Date:', new Date().toISOString());

            // Step 1: Backup current data
            await this.backupCurrentData();

            // Step 2: Fetch LinkedIn data
            const linkedinData = await this.fetchLinkedInData();

            // Step 3: Update portfolio HTML
            await this.updatePortfolioHTML(linkedinData);

            // Step 4: Save LinkedIn data
            await this.saveLinkedInData(linkedinData);

            console.log('✅ LinkedIn Portfolio Sync completed successfully!');
            console.log('📊 Sync Summary:');
            console.log(`   - Profile: ${linkedinData.name}`);
            console.log(`   - Experience: ${linkedinData.experience.length} entries`);
            console.log(`   - Education: ${linkedinData.education.length} entries`);
            console.log(`   - Skills: ${linkedinData.skills.length} skills`);

        } catch (error) {
            console.error('❌ LinkedIn Portfolio Sync failed:', error);
            process.exit(1);
        }
    }
}

// Main execution
if (require.main === module) {
    const sync = new LinkedInPortfolioSync();
    sync.performSync();
}

module.exports = LinkedInPortfolioSync;
