#!/usr/bin/env node

/**
 * LinkedIn Playwright with Authentication
 * Uses Playwright to scrape LinkedIn with proper authentication
 */

const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class LinkedInPlaywrightAuth {
  constructor() {
    this.browser = null;
    this.page = null;
    this.profileUrl = 'https://www.linkedin.com/in/kunjchacha/';
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Playwright with authentication...');
      
      this.browser = await chromium.launch({
        headless: false, // Set to true for headless mode
        slowMo: 1000 // Slow down for better reliability
      });
      
      this.page = await this.browser.newPage();
      
      // Set user agent
      await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      console.log('✅ Playwright initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Playwright:', error);
      throw error;
    }
  }

  async authenticate() {
    try {
      console.log('🔐 Starting LinkedIn authentication...');
      
      // Go to LinkedIn login page
      await this.page.goto('https://www.linkedin.com/login');
      
      console.log('📝 Please log in to LinkedIn manually:');
      console.log('1. Enter your email and password');
      console.log('2. Complete any 2FA if required');
      console.log('3. Wait for the page to load completely');
      console.log('4. Press Enter in this terminal when ready...');
      
      // Wait for user to complete login
      await this.waitForUserInput();
      
      // Verify we're logged in
      const isLoggedIn = await this.verifyLogin();
      if (!isLoggedIn) {
        throw new Error('Login verification failed');
      }
      
      console.log('✅ Successfully authenticated with LinkedIn');
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      throw error;
    }
  }

  async waitForUserInput() {
    return new Promise((resolve) => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
  }

  async verifyLogin() {
    try {
      // Check if we're on a LinkedIn page (not login page)
      const currentUrl = this.page.url();
      return currentUrl.includes('linkedin.com') && !currentUrl.includes('login');
    } catch (error) {
      return false;
    }
  }

  async scrapeProfile() {
    try {
      console.log(`🔍 Scraping profile: ${this.profileUrl}`);
      
      // Navigate to the profile
      await this.page.goto(this.profileUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for profile to load
      await this.page.waitForSelector('.pv-text-details__left-panel', { timeout: 15000 });

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
          if (index >= 12) return; // Limit to 12 experiences
          
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
          if (index >= 4) return; // Limit to 4 education entries
          
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
          if (index >= 20) return; // Limit to 20 skills
          data.skills.push(skill.textContent.trim());
        });

        return data;
      });

      // Add metadata
      profileData.lastUpdated = new Date().toISOString();
      profileData.source = 'playwright_authenticated';
      profileData.profileUrl = this.profileUrl;

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
  const scraper = new LinkedInPlaywrightAuth();
  
  try {
    await scraper.initialize();
    await scraper.authenticate();
    
    // Scrape the profile
    const profileData = await scraper.scrapeProfile();
    
    // Save the data
    await scraper.saveProfileData(profileData);
    
    console.log('🎉 LinkedIn scraping with authentication completed successfully!');
    console.log(`📊 Found ${profileData.experience.length} experience entries`);
    console.log(`🎓 Found ${profileData.education.length} education entries`);
    console.log(`🛠️ Found ${profileData.skills.length} skills`);
    
  } catch (error) {
    console.error('💥 LinkedIn scraping failed:', error);
    process.exit(1);
  } finally {
    await scraper.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = LinkedInPlaywrightAuth;
