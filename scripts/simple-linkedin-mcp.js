#!/usr/bin/env node

/**
 * Simple LinkedIn MCP Server
 * A minimal MCP server that works with Cursor
 */

const fs = require('fs').promises;
const path = require('path');

// Simple MCP server implementation
class SimpleLinkedInMCP {
  constructor() {
    this.tools = [
      {
        name: "get-linkedin-profile",
        description: "Get LinkedIn profile data",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "search-linkedin-people",
        description: "Search LinkedIn profiles",
        inputSchema: {
          type: "object",
          properties: {
            keywords: {
              type: "string",
              description: "Search keywords"
            }
          },
          required: []
        }
      }
    ];
  }

  async handleRequest(request) {
    try {
      const { method, params, id } = request;

      switch (method) {
        case 'initialize':
          return {
            jsonrpc: "2.0",
            id,
            result: {
              protocolVersion: "2024-11-05",
              capabilities: {
                tools: {}
              },
              serverInfo: {
                name: "simple-linkedin-mcp",
                version: "1.0.0"
              }
            }
          };

        case 'tools/list':
          return {
            jsonrpc: "2.0",
            id,
            result: {
              tools: this.tools
            }
          };

        case 'tools/call':
          const { name, arguments: args } = params;
          let result;

          switch (name) {
            case 'get-linkedin-profile':
              result = await this.getLinkedInProfile();
              break;
            case 'search-linkedin-people':
              result = await this.searchLinkedInPeople(args);
              break;
            default:
              throw new Error(`Unknown tool: ${name}`);
          }

          return {
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2)
                }
              ]
            }
          };

        default:
          return {
            jsonrpc: "2.0",
            id,
            error: {
              code: -32601,
              message: `Method not found: ${method}`
            }
          };
      }
    } catch (error) {
      return {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: -32603,
          message: error.message
        }
      };
    }
  }

  async getLinkedInProfile() {
    try {
      // Try to load existing LinkedIn data
      const dataPath = path.join(__dirname, '../data/linkedin-profile.json');
      try {
        const data = await fs.readFile(dataPath, 'utf8');
        const profileData = JSON.parse(data);
        return {
          success: true,
          profile: profileData,
          source: "cached_data",
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        // Return sample data if no cached data
        return {
          success: true,
          profile: {
            name: "Kunj Chacha",
            headline: "Program Manager at Blenheim Chalcot | Building Innovative Technology Businesses",
            location: "Mumbai, Maharashtra, India",
            about: "Results-driven business leader with 10+ years of experience in sales, operations, project management, and process automation across diverse industries. Proven ability to lead cross-functional teams, optimize workflows, and drive revenue growth, having successfully delivered INR 3.6 Cr+ in sales while improving operational efficiency by 40%.",
            experience: [
              {
                title: "Program Manager",
                company: "Blenheim Chalcot India",
                duration: "July 2023 - Present",
                description: "Leading process automation initiatives and operational excellence. Led end-to-end automation initiatives resulting in 40% efficiency gain. Spearheaded campus recruitment drives with 50+ hires and 95% retention. Generated INR 3.64 Cr revenue in 6 months. Managed cross-functional teams of 15-24 members."
              },
              {
                title: "Senior Manager, Strategic Sales",
                company: "Whitehat Jr",
                duration: "2021 - 2022",
                description: "Drove UK market expansion generating INR 3.64 Cr revenue, exceeding targets by 20%. Achieved average deal size of INR 85,000 with strategic sales approach."
              },
              {
                title: "Business Head",
                company: "Flint Chem",
                duration: "2020 - 2021",
                description: "Led process automation and business expansion initiatives. Optimized operational workflows for enhanced efficiency."
              },
              {
                title: "Manager, Sales & Retention",
                company: "Tech Mahindra",
                duration: "2019 - 2020",
                description: "Led process transformation and client management. Improved customer retention through strategic initiatives."
              }
            ],
            education: [
              {
                school: "Indian Institute of Management (IIM)",
                degree: "Master of Business Administration (MBA)",
                duration: "2015 - 2017",
                description: "Specialization in Operations Management and Strategic Leadership"
              },
              {
                school: "Mumbai University",
                degree: "Bachelor of Technology (B.Tech)",
                duration: "2014 - 2018",
                description: "Computer Science Engineering"
              }
            ],
            skills: [
              "Project Management",
              "Strategic Planning", 
              "Process Optimization",
              "Team Leadership",
              "Business Analysis",
              "Stakeholder Management",
              "Process Transformation",
              "Salesforce CRM",
              "Data Analytics",
              "Revenue Growth"
            ],
            lastUpdated: new Date().toISOString()
          },
          source: "enhanced_sample_data",
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      throw new Error(`Profile retrieval failed: ${error.message}`);
    }
  }

  async searchLinkedInPeople(args) {
    try {
      const profile = await this.getLinkedInProfile();
      
      // Simple search implementation
      let results = [profile.profile];
      
      if (args.keywords) {
        const keywords = args.keywords.toLowerCase();
        const filtered = results.filter(profile => 
          profile.name.toLowerCase().includes(keywords) ||
          profile.headline.toLowerCase().includes(keywords) ||
          profile.about.toLowerCase().includes(keywords)
        );
        results = filtered;
      }

      return {
        success: true,
        results: results,
        searchParams: args,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async start() {
    // Handle stdin for MCP communication
    process.stdin.on('data', async (data) => {
      try {
        const request = JSON.parse(data.toString());
        const response = await this.handleRequest(request);
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (error) {
        process.stdout.write(JSON.stringify({
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32700,
            message: `Parse error: ${error.message}`
          }
        }) + '\n');
      }
    });
  }
}

// Start the server
const server = new SimpleLinkedInMCP();
server.start().catch(console.error);