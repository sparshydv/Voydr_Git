import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Popular sites with special capitalization
const SITE_NAMES: Record<string, string> = {
  "chatgpt.com": "ChatGPT",
  "youtube.com": "YouTube",
  "github.com": "GitHub",
  "linkedin.com": "LinkedIn",
  "stackoverflow.com": "Stack Overflow",
  "facebook.com": "Facebook",
  "instagram.com": "Instagram",
  "netflix.com": "Netflix",
  "gmail.com": "Gmail",
  "whatsapp.com": "WhatsApp",
  "twitter.com": "Twitter",
  "tiktok.com": "TikTok",
  "reddit.com": "Reddit",
  "wikipedia.org": "Wikipedia",
  "amazon.com": "Amazon",
  "ebay.com": "eBay",
  "figma.com": "Figma",
  "vscode.dev": "VS Code",
  "office.com": "Microsoft Office",
  "docs.google.com": "Google Docs",
  "leetcode.com": "LeetCode",
};

/**
 * Convert raw domain/site name to user-friendly display name
 * Examples:
 *   chatgpt.com -> ChatGPT
 *   netmirror.gg -> Netmirror
 *   internet.lpu.in -> LPU Internet
 */
export function formatSiteName(rawSite: string): string {
  if (!rawSite) return "Unknown";
  
  // Remove protocol if present
  let site = rawSite.replace(/^https?:\/\//, "").replace(/^www\./, "");
  
  // Remove trailing slashes and paths
  site = site.split('/')[0];
  
  // Check if it's in our dictionary
  if (SITE_NAMES[site]) {
    return SITE_NAMES[site];
  }
  
  // Smart parsing for unknown sites
  // Remove common TLDs
  const domain = site
    .replace(/\.(com|org|net|edu|gov|io|co|gg|cc|in|uk|us|ca|au|de|fr|jp|cn|ru)$/i, "")
    .split('.');
  
  // Capitalize each part
  const formatted = domain
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  
  return formatted;
}