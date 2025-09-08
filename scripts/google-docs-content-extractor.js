#!/usr/bin/env node

/**
 * Google Docs Content Extractor
 * Extracts actual resume content from the scraped data
 */

const fs = require('fs');
const path = require('path');

class GoogleDocsContentExtractor {
    constructor() {
        this.dataPath = path.join(__dirname, '..', 'data');
    }

    extractRealContent() {
        console.log('🔄 Extracting real content from scraped data...');
        
        // Read the scraped data
        const scrapedFile = path.join(this.dataPath, 'google-docs-multiple-formats.json');
        if (!fs.existsSync(scrapedFile)) {
            console.log('❌ No scraped data found. Run the scraper first.');
            return null;
        }

        const scrapedData = JSON.parse(fs.readFileSync(scrapedFile, 'utf8'));
        const rawContent = scrapedData.rawContent;

        console.log('📄 Raw content length:', rawContent.length);
        console.log('🔍 Looking for resume content...');

        // Extract the actual resume content from the HTML/JS mess
        const resumeContent = this.parseResumeContent(rawContent);
        
        if (resumeContent) {
            console.log('✅ Found resume content!');
            console.log('📊 Content summary:');
            console.log(`   - Name: ${resumeContent.name}`);
            console.log(`   - Experience entries: ${resumeContent.experience.length}`);
            console.log(`   - Education entries: ${resumeContent.education.length}`);
            console.log(`   - Skills: ${resumeContent.skills.length}`);
            
            return resumeContent;
        } else {
            console.log('❌ Could not extract resume content from scraped data.');
            return null;
        }
    }

    parseResumeContent(rawContent) {
        // Look for the actual resume content in the HTML/JS mess
        const resumeText = this.extractResumeText(rawContent);
        
        if (!resumeText || resumeText.length < 100) {
            console.log('⚠️  Insufficient resume text found.');
            return null;
        }

        console.log('📝 Extracted resume text length:', resumeText.length);
        console.log('📄 First 500 characters:', resumeText.substring(0, 500));

        // Parse the resume text
        return this.parseResumeText(resumeText);
    }

    extractResumeText(content) {
        // Look for patterns that indicate resume content
        const patterns = [
            /KUNJ CHACHA[\s\S]*?(?=Changes by|$)/i,
            /PROFILE[\s\S]*?(?=Changes by|$)/i,
            /EMPLOYMENT HISTORY[\s\S]*?(?=Changes by|$)/i,
            /EDUCATION[\s\S]*?(?=Changes by|$)/i,
            /CORE SKILLS[\s\S]*?(?=Changes by|$)/i
        ];

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match && match[0].length > 200) {
                console.log('🎯 Found resume content with pattern:', pattern.source);
                return match[0];
            }
        }

        // If no pattern matches, try to extract text between known markers
        const markers = [
            'KUNJ CHACHA',
            'PROFILE',
            'EMPLOYMENT HISTORY',
            'EDUCATION',
            'CORE SKILLS',
            'CERTIFICATIONS',
            'AWARDS',
            'REFERENCES'
        ];

        let resumeText = '';
        let foundStart = false;

        for (const marker of markers) {
            const index = content.indexOf(marker);
            if (index !== -1) {
                if (!foundStart) {
                    foundStart = true;
                    resumeText = content.substring(index);
                } else {
                    // Found another marker, add content up to this point
                    const nextIndex = content.indexOf(marker, index + 1);
                    if (nextIndex !== -1) {
                        resumeText += content.substring(index, nextIndex);
                    } else {
                        resumeText += content.substring(index);
                    }
                }
            }
        }

        if (resumeText.length > 200) {
            console.log('🎯 Extracted resume text using markers');
            return resumeText;
        }

        return null;
    }

    parseResumeText(text) {
        console.log('🔄 Parsing resume text...');
        
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        
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
            source: 'google_docs_extracted',
            rawContent: text.substring(0, 2000),
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
            if (lowerLine.includes('profile') || lowerLine.includes('summary') || lowerLine.includes('objective')) {
                currentSection = 'about';
                console.log('📍 Found profile section at line', i);
                continue;
            } else if (lowerLine.includes('employment') || lowerLine.includes('work experience') || lowerLine.includes('experience')) {
                currentSection = 'experience';
                console.log('📍 Found experience section at line', i);
                continue;
            } else if (lowerLine.includes('education') || lowerLine.includes('academic') || lowerLine.includes('qualification')) {
                currentSection = 'education';
                console.log('📍 Found education section at line', i);
                continue;
            } else if (lowerLine.includes('skills') || lowerLine.includes('core skills') || lowerLine.includes('competencies')) {
                currentSection = 'skills';
                console.log('📍 Found skills section at line', i);
                continue;
            } else if (lowerLine.includes('projects') || lowerLine.includes('key projects') || lowerLine.includes('achievements')) {
                currentSection = 'projects';
                console.log('📍 Found projects section at line', i);
                continue;
            }

            // Parse based on current section
            if (currentSection === 'about' && line.length > 20) {
                parsedData.about += (parsedData.about ? ' ' : '') + line;
            } else if (currentSection === 'experience' && line.length > 10) {
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

    async saveExtractedData(data) {
        const filePath = path.join(this.dataPath, 'google-docs-extracted.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('✅ Extracted data saved to:', filePath);
    }
}

// Main execution
if (require.main === module) {
    const extractor = new GoogleDocsContentExtractor();
    
    const extractedData = extractor.extractRealContent();
    
    if (extractedData) {
        extractor.saveExtractedData(extractedData)
            .then(() => {
                console.log('🎉 Content extraction completed!');
                console.log('📄 Check data/google-docs-extracted.json for the real resume data');
            });
    } else {
        console.log('❌ Could not extract resume content.');
        process.exit(1);
    }
}

module.exports = GoogleDocsContentExtractor;
