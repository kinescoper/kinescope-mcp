# @kinescope/mcp

MCP Server for Kinescope API - Model Context Protocol server providing access to Kinescope video platform APIs.

## Installation

```bash
npm install -g @kinescope/mcp
```

Or use directly with npx:

```bash
npx -y @kinescope/mcp@latest --api-key YOUR_API_KEY
```

## Usage

### With Cursor

#### ✅ Default: Dynamic Tools Only (3 tools)

By default, the package uses **dynamic tools only (3 tools)**, which keeps you well under Cursor's recommended limit of **80 tools**. This provides maximum flexibility while maintaining performance.

To use all static tools (126 tools), add `--include-all-tools`:

**Default configuration (3 dynamic tools) - Recommended**
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Video API only (~26 static tools)**
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor", "--include-all-tools", "--resource", "video.*"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**All static tools (126 tools) - Use with caution**
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor", "--include-all-tools"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Tool counts by category:**
- `video.*` - ~26 tools
- `data.*` - ~3 tools  
- `live_streams.*` - ~18 tools
- `real_time.*` - ~10 tools
- `system.*` - ~69 tools

See [TOOLS-LIMIT-SOLUTION.md](./TOOLS-LIMIT-SOLUTION.md) for detailed solutions.

### With Claude Desktop

Add to your Claude Desktop MCP configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=claude"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Command Line Options

```bash
npx -y @kinescope/mcp@latest [options]

Options:
  --api-key <key>              Kinescope API key (or use KINESCOPE_API_KEY env var)
  --base-url <url>             Base URL for API (optional)
  --transport <stdio|http>     Transport type (default: stdio)
  --port <number>              Port for HTTP transport (default: 3000)
  --client <type>              MCP client type: cursor, claude, claude-code, openai-agents, infer (default: infer)
  --include-dynamic-tools      Include dynamic tools (default: true)
  --include-all-tools          Include all static tools (default: false)
  --resource <pattern>         Filter by resource category (e.g., video.*, data.*, live_streams.*)
  --help                       Show help
```

### Resource Filtering

Filter tools by category:

```bash
# Only Video API tools
npx -y @kinescope/mcp@latest --resource video.*

# Video and Analytics tools
npx -y @kinescope/mcp@latest --resource video.* --resource data.*

# Multiple categories
npx -y @kinescope/mcp@latest --resource video.*,data.*,live_streams.*
```

Available resource categories:
- `video.*` - Video APIs (videos, posters, subtitles, annotations)
- `data.*` - Analytics and metrics APIs
- `live_streams.*` - Live streaming APIs
- `real_time.*` - Real-time/Speak APIs (video calls, rooms)
- `system.*` - System APIs (projects, tags, webhooks, players, etc.)

## Features

- ✅ **126+ API endpoints** covering all Kinescope API functionality
- ✅ **Client compatibility** - Automatic adaptation for Cursor, Claude, Claude Code, OpenAI Agents
- ✅ **Resource filtering** - Filter tools by category (video, data, live_streams, etc.)
- ✅ **Dynamic tools** - Universal tools for discovering and invoking any endpoint
- ✅ **HTTP transport** - Remote access via HTTP (optional)
- ✅ **Analytics support** - Video performance metrics, country analytics, engagement data

## API Coverage

### Video APIs
- List and manage videos
- Video operations (copy, cut, concat)
- Posters, subtitles, annotations
- Video metadata and status

### Analytics APIs
- Custom analytics with grouping
- Overview metrics with timeline
- Performance by country, device, video
- Engagement metrics

### Live Streaming APIs
- Live events management
- Restreams configuration
- QoS metrics
- Event scheduling

### System APIs
- Projects and folders
- Tags and webhooks
- Players configuration
- Moderators and playlists
- Access tokens and file requests

## Examples

### Get video performance metrics

```typescript
// Using the MCP tool
kinescope_overview_overview_overview({
  from: '2024-12-01',
  to: '2024-12-14',
  group_time: 'day'
})
```

### List videos with filters

```typescript
kinescope_videos_videos_list({
  page: '1',
  per_page: '10',
  order: 'created_at.desc',
  status: ['done']
})
```

### Get analytics by country

```typescript
kinescope_analytics_custom({
  from: '2024-11-01',
  to: '2024-12-01',
  group: 'month',
  group_entities: 'country_code',
  fields: 'country_code,view,unique_view,watch_time',
  order: 'view.desc'
})
```

## License

MIT

## Links

- [Kinescope API Documentation](https://documenter.getpostman.com/view/10589901/TVCcXpNM)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Local Installation Guide (Russian)](./INSTALLATION-LOCAL.md) - Подробное руководство по локальной установке
