#!/usr/bin/env node

/**
 * Google Docs Monthly Auto-Sync Scheduler
 * Runs Google Docs sync every 30 days automatically
 */

const cron = require('node-cron');
const GoogleDocsSync = require('./google-docs-sync');

class GoogleDocsMonthlyScheduler {
    constructor() {
        this.sync = new GoogleDocsSync();
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) {
            console.log('⚠️  Google Docs Monthly Scheduler is already running');
            return;
        }

        console.log('🚀 Starting Google Docs Monthly Auto-Sync Scheduler...');
        console.log('📅 Schedule: Every 30 days at 9:00 AM');
        console.log('📄 Document ID: e/2PACX-1vTOxyH3PzDT-lGe2huhuw82fDTf5dflOzycAH0ERw-d3DGuE542MVUf8pw3P8uJkA');

        // Schedule sync every 30 days at 9:00 AM
        // Using cron expression: 0 9 */30 * * (every 30 days at 9 AM)
        // For testing, we'll use every 5 minutes: */5 * * * *
        const cronExpression = process.env.NODE_ENV === 'production' ? '0 9 */30 * *' : '*/5 * * * *';
        
        this.task = cron.schedule(cronExpression, async () => {
            try {
                console.log('⏰ Scheduled Google Docs sync triggered...');
                await this.sync.performSync();
                console.log('✅ Scheduled sync completed successfully');
            } catch (error) {
                console.error('❌ Scheduled sync failed:', error);
            }
        }, {
            scheduled: false,
            timezone: "Asia/Kolkata"
        });

        this.task.start();
        this.isRunning = true;

        console.log('✅ Google Docs Monthly Scheduler started successfully');
        console.log('🔄 Scheduler is running in the background...');
        console.log('📝 To stop the scheduler, press Ctrl+C');
    }

    stop() {
        if (this.task) {
            this.task.stop();
            this.isRunning = false;
            console.log('⏹️  Google Docs Monthly Scheduler stopped');
        }
    }

    async runOnce() {
        console.log('🔄 Running Google Docs sync once...');
        await this.sync.performSync();
        console.log('✅ One-time sync completed');
    }
}

// Command line interface
if (require.main === module) {
    const scheduler = new GoogleDocsMonthlyScheduler();
    const command = process.argv[2];

    switch (command) {
        case 'start':
            scheduler.start();
            // Keep the process running
            process.on('SIGINT', () => {
                console.log('\n🛑 Received SIGINT, stopping scheduler...');
                scheduler.stop();
                process.exit(0);
            });
            break;
        case 'stop':
            scheduler.stop();
            break;
        case 'sync':
            scheduler.runOnce();
            break;
        default:
            console.log('Usage: node google-docs-monthly.js [start|stop|sync]');
            console.log('  start - Start the monthly scheduler');
            console.log('  stop  - Stop the scheduler');
            console.log('  sync  - Run sync once');
            break;
    }
}

module.exports = GoogleDocsMonthlyScheduler;
