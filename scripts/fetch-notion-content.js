#!/usr/bin/env node

const { Client } = require('@notionhq/client');
const fs = require('fs').promises;
const path = require('path');

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Content structure mapping
const CONTENT_MAPPING = {
  'hero-section': 'hero',
  'about-section': 'about',
  'experience-section': 'experience',
  'projects-section': 'projects',
  'contact-section': 'contact'
};

async function fetchNotionContent() {
  try {
    console.log('🔍 Fetching content from Notion...');
    
    // Fetch database entries
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: 'Order',
          direction: 'ascending',
        },
      ],
    });

    const content = {};
    let hasChanges = false;

    // Process each page
    for (const page of response.results) {
      const pageId = page.id;
      const pageContent = await fetchPageContent(pageId);
      
      if (pageContent) {
        const sectionType = getSectionType(page.properties);
        if (sectionType && CONTENT_MAPPING[sectionType]) {
          content[CONTENT_MAPPING[sectionType]] = pageContent;
          
          // Check if content has changed
          const currentContent = await getCurrentContent(sectionType);
          if (JSON.stringify(pageContent) !== JSON.stringify(currentContent)) {
            hasChanges = true;
            console.log(`📝 Content changed for section: ${sectionType}`);
          }
        }
      }
    }

    // Save content to file
    await saveContent(content);
    
    // Set output for GitHub Actions
    console.log(`::set-output name=changed::${hasChanges}`);
    
           console.log('✅ Profile content fetch completed');
    return { content, hasChanges };
    
  } catch (error) {
    console.error('❌ Error fetching Notion content:', error);
    throw error;
  }
}

async function fetchPageContent(pageId) {
  try {
    // Fetch page properties
    const page = await notion.pages.retrieve({ page_id: pageId });
    
    // Fetch page blocks
    const blocks = await notion.blocks.children.list({ block_id: pageId });
    
    return {
      properties: page.properties,
      blocks: blocks.results,
      lastEdited: page.last_edited_time
    };
    
  } catch (error) {
    console.error(`Error fetching page ${pageId}:`, error);
    return null;
  }
}

function getSectionType(properties) {
  // Extract section type from page properties
  if (properties.Section && properties.Section.select) {
    return properties.Section.select.name;
  }
  return null;
}

async function getCurrentContent(sectionType) {
  try {
    const contentPath = path.join(__dirname, '../data/content.json');
    const content = JSON.parse(await fs.readFile(contentPath, 'utf8'));
    return content[CONTENT_MAPPING[sectionType]] || null;
  } catch (error) {
    return null;
  }
}

async function saveContent(content) {
  const dataDir = path.join(__dirname, '../data');
  const contentPath = path.join(dataDir, 'content.json');
  
  // Ensure data directory exists
  await fs.mkdir(dataDir, { recursive: true });
  
  // Save content with timestamp
  const contentData = {
    content,
    lastUpdated: new Date().toISOString(),
    version: Date.now()
  };
  
  await fs.writeFile(contentPath, JSON.stringify(contentData, null, 2));
  console.log('💾 Content saved to data/content.json');
}

// Convert Notion blocks to HTML
function convertBlocksToHTML(blocks) {
  let html = '';
  
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        html += `<p>${convertRichText(block.paragraph.rich_text)}</p>`;
        break;
        
      case 'heading_1':
        html += `<h1>${convertRichText(block.heading_1.rich_text)}</h1>`;
        break;
        
      case 'heading_2':
        html += `<h2>${convertRichText(block.heading_2.rich_text)}</h2>`;
        break;
        
      case 'heading_3':
        html += `<h3>${convertRichText(block.heading_3.rich_text)}</h3>`;
        break;
        
      case 'bulleted_list_item':
        html += `<li>${convertRichText(block.bulleted_list_item.rich_text)}</li>`;
        break;
        
      case 'numbered_list_item':
        html += `<li>${convertRichText(block.numbered_list_item.rich_text)}</li>`;
        break;
        
      case 'quote':
        html += `<blockquote>${convertRichText(block.quote.rich_text)}</blockquote>`;
        break;
        
      case 'code':
        html += `<pre><code>${block.code.rich_text[0]?.plain_text || ''}</code></pre>`;
        break;
        
      case 'image':
        if (block.image.type === 'external') {
          html += `<img src="${block.image.external.url}" alt="${block.image.caption?.[0]?.plain_text || ''}" />`;
        }
        break;
        
      case 'divider':
        html += '<hr />';
        break;
        
      default:
        console.log(`Unsupported block type: ${block.type}`);
    }
  }
  
  return html;
}

function convertRichText(richText) {
  if (!richText || !Array.isArray(richText)) {
    return '';
  }
  
  return richText.map(text => {
    let content = text.plain_text;
    
    if (text.annotations.bold) {
      content = `<strong>${content}</strong>`;
    }
    
    if (text.annotations.italic) {
      content = `<em>${content}</em>`;
    }
    
    if (text.annotations.strikethrough) {
      content = `<del>${content}</del>`;
    }
    
    if (text.annotations.code) {
      content = `<code>${content}</code>`;
    }
    
    if (text.href) {
      content = `<a href="${text.href}">${content}</a>`;
    }
    
    return content;
  }).join('');
}

// Extract structured data from Notion properties
function extractStructuredData(properties) {
  const data = {};
  
  for (const [key, value] of Object.entries(properties)) {
    switch (value.type) {
      case 'title':
        data[key] = value.title[0]?.plain_text || '';
        break;
        
      case 'rich_text':
        data[key] = value.rich_text[0]?.plain_text || '';
        break;
        
      case 'select':
        data[key] = value.select?.name || '';
        break;
        
      case 'multi_select':
        data[key] = value.multi_select.map(item => item.name);
        break;
        
      case 'date':
        data[key] = value.date?.start || '';
        break;
        
      case 'number':
        data[key] = value.number;
        break;
        
      case 'url':
        data[key] = value.url || '';
        break;
        
      case 'email':
        data[key] = value.email || '';
        break;
        
      case 'phone_number':
        data[key] = value.phone_number || '';
        break;
        
      default:
        console.log(`Unsupported property type: ${value.type}`);
    }
  }
  
  return data;
}

// Main execution
if (require.main === module) {
  fetchNotionContent()
    .then(({ content, hasChanges }) => {
      console.log(`Content sync completed. Changes detected: ${hasChanges}`);
      process.exit(hasChanges ? 0 : 1);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = {
  fetchNotionContent,
  convertBlocksToHTML,
  extractStructuredData
};
