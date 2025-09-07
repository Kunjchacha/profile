# LinkedIn Sync Guide

## 🔄 How LinkedIn Auto-Sync Works

### **Current System:**
- **Data Source**: Cached LinkedIn profile data in `/data/linkedin-profile.json`
- **Update Method**: Manual updates when you change your LinkedIn profile
- **Sync Frequency**: Fortnightly (every 2 weeks) or manual trigger

### **Why Not Real-Time LinkedIn API?**
1. **LinkedIn API Restrictions**: Requires OAuth, partner approval, rate limits
2. **Web Scraping Challenges**: LinkedIn blocks automated access, requires login
3. **Legal Considerations**: LinkedIn's Terms of Service restrict automated data collection

## 📝 How to Update Your LinkedIn Data

### **Method 1: Manual Update (Recommended)**

1. **Update your LinkedIn profile** with new information
2. **Run the update guide**:
   ```bash
   npm run update-linkedin
   ```
3. **Edit the data file**:
   ```bash
   # Open the data file
   open data/linkedin-profile.json
   ```
4. **Update the information** you want to change
5. **Sync to portfolio**:
   ```bash
   npm run sync
   ```

### **Method 2: Direct File Edit**

1. **Open the data file**:
   ```bash
   code data/linkedin-profile.json
   ```
2. **Update the JSON** with your latest LinkedIn information
3. **Save the file**
4. **Run sync**:
   ```bash
   npm run sync
   ```

## 🗂️ Data File Structure

```json
{
  "name": "Your Name",
  "headline": "Your LinkedIn Headline",
  "location": "Your Location",
  "about": "Your About Section",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start Date - End Date",
      "description": "Job Description"
    }
  ],
  "education": [
    {
      "school": "School Name",
      "degree": "Degree Name",
      "duration": "Start Date - End Date",
      "description": "Additional Details"
    }
  ],
  "skills": [
    "Skill 1",
    "Skill 2",
    "Skill 3"
  ]
}
```

## 🚀 Available Commands

```bash
# Manual sync (updates portfolio from data file)
npm run sync

# Manual sync via scheduler
npm run sync-manual

# Start fortnightly scheduler
npm run scheduler

# Update LinkedIn data guide
npm run update-linkedin

# Deploy changes to GitHub Pages
npm run deploy
```

## ⚡ Quick Update Process

1. **Change something on LinkedIn**
2. **Run**: `npm run update-linkedin`
3. **Edit**: `data/linkedin-profile.json`
4. **Run**: `npm run sync`
5. **Deploy**: `npm run deploy`

## 🔧 Troubleshooting

### **Data Not Updating?**
- Check if the JSON file is valid
- Ensure all required fields are present
- Run `npm run sync` after updating

### **Portfolio Not Reflecting Changes?**
- Clear browser cache
- Check if the sync completed successfully
- Verify the data file was saved correctly

### **MCP Not Working?**
- The MCP reads from the cached data file
- Update the data file manually
- The MCP will return the updated data

## 📊 Current Data Status

Your portfolio currently shows:
- ✅ **5 Experience entries** (from your LinkedIn screenshots)
- ✅ **2 Education entries** (correct IIM Visakhapatnam and Chetana's)
- ✅ **16 Skills** (including new ones from LinkedIn)
- ✅ **Location**: Mumbai, Maharashtra, India

## 🎯 Best Practices

1. **Update regularly**: Keep your LinkedIn data fresh
2. **Test locally**: Always test changes locally before deploying
3. **Backup data**: Keep a backup of your LinkedIn data
4. **Version control**: Commit changes to git for tracking

---

**Note**: This system provides a practical solution for keeping your portfolio updated with LinkedIn data while respecting LinkedIn's terms of service and technical limitations.
