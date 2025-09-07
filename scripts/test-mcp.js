#!/usr/bin/env node

// Minimal test MCP server
process.stdin.on('data', (data) => {
  try {
    const request = JSON.parse(data.toString());
    
    if (request.method === 'initialize') {
      process.stdout.write(JSON.stringify({
        jsonrpc: "2.0",
        id: request.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "test-mcp", version: "1.0.0" }
        }
      }) + '\n');
    } else if (request.method === 'tools/list') {
      process.stdout.write(JSON.stringify({
        jsonrpc: "2.0",
        id: request.id,
        result: {
          tools: [
            {
              name: "test-tool",
              description: "A test tool",
              inputSchema: {
                type: "object",
                properties: {},
                required: []
              }
            }
          ]
        }
      }) + '\n');
    } else if (request.method === 'tools/call') {
      process.stdout.write(JSON.stringify({
        jsonrpc: "2.0",
        id: request.id,
        result: {
          content: [
            {
              type: "text",
              text: "Test tool executed successfully"
            }
          ]
        }
      }) + '\n');
    }
  } catch (error) {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: error.message }
    }) + '\n');
  }
});

