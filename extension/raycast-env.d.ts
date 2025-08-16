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
  "issueFieldId"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `dashboard` command */
  export type Dashboard = ExtensionPreferences & {}
  /** Preferences accessible in the `tickets` command */
  export type Tickets = ExtensionPreferences & {}
  /** Preferences accessible in the `search-zendesk-support-center` command */
  export type SearchZendeskSupportCenter = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `dashboard` command */
  export type Dashboard = {}
  /** Arguments passed to the `tickets` command */
  export type Tickets = {}
  /** Arguments passed to the `search-zendesk-support-center` command */
  export type SearchZendeskSupportCenter = {}
}

