const playwright = require('playwright');

class ResumeSpecificFetcher {
    constructor() {
        this.resumeUrl = 'https://docs.google.com/document/d/e/2PACX-1vTOxyH3PzDT-lGe2huhuw82fDTf5dflOzycAH0ERw-d3DGuE542MVUf8pw3P8uJkA/pub';
    }

    async fetchResumeData() {
        console.log('🚀 Starting specific resume data fetch...');
        
        try {
            const browser = await playwright.chromium.launch({ 
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            await page.goto(this.resumeUrl, { waitUntil: 'networkidle' });
            
            // Wait for content to load
            await page.waitForTimeout(5000);
            
            // Try to get the main document content
            const content = await page.evaluate(() => {
                // Look for the main document content
                const docContent = document.querySelector('.doc-content') || 
                                 document.querySelector('.doc') ||
                                 document.querySelector('[role="main"]') ||
                                 document.querySelector('main') ||
                                 document.body;
                
                return docContent ? docContent.innerText : document.body.innerText;
            });
            
            await browser.close();
            
            // Parse specific sections
            const parsedData = this.parseSpecificSections(content);
            
            // Save the parsed data
            const fs = require('fs');
            const path = require('path');
            
            const dataDir = path.join(__dirname, '..', 'data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            
            fs.writeFileSync(
                path.join(dataDir, 'resume-specific-data.json'),
                JSON.stringify(parsedData, null, 2)
            );
            
            console.log('✅ Resume data fetched and saved successfully!');
            console.log('📊 Parsed data:', JSON.stringify(parsedData, null, 2));
            
            return parsedData;
            
        } catch (error) {
            console.error('❌ Error fetching resume data:', error);
            return null;
        }
    }

    parseSpecificSections(content) {
        console.log('🔍 Parsing specific sections from resume...');
        
        const data = {
            personalInfo: this.extractPersonalInfo(content),
            currentRole: this.extractCurrentRole(content),
            keyAchievements: this.extractKeyAchievements(content),
            coreSkills: this.extractCoreSkills(content),
            education: this.extractEducation(content),
            awards: this.extractAwards(content),
            references: this.extractReferences(content),
            projects: this.extractProjects(content)
        };
        
        return data;
    }

    extractPersonalInfo(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        return {
            name: this.findValueAfter('KUNJ CHACHA', lines),
            title: this.findValueAfter('Program Manager', lines),
            phone: this.findValueAfter('+917304042382', lines) || '+917304042382',
            email: this.findValueAfter('kunjnikhilchacha@gmail.com', lines) || 'kunjnikhilchacha@gmail.com',
            linkedin: this.findValueAfter('LinkedIn', lines) || 'https://linkedin.com/in/kunjchacha'
        };
    }

    extractCurrentRole(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        // Find current role section
        const currentRoleIndex = lines.findIndex(line => 
            line.includes('Program Manager') && line.includes('Blenheim Chalcot')
        );
        
        if (currentRoleIndex !== -1) {
            const roleSection = lines.slice(currentRoleIndex, currentRoleIndex + 10);
            return {
                position: 'Program Manager',
                company: 'Blenheim Chalcot India',
                period: 'July 2023 – Present',
                description: roleSection.join(' ').substring(0, 200) + '...'
            };
        }
        
        return null;
    }

    extractKeyAchievements(content) {
        const achievements = [];
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        // Look for specific achievement patterns
        const achievementPatterns = [
            /INR [\d.]+ Cr/gi,
            /40% reduction/gi,
            /200\+ hours saved/gi,
            /50\+ professionals hired/gi,
            /95% retention/gi,
            /25% productivity/gi,
            /110% of quarterly targets/gi
        ];
        
        lines.forEach(line => {
            achievementPatterns.forEach(pattern => {
                const matches = line.match(pattern);
                if (matches) {
                    achievements.push(line);
                }
            });
        });
        
        return [...new Set(achievements)]; // Remove duplicates
    }

    extractCoreSkills(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        // Find CORE SKILLS section
        const skillsIndex = lines.findIndex(line => 
            line.includes('CORE SKILLS') || line.includes('Core Skills')
        );
        
        if (skillsIndex !== -1) {
            const skillsSection = lines.slice(skillsIndex + 1, skillsIndex + 20);
            const skills = [];
            
            skillsSection.forEach(line => {
                if (line && !line.includes('CERTIFICATIONS') && !line.includes('AWARDS')) {
                    // Split by common delimiters
                    const skillItems = line.split(/[,•·]/).map(s => s.trim()).filter(s => s);
                    skills.push(...skillItems);
                }
            });
            
            return skills.filter(skill => skill.length > 2);
        }
        
        return [];
    }

    extractEducation(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        // Find EDUCATION section
        const educationIndex = lines.findIndex(line => 
            line.includes('EDUCATION') || line.includes('Education')
        );
        
        if (educationIndex !== -1) {
            const educationSection = lines.slice(educationIndex + 1, educationIndex + 15);
            const education = [];
            
            educationSection.forEach(line => {
                if (line && !line.includes('CORE SKILLS') && !line.includes('CERTIFICATIONS')) {
                    education.push(line);
                }
            });
            
            return education;
        }
        
        return [];
    }

    extractAwards(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        // Find AWARDS section
        const awardsIndex = lines.findIndex(line => 
            line.includes('AWARDS') || line.includes('Awards')
        );
        
        if (awardsIndex !== -1) {
            const awardsSection = lines.slice(awardsIndex + 1, awardsIndex + 10);
            const awards = [];
            
            awardsSection.forEach(line => {
                if (line && !line.includes('REFERENCES') && !line.includes('References')) {
                    awards.push(line);
                }
            });
            
            return awards;
        }
        
        return [];
    }

    extractReferences(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        // Find REFERENCES section
        const referencesIndex = lines.findIndex(line => 
            line.includes('REFERENCES') || line.includes('References')
        );
        
        if (referencesIndex !== -1) {
            const referencesSection = lines.slice(referencesIndex + 1);
            const references = [];
            
            referencesSection.forEach(line => {
                if (line && line.includes('@')) {
                    references.push(line);
                }
            });
            
            return references;
        }
        
        return [];
    }

    extractProjects(content) {
        // Extract project information from employment history
        const projects = [];
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        // Look for project-related content
        const projectKeywords = [
            'automation', 'recruitment', 'expansion', 'implementation', 
            'development', 'optimization', 'transformation'
        ];
        
        lines.forEach(line => {
            if (projectKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
                if (line.length > 20 && line.length < 200) {
                    projects.push(line);
                }
            }
        });
        
        return [...new Set(projects)]; // Remove duplicates
    }

    findValueAfter(searchTerm, lines) {
        const index = lines.findIndex(line => line.includes(searchTerm));
        if (index !== -1 && index + 1 < lines.length) {
            return lines[index + 1];
        }
        return null;
    }
}

// Run the fetcher
async function main() {
    const fetcher = new ResumeSpecificFetcher();
    await fetcher.fetchResumeData();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = ResumeSpecificFetcher;
