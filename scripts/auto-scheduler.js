#!/usr/bin/env node

/**
 * Automatic LinkedIn Sync Scheduler
 * Automatically syncs LinkedIn data at regular intervals
 */

const cron = require('node-cron');
const AutoLinkedInSync = require('./auto-linkedin-sync');
const LinkedInPortfolioSync = require('./linkedin-auto-sync');

class AutoScheduler {
  constructor() {
    this.isRunning = false;
    this.sync = new AutoLinkedInSync();
    this.portfolioSync = new LinkedInPortfolioSync();
  }

  start() {
    console.log('🕐 Starting Automatic LinkedIn Sync Scheduler...');
    
    // Run every 6 hours
    const cronExpression = '0 */6 * * *';
    
    const task = cron.schedule(cronExpression, async () => {
      if (this.isRunning) {
        console.log('⏳ Sync already running, skipping...');
        return;
      }

      this.isRunning = true;
      console.log('🔄 Starting scheduled automatic LinkedIn sync...');
      
      try {
        // Step 1: Fetch fresh LinkedIn data
        await this.sync.initialize();
        const profileData = await this.sync.syncLinkedInData();
        
        // Step 2: Update portfolio with fresh data
        await this.portfolioSync.updatePortfolioHTML(profileData);
        
        // Step 3: Save updated data
        await this.portfolioSync.saveLinkedInData(profileData);
        
        console.log('✅ Scheduled automatic sync completed successfully');
        console.log(`📊 Updated ${profileData.experience.length} experiences`);
        console.log(`🎓 Updated ${profileData.education.length} education entries`);
        console.log(`🛠️ Updated ${profileData.skills.length} skills`);
        
      } catch (error) {
        console.error('❌ Scheduled automatic sync failed:', error);
      } finally {
        this.isRunning = false;
      }
    }, {
      scheduled: false, // Don't start immediately
      timezone: "Asia/Kolkata" // Indian timezone
    });

    // Start the scheduler
    task.start();
    
    console.log('✅ Automatic scheduler started');
    console.log('📅 Sync schedule: Every 6 hours');
    console.log('⏹️  To stop: Press Ctrl+C');

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping automatic scheduler...');
      task.stop();
      process.exit(0);
    });

    // Manual sync option
    process.on('SIGUSR1', async () => {
      console.log('\n🔄 Manual automatic sync triggered...');
      if (!this.isRunning) {
        this.isRunning = true;
        try {
          await this.sync.initialize();
          const profileData = await this.sync.syncLinkedInData();
          await this.portfolioSync.updatePortfolioHTML(profileData);
          await this.portfolioSync.saveLinkedInData(profileData);
          console.log('✅ Manual automatic sync completed');
        } catch (error) {
          console.error('❌ Manual automatic sync failed:', error);
        } finally {
          this.isRunning = false;
        }
      }
    });
  }

  async runManualSync() {
    console.log('🔄 Running manual automatic LinkedIn sync...');
    try {
      await this.sync.initialize();
      const profileData = await this.sync.syncLinkedInData();
      await this.portfolioSync.updatePortfolioHTML(profileData);
      await this.portfolioSync.saveLinkedInData(profileData);
      console.log('✅ Manual automatic sync completed successfully');
    } catch (error) {
      console.error('❌ Manual automatic sync failed:', error);
      process.exit(1);
    }
  }
}

// Command line interface
if (require.main === module) {
  const scheduler = new AutoScheduler();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      scheduler.start();
      break;
    case 'sync':
      scheduler.runManualSync();
      break;
    default:
      console.log('Usage:');
      console.log('  node auto-scheduler.js start  - Start the automatic scheduler');
      console.log('  node auto-scheduler.js sync   - Run manual automatic sync');
      break;
  }
}

module.exports = AutoScheduler;
