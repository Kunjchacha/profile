#!/usr/bin/env node

/**
 * LinkedIn Web Scraper
 * Fetches real-time LinkedIn profile data using web scraping
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class LinkedInScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    try {
      console.log('🚀 Initializing LinkedIn scraper...');
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      
      // Set user agent to avoid detection
      await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      console.log('✅ LinkedIn scraper initialized');
    } catch (error) {
      console.error('❌ Failed to initialize scraper:', error);
      throw error;
    }
  }

  async scrapeProfile(profileUrl) {
    try {
      console.log(`🔍 Scraping profile: ${profileUrl}`);
      
      // Navigate to the profile
      await this.page.goto(profileUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for profile content to load
      await this.page.waitForSelector('.pv-text-details__left-panel', { timeout: 10000 });

      // Extract profile data
      const profileData = await this.page.evaluate(() => {
        const data = {};

        // Extract name
        const nameElement = document.querySelector('.text-heading-xlarge');
        data.name = nameElement ? nameElement.textContent.trim() : '';

        // Extract headline
        const headlineElement = document.querySelector('.text-body-medium.break-words');
        data.headline = headlineElement ? headlineElement.textContent.trim() : '';

        // Extract location
        const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words');
        data.location = locationElement ? locationElement.textContent.trim() : '';

        // Extract about section
        const aboutElement = document.querySelector('#about ~ .pv-shared-text-with-see-more .inline-show-more-text');
        data.about = aboutElement ? aboutElement.textContent.trim() : '';

        // Extract experience
        data.experience = [];
        const experienceElements = document.querySelectorAll('#experience ~ .pvs-list__container .pvs-entity');
        
        experienceElements.forEach((exp, index) => {
          if (index >= 5) return; // Limit to 5 experiences
          
          const titleElement = exp.querySelector('.mr1.t-bold span[aria-hidden="true"]');
          const companyElement = exp.querySelector('.t-14.t-normal span[aria-hidden="true"]');
          const durationElement = exp.querySelector('.t-14.t-normal.t-black--light span[aria-hidden="true"]');
          const descriptionElement = exp.querySelector('.t-14.t-normal.t-black span[aria-hidden="true"]');

          if (titleElement && companyElement) {
            data.experience.push({
              title: titleElement.textContent.trim(),
              company: companyElement.textContent.trim(),
              duration: durationElement ? durationElement.textContent.trim() : '',
              description: descriptionElement ? descriptionElement.textContent.trim() : ''
            });
          }
        });

        // Extract education
        data.education = [];
        const educationElements = document.querySelectorAll('#education ~ .pvs-list__container .pvs-entity');
        
        educationElements.forEach((edu, index) => {
          if (index >= 3) return; // Limit to 3 education entries
          
          const schoolElement = edu.querySelector('.mr1.t-bold span[aria-hidden="true"]');
          const degreeElement = edu.querySelector('.t-14.t-normal span[aria-hidden="true"]');
          const durationElement = edu.querySelector('.t-14.t-normal.t-black--light span[aria-hidden="true"]');
          const descriptionElement = edu.querySelector('.t-14.t-normal.t-black span[aria-hidden="true"]');

          if (schoolElement && degreeElement) {
            data.education.push({
              school: schoolElement.textContent.trim(),
              degree: degreeElement.textContent.trim(),
              duration: durationElement ? durationElement.textContent.trim() : '',
              description: descriptionElement ? descriptionElement.textContent.trim() : ''
            });
          }
        });

        // Extract skills
        data.skills = [];
        const skillElements = document.querySelectorAll('#skills ~ .pvs-list__container .pvs-entity .mr1.t-bold span[aria-hidden="true"]');
        
        skillElements.forEach((skill, index) => {
          if (index >= 15) return; // Limit to 15 skills
          data.skills.push(skill.textContent.trim());
        });

        return data;
      });

      // Add metadata
      profileData.lastUpdated = new Date().toISOString();
      profileData.source = 'linkedin_scraping';
      profileData.profileUrl = profileUrl;

      console.log('✅ Profile scraped successfully');
      return profileData;

    } catch (error) {
      console.error('❌ Scraping failed:', error);
      throw error;
    }
  }

  async saveProfileData(profileData) {
    try {
      const dataPath = path.join(__dirname, '../data/linkedin-profile.json');
      await fs.writeFile(dataPath, JSON.stringify(profileData, null, 2));
      console.log('💾 Profile data saved to:', dataPath);
    } catch (error) {
      console.error('❌ Failed to save profile data:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

// Main execution
async function main() {
  const scraper = new LinkedInScraper();
  
  try {
    await scraper.initialize();
    
    // Scrape the profile
    const profileUrl = 'https://www.linkedin.com/in/kunjchacha/';
    const profileData = await scraper.scrapeProfile(profileUrl);
    
    // Save the data
    await scraper.saveProfileData(profileData);
    
    console.log('🎉 LinkedIn scraping completed successfully!');
    console.log('📊 Profile data:', JSON.stringify(profileData, null, 2));
    
  } catch (error) {
    console.error('💥 Scraping failed:', error);
    process.exit(1);
  } finally {
    await scraper.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = LinkedInScraper;
