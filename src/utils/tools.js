// Utility functions for DevToolbox tools.
// All encoding/decoding/hashing logic lives here as pure functions.
// Components only handle UI binding.

// --- URL ---
export function encodeUrl(text) {
  return encodeURIComponent(text)
}

export function decodeUrl(text) {
  try { return decodeURIComponent(text) }
  catch { return text }
}

// --- JSON ---
export function formatJson(text) {
  try { return JSON.stringify(JSON.parse(text), null, 2) }
  catch { return 'Invalid JSON' }
}

export function compressJson(text) {
  try { return JSON.stringify(JSON.parse(text)) }
  catch { return 'Invalid JSON' }
}

// --- Base64 ---
export function encodeBase64(text) {
  if (!text) return ''
  const bytes = new TextEncoder().encode(text)
  const bin = String.fromCharCode(...bytes)
  return btoa(bin)
}

export function decodeBase64(text) {
  if (!text) return ''
  try {
    const bin = atob(text)
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch { return '' }
}

// --- Timestamp ---
export function timestampToDate(ts) {
  const str = String(ts).trim()
  if (!str || !/^\d+$/.test(str)) return 'Invalid timestamp'
  let num = Number(str)
  if (num < 10000000000) num *= 1000
  const d = new Date(num)
  if (isNaN(d.getTime())) return 'Invalid timestamp'
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function dateToTimestamp(dateStr) {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return Math.floor(d.getTime() / 1000)
}

// --- Unicode ---
export function unicodeEncode(text) {
  return text.replace(/[^\x00-\x7F]/g, ch => {
    const hex = ch.codePointAt(0).toString(16)
    return '\\u' + '0'.repeat(4 - hex.length) + hex
  })
}

export function unicodeDecode(text) {
  return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16)))
}

// --- Hash ---
// Supported algorithms: SHA-1, SHA-256, SHA-512 (MD5 is NOT supported by Web Crypto API)
const SUPPORTED_HASH_ALGORITHMS = new Set(['SHA-1', 'SHA-256', 'SHA-512'])

export async function hashText(text, algorithm) {
  if (!text) return ''
  if (!SUPPORTED_HASH_ALGORITHMS.has(algorithm)) {
    throw new Error(`Unsupported algorithm: ${algorithm}. Supported: SHA-1, SHA-256, SHA-512`)
  }
  const buf = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest(algorithm, buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// --- Regex ---
export function testRegex(pattern, flags, text) {
  try {
    const re = new RegExp(pattern, flags)
    const matches = []
    if (flags.includes('g')) {
      let m
      while ((m = re.exec(text)) !== null) {
        matches.push(m[0])
        if (m[0] === '') re.lastIndex++
      }
    } else {
      const m = re.exec(text)
      if (m) matches.push(m[0])
    }
    return { matches, flags, error: null }
  } catch (e) {
    return { matches: [], flags, error: e.message }
  }
}
