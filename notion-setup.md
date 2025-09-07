# 🔄 Notion Integration Setup Guide

## **Overview**
This guide will help you set up Notion as your Content Management System (CMS) for your portfolio website. Once configured, you can update your website content by simply editing a Notion document.

## **Step 1: Create Notion Integration**

1. **Go to**: https://www.notion.so/my-integrations
2. **Click "New integration"**
3. **Fill in details**:
   - **Name**: `Kunj Chacha Portfolio CMS`
   - **Description**: `Content management system for portfolio website`
   - **Workspace**: Select your workspace
4. **Click "Submit"**
5. **Copy the Integration Token** (starts with `secret_`)

## **Step 2: Create Notion Database**

1. **Create a new page** in your Notion workspace
2. **Add a database** (type `/database` and select "Table")
3. **Configure database properties**:

### **Required Properties:**
- **Name** (Title) - Page title
- **Section** (Select) - Options: `hero-section`, `about-section`, `experience-section`, `projects-section`, `contact-section`
- **Order** (Number) - Display order (1, 2, 3, etc.)
- **Content** (Text) - Main content
- **Last Updated** (Date) - Auto-updated

### **Optional Properties:**
- **Status** (Select) - Draft, Published, Archived
- **Tags** (Multi-select) - For categorization

## **Step 3: Add Sample Content**

### **Hero Section**
- **Name**: Hero Section
- **Section**: hero-section
- **Order**: 1
- **Content**: 
```
Name: KUNJ CHACHA
Title: Program Manager & Process Transformation Expert
Description: Transforming processes, maximizing efficiency & driving strategic growth. Results-driven business leader with 10+ years of experience delivering INR 3.6 Cr+ in sales while improving operational efficiency by 40%.
Stats: [{"value": "10+", "label": "Years Experience"}, {"value": "INR 3.6 Cr+", "label": "Sales Delivered"}, {"value": "40%", "label": "Efficiency Gain"}, {"value": "15-24", "label": "Team Members Led"}]
```

### **About Section**
- **Name**: About Section
- **Section**: about-section
- **Order**: 2
- **Content**: 
```
Title: Strategic Business Leader
Description: I'm a results-driven business leader with over a decade of experience in sales, operations, project management, and process automation across diverse industries.
Skills: {"Leadership": ["Cross-functional Team Leadership", "Stakeholder Management", "Strategic Planning"], "Process": ["Workflow Automation", "Process Transformation", "Project Management"], "Sales": ["B2B Sales Strategy", "Revenue Growth", "Salesforce CRM"], "Technical": ["GitHub Copilot", "API Security", "Data Analytics"]}
```

## **Step 4: Share Database with Integration**

1. **Click "Share"** on your database
2. **Click "Invite"**
3. **Search for your integration name**: `Kunj Chacha Portfolio CMS`
4. **Select it and click "Invite"**
5. **Copy the Database ID** from the URL (32 characters after the last `/`)

## **Step 5: Configure GitHub Secrets**

1. **Go to your GitHub repository**: https://github.com/kunjchacha/profile
2. **Go to Settings > Secrets and variables > Actions**
3. **Add these secrets**:
   - **Name**: `NOTION_TOKEN`
   - **Value**: Your integration token (starts with `secret_`)
4. **Add another secret**:
   - **Name**: `NOTION_DATABASE_ID`
   - **Value**: Your database ID (32 characters)

## **Step 6: Test the Integration**

1. **Edit content** in your Notion database
2. **Go to GitHub repository > Actions**
3. **Click "Notion to Profile Sync"**
4. **Click "Run workflow"**
5. **Check the logs** to see if content was synced

## **Step 7: Automatic Updates**

The workflow is configured to run:
- **Every 6 hours** automatically
- **Manually** when you trigger it
- **Via webhook** when you update Notion (requires additional setup)

## **Content Structure Examples**

### **Experience Entry**
```
Title: Program Manager
Company: Blenheim Chalcot India
Duration: July 2023 - Present
Focus: Process Automations & Transformation | Operational Excellence
Achievements: ["Led end-to-end automation initiatives", "Spearheaded campus recruitment drives", "Directed 15-member cross-functional teams"]
```

### **Project Entry**
```
Title: Process Automation Initiative
Company: Blenheim Chalcot India
Description: Led end-to-end automation of travel approvals, SOW, and service packs workflows
Metrics: ["40% Efficiency Gain", "200+ Hours Saved"]
Technologies: ["Workflow Automation", "Process Optimization"]
```

## **Troubleshooting**

### **Common Issues:**
1. **Integration not found**: Make sure you shared the database with the integration
2. **Token invalid**: Check that you copied the full token
3. **Database ID wrong**: Verify the 32-character ID from the URL
4. **Content not updating**: Check GitHub Actions logs for errors

### **Manual Sync:**
If automatic sync isn't working, you can manually trigger:
1. Go to GitHub repository > Actions
2. Select "Notion to Profile Sync"
3. Click "Run workflow"

---

**Need help?** The integration is designed to be simple - just edit Notion and your website updates automatically!
