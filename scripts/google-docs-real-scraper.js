#!/usr/bin/env node

/**
 * Google Docs Real-Time Scraper
 * Uses the actual Google Doc link provided by the user
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Your actual Google Doc link
const GOOGLE_DOC_URL = 'https://docs.google.com/document/d/e/2PACX-1vTOxyH3PzDT-lGe2huhuw82fDTf5dflOzycAH0ERw-d3DGuE542MVUf8pw3P8uJkA/pub';

class GoogleDocsRealScraper {
    constructor() {
        this.docUrl = GOOGLE_DOC_URL;
    }

    async scrapeDocument() {
        console.log('🔄 Starting Google Docs scraping...');
        console.log(`📄 Document URL: ${this.docUrl}`);

        const browser = await chromium.launch({ 
            headless: false, // Set to false to see what's happening
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
            
            // Try the sharing URL first
            await page.goto(this.docUrl, { 
                waitUntil: 'domcontentloaded',
                timeout: 60000 
            });

            // Wait for document to load
            await page.waitForTimeout(10000);

            console.log('📖 Extracting document content...');
            
            // Take a screenshot to see what we're getting
            await page.screenshot({ path: 'google-doc-screenshot.png' });
            console.log('📸 Screenshot saved as google-doc-screenshot.png');

            // Try multiple approaches to get content
            const content = await page.evaluate(() => {
                console.log('🔍 Looking for document content...');
                
                // Try different selectors
                const selectors = [
                    '.kix-appview-editor',
                    '.docs-texteventtarget-iframe',
                    '[role="textbox"]',
                    '.kix-lineview-text-block',
                    '.kix-page',
                    '.docs-doc',
                    '.kix-document',
                    'body'
                ];

                let textContent = '';
                let foundSelector = '';
                
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    console.log(`🔍 Checking selector "${selector}": found ${elements.length} elements`);
                    
                    if (elements.length > 0) {
                        const content = Array.from(elements)
                            .map(el => el.textContent || el.innerText)
                            .join('\n')
                            .trim();
                        
                        if (content && content.length > 50) {
                            textContent = content;
                            foundSelector = selector;
                            console.log(`✅ Found content with selector "${selector}": ${content.length} characters`);
                            break;
                        }
                    }
                }

                // If still no content, try to get all text
                if (!textContent) {
                    textContent = document.body.textContent || document.body.innerText || '';
                    foundSelector = 'body';
                    console.log(`📄 Using body content: ${textContent.length} characters`);
                }

                return {
                    content: textContent,
                    selector: foundSelector,
                    title: document.title,
                    url: window.location.href
                };
            });

            console.log('📝 Content extraction results:');
            console.log(`   - Selector used: ${content.selector}`);
            console.log(`   - Content length: ${content.content.length} characters`);
            console.log(`   - Page title: ${content.title}`);
            console.log(`   - Current URL: ${content.url}`);
            console.log('📄 First 1000 characters of content:');
            console.log(content.content.substring(0, 1000));

            if (content.content.length < 100) {
                console.log('⚠️  Very little content found. The document might require authentication.');
                console.log('🔍 Let me try a different approach...');
                
                // Try to get the page HTML
                const html = await page.content();
                console.log('📄 Page HTML length:', html.length);
                
                // Save HTML for debugging
                fs.writeFileSync('google-doc-html.html', html);
                console.log('💾 HTML saved as google-doc-html.html');
            }

            // Parse the content
            const parsedData = this.parseContent(content.content);

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
        
        if (!content || content.length < 50) {
            console.log('⚠️  Insufficient content to parse. Using fallback data structure.');
            return this.getFallbackData();
        }
        
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
            source: 'google_docs_real_scraped',
            rawContent: content.substring(0, 2000), // Store first 2000 chars for debugging
            totalLines: lines.length
        };

        // Try to extract information from the content
        let currentSection = '';
        let currentExperience = null;
        let currentEducation = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lowerLine = line.toLowerCase();

            // Detect sections
            if (lowerLine.includes('experience') || lowerLine.includes('work experience') || lowerLine.includes('employment')) {
                currentSection = 'experience';
                console.log('📍 Found experience section at line', i);
                continue;
            } else if (lowerLine.includes('education') || lowerLine.includes('academic') || lowerLine.includes('qualification')) {
                currentSection = 'education';
                console.log('📍 Found education section at line', i);
                continue;
            } else if (lowerLine.includes('skills') || lowerLine.includes('technical skills') || lowerLine.includes('competencies')) {
                currentSection = 'skills';
                console.log('📍 Found skills section at line', i);
                continue;
            } else if (lowerLine.includes('projects') || lowerLine.includes('key projects') || lowerLine.includes('achievements')) {
                currentSection = 'projects';
                console.log('📍 Found projects section at line', i);
                continue;
            } else if (lowerLine.includes('about') || lowerLine.includes('summary') || lowerLine.includes('profile') || lowerLine.includes('objective')) {
                currentSection = 'about';
                console.log('📍 Found about section at line', i);
                continue;
            }

            // Parse based on current section
            if (currentSection === 'experience' && line.length > 10) {
                // Look for job titles (usually shorter lines)
                if (line.length < 100 && !line.includes('•') && !line.includes('-') && !line.includes(':')) {
                    if (currentExperience) {
                        parsedData.experience.push(currentExperience);
                    }
                    currentExperience = {
                        title: line,
                        company: '',
                        duration: '',
                        description: ''
                    };
                    console.log('💼 Found experience entry:', line);
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
                    console.log('🎓 Found education entry:', line);
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
                if (skills.length > 0) {
                    console.log('🛠️  Found skills:', skills);
                }
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

    getFallbackData() {
        console.log('🔄 Using fallback data structure...');
        return {
            name: "Kunj Chacha",
            headline: "Program Manager at Blenheim Chalcot | Building Innovative Technology Businesses",
            about: "Results-driven business leader with 10+ years of experience in sales, operations, project management, and process automation across diverse industries.",
            experience: [
                {
                    title: "Program Manager",
                    company: "Blenheim Chalcot India",
                    duration: "July 2023 - Present",
                    description: "Leading process automation initiatives and operational excellence."
                }
            ],
            education: [
                {
                    school: "Indian Institute of Management Visakhapatnam",
                    degree: "Executive Program in New Product Development & Marketing Strategy",
                    duration: "Nov 2024 - Jun 2025",
                    description: "Certification - IIMV"
                }
            ],
            skills: ["Project Management", "Team Leadership", "Process Optimization"],
            projects: [],
            lastUpdated: new Date().toISOString(),
            source: 'google_docs_fallback',
            note: 'Document access may require authentication. Using fallback data structure.'
        };
    }

    async saveScrapedData(data) {
        const dataPath = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, { recursive: true });
        }

        const filePath = path.join(dataPath, 'google-docs-real-scraped.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('✅ Real scraped data saved to:', filePath);
    }
}

// Main execution
if (require.main === module) {
    const scraper = new GoogleDocsRealScraper();
    
    scraper.scrapeDocument()
        .then(data => {
            console.log('✅ Google Docs real scraping completed!');
            return scraper.saveScrapedData(data);
        })
        .then(() => {
            console.log('🎉 All done! Check data/google-docs-real-scraped.json for results');
        })
        .catch(error => {
            console.error('❌ Real scraping failed:', error);
            process.exit(1);
        });
}

module.exports = GoogleDocsRealScraper;
