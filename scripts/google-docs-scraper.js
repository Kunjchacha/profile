#!/usr/bin/env node

/**
 * Google Docs Real-Time Scraper
 * Actually reads content from the Google Doc and parses it
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const GOOGLE_DOC_ID = '1aksVkF5j53pBotJ4zddwKQHRnBOt8WdW';

class GoogleDocsScraper {
    constructor() {
        this.docUrl = `https://docs.google.com/document/d/${GOOGLE_DOC_ID}/edit`;
    }

    async scrapeDocument() {
        console.log('🔄 Starting Google Docs scraping...');
        console.log(`📄 Document URL: ${this.docUrl}`);

        const browser = await chromium.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });

            const page = await context.newPage();
            
            // Set viewport
            await page.setViewportSize({ width: 1280, height: 720 });

            console.log('🌐 Navigating to Google Doc...');
            await page.goto(this.docUrl, { 
                waitUntil: 'networkidle',
                timeout: 30000 
            });

            // Wait for document to load
            await page.waitForTimeout(5000);

            console.log('📖 Extracting document content...');
            
            // Try to get the document content
            const content = await page.evaluate(() => {
                // Look for document content in various possible containers
                const selectors = [
                    '.kix-appview-editor',
                    '.docs-texteventtarget-iframe',
                    '[role="textbox"]',
                    '.kix-lineview-text-block',
                    '.kix-page'
                ];

                let textContent = '';
                
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        textContent = Array.from(elements)
                            .map(el => el.textContent || el.innerText)
                            .join('\n')
                            .trim();
                        if (textContent) break;
                    }
                }

                // If no content found, try to get all text
                if (!textContent) {
                    textContent = document.body.textContent || document.body.innerText || '';
                }

                return textContent;
            });

            console.log('📝 Raw content extracted:', content.length, 'characters');
            console.log('📄 First 500 characters:', content.substring(0, 500));

            // Parse the content
            const parsedData = this.parseContent(content);

            return parsedData;

        } catch (error) {
            console.error('❌ Error scraping Google Doc:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    parseContent(content) {
        console.log('🔄 Parsing document content...');
        
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        console.log('📊 Total lines found:', lines.length);
        console.log('📝 First 10 lines:', lines.slice(0, 10));

        // Initialize parsed data
        const parsedData = {
            name: "Kunj Chacha",
            headline: "",
            about: "",
            experience: [],
            education: [],
            skills: [],
            projects: [],
            lastUpdated: new Date().toISOString(),
            source: 'google_docs_scraped',
            rawContent: content.substring(0, 1000) // Store first 1000 chars for debugging
        };

        // Try to extract information from the content
        let currentSection = '';
        let currentExperience = null;
        let currentEducation = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lowerLine = line.toLowerCase();

            // Detect sections
            if (lowerLine.includes('experience') || lowerLine.includes('work experience')) {
                currentSection = 'experience';
                continue;
            } else if (lowerLine.includes('education') || lowerLine.includes('academic')) {
                currentSection = 'education';
                continue;
            } else if (lowerLine.includes('skills') || lowerLine.includes('technical skills')) {
                currentSection = 'skills';
                continue;
            } else if (lowerLine.includes('projects') || lowerLine.includes('key projects')) {
                currentSection = 'projects';
                continue;
            } else if (lowerLine.includes('about') || lowerLine.includes('summary') || lowerLine.includes('profile')) {
                currentSection = 'about';
                continue;
            }

            // Parse based on current section
            if (currentSection === 'experience' && line.length > 10) {
                // Look for job titles (usually shorter lines)
                if (line.length < 100 && !line.includes('•') && !line.includes('-')) {
                    if (currentExperience) {
                        parsedData.experience.push(currentExperience);
                    }
                    currentExperience = {
                        title: line,
                        company: '',
                        duration: '',
                        description: ''
                    };
                } else if (currentExperience) {
                    // This might be company, duration, or description
                    if (!currentExperience.company && line.length < 50) {
                        currentExperience.company = line;
                    } else if (!currentExperience.duration && (line.includes('20') || line.includes('present'))) {
                        currentExperience.duration = line;
                    } else {
                        currentExperience.description += (currentExperience.description ? ' ' : '') + line;
                    }
                }
            } else if (currentSection === 'education' && line.length > 10) {
                if (line.length < 100 && !line.includes('•')) {
                    if (currentEducation) {
                        parsedData.education.push(currentEducation);
                    }
                    currentEducation = {
                        school: line,
                        degree: '',
                        duration: '',
                        description: ''
                    };
                } else if (currentEducation) {
                    if (!currentEducation.degree && line.length < 100) {
                        currentEducation.degree = line;
                    } else if (!currentEducation.duration && (line.includes('20') || line.includes('present'))) {
                        currentEducation.duration = line;
                    } else {
                        currentEducation.description += (currentEducation.description ? ' ' : '') + line;
                    }
                }
            } else if (currentSection === 'skills' && line.length > 2) {
                // Extract skills (usually comma-separated or bullet points)
                const skills = line.split(/[,•\-\n]/)
                    .map(skill => skill.trim())
                    .filter(skill => skill.length > 2 && skill.length < 50);
                
                parsedData.skills.push(...skills);
            } else if (currentSection === 'about' && line.length > 20) {
                parsedData.about += (parsedData.about ? ' ' : '') + line;
            }
        }

        // Add the last experience/education if exists
        if (currentExperience) {
            parsedData.experience.push(currentExperience);
        }
        if (currentEducation) {
            parsedData.education.push(currentEducation);
        }

        // Clean up skills (remove duplicates and empty strings)
        parsedData.skills = [...new Set(parsedData.skills)].filter(skill => skill);

        console.log('📊 Parsed data summary:');
        console.log(`   - Experience entries: ${parsedData.experience.length}`);
        console.log(`   - Education entries: ${parsedData.education.length}`);
        console.log(`   - Skills: ${parsedData.skills.length}`);
        console.log(`   - About length: ${parsedData.about.length} characters`);

        return parsedData;
    }

    async saveScrapedData(data) {
        const dataPath = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, { recursive: true });
        }

        const filePath = path.join(dataPath, 'google-docs-scraped.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('✅ Scraped data saved to:', filePath);
    }
}

// Main execution
if (require.main === module) {
    const scraper = new GoogleDocsScraper();
    
    scraper.scrapeDocument()
        .then(data => {
            console.log('✅ Google Docs scraping completed!');
            return scraper.saveScrapedData(data);
        })
        .then(() => {
            console.log('🎉 All done! Check data/google-docs-scraped.json for results');
        })
        .catch(error => {
            console.error('❌ Scraping failed:', error);
            process.exit(1);
        });
}

module.exports = GoogleDocsScraper;
