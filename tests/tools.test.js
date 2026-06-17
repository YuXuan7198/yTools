import { describe, it, expect } from 'vitest'
import {
  encodeUrl, decodeUrl,
  formatJson, compressJson,
  encodeBase64, decodeBase64,
  timestampToDate, dateToTimestamp,
  unicodeEncode, unicodeDecode,
  hashText,
  testRegex,
} from '../src/utils/tools.js'

describe('URL encode/decode', () => {
  it('encodes a URL component', () => {
    expect(encodeUrl('hello world')).toBe('hello%20world')
  })
  it('encodes Chinese characters', () => {
    expect(encodeUrl('你好')).toBe('%E4%BD%A0%E5%A5%BD')
  })
  it('decodes an encoded URL component', () => {
    expect(decodeUrl('hello%20world')).toBe('hello world')
  })
  it('round-trips', () => {
    const original = 'hello world 你好 👋'
    expect(decodeUrl(encodeUrl(original))).toBe(original)
  })
  it('decode returns original on invalid input', () => {
    expect(decodeUrl('%E0%A4')).toBe('%E0%A4')
  })
})

describe('JSON format/compress', () => {
  it('pretty-prints JSON', () => {
    expect(formatJson('{"a":1,"b":2}')).toBe('{\n  "a": 1,\n  "b": 2\n}')
  })
  it('compresses formatted JSON', () => {
    expect(compressJson('{\n  "a": 1\n}')).toBe('{"a":1}')
  })
  it('formatJson returns error for invalid JSON', () => {
    expect(formatJson('{invalid')).toBe('Invalid JSON')
  })
  it('compressJson returns error for invalid JSON', () => {
    expect(compressJson('{invalid')).toBe('Invalid JSON')
  })
})

describe('Base64 encode/decode', () => {
  it('encodes ASCII text', () => {
    expect(encodeBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=')
  })
  it('decodes ASCII text', () => {
    expect(decodeBase64('SGVsbG8gV29ybGQ=')).toBe('Hello World')
  })
  it('round-trips UTF-8 text', () => {
    const original = '你好世界 🌍'
    expect(decodeBase64(encodeBase64(original))).toBe(original)
  })
  it('handles empty string', () => {
    expect(encodeBase64('')).toBe('')
    expect(decodeBase64('')).toBe('')
  })
})

describe('Timestamp conversion', () => {
  it('converts timestamp (seconds) to date string', () => {
    const result = timestampToDate(1700000000)
    expect(result).toContain('2023')
  })
  it('converts timestamp (milliseconds) to date string', () => {
    const result = timestampToDate(1700000000000)
    expect(result).toContain('2023')
  })
  it('converts date string to timestamp in seconds', () => {
    const ts = dateToTimestamp('2023-11-15T00:00:00')
    expect(ts).toBeGreaterThan(1699920000)
  })
  it('returns null for invalid date string', () => {
    expect(dateToTimestamp('not a date')).toBeNull()
  })
  it('returns error for invalid timestamp', () => {
    expect(timestampToDate('abc')).toBe('Invalid timestamp')
    expect(timestampToDate('')).toBe('Invalid timestamp')
  })
})

describe('Unicode encode/decode', () => {
  it('encodes CJK to \\uXXXX', () => {
    expect(unicodeEncode('你好')).toBe('\\u4f60\\u597d')
  })
  it('decodes \\uXXXX to characters', () => {
    expect(unicodeDecode('\\u4f60\\u597d')).toBe('你好')
  })
  it('round-trips mixed content', () => {
    const original = 'Hello 世界'
    expect(unicodeDecode(unicodeEncode(original))).toBe(original)
  })
  it('keeps ASCII unchanged', () => {
    expect(unicodeEncode('ABC')).toBe('ABC')
  })
})

describe('Hash computation', () => {
  it('computes SHA-1', async () => {
    const r = await hashText('hello', 'SHA-1')
    expect(r).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d')
  })
  it('computes SHA-256', async () => {
    const r = await hashText('hello', 'SHA-256')
    expect(r).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
  })
  it('computes SHA-512', async () => {
    const r = await hashText('hello', 'SHA-512')
    expect(r).toBe('9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043')
  })
  it('returns empty for empty input', async () => {
    expect(await hashText('', 'SHA-256')).toBe('')
  })
  it('rejects unsupported algorithm', async () => {
    await expect(hashText('hello', 'MD5')).rejects.toThrow()
  })
})

describe('Regex testing', () => {
  it('finds global matches', () => {
    const r = testRegex('\\d+', 'g', 'abc 123 def 456')
    expect(r.matches).toEqual(['123', '456'])
  })
  it('returns empty matches for no match', () => {
    const r = testRegex('\\d+', 'g', 'no numbers')
    expect(r.matches).toEqual([])
  })
  it('returns error for invalid regex', () => {
    const r = testRegex('[invalid', 'g', 'test')
    expect(r.error).toBeTruthy()
  })
  it('reports flags', () => {
    const r = testRegex('hello', 'gi', 'Hello hello')
    expect(r.flags).toBe('gi')
  })
})
