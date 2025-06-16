# CLAUDE.md - AI Development Instructions

## Project Overview
This is a Node-RED custom node package for LINE Messaging API integration that allows developers to build LINE bots using the visual Node-RED flow editor.

**Package Name**: `node-red-contrib-line-messaging-api`
**Version**: 0.4.1
**Author**: n0bisuke
**Main Purpose**: Enable LINE Bot development through Node-RED's visual programming interface

## Architecture & Key Components

### Core Dependencies
- `@line/bot-sdk`: Official LINE Bot SDK (v9.5.0)
- `express`: Web framework for HTTP endpoints
- `body-parser`: Parse incoming request bodies
- `cors`: Cross-Origin Resource Sharing middleware

### Node Types & Structure
The package provides 11 different node types for LINE Bot functionality:

#### 1. Configuration Node (`config.js`, `config.html`)
- **Purpose**: Stores LINE Bot credentials (Channel Secret, Channel Access Token)
- **Location**: `nodes/config/config.js`
- **Features**:
  - Validates credential format and length
  - Fetches bot info from LINE API
  - Stores bot name and icon URL
  - Provides HTTP Admin API endpoint at `/line-config/bot-info`

#### 2. Webhook Node (`webhook.js`, `webhook.html`)
- **Purpose**: Receives webhooks from LINE platform
- **Location**: `nodes/webhook/webhook.js`
- **Features**:
  - Creates HTTP POST endpoint for LINE webhook events
  - Processes LINE events and converts to Node-RED messages
  - Supports all LINE event types (message, postback, follow, etc.)
  - Automatically responds with 200 OK to LINE platform

#### 3. Reply Message Node (`reply.js`, `reply.html`)
- **Purpose**: Sends reply messages to LINE users
- **Location**: `nodes/reply/reply.js`
- **Features**:
  - Supports both legacy and new message formats
  - Handles text, image, and flex messages
  - Uses reply tokens from webhook events

#### 4. Push Message Node (`push.js`, `push.html`)
- **Purpose**: Sends push messages to specific users
- **Location**: `nodes/push/push.js`
- **Features**:
  - Sends messages without reply token
  - Requires target user ID
  - Supports text messages by default

#### 5. Other Nodes
- **Broadcast**: Send messages to all bot friends
- **Notify**: LINE Notify integration (deprecated)
- **Loading**: Display loading indicators
- **getProfile**: Retrieve user profile information  
- **getBotInfo**: Retrieve bot information
- **Limit**: Rate limiting functionality

## Development Guidelines

### Code Style & Patterns
- Uses ES6 modules with `module.exports`
- Consistent error handling with try-catch blocks
- All nodes follow Node-RED's standard node structure
- Credential handling through Node-RED's secure credential system

### File Organization
```
nodes/
├── config/          # Bot configuration
├── webhook/         # Webhook receiver
├── reply/           # Reply messages
├── push/            # Push messages
├── bloadcast/       # Broadcast messages
├── notify/          # LINE Notify
├── loading/         # Loading indicators
├── getProfile/      # User profile
├── getBotInfo/      # Bot information
├── limit/           # Rate limiting
└── _new/           # New implementations
    ├── reply/
    ├── push/
    └── notify/
```

### Key Implementation Details

#### Credential Management
- Channel Secret: 32-character string validation
- Channel Access Token: Minimum 150 characters
- Stored securely using Node-RED's credential system
- Validation includes whitespace and full-width character checks

#### Message Processing
- Webhook events are parsed and converted to Node-RED message format
- `msg.line.event` contains individual LINE events
- `msg.payload` contains human-readable event content
- Support for multiple message types (text, image, flex, etc.)

#### Error Handling
- Comprehensive validation in configuration UI
- API error responses are properly handled and logged
- User-friendly error messages in Japanese

## Testing & Deployment

### Available Scripts
- `npm run deploy`: Automated git commit and push
- No test suite currently implemented

### Local Development
- Playground folder contains test application
- Express server setup for local webhook testing

## Common Development Tasks

### Adding New Node Types
1. Create node directory under `nodes/`
2. Implement `.js` file with Node-RED registration
3. Create `.html` file with UI definition
4. Update `package.json` node-red section
5. Follow existing patterns for credential handling

### Modifying Existing Nodes
1. Always test with actual LINE Bot setup
2. Maintain backward compatibility
3. Update validation logic if changing credential formats
4. Test both legacy and new message formats

### Debugging
- Use `console.log` for development logging
- Check Node-RED debug panel for runtime errors
- Validate LINE webhook signatures for security
- Test with LINE Bot Simulator for development

## LINE API Integration Notes

### Webhook Events
- All events are automatically processed by webhook node
- Events include: message, postback, follow, unfollow, join, leave, etc.
- Each event generates separate Node-RED message

### Message Types
- Text messages: Simple string content
- Rich messages: JSON objects with type definitions
- Media messages: Images, videos, audio files
- Interactive messages: Buttons, carousels, flex messages

### Rate Limits & Quotas
- Push messages have monthly limits
- Reply messages are free but must use reply tokens
- Broadcast messages have restrictions based on friend count

## Security Considerations
- Never expose Channel Secret or Access Token in logs
- Use HTTPS for webhook endpoints in production
- Validate webhook signatures from LINE platform
- Store credentials securely using Node-RED's credential system

## Common Issues & Solutions
- **Token validation errors**: Check credential format and length
- **Webhook not receiving**: Verify URL and HTTP method (POST only)
- **Reply token expired**: Reply tokens are single-use and time-limited
- **Message format errors**: Ensure JSON structure matches LINE API specs

This documentation provides AI assistants with comprehensive context for maintaining and extending this LINE Bot Node-RED integration package.

---

## 【重要】getBotInfoノードの多言語化（i18n）設計方針まとめ

- UI要素のi18nは `getBotInfo.label.xxx` 形式でJSONファイルに記述し、テンプレートも同じ参照形式で統一する
- 例: `<span data-i18n="getBotInfo.label.lineConfig">LINE Bot設定</span>`
- JSON構造例:
    ```json
    {
        "getBotInfo": {
            "label": {
                "name": "名前",
                "lineConfig": "LINE Bot設定",
                "fetchBotInfo": "Bot情報を取得"
            }
        }
    }
    ```
- `data-help-name`セクションのヘルプテキストはJSONからは参照できないため、英語で直接HTMLに記述する
- ヘルプの多言語化が必要な場合は、locales/ja/getBotInfo.html等を用意しHTML分離方式で対応する
- `data-i18n`は`data-template-name`セクション内のみ有効、`data-help-name`内では動作しない
