const cron = require('node-cron');
const LinkedInMCPSync = require('./linkedin-mcp-sync');
const NotionAPISync = require('./notion-api-sync');

/**
 * Automated Portfolio Scheduler
 * Manages LinkedIn MCP (weekly) and Notion API (monthly) updates
 */
class PortfolioScheduler {
    constructor() {
        this.linkedinSync = new LinkedInMCPSync();
        this.notionSync = new NotionAPISync();
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) {
            console.log('⚠️ Scheduler is already running');
            return;
        }

        console.log('🚀 Starting Portfolio Scheduler...');
        console.log('==================================');

        // LinkedIn MCP Sync - Every Monday at 9 AM
        cron.schedule('0 9 * * 1', async () => {
            console.log('📅 Running scheduled LinkedIn MCP sync...');
            try {
                await this.linkedinSync.run();
                console.log('✅ LinkedIn MCP sync completed successfully');
            } catch (error) {
                console.error('❌ LinkedIn MCP sync failed:', error);
            }
        }, {
            timezone: 'Asia/Kolkata'
        });

        // Notion API Sync - 1st of every month at 10 AM
        cron.schedule('0 10 1 * *', async () => {
            console.log('📅 Running scheduled Notion API sync...');
            try {
                await this.notionSync.run();
                console.log('✅ Notion API sync completed successfully');
            } catch (error) {
                console.error('❌ Notion API sync failed:', error);
            }
        }, {
            timezone: 'Asia/Kolkata'
        });

        this.isRunning = true;
        console.log('✅ Scheduler started successfully');
        console.log('📅 LinkedIn MCP sync: Every Monday at 9:00 AM');
        console.log('📅 Notion API sync: 1st of every month at 10:00 AM');
        console.log('⏰ Timezone: Asia/Kolkata');
        console.log('🔄 Scheduler is running... Press Ctrl+C to stop');
    }

    stop() {
        if (!this.isRunning) {
            console.log('⚠️ Scheduler is not running');
            return;
        }

        console.log('🛑 Stopping Portfolio Scheduler...');
        this.isRunning = false;
        console.log('✅ Scheduler stopped');
    }

    async runLinkedInSync() {
        console.log('🔗 Running LinkedIn MCP sync manually...');
        try {
            await this.linkedinSync.run();
            console.log('✅ LinkedIn MCP sync completed successfully');
        } catch (error) {
            console.error('❌ LinkedIn MCP sync failed:', error);
        }
    }

    async runNotionSync() {
        console.log('📝 Running Notion API sync manually...');
        try {
            await this.notionSync.run();
            console.log('✅ Notion API sync completed successfully');
        } catch (error) {
            console.error('❌ Notion API sync failed:', error);
        }
    }

    async runBothSyncs() {
        console.log('🔄 Running both LinkedIn and Notion syncs...');
        try {
            await this.runLinkedInSync();
            await this.runNotionSync();
            console.log('✅ Both syncs completed successfully');
        } catch (error) {
            console.error('❌ Sync failed:', error);
        }
    }
}

// CLI Interface
if (require.main === module) {
    const scheduler = new PortfolioScheduler();
    const command = process.argv[2];

    switch (command) {
        case 'start':
            scheduler.start();
            // Keep the process running
            process.on('SIGINT', () => {
                scheduler.stop();
                process.exit(0);
            });
            break;
        case 'stop':
            scheduler.stop();
            break;
        case 'linkedin':
            scheduler.runLinkedInSync().then(() => process.exit(0));
            break;
        case 'notion':
            scheduler.runNotionSync().then(() => process.exit(0));
            break;
        case 'both':
            scheduler.runBothSyncs().then(() => process.exit(0));
            break;
        default:
            console.log('📋 Portfolio Scheduler Commands:');
            console.log('================================');
            console.log('npm run scheduler start    - Start the scheduler');
            console.log('npm run scheduler stop     - Stop the scheduler');
            console.log('npm run scheduler linkedin - Run LinkedIn sync manually');
            console.log('npm run scheduler notion   - Run Notion sync manually');
            console.log('npm run scheduler both     - Run both syncs manually');
            break;
    }
}

module.exports = PortfolioScheduler;




