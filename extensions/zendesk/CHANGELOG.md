# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-17

### Added
- **Image Attachments**: Drag and drop images/screenshots directly into ticket replies
- **Ticket Editing**: Complete ticket management with assignment, status updates, and custom fields
- **Custom Field Support**: Configurable System and Issue custom fields with dynamic options
- **Agent Management**: Full agent list loading with pagination support for ticket reassignment
- **Status Filtering**: "Only Open Tickets" filter to hide pending/solved tickets
- **Markdown to Article**: Upload markdown files and convert them to Help Center articles
- **Category/Section Management**: Organized article creation with proper categorization
- **Bulk Operations**: Support for multiple ticket operations and efficient data loading
- **Enhanced UX**: Improved navigation with `popToRoot()` after form submissions

### Changed
- **Ticket Assignment**: Now supports both user and group assignment with full agent lists
- **Custom Fields**: Dynamic loading of field options from Zendesk API instead of hardcoded values
- **Article Creation**: Enhanced with proper permission groups and user segments
- **Form Validation**: Improved validation and error handling across all forms
- **UI Polish**: Better form layouts, descriptions, and user feedback

### Fixed
- **File Upload**: Proper handling of local file paths in Raycast environment
- **API Errors**: Better error handling for Zendesk API responses and validation
- **Performance**: Optimized agent loading and custom field operations

## [0.1.0] - 2024-08-14

### Added
- **Complete rewrite** from simple article search to comprehensive Zendesk management
- **Ticket Management**: View, reply, assign, and update status of Zendesk tickets
- **Enhanced Article Search**: Improved Help Center article search with live search
- **API Integration**: Full Zendesk API integration with proper authentication
- **Rate Limiting**: Respects Zendesk API rate limits
- **Error Handling**: Comprehensive error handling with user feedback
- **Authentication**: Secure API token-based authentication system

### Changed
- **Architecture**: Moved from web scraping to full API integration
- **UI**: Enhanced interface following Raycast design patterns
- **Commands**: Added "My Tickets" command alongside "Search Articles"

### Removed
- **Legacy search implementation**: Replaced with modern API-based approach
- **Basic URL authentication**: Replaced with secure API token system

## [0.0.1] - 2024-08-14

### Added
- Initial release with basic Help Center article search functionality
