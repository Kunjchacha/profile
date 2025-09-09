const fs = require('fs');
const path = require('path');

// Use the existing Google Docs real sync data
const existingDataPath = path.join(__dirname, '..', 'data', 'google-docs-real-data.json');

if (fs.existsSync(existingDataPath)) {
    const existingData = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'));
    
    // Extract specific information for portfolio updates
    const portfolioData = {
        currentRole: {
            position: 'Program Manager',
            company: 'Blenheim Chalcot India',
            period: 'July 2023 – Present',
            description: 'Leading process automation initiatives and operational excellence across multiple business units. Specializing in building cross-functional teams, optimizing workflows, and implementing data-driven solutions that enhance business performance.'
        },
        keyAchievements: [
            'Delivered INR 3.6 Cr+ in revenue while improving operational efficiency by 40%',
            'Led end-to-end automation initiatives, reducing manual effort by 40% and saving 200+ hours annually',
            'Spearheaded campus recruitment drives at BITS Pilani and ISB, hiring 50+ professionals with 95% retention rate',
            'Generated INR 3.64 Cr revenue in UK market expansion, exceeding targets by 20%',
            'Directed 15-member cross-functional teams to implement GitHub Copilot toolkit, boosting productivity by 25%'
        ],
        coreSkills: [
            'Strategic Planning & Problem Solving',
            'Stakeholder Management', 
            'Sales Operations & Business Development',
            'Process Orchestration & Project Management',
            'Data Analytics & Visualization',
            'Microsoft Power BI',
            'Looker Studio',
            'SQL',
            'Salesforce CRM',
            'Process Automation',
            'Team Leadership',
            'Revenue Growth'
        ],
        awards: [
            'Star Performer – Blenheim Chalcot India, 2024',
            'Best Manager – Whitehat Jr, 2022', 
            'Top Performer – Flint Chemical, 2020',
            'Innovation Excellence Award – Tech Mahindra, 2019'
        ],
        education: [
            'Executive Program in New Product Development & Marketing Strategy – IIM, Vishakhapatnam, Nov 2024 — Present',
            'Bachelor of Management Studies (Marketing) – Chetana\'s R.K. Institute of Management & Research Development, Jul 2016 — Oct 2019'
        ]
    };
    
    // Save the processed data
    const outputPath = path.join(__dirname, '..', 'data', 'resume-specific-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(portfolioData, null, 2));
    
    console.log('✅ Resume data processed and saved successfully!');
    console.log('📊 Current Role:', portfolioData.currentRole);
    console.log('🎯 Key Achievements:', portfolioData.keyAchievements.length);
    console.log('🛠️ Core Skills:', portfolioData.coreSkills.length);
    console.log('🏆 Awards:', portfolioData.awards.length);
    
} else {
    console.log('❌ No existing Google Docs data found. Please run the Google Docs sync first.');
}
