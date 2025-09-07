#!/usr/bin/env node

/**
 * Fortnightly LinkedIn Sync Scheduler
 * Automatically runs LinkedIn portfolio sync every 2 weeks
 */

const cron = require('node-cron');
const LinkedInPortfolioSync = require('./linkedin-auto-sync');

class FortnightlyScheduler {
    constructor() {
        this.sync = new LinkedInPortfolioSync();
        this.isRunning = false;
    }

    start() {
        console.log('🕐 Starting Fortnightly LinkedIn Sync Scheduler...');
        
        // Run every 2 weeks on Monday at 9:00 AM
        // Cron: 0 9 */14 * 1 (every 14 days, on Monday at 9 AM)
        const cronExpression = '0 9 */14 * 1';
        
        const task = cron.schedule(cronExpression, async () => {
            if (this.isRunning) {
                console.log('⏳ Sync already running, skipping...');
                return;
            }

            this.isRunning = true;
            console.log('🔄 Starting scheduled LinkedIn sync...');
            
            try {
                await this.sync.performSync();
                console.log('✅ Scheduled sync completed successfully');
            } catch (error) {
                console.error('❌ Scheduled sync failed:', error);
            } finally {
                this.isRunning = false;
            }
        }, {
            scheduled: false, // Don't start immediately
            timezone: "Asia/Kolkata" // Indian timezone
        });

        // Start the scheduler
        task.start();
        
        console.log('✅ Fortnightly scheduler started');
        console.log('📅 Next sync: Every 2 weeks on Monday at 9:00 AM IST');
        console.log('⏹️  To stop: Press Ctrl+C');

        // Keep the process running
        process.on('SIGINT', () => {
            console.log('\n🛑 Stopping scheduler...');
            task.stop();
            process.exit(0);
        });

        // Manual sync option
        process.on('SIGUSR1', async () => {
            console.log('\n🔄 Manual sync triggered...');
            if (!this.isRunning) {
                this.isRunning = true;
                try {
                    await this.sync.performSync();
                } catch (error) {
                    console.error('❌ Manual sync failed:', error);
                } finally {
                    this.isRunning = false;
                }
            }
        });
    }

    async runManualSync() {
        console.log('🔄 Running manual LinkedIn sync...');
        try {
            await this.sync.performSync();
            console.log('✅ Manual sync completed successfully');
        } catch (error) {
            console.error('❌ Manual sync failed:', error);
            process.exit(1);
        }
    }
}

// Command line interface
if (require.main === module) {
    const scheduler = new FortnightlyScheduler();
    
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
            console.log('  node fortnightly-scheduler.js start  - Start the scheduler');
            console.log('  node fortnightly-scheduler.js sync   - Run manual sync');
            break;
    }
}

module.exports = FortnightlyScheduler;
