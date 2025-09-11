#!/usr/bin/env node

/**
 * Google Docs Multiple Format Scraper
 * Tries different URL formats to access the document
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const GOOGLE_DOC_ID = 'e/2PACX-1vTOxyH3PzDT-lGe2huhuw82fDTf5dflOzycAH0ERw-d3DGuE542MVUf8pw3P8uJkA';

class GoogleDocsMultipleFormats {
    constructor() {
        this.docId = GOOGLE_DOC_ID;
        this.urls = [
            // Original sharing URL
            `https://docs.google.com/document/d/${this.docId}/edit?usp=sharing&ouid=110093156976609512851&rtpof=true&sd=true`,
            // Standard edit URL
            `https://docs.google.com/document/d/${this.docId}/edit`,
            // View URL
            `https://docs.google.com/document/d/${this.docId}/view`,
            // Export as text
            `https://docs.google.com/document/d/${this.docId}/export?format=txt`,
            // Export as HTML
            `https://docs.google.com/document/d/${this.docId}/export?format=html`,
            // Public view
            `https://docs.google.com/document/d/${this.docId}/pub`,
            // Mobile view
            `https://docs.google.com/document/d/${this.docId}/mobilebasic`
        ];
    }

    async tryAllFormats() {
        console.log('🔄 Trying multiple Google Docs URL formats...');
        console.log(`📄 Document ID: ${this.docId}`);

        const browser = await chromium.launch({ 
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });

            const page = await context.newPage();
            await page.setViewportSize({ width: 1280, height: 720 });

            const results = [];

            for (let i = 0; i < this.urls.length; i++) {
                const url = this.urls[i];
                console.log(`\n🌐 Trying URL ${i + 1}/${this.urls.length}: ${url}`);

                try {
                    await page.goto(url, { 
                        waitUntil: 'domcontentloaded',
                        timeout: 30000 
                    });

                    await page.waitForTimeout(5000);

                    const result = await page.evaluate(() => {
                        const content = document.body.textContent || document.body.innerText || '';
                        return {
                            url: window.location.href,
                            title: document.title,
                            contentLength: content.length,
                            first500Chars: content.substring(0, 500),
                            hasContent: content.length > 100,
                            content: content
                        };
                    });

                    results.push({
                        urlIndex: i + 1,
                        url: url,
                        success: true,
                        ...result
                    });

                    console.log(`✅ URL ${i + 1} - Content length: ${result.contentLength}`);
                    console.log(`📄 Title: ${result.title}`);
                    console.log(`📝 First 200 chars: ${result.first500Chars.substring(0, 200)}`);

                    if (result.hasContent && !result.first500Chars.includes('Gemini')) {
                        console.log('🎉 Found good content!');
                        break;
                    }

                } catch (error) {
                    console.log(`❌ URL ${i + 1} failed: ${error.message}`);
                    results.push({
                        urlIndex: i + 1,
                        url: url,
                        success: false,
                        error: error.message
                    });
                }
            }

            // Find the best result
            const bestResult = results.find(r => r.success && r.hasContent && !r.first500Chars.includes('Gemini'));
            
            if (bestResult) {
                console.log('\n🎉 Found working URL!');
                console.log(`📄 URL: ${bestResult.url}`);
                console.log(`📝 Content length: ${bestResult.contentLength}`);
                
                // Parse the content
                const parsedData = this.parseContent(bestResult.content);
                parsedData.sourceUrl = bestResult.url;
                parsedData.urlIndex = bestResult.urlIndex;
                
                return parsedData;
            } else {
                console.log('\n⚠️  No working URL found. All URLs either failed or returned insufficient content.');
                console.log('📊 Results summary:');
                results.forEach(r => {
                    console.log(`   URL ${r.urlIndex}: ${r.success ? '✅' : '❌'} - ${r.success ? r.contentLength + ' chars' : r.error}`);
                });
                
                return this.getFallbackData();
            }

        } catch (error) {
            console.error('❌ Error in multiple format scraper:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    parseContent(content) {
        console.log('🔄 Parsing document content...');
        
        if (!content || content.length < 50) {
            console.log('⚠️  Insufficient content to parse.');
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
            source: 'google_docs_multiple_formats',
            rawContent: content.substring(0, 2000),
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

    async saveResults(data) {
        const dataPath = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, { recursive: true });
        }

        const filePath = path.join(dataPath, 'google-docs-multiple-formats.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('✅ Multiple formats results saved to:', filePath);
    }
}

// Main execution
if (require.main === module) {
    const scraper = new GoogleDocsMultipleFormats();
    
    scraper.tryAllFormats()
        .then(data => {
            console.log('✅ Google Docs multiple formats scraping completed!');
            return scraper.saveResults(data);
        })
        .then(() => {
            console.log('🎉 All done! Check data/google-docs-multiple-formats.json for results');
        })
        .catch(error => {
            console.error('❌ Multiple formats scraping failed:', error);
            process.exit(1);
        });
}

module.exports = GoogleDocsMultipleFormats;
