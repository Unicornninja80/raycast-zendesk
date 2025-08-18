/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Zendesk Subdomain - Your Zendesk subdomain (e.g., company for company.zendesk.com) */
  "subdomain": string,
  /** Agent Email - Your Zendesk agent email address */
  "email": string,
  /** API Token - Your Zendesk API token */
  "apiToken": string,
  /** Enable System Field - Show System custom field in ticket editing */
  "enableSystemField": boolean,
  /** System Field ID - Your Zendesk System custom field ID (find in admin settings) */
  "systemFieldId"?: string,
  /** Enable Issue Field - Show Issue custom field in ticket editing */
  "enableIssueField": boolean,
  /** Issue Field ID - Your Zendesk Issue custom field ID (find in admin settings) */
  "issueFieldId"?: string,
  /** OpenAI API Key - Your OpenAI API key for AI-powered macro generation */
  "openaiApiKey"?: string,
  /** Enable AI Macro Generation - Use AI to analyze resolved tickets and suggest new macros */
  "enableAIMacros": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `dashboard` command */
  export type Dashboard = ExtensionPreferences & {}
  /** Preferences accessible in the `tickets` command */
  export type Tickets = ExtensionPreferences & {}
  /** Preferences accessible in the `macros-entry` command */
  export type MacrosEntry = ExtensionPreferences & {}
  /** Preferences accessible in the `ai-suggestions` command */
  export type AiSuggestions = ExtensionPreferences & {}
  /** Preferences accessible in the `test-ai` command */
  export type TestAi = ExtensionPreferences & {}
  /** Preferences accessible in the `search-zendesk-support-center` command */
  export type SearchZendeskSupportCenter = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `dashboard` command */
  export type Dashboard = {}
  /** Arguments passed to the `tickets` command */
  export type Tickets = {}
  /** Arguments passed to the `macros-entry` command */
  export type MacrosEntry = {}
  /** Arguments passed to the `ai-suggestions` command */
  export type AiSuggestions = {}
  /** Arguments passed to the `test-ai` command */
  export type TestAi = {}
  /** Arguments passed to the `search-zendesk-support-center` command */
  export type SearchZendeskSupportCenter = {}
}

