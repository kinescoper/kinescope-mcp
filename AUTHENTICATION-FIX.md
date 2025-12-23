# Authentication Fix for Analytics Endpoints

## Problem

The MCP server wasn't passing the API token correctly for analytics endpoints, resulting in authentication errors:
```
"api_token is required"
```

## Root Cause

The Kinescope API accepts authentication via:
1. Query parameter: `?api_token=...`
2. Header: `X-API-Token: ...`
3. Header: `Authorization: Bearer ...`

The client was only sending `Authorization: Bearer` header, but the API might prefer or require `X-API-Token` in some cases.

## Solution

### Changes Made to `/src/client.ts`:

1. **Added X-API-Token header** - Now sends both `Authorization: Bearer` and `X-API-Token` headers:
   ```typescript
   headers: {
     'Authorization': `Bearer ${this.apiKey}`,
     'X-API-Token': this.apiKey, // Also send as X-API-Token header
     'Content-Type': 'application/json',
   }
   ```

2. **Added API key validation** - Validates that API key is present and not empty:
   ```typescript
   if (!options.apiKey || options.apiKey.trim() === '') {
     throw new Error('Kinescope API key is required...');
   }
   ```

3. **Improved error messages** - Better error messages for authentication failures:
   ```typescript
   if (status === 401 || (errorData && errorData.message && errorData.message.includes('api_token'))) {
     throw new Error(
       `Authentication failed: API token is required. ` +
       `Please ensure KINESCOPE_API_KEY environment variable is set correctly...`
     );
   }
   ```

## Verification

To verify the fix works:

1. **Check your Cursor MCP configuration** - Ensure the API key is set in the `env` section:
   ```json
   {
     "mcpServers": {
       "kinescope": {
         "command": "npx",
         "args": ["-y", "@kinescope/mcp@latest", "--client=cursor"],
         "env": {
           "KINESCOPE_API_KEY": "your_actual_api_key_here"
         }
       }
     }
   }
   ```

2. **Restart Cursor** - After updating the configuration, restart Cursor to reload the MCP server.

3. **Test analytics endpoint**:
   ```
   Find all videos containing "Kinescope" from Q4 2024 and get their analytics
   ```

## Testing

You can test the fix locally:

```bash
cd /Users/insty/test_mcp/mcp
npm run build
export KINESCOPE_API_KEY="your_api_key"
node dist/index.js --api-key=$KINESCOPE_API_KEY
```

## Next Steps

1. **Build and test** the changes
2. **Commit and push** to the repository
3. **Publish** updated npm package if needed
4. **Update Cursor configuration** with the correct API key
5. **Restart Cursor** and test analytics queries

## Additional Notes

- The API key should be set in the `env` section of Cursor's MCP configuration
- Both `Authorization: Bearer` and `X-API-Token` headers are now sent for maximum compatibility
- Error messages now provide clear guidance when authentication fails

