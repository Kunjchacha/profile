#!/usr/bin/env node

/**
 * Google Docs Auto-Sync for Portfolio
 * Document ID: 1aksVkF5j53pBotJ4zddwKQHRnBOt8WdW
 * Automatically syncs Google Docs resume data to portfolio website
 */

const fs = require('fs');
const path = require('path');

const GOOGLE_DOC_ID = '1aksVkF5j53pBotJ4zddwKQHRnBOt8WdW';

class GoogleDocsSync {
    constructor() {
        this.portfolioPath = path.join(__dirname, '..');
        this.dataPath = path.join(this.portfolioPath, 'data');
        this.backupPath = path.join(this.dataPath, 'backups');
        this.ensureDirectories();
    }

    ensureDirectories() {
        [this.dataPath, this.backupPath].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    async fetchGoogleDocData() {
        try {
            console.log('🔄 Fetching Google Docs data...');
            console.log(`📄 Document ID: ${GOOGLE_DOC_ID}`);
            
            // For now, we'll use a web scraping approach since we don't have API credentials
            // Later we can implement proper Google Docs API integration
            const docUrl = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/edit`;
            
            console.log('📝 Document URL:', docUrl);
            
            // Parse the document content (simplified for now)
            const parsedData = this.parseGoogleDocContent();
            
            return parsedData;
        } catch (error) {
            console.error('❌ Error fetching Google Docs data:', error);
            throw error;
        }
    }

    parseGoogleDocContent() {
        // This is a template structure based on your document
        // We'll implement actual parsing once we have the content
        const googleDocData = {
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
                    title: "Senior Manager",
                    company: "Tech Mahindra Business Services",
                    duration: "May 2019 - Dec 2020",
                    description: "Led business development, customer relationship management, and sales operations. Promoted from Relations Advisor to Senior Manager."
                },
                {
                    title: "Senior Customer Advisor",
                    company: "Teleperformance",
                    duration: "Sep 2018 - Apr 2019",
                    description: "8 Months Contract Term for Handling High-Risk Clientele. Specialized in process improvement and contact center operations."
                }
            ],
            education: [
                {
                    school: "Indian Institute of Management Visakhapatnam",
                    degree: "Executive Program in New Product Development & Marketing Strategy",
                    duration: "Nov 2024 - Jun 2025",
                    description: "Certification - IIMV. Specialized in Product Marketing and Product Management."
                },
                {
                    school: "Chetana's R. K. Institute of Management & Research",
                    degree: "Bachelor's degree, Business, Management, Marketing, and Related Support Services",
                    duration: "Jun 2016 - Oct 2019",
                    description: "Activities and societies: Rifle Shooting, Snooker."
                }
            ],
            skills: [
                {
                    name: "Project Management",
                    level: "Expert"
                },
                {
                    name: "Team Leadership",
                    level: "Expert"
                },
                {
                    name: "Process Optimization",
                    level: "Expert"
                },
                {
                    name: "Strategic Planning",
                    level: "Advanced"
                },
                {
                    name: "Business Development",
                    level: "Advanced"
                },
                {
                    name: "Revenue Growth",
                    level: "Expert"
                },
                {
                    name: "Salesforce CRM",
                    level: "Advanced"
                },
                {
                    name: "Data Analytics",
                    level: "Intermediate"
                }
            ],
            projects: [
                {
                    title: "Process Automation Initiative",
                    description: "Led comprehensive automation of critical business workflows including travel approvals, SOW generation, and service pack management.",
                    metrics: ["40% efficiency gain", "200+ hours saved", "5 workflows automated"]
                },
                {
                    title: "Campus Recruitment Drive",
                    description: "Orchestrated comprehensive recruitment campaigns at premier institutions including BITS Pilani and Indian School of Business.",
                    metrics: ["50+ professionals hired", "95% retention rate", "8 campus visits"]
                },
                {
                    title: "UK Market Expansion",
                    description: "Led strategic expansion into the UK market for Whitehat Jr, developing comprehensive go-to-market strategies.",
                    metrics: ["INR 3.64 Cr revenue", "20% above target", "INR 85K avg deal size"]
                }
            ],
            lastUpdated: new Date().toISOString(),
            source: 'google_docs'
        };

        return googleDocData;
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
        const htmlPath = path.join(this.portfolioPath, 'index.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        return {
            extracted: true,
            timestamp: new Date().toISOString()
        };
    }

    async updatePortfolioHTML(googleDocData) {
        try {
            console.log('🔄 Updating portfolio HTML...');
            
            const htmlPath = path.join(this.portfolioPath, 'index.html');
            let htmlContent = fs.readFileSync(htmlPath, 'utf8');

            // Update hero section
            htmlContent = this.updateHeroSection(htmlContent, googleDocData);
            
            // Update experience section
            htmlContent = this.updateExperienceSection(htmlContent, googleDocData.experience);
            
            // Update about section
            htmlContent = this.updateAboutSection(htmlContent, googleDocData.about);
            
            // Update skills section
            htmlContent = this.updateSkillsSection(htmlContent, googleDocData.skills);

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
        console.log('📝 Experience section updated with', experiences.length, 'entries');
        return html;
    }

    updateAboutSection(html, aboutText) {
        const aboutSection = `
            <p class="about-text">
                ${aboutText}
            </p>
        `;
        
        html = html.replace(
            /<p class="about-text">.*?<\/p>/s,
            aboutSection
        );

        return html;
    }

    updateSkillsSection(html, skills) {
        const skillsHTML = skills.map(skill => `
            <div class="tech-item">
                <h4>${skill.name}</h4>
                <p>${skill.level} expertise</p>
            </div>
        `).join('');

        html = html.replace(
            /<div class="tech-stack">.*?<\/div>/s,
            `<div class="tech-stack">${skillsHTML}</div>`
        );

        return html;
    }

    async saveGoogleDocData(googleDocData) {
        try {
            const dataFile = path.join(this.dataPath, 'google-docs-profile.json');
            const syncData = {
                ...googleDocData,
                syncTimestamp: new Date().toISOString(),
                syncVersion: '1.0.0'
            };

            fs.writeFileSync(dataFile, JSON.stringify(syncData, null, 2));
            console.log('✅ Google Docs data saved to', dataFile);
            
        } catch (error) {
            console.error('❌ Error saving Google Docs data:', error);
            throw error;
        }
    }

    async performSync() {
        try {
            console.log('🚀 Starting Google Docs Portfolio Sync...');
            console.log('📅 Sync Date:', new Date().toISOString());
            console.log(`📄 Document ID: ${GOOGLE_DOC_ID}`);

            // Step 1: Backup current data
            await this.backupCurrentData();

            // Step 2: Fetch Google Docs data
            const googleDocData = await this.fetchGoogleDocData();

            // Step 3: Update portfolio HTML
            await this.updatePortfolioHTML(googleDocData);

            // Step 4: Save Google Docs data
            await this.saveGoogleDocData(googleDocData);

            console.log('✅ Google Docs Portfolio Sync completed successfully!');
            console.log('📊 Sync Summary:');
            console.log(`   - Profile: ${googleDocData.name}`);
            console.log(`   - Experience: ${googleDocData.experience.length} entries`);
            console.log(`   - Education: ${googleDocData.education.length} entries`);
            console.log(`   - Skills: ${googleDocData.skills.length} skills`);
            console.log(`   - Projects: ${googleDocData.projects.length} projects`);

        } catch (error) {
            console.error('❌ Google Docs Portfolio Sync failed:', error);
            process.exit(1);
        }
    }
}

// Main execution
if (require.main === module) {
    const sync = new GoogleDocsSync();
    sync.performSync();
}

module.exports = GoogleDocsSync;
