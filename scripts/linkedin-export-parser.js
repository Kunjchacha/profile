#!/usr/bin/env node

/**
 * LinkedIn Data Export Parser
 * Parses LinkedIn's official data export to extract complete profile information
 */

const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');

class LinkedInExportParser {
  constructor() {
    this.exportPath = path.join(__dirname, '../data/linkedin-export');
  }

  async parseLinkedInExport() {
    console.log('📥 Parsing LinkedIn Data Export...');
    
    try {
      // Check if export directory exists
      const exportExists = await this.checkExportExists();
      if (!exportExists) {
        console.log('❌ LinkedIn export not found. Please follow these steps:');
        await this.showExportInstructions();
        return null;
      }

      // Parse different export files
      const profileData = {
        name: '',
        headline: '',
        location: '',
        about: '',
        experience: [],
        education: [],
        skills: [],
        lastUpdated: new Date().toISOString(),
        source: 'linkedin_export'
      };

      // Parse Profile.csv
      await this.parseProfile(profileData);
      
      // Parse Positions.csv (Experience)
      await this.parsePositions(profileData);
      
      // Parse Education.csv
      await this.parseEducation(profileData);
      
      // Parse Skills.csv
      await this.parseSkills(profileData);

      console.log('✅ LinkedIn export parsed successfully!');
      return profileData;

    } catch (error) {
      console.error('❌ Error parsing LinkedIn export:', error);
      throw error;
    }
  }

  async checkExportExists() {
    try {
      await fs.access(this.exportPath);
      return true;
    } catch {
      return false;
    }
  }

  async showExportInstructions() {
    console.log('\n📋 LinkedIn Data Export Instructions:');
    console.log('=====================================');
    console.log('1. Go to LinkedIn.com');
    console.log('2. Click on "Me" → "Settings & Privacy"');
    console.log('3. Click on "Data Privacy" tab');
    console.log('4. Click on "Get a copy of your data"');
    console.log('5. Select "Request archive"');
    console.log('6. Choose "Complete profile data"');
    console.log('7. Download the ZIP file when ready');
    console.log('8. Extract the ZIP file to: data/linkedin-export/');
    console.log('9. Run this script again');
    console.log('\n📁 Expected files:');
    console.log('- Profile.csv');
    console.log('- Positions.csv');
    console.log('- Education.csv');
    console.log('- Skills.csv');
  }

  async parseProfile(profileData) {
    try {
      const profilePath = path.join(this.exportPath, 'Profile.csv');
      const data = await fs.readFile(profilePath, 'utf8');
      const lines = data.split('\n');
      
      for (const line of lines) {
        if (line.includes('First Name')) {
          const firstName = line.split(',')[1]?.replace(/"/g, '') || '';
          profileData.name = firstName;
        }
        if (line.includes('Last Name')) {
          const lastName = line.split(',')[1]?.replace(/"/g, '') || '';
          profileData.name = `${profileData.name} ${lastName}`.trim();
        }
        if (line.includes('Headline')) {
          profileData.headline = line.split(',')[1]?.replace(/"/g, '') || '';
        }
        if (line.includes('Location')) {
          profileData.location = line.split(',')[1]?.replace(/"/g, '') || '';
        }
        if (line.includes('Summary')) {
          profileData.about = line.split(',')[1]?.replace(/"/g, '') || '';
        }
      }
    } catch (error) {
      console.log('⚠️ Could not parse Profile.csv:', error.message);
    }
  }

  async parsePositions(profileData) {
    try {
      const positionsPath = path.join(this.exportPath, 'Positions.csv');
      const data = await fs.readFile(positionsPath, 'utf8');
      const lines = data.split('\n');
      
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim()) {
          const columns = this.parseCSVLine(line);
          if (columns.length >= 4) {
            profileData.experience.push({
              title: columns[0] || '',
              company: columns[1] || '',
              duration: `${columns[2] || ''} - ${columns[3] || ''}`,
              description: columns[4] || ''
            });
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Could not parse Positions.csv:', error.message);
    }
  }

  async parseEducation(profileData) {
    try {
      const educationPath = path.join(this.exportPath, 'Education.csv');
      const data = await fs.readFile(educationPath, 'utf8');
      const lines = data.split('\n');
      
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim()) {
          const columns = this.parseCSVLine(line);
          if (columns.length >= 3) {
            profileData.education.push({
              school: columns[0] || '',
              degree: columns[1] || '',
              duration: `${columns[2] || ''} - ${columns[3] || ''}`,
              description: columns[4] || ''
            });
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Could not parse Education.csv:', error.message);
    }
  }

  async parseSkills(profileData) {
    try {
      const skillsPath = path.join(this.exportPath, 'Skills.csv');
      const data = await fs.readFile(skillsPath, 'utf8');
      const lines = data.split('\n');
      
      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim()) {
          const columns = this.parseCSVLine(line);
          if (columns[0]) {
            profileData.skills.push(columns[0]);
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Could not parse Skills.csv:', error.message);
    }
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  async saveParsedData(profileData) {
    try {
      const outputPath = path.join(__dirname, '../data/linkedin-profile.json');
      await fs.writeFile(outputPath, JSON.stringify(profileData, null, 2));
      console.log('💾 Parsed data saved to:', outputPath);
    } catch (error) {
      console.error('❌ Failed to save parsed data:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const parser = new LinkedInExportParser();
  
  try {
    const profileData = await parser.parseLinkedInExport();
    
    if (profileData) {
      await parser.saveParsedData(profileData);
      console.log('🎉 LinkedIn export parsing completed!');
      console.log(`📊 Found ${profileData.experience.length} experiences`);
      console.log(`🎓 Found ${profileData.education.length} education entries`);
      console.log(`🛠️ Found ${profileData.skills.length} skills`);
    }
    
  } catch (error) {
    console.error('💥 LinkedIn export parsing failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = LinkedInExportParser;
