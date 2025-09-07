#!/usr/bin/env node

/**
 * LinkedIn Browser Extension Method
 * Instructions for using browser extensions to extract LinkedIn data
 */

const fs = require('fs').promises;
const path = require('path');

class LinkedInBrowserExtension {
  constructor() {
    this.extensions = [
      {
        name: "LinkedIn Data Extractor",
        description: "Extracts complete LinkedIn profile data",
        url: "https://chrome.google.com/webstore/search/linkedin%20data%20extractor",
        method: "Chrome Extension"
      },
      {
        name: "Web Scraper",
        description: "Generic web scraping tool",
        url: "https://chrome.google.com/webstore/search/web%20scraper",
        method: "Chrome Extension"
      },
      {
        name: "Data Miner",
        description: "Data extraction tool",
        url: "https://chrome.google.com/webstore/search/data%20miner",
        method: "Chrome Extension"
      }
    ];
  }

  async showInstructions() {
    console.log('🌐 LinkedIn Browser Extension Method');
    console.log('====================================');
    
    console.log('\n📋 Step-by-Step Instructions:');
    console.log('1. Install a LinkedIn data extraction extension');
    console.log('2. Go to your LinkedIn profile');
    console.log('3. Run the extension to extract data');
    console.log('4. Export the data as JSON/CSV');
    console.log('5. Save the file to: data/linkedin-export/');
    console.log('6. Run: npm run parse-linkedin-export');

    console.log('\n🔧 Recommended Extensions:');
    this.extensions.forEach((ext, index) => {
      console.log(`${index + 1}. ${ext.name}`);
      console.log(`   Description: ${ext.description}`);
      console.log(`   Method: ${ext.method}`);
      console.log(`   URL: ${ext.url}`);
      console.log('');
    });

    console.log('📝 Manual Data Collection:');
    console.log('If extensions don\'t work, you can manually collect:');
    console.log('- Copy your profile information');
    console.log('- Copy all experience entries');
    console.log('- Copy all education entries');
    console.log('- Copy all skills');
    console.log('- Paste into: data/linkedin-manual-data.json');
  }

  async createManualDataTemplate() {
    const template = {
      name: "Your Full Name",
      headline: "Your LinkedIn Headline",
      location: "Your Location",
      about: "Your About Section",
      experience: [
        {
          title: "Job Title",
          company: "Company Name",
          duration: "Start Date - End Date",
          description: "Job Description"
        }
      ],
      education: [
        {
          school: "School Name",
          degree: "Degree Name",
          duration: "Start Date - End Date",
          description: "Additional Details"
        }
      ],
      skills: [
        "Skill 1",
        "Skill 2",
        "Skill 3"
      ],
      lastUpdated: new Date().toISOString(),
      source: "manual_collection"
    };

    const templatePath = path.join(__dirname, '../data/linkedin-manual-data.json');
    await fs.writeFile(templatePath, JSON.stringify(template, null, 2));
    console.log('📄 Manual data template created at:', templatePath);
  }
}

// Main execution
async function main() {
  const extension = new LinkedInBrowserExtension();
  
  try {
    await extension.showInstructions();
    await extension.createManualDataTemplate();
    
    console.log('\n✅ Browser extension method setup completed!');
    console.log('💡 Choose the method that works best for you.');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = LinkedInBrowserExtension;
