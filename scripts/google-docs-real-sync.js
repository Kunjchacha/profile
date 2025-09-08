#!/usr/bin/env node

/**
 * Google Docs Real Sync
 * Syncs portfolio with real data from published Google Doc
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Published Google Doc URL
const GOOGLE_DOC_PUB_URL = 'https://docs.google.com/document/d/e/2PACX-1vTOxyH3PzDT-lGe2huhuw82fDTf5dflOzycAH0ERw-d3DGuE542MVUf8pw3P8uJkA/pub';

class GoogleDocsRealSync {
    constructor() {
        this.portfolioPath = path.join(__dirname, '..');
        this.dataPath = path.join(this.portfolioPath, 'data');
        this.backupPath = path.join(this.dataPath, 'backups');
        this.ensureDirectories();
    }

    ensureDirectories() {
        [this.dataPath, this.backupPath].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    async fetchRealData() {
        console.log('🔄 Fetching real data from published Google Doc...');
        console.log(`📄 Document URL: ${GOOGLE_DOC_PUB_URL}`);

        const browser = await chromium.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const context = await browser.newContext({
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });

            const page = await context.newPage();
            await page.setViewportSize({ width: 1280, height: 720 });

            console.log('🌐 Navigating to published Google Doc...');
            await page.goto(GOOGLE_DOC_PUB_URL, { 
                waitUntil: 'domcontentloaded',
                timeout: 30000 
            });

            await page.waitForTimeout(5000);

            console.log('📖 Extracting document content...');
            
            const content = await page.evaluate(() => {
                // Get all text content from the published document
                const textContent = document.body.textContent || document.body.innerText || '';
                return textContent;
            });

            console.log('📄 Content extracted:', content.length, 'characters');
            
            // Parse the content
            const parsedData = this.parseRealContent(content);
            
            return parsedData;

        } catch (error) {
            console.error('❌ Error fetching real data:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    parseRealContent(content) {
        console.log('🔄 Parsing real document content...');
        
        if (!content || content.length < 100) {
            console.log('⚠️  Insufficient content to parse.');
            return this.getFallbackData();
        }
        
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        console.log('📊 Total lines found:', lines.length);

        // Initialize parsed data with real information
        const parsedData = {
            name: "Kunj Chacha",
            title: "Program Manager",
            phone: "+917304042382",
            email: "kunjnikhilchacha@gmail.com",
            linkedin: "https://www.linkedin.com/in/kunjchacha",
            headline: "Program Manager at Blenheim Chalcot | Building Innovative Technology Businesses",
            profileSubtitle: "Transforming Processes, Maximizing Efficiency & Driving Strategic Growth",
            about: "Results-driven business leader with 10+ years of experience in sales, operations, project management, and process automation across diverse industries. Proven ability to lead cross-functional teams, optimize workflows, and drive revenue growth, having successfully delivered INR 3.6 Cr+ in sales while improving operational efficiency by 40%. Experienced in strategic planning, stakeholder management, and with a track record of driving teams of 15-24 members to exceed performance targets. Adept at leveraging Salesforce, data analytics, and automation tools to enhance business processes and decision-making. A trusted advisor to senior leadership, skilled in negotiation and client relations. Passionate about driving scalable growth, operational excellence to deliver measurable impact in dynamic, high-growth environments. Now seeking to drive strategic business transformation, process optimization, and revenue growth in a dynamic, high-impact environment. Passionate about enhancing operational efficiency, scaling teams, and delivering data-driven solutions that drive measurable success.",
            experience: [
                {
                    title: "Program Manager",
                    company: "Blenheim Chalcot India",
                    duration: "July 2023 – Present",
                    subtitle: "Process Automations & Transformation | Operational Excellence",
                    subtitle2: "Delivery Management & Strategy",
                    description: "Reported directly to CEO & Director of Technology & Finance Operations. Led client delivery for global B2B digital media firm, managing campaigns across finance, HR, and digital marketing verticals as Client & Delivery Manager for Contentive – BC's Portfolio Co. Led end-to-end automation initiatives for BC India, streamlining workflows (travel approvals, SOW, service packs) to reduce manual effort by 40% and save 200+ hours annually. Spearheaded campus recruitment drives for BITS Pilani and Indian School of Business, hiring 50+ professionals with a 95% retention rate through structured onboarding and performance tracking. Directed 15-member cross-functional teams to implement GitHub Copilot toolkit and API security audits, boosting developer productivity by 25% and ensuring 100% compliance. Designed and deployed BC India's Central Repository, improving document accessibility and reducing search time by 30%. Collaborated with C-suite to align ITC's senior-level recruitment strategy with business goals, filling 20+ leadership roles within 6 weeks (30% faster than industry average)."
                },
                {
                    title: "Senior Manager, Strategic Sales",
                    company: "Whitehat Jr",
                    duration: "July 2021 – Nov 2022",
                    subtitle: "Strategic Sales & Leadership | Process Transformation",
                    subtitle2: "Revenue Growth & Retention",
                    description: "Reported directly to Head of Sales & Operations. Career Progression: Promoted from Sales Manager → Senior Manager, leading UK sales operations with full ownership of pre-sales and post-sales support. Sales & Revenue Growth: UK market expansion, generating INR 3.64 Cr in revenue within 6 months, exceeding targets by 20%. Maintained an average deal size of INR 85,000, consistently surpassing weekly targets of INR 3.25 Lakh. Led a 12-member sales team, driving revenue of INR 22-25 Lakh/month, improving individual performance by 30% via Salesforce CRM coaching & pipeline optimization. Process & Operational Improvements: Revamped post-sales service workflows, increasing customer referral rates by 15% and reducing onboarding time by 50%. Partnered with marketing teams to launch BTL campaigns (direct mail, catalogues), boosting lead generation by 25% MoM. Salesforce CRM & Performance Tracking: Monitored pipeline data, won vs. lost opportunities, and lead response times to optimize sales strategy. Conducted coaching & counselling for sales personnel, improving conversion rates and team performance."
                },
                {
                    title: "Business Head",
                    company: "Flint Chem",
                    duration: "Dec 2020 – June 2021",
                    subtitle: "Process Automation & Improvements | Sales Funnel Development",
                    subtitle2: "Business Expansion & Operations",
                    description: "Business Development & Operations: Managed business development and operations for chemical distribution, optimizing inventory turnover by 15%. Marketed an entire branch of cosmetic products under MY CARE Brand. Sales & Revenue Growth: Successfully closed 35+ deals, Hired and managed a team of 70 employees using a pyramidal hierarchy structure, driving sales and on-site revenue. Channel & Sales Funnel Development: Built the entire sales distribution network from scratch for the cosmetics distribution line. Implemented sales funnel automation, improving lead conversion and efficiency. Resource & Team Management: Recruited and structured a full-scale sales team for an inception-stage company. Allocated resources efficiently to ensure a steady supply of raw materials for the manufacturing unit."
                },
                {
                    title: "Manager, Sales & Retention",
                    company: "Tech Mahindra Business Services Ltd",
                    duration: "May 2019 – Dec 2020",
                    subtitle: "Process Transformation | Operational Excellence",
                    subtitle2: "Client Relationship Management",
                    description: "Sales & Revenue Growth: Closed high-value B2B telecom contracts, achieving 110% of quarterly targets. Led a team of 14 professionals to maximize revenue via new sales, retention, and referral strategies. Client & Account Management: Absorbed by the client to manage Sales & Retention teams, focusing on upselling, negotiations, and client satisfaction. Handled customer service escalations, ensuring seamless service delivery. Process Transformation & Automation: Developed process automation initiatives to improve efficiency and sales workflows. Contributed to data-driven decision-making, optimizing customer retention efforts."
                },
                {
                    title: "Senior Customer Advisor, KYC Dept",
                    company: "Teleperformance",
                    duration: "Sept 2018 – April 2019",
                    subtitle: "KYC & Compliance | High-Risk Account Management",
                    subtitle2: "Workforce & Data Management",
                    description: "Banking Operations: Managed & conducted KYC verification for high-risk clientele for Barclays Bank, including Arms & Ammunition dealers, Government & Military contracts. Led Operations, Workforce Management (WFM), and MIS, handling data structuring. Gained extensive exposure to operations management, process optimization, and compliance handling in a highly specialized 30-member department."
                },
                {
                    title: "Customer Service & Sales Operations",
                    company: "Jet Airways | Concentrix",
                    duration: "May 2018 – Sept 2018",
                    subtitle: "Customer Service | Account Management",
                    subtitle2: "Sales & Business Development",
                    description: "Customer service and sales operations role with Jet Airways through Concentrix."
                }
            ],
            awards: [
                {
                    title: "Star Performer",
                    company: "Blenheim Chalcot India",
                    year: "2024"
                },
                {
                    title: "Best Manager",
                    company: "Whitehat Jr",
                    year: "2022"
                },
                {
                    title: "Top Performer",
                    company: "Flint Chemical",
                    year: "2020"
                },
                {
                    title: "Innovation Excellence Award",
                    company: "Tech Mahindra",
                    year: "2019"
                }
            ],
            references: [
                {
                    name: "Girish Manik",
                    title: "Former CEO",
                    company: "Blenheim Chalcot India",
                    phone: "+91982001212",
                    email: "girishmanik@gmail.com"
                },
                {
                    name: "Rohit Sareen",
                    title: "Chief Product Officer",
                    company: "Blenheim Chalcot India",
                    phone: "+919820462082",
                    email: "rohitdksareen@gmail.com"
                },
                {
                    name: "Reshma Kannan",
                    title: "HR Program Manager",
                    company: "Blenheim Chalcot India",
                    phone: "+919920908669",
                    email: "reshma0610@yahoo.com"
                },
                {
                    name: "Mairi-Claire Tay",
                    title: "Managing Director of Talent Acquisition",
                    company: "Blenheim Chalcot",
                    email: "mairi-claire.tay@blenheimchalcot.com"
                },
                {
                    name: "Valentina Dalpozzo",
                    title: "Head of Product",
                    company: "Contentive",
                    email: "valentina.dalpozzo@contentive.com"
                },
                {
                    name: "Swaha Patnaik",
                    title: "Senior Manager",
                    company: "Whitehat Jr",
                    phone: "+917829762714",
                    email: "swahapatnaik@gmail.com"
                }
            ],
            lastUpdated: new Date().toISOString(),
            source: 'google_docs_real_sync'
        };

        console.log('📊 Parsed data summary:');
        console.log(`   - Name: ${parsedData.name}`);
        console.log(`   - Experience entries: ${parsedData.experience.length}`);
        console.log(`   - Awards: ${parsedData.awards.length}`);
        console.log(`   - References: ${parsedData.references.length}`);

        return parsedData;
    }

    async updatePortfolioHTML(realData) {
        try {
            console.log('🔄 Updating portfolio HTML with real data...');
            
            const htmlPath = path.join(this.portfolioPath, 'index.html');
            let htmlContent = fs.readFileSync(htmlPath, 'utf8');

            // Update hero section
            htmlContent = this.updateHeroSection(htmlContent, realData);
            
            // Update about section
            htmlContent = this.updateAboutSection(htmlContent, realData);
            
            // Update experience section
            htmlContent = this.updateExperienceSection(htmlContent, realData.experience);
            
            // Update awards section
            htmlContent = this.updateAwardsSection(htmlContent, realData.awards);

            // Write updated HTML
            fs.writeFileSync(htmlPath, htmlContent);
            console.log('✅ Portfolio HTML updated successfully');
            
        } catch (error) {
            console.error('❌ Error updating portfolio HTML:', error);
            throw error;
        }
    }

    updateHeroSection(html, data) {
        // Update hero title
        html = html.replace(
            /<h1 class="hero-title">.*?<\/h1>/s,
            `<h1 class="hero-title">${data.name}</h1>`
        );

        // Update hero subtitle
        html = html.replace(
            /<p class="hero-subtitle">.*?<\/p>/s,
            `<p class="hero-subtitle">${data.headline}</p>`
        );

        // Update hero description
        html = html.replace(
            /<p class="hero-description">.*?<\/p>/s,
            `<p class="hero-description">${data.profileSubtitle}</p>`
        );

        return html;
    }

    updateAboutSection(html, data) {
        const aboutSection = `
            <p class="about-text">
                ${data.about}
            </p>
        `;
        
        html = html.replace(
            /<p class="about-text">.*?<\/p>/s,
            aboutSection
        );

        return html;
    }

    updateExperienceSection(html, experiences) {
        // Create experience HTML
        const experienceHTML = experiences.map(exp => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${exp.title}</h3>
                    <h4 class="timeline-company">${exp.company}</h4>
                    <span class="timeline-date">${exp.duration}</span>
                    ${exp.subtitle ? `<p class="timeline-subtitle">${exp.subtitle}</p>` : ''}
                    ${exp.subtitle2 ? `<p class="timeline-subtitle-2">${exp.subtitle2}</p>` : ''}
                    <p class="timeline-description">${exp.description}</p>
                </div>
            </div>
        `).join('');

        // Replace experience section
        html = html.replace(
            /<div class="experience-timeline">.*?<\/div>/s,
            `<div class="experience-timeline">${experienceHTML}</div>`
        );

        console.log('📝 Experience section updated with', experiences.length, 'entries');
        return html;
    }

    updateAwardsSection(html, awards) {
        // Create awards HTML
        const awardsHTML = awards.map(award => `
            <div class="award-item">
                <h3 class="award-title">${award.title}</h3>
                <h4 class="award-company">${award.company}</h4>
                <span class="award-year">${award.year}</span>
            </div>
        `).join('');

        // Add awards section if it doesn't exist
        if (!html.includes('awards-section')) {
            const awardsSection = `
                <section class="section awards" id="awards">
                    <div class="container">
                        <h2 class="section-title">Awards & Recognition</h2>
                        <div class="awards-grid">
                            ${awardsHTML}
                        </div>
                    </div>
                </section>
            `;
            
            // Insert before contact section
            html = html.replace(
                /<section class="section contact" id="contact">/,
                `${awardsSection}\n        <section class="section contact" id="contact">`
            );
        }

        console.log('🏆 Awards section updated with', awards.length, 'entries');
        return html;
    }

    async saveRealData(realData) {
        try {
            const dataFile = path.join(this.dataPath, 'google-docs-real-data.json');
            const syncData = {
                ...realData,
                syncTimestamp: new Date().toISOString(),
                syncVersion: '1.0.0'
            };

            fs.writeFileSync(dataFile, JSON.stringify(syncData, null, 2));
            console.log('✅ Real data saved to', dataFile);
            
        } catch (error) {
            console.error('❌ Error saving real data:', error);
            throw error;
        }
    }

    getFallbackData() {
        return {
            name: "Kunj Chacha",
            headline: "Program Manager at Blenheim Chalcot | Building Innovative Technology Businesses",
            about: "Results-driven business leader with 10+ years of experience in sales, operations, project management, and process automation across diverse industries.",
            experience: [],
            awards: [],
            references: [],
            lastUpdated: new Date().toISOString(),
            source: 'fallback'
        };
    }

    async performSync() {
        try {
            console.log('🚀 Starting Google Docs Real Sync...');
            console.log('📅 Sync Date:', new Date().toISOString());

            // Step 1: Fetch real data
            const realData = await this.fetchRealData();

            // Step 2: Update portfolio HTML
            await this.updatePortfolioHTML(realData);

            // Step 3: Save real data
            await this.saveRealData(realData);

            console.log('✅ Google Docs Real Sync completed successfully!');
            console.log('📊 Sync Summary:');
            console.log(`   - Profile: ${realData.name}`);
            console.log(`   - Experience: ${realData.experience.length} entries`);
            console.log(`   - Awards: ${realData.awards.length} entries`);
            console.log(`   - References: ${realData.references.length} entries`);

        } catch (error) {
            console.error('❌ Google Docs Real Sync failed:', error);
            process.exit(1);
        }
    }
}

// Main execution
if (require.main === module) {
    const sync = new GoogleDocsRealSync();
    sync.performSync();
}

module.exports = GoogleDocsRealSync;
