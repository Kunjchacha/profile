const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

/**
 * LinkedIn MCP Integration Script
 * Uses LinkedIn MCP to extract profile data and update portfolio
 */
class LinkedInMCPSync {
    constructor() {
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
        console.log('🔗 Extracting LinkedIn profile data via MCP...');
        
        try {
            // Call the actual LinkedIn MCP
            return new Promise((resolve, reject) => {
                const mcpProcess = spawn('node', ['scripts/simple-linkedin-mcp.js']);
                
                let output = '';
                mcpProcess.stdout.on('data', (data) => {
                    output += data.toString();
                });
                
                mcpProcess.stderr.on('data', (data) => {
                    console.error('MCP Error:', data.toString());
                });
                
                mcpProcess.on('close', (code) => {
                    if (code === 0) {
                        try {
                            const response = JSON.parse(output.trim());
                            if (response.result && response.result.content) {
                                const profileData = JSON.parse(response.result.content[0].text);
                                this.profileData = profileData.profile;
                                this.profileData.lastUpdated = new Date().toISOString();
                                console.log('✅ LinkedIn MCP data extracted successfully');
                                resolve(this.profileData);
                            } else {
                                throw new Error('Invalid MCP response format');
                            }
                        } catch (parseError) {
                            console.error('❌ Error parsing MCP response:', parseError);
                            reject(parseError);
                        }
                    } else {
                        reject(new Error(`MCP process exited with code ${code}`));
                    }
                });
                
                // Send the get-linkedin-profile request
                const request = {
                    jsonrpc: "2.0",
                    id: 1,
                    method: "tools/call",
                    params: {
                        name: "get-linkedin-profile",
                        arguments: {}
                    }
                };
                
                mcpProcess.stdin.write(JSON.stringify(request) + '\n');
                mcpProcess.stdin.end();
            });
            
        } catch (error) {
            console.error('❌ Error extracting LinkedIn data:', error);
            throw error;
        }
    }

    async updatePortfolio() {
        console.log('📝 Updating portfolio with LinkedIn data...');
        
        try {
            const profileData = await this.extractProfileData();
            
            // Read current portfolio HTML
            const portfolioPath = path.join(__dirname, '../index.html');
            let portfolioContent = fs.readFileSync(portfolioPath, 'utf8');
            
            // Update name and headline
            portfolioContent = this.updateNameAndHeadline(portfolioContent, profileData);
            
            // Update about section
            portfolioContent = this.updateAboutSection(portfolioContent, profileData);
            
            // Update experience section
            portfolioContent = this.updateExperienceSection(portfolioContent, profileData);
            
            // Update education section
            portfolioContent = this.updateEducationSection(portfolioContent, profileData);
            
            // Update skills section
            portfolioContent = this.updateSkillsSection(portfolioContent, profileData);
            
            // Save updated portfolio
            fs.writeFileSync(portfolioPath, portfolioContent, 'utf8');
            
            // Save profile data for reference
            const dataPath = path.join(__dirname, '../data');
            if (!fs.existsSync(dataPath)) {
                fs.mkdirSync(dataPath, { recursive: true });
            }
            
            fs.writeFileSync(
                path.join(dataPath, 'linkedin-profile.json'),
                JSON.stringify(profileData, null, 2),
                'utf8'
            );
            
            console.log('✅ Portfolio updated successfully with LinkedIn data');
            return true;
            
        } catch (error) {
            console.error('❌ Error updating portfolio:', error);
            throw error;
        }
    }

    updateNameAndHeadline(content, data) {
        // Update title tag
        content = content.replace(
            /<title>.*?<\/title>/,
            `<title>${data.name.toUpperCase()} - ${data.headline}</title>`
        );
        
        // Update hero section name
        content = content.replace(
            /<h1 class="hero-name">.*?<\/h1>/,
            `<h1 class="hero-name">${data.name}</h1>`
        );
        
        // Update hero subtitle
        content = content.replace(
            /<p class="hero-subtitle">.*?<\/p>/,
            `<p class="hero-subtitle">${data.headline}</p>`
        );
        
        // Update location
        content = content.replace(
            /<p class="hero-location">.*?<\/p>/,
            `<p class="hero-location">${data.location}</p>`
        );
        
        return content;
    }

    updateAboutSection(content, data) {
        if (data.about) {
            content = content.replace(
                /<div class="about-content">[\s\S]*?<\/div>/,
                `<div class="about-content">${data.about}</div>`
            );
        }
        return content;
    }

    updateExperienceSection(content, data) {
        if (data.experience && data.experience.length > 0) {
            let experienceHTML = '';
            data.experience.forEach((exp, index) => {
                experienceHTML += `
                    <div class="experience-item">
                        <div class="experience-header">
                            <h3>${exp.title}</h3>
                            <span class="experience-company">${exp.company}</span>
                            <span class="experience-duration">${exp.duration}</span>
                        </div>
                        <div class="experience-description">
                            <p>${exp.description || 'Leading strategic initiatives and driving operational excellence.'}</p>
                        </div>
                    </div>
                `;
            });
            
            content = content.replace(
                /<div class="experience-list">[\s\S]*?<\/div>/,
                `<div class="experience-list">${experienceHTML}</div>`
            );
        }
        return content;
    }

    updateEducationSection(content, data) {
        if (data.education && data.education.length > 0) {
            let educationHTML = '';
            data.education.forEach((edu, index) => {
                educationHTML += `
                    <div class="education-item">
                        <div class="education-header">
                            <h3>${edu.degree}</h3>
                            <span class="education-school">${edu.school}</span>
                            <span class="education-duration">${edu.duration}</span>
                        </div>
                    </div>
                `;
            });
            
            content = content.replace(
                /<div class="education-list">[\s\S]*?<\/div>/,
                `<div class="education-list">${educationHTML}</div>`
            );
        }
        return content;
    }

    updateSkillsSection(content, data) {
        if (data.skills && data.skills.length > 0) {
            let skillsHTML = '';
            data.skills.forEach((skill, index) => {
                skillsHTML += `
                    <div class="skill-item">
                        <span class="skill-name">${skill}</span>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: ${85 + (index * 2)}%"></div>
                        </div>
                    </div>
                `;
            });
            
            content = content.replace(
                /<div class="skills-list">[\s\S]*?<\/div>/,
                `<div class="skills-list">${skillsHTML}</div>`
            );
        }
        return content;
    }

    async run() {
        console.log('🚀 Starting LinkedIn MCP Sync...');
        console.log('================================');
        
        try {
            await this.updatePortfolio();
            console.log('✅ LinkedIn MCP Sync completed successfully');
            return true;
        } catch (error) {
            console.error('❌ LinkedIn MCP Sync failed:', error);
            return false;
        }
    }
}

// Export for use in scheduler
module.exports = LinkedInMCPSync;

// Run directly if called from command line
if (require.main === module) {
    const sync = new LinkedInMCPSync();
    sync.run().then(success => {
        process.exit(success ? 0 : 1);
    });
}