#!/usr/bin/env node

/**
 * Manual LinkedIn Data Update
 * Simple script to manually update LinkedIn profile data
 */

const fs = require('fs').promises;
const path = require('path');

async function updateLinkedInData() {
  console.log('📝 Manual LinkedIn Data Update');
  console.log('================================');
  
  // Get current data
  const dataPath = path.join(__dirname, '../data/linkedin-profile.json');
  let currentData;
  
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    currentData = JSON.parse(data);
    console.log('✅ Current data loaded');
  } catch (error) {
    console.log('❌ No existing data found');
    currentData = {};
  }

  console.log('\n📊 Current Profile Data:');
  console.log(`Name: ${currentData.name || 'Not set'}`);
  console.log(`Headline: ${currentData.headline || 'Not set'}`);
  console.log(`Location: ${currentData.location || 'Not set'}`);
  console.log(`Experiences: ${currentData.experience?.length || 0}`);
  console.log(`Education: ${currentData.education?.length || 0}`);
  console.log(`Skills: ${currentData.skills?.length || 0}`);

  console.log('\n🔄 To update your LinkedIn data:');
  console.log('1. Go to your LinkedIn profile');
  console.log('2. Copy the information you want to update');
  console.log('3. Edit the file: /data/linkedin-profile.json');
  console.log('4. Run: npm run sync');
  
  console.log('\n📁 Data file location:');
  console.log(dataPath);
  
  console.log('\n💡 Pro tip: You can also:');
  console.log('- Use the LinkedIn export feature');
  console.log('- Copy-paste from your LinkedIn profile');
  console.log('- Update specific sections as needed');
}

// Main execution
if (require.main === module) {
  updateLinkedInData()
    .then(() => {
      console.log('\n✅ Manual update guide completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = updateLinkedInData;
