# Google Docs Auto-Sync Guide

## 🚀 **Overview**

Your portfolio now automatically syncs with your Google Docs resume every 30 days! The system reads from your Google Doc and updates your portfolio website automatically.

## 📄 **Google Doc Details**

- **Document ID**: `e/2PACX-1vTOxyH3PzDT-lGe2huhuw82fDTf5dflOzycAH0ERw-d3DGuE542MVUf8pw3P8uJkA`
- **Document URL**: https://docs.google.com/document/d/e/2PACX-1vTOxyH3PzDT-lGe2huhuw82fDTf5dflOzycAH0ERw-d3DGuE542MVUf8pw3P8uJkA/pub
- **Sync Frequency**: Every 30 days
- **Last Sync**: Check `data/google-docs-profile.json`

## 🔧 **Available Commands**

### **Manual Sync**
```bash
# Run Google Docs sync once
npm run sync-google-docs

# Test the sync
npm run test-google-sync
```

### **Monthly Scheduler**
```bash
# Start monthly scheduler (runs every 30 days)
npm run sync-google-monthly

# Stop scheduler
node scripts/google-docs-monthly.js stop

# Run sync once
node scripts/google-docs-monthly.js sync
```

## 📊 **What Gets Synced**

### **Profile Information**
- ✅ Name
- ✅ Headline/Title
- ✅ About/Summary
- ✅ Location

### **Experience**
- ✅ Job titles
- ✅ Company names
- ✅ Duration
- ✅ Job descriptions

### **Education**
- ✅ School/University names
- ✅ Degrees
- ✅ Duration
- ✅ Descriptions

### **Skills**
- ✅ Skill names
- ✅ Proficiency levels (Expert, Advanced, Intermediate)

### **Projects**
- ✅ Project titles
- ✅ Descriptions
- ✅ Key metrics

## 🔄 **Automatic Sync Schedule**

### **GitHub Actions (Recommended)**
- **Frequency**: Every 30 days at 9:00 AM IST
- **Status**: ✅ Active
- **Workflow**: `.github/workflows/google-docs-sync.yml`

### **Local Scheduler**
- **Frequency**: Every 30 days at 9:00 AM IST
- **Command**: `npm run sync-google-monthly`
- **Status**: Available for local development

## 📁 **File Structure**

```
webume-portfolio/
├── scripts/
│   ├── google-docs-sync.js          # Main sync script
│   └── google-docs-monthly.js       # Monthly scheduler
├── data/
│   ├── google-docs-profile.json     # Synced data
│   └── backups/                     # Backup files
├── .github/workflows/
│   └── google-docs-sync.yml         # GitHub Actions workflow
└── GOOGLE-DOCS-SYNC-GUIDE.md        # This guide
```

## 🛠️ **How It Works**

1. **Document Access**: Reads from your Google Doc using the document ID
2. **Data Parsing**: Extracts structured data (experience, education, skills, etc.)
3. **Portfolio Update**: Updates your `index.html` with new data
4. **Backup**: Creates backup of current data before updating
5. **Data Storage**: Saves parsed data to `data/google-docs-profile.json`

## 📝 **Updating Your Resume**

### **To Update Your Portfolio:**
1. **Edit your Google Doc**: https://docs.google.com/document/d/e/2PACX-1vTOxyH3PzDT-lGe2huhuw82fDTf5dflOzycAH0ERw-d3DGuE542MVUf8pw3P8uJkA/pub
2. **Wait for automatic sync** (every 30 days)
3. **Or run manual sync**: `npm run sync-google-docs`

### **Document Format**
Your Google Doc should contain:
- **Name and Title** at the top
- **About/Summary** section
- **Experience** section with job details
- **Education** section
- **Skills** section
- **Projects** section (optional)

## 🔍 **Monitoring & Troubleshooting**

### **Check Sync Status**
```bash
# View last sync data
cat data/google-docs-profile.json

# Check backup files
ls data/backups/
```

### **Manual Sync Test**
```bash
# Test the sync process
npm run test-google-sync

# Check for errors
node scripts/google-docs-sync.js
```

### **Common Issues**
1. **Document not accessible**: Ensure the Google Doc is publicly viewable
2. **Sync fails**: Check the document ID and format
3. **Data not updating**: Verify the document structure matches expected format

## 🚀 **Next Steps**

### **Phase 1: Testing ✅**
- [x] Google Docs sync script created
- [x] Test sync completed successfully
- [x] Portfolio updated with Google Docs data
- [x] Backup system implemented

### **Phase 2: 30-Day Auto-Sync ✅**
- [x] Monthly scheduler created
- [x] GitHub Actions workflow configured
- [x] Automatic sync every 30 days
- [x] Manual sync commands available

### **Phase 3: Advanced Features (Future)**
- [ ] Google Docs API integration for real-time sync
- [ ] Document format validation
- [ ] Email notifications on sync completion
- [ ] Sync history and analytics

## 📞 **Support**

If you encounter any issues:
1. Check the sync logs in the terminal
2. Verify your Google Doc is accessible
3. Run manual sync to test: `npm run test-google-sync`
4. Check the backup files in `data/backups/`

---

**🎉 Your portfolio now automatically stays updated with your Google Docs resume every 30 days!**
