# Zendesk for Raycast

A comprehensive Raycast extension to manage your Zendesk tickets and Help Center articles with advanced features.

## Features

### 🎫 My Tickets
- **View & manage** your assigned Zendesk tickets
- **Reply to tickets** with public/private comments
- **📎 Image attachments** - Upload screenshots and images to ticket replies
- **✏️ Edit tickets** - Change status, reassign tickets, and set custom fields
- **🔄 Ticket assignment** - Assign to users or groups
- **📋 Custom fields** - Configurable System and Issue fields
- **🌐 Open in browser** - Quick access to full ticket view

### 📚 Help Center
- **🔍 Search** Help Center articles
- **📝 Create articles** from Markdown files
- **🔒 Visibility control** - Public or agent-only articles
- **📂 Category & section** organization
- **🌐 Open in browser** and copy URLs

## Setup

### Basic Configuration
1. Install the extension from Raycast Store (or run locally)
2. Configure your Zendesk settings in Raycast preferences:
   - **Subdomain**: Your Zendesk subdomain (e.g., `company` for company.zendesk.com)
   - **Email**: Your Zendesk agent email address
   - **API Token**: Generate from Zendesk Admin → Apps & integrations → APIs → Zendesk API

### Custom Ticket Fields Configuration

The extension supports configurable custom fields for ticket editing. To set up custom fields:

#### 1. Find Your Custom Field IDs
1. Go to **Zendesk Admin** → **Objects and rules** → **Tickets** → **Fields**
2. Click on your custom field (e.g., "System", "Issue")
3. Note the **Field ID** from the URL or field settings (e.g., `123456`)

#### 2. Configure in Raycast
In Raycast preferences for the Zendesk extension:

**System Field:**
- ✅ **Enable System Field**: Check to show System field in ticket editing
- **System Field ID**: Enter your System custom field ID (e.g., `123456`)

**Issue Field:**
- ✅ **Enable Issue Field**: Check to show Issue field in ticket editing  
- **Issue Field ID**: Enter your Issue custom field ID (e.g., `123457`)

#### 3. Field Options
The extension includes predefined options for common field types:

**System Field Options:**
- Windows, macOS, Linux, iOS, Android, Web Browser, Other

**Issue Field Options:**
- Bug, Feature Request, Question, Configuration, Performance, Security, Other

> **💡 Tip**: You can disable fields you don't use by unchecking the "Enable" option in preferences.

## Usage

### Tickets
- **⌘ + Space** → Type "My Tickets" to view assigned tickets
- **↵ Enter** on ticket → View details and reply
- **⌘ + ↵** → Edit ticket (status, assignment, custom fields)
- **📎 Drag images** onto Raycast when replying to attach files

### Help Center  
- **⌘ + Space** → Type "Help Center" to search articles
- **⌘ + N** → Create new article from Markdown file
- **📄 Drag .md files** onto Raycast file picker for easy upload

## Development

Built with:
- TypeScript
- React
- Raycast API

## License

MIT
