import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { renderWaitlistEmail, type WaitlistEmailKind } from './waitlist-email.ts'

const options = {
  kind: 'welcome' as const,
  referralCode: 'preview_' + '0'.repeat(24),
  publicUrl: 'https://example.com/launch/',
  unsubscribeUrl: 'https://example.com/launch/api/waitlist/unsubscribe?token=signed-preview',
}
const productUrl = 'https://example.com/launch/#product'
const artworkUrl = 'https://example.com/launch/media/email/forty/motion-13.jpg'

function anchors(html: string) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((match) => {
    const href = match[1].match(/\bhref="([^"]*)"/)?.[1]
    assert.ok(href, 'Every email anchor has a destination')
    return {
      href: href.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
      className: match[1].match(/\bclass="([^"]*)"/)?.[1],
      text: match[2].replace(/<[^>]+>/g, ''),
    }
  })
}

test('welcome preserves the selected Ink Margin artwork, saved spot and one product action', () => {
  const email = renderWaitlistEmail(options)
  const links = anchors(email.html)
  const primary = links.filter((link) => link.className === 'button')
  const share = links.filter((link) => link.href.startsWith('mailto:'))
  assert.match(email.subject, /Your own Jarvis/)
  assert.match(email.html, /A Jarvis<br>of your<br>own\./)
  assert.match(email.text, /A Jarvis of your own/)
  assert.match(email.html, /Your spot is saved\. We’ll email you when early access opens\./)
  assert.match(email.text, /Your spot is saved\. We’ll email you when early access opens\./)
  assert.match(email.text, /When 3 friends join through your link, you’ll get priority early access\./)
  assert.deepEqual(primary.map((link) => link.href), [productUrl])
  assert.match(primary[0].text, /^Take a closer look/)
  assert.equal(links.filter((link) => link.href === productUrl).length, 1)
  assert.equal(share.length, 1)
  assert.equal(share[0].className, 'footer-link', 'Sharing stays in the quiet footer, not the primary action')
  assert.equal(new URL(share[0].href).searchParams.get('subject'), 'Join me on Open Swarm')
  assert.ok(email.html.includes(`background="${artworkUrl}"`))
  assert.ok(email.html.includes(`src="${artworkUrl}"`), 'Outlook receives the same selected artwork through VML')
  assert.ok(email.html.includes('src="https://example.com/launch/media/logo-256.png"'))
  assert.doesNotMatch(email.html, /jarvis-workspace\.jpg|motion-(?!13\.)\d+\.jpg/)
  assert.ok(email.text.includes(`Take a closer look: ${productUrl}`))
  assert.ok(Buffer.byteLength(email.html) < 25_000)
})

test('each recipient gets their own referral in the personal link, share message and plain text', () => {
  const codes = ['A'.repeat(32), 'B'.repeat(32)]
  for (const [index, referralCode] of codes.entries()) {
    const email = renderWaitlistEmail({ ...options, referralCode, publicUrl: 'https://example.com/launch?campaign=old#discarded' })
    const link = `https://example.com/launch/?ref=${referralCode}`
    const links = anchors(email.html)
    const personal = links.find((item) => item.text === 'Your personal link')
    const share = links.find((item) => item.href.startsWith('mailto:'))
    assert.equal(personal?.href, link)
    assert.ok(share)
    assert.ok(new URL(share.href).searchParams.get('body')?.endsWith(`\n\n${link}`))
    assert.ok(email.text.includes(link))
    assert.doesNotMatch(email.html + email.text, /campaign=old|discarded/)
    assert.ok(!(email.html + email.text).includes(codes[1 - index]), 'A recipient never receives another recipient’s referral')
  }
})

test('priority confirms earned status while keeping access in a separate future invitation', () => {
  const email = renderWaitlistEmail({ ...options, kind: 'priority' })
  const links = anchors(email.html)
  assert.match(email.subject, /priority early access/)
  for (const content of [email.html, email.text]) {
    assert.match(content, /Three friends joined through your link/)
    assert.match(content, /We’ll email you when your invitation is ready/)
    assert.match(content, /Access arrives in a separate invitation/)
    assert.doesNotMatch(content, /mailto:|Invite 3 friends|Download now|account is ready|When 3 friends join|Share your invite|Your personal link/i)
  }
  assert.deepEqual(links.filter((link) => link.className === 'button').map((link) => link.href), [productUrl])
  assert.equal(links.filter((link) => link.href === productUrl).length, 1)
  assert.match(links.find((link) => link.className === 'button')!.text, /^Explore Open Swarm/)
  assert.ok(email.html.includes(`background="${artworkUrl}"`))
  assert.deepEqual(links.map((link) => link.href), [productUrl, options.unsubscribeUrl])
})

test('both email kinds keep live content and inline table fallbacks when fonts, images or styles are unavailable', () => {
  for (const kind of ['welcome', 'priority'] as const) {
    const email = renderWaitlistEmail({ ...options, kind })
    const fallback = email.html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<img\b[^>]*>/gi, '')
    assert.match(fallback, /<table\b[^>]*role="presentation"/)
    assert.match(fallback, /<h1\b[^>]*style="[^"]*font-family:'Newsreader',Georgia,'Times New Roman',serif/)
    assert.match(fallback, /font-family:'Manrope','Helvetica Neue',Helvetica,Arial,sans-serif/)
    assert.match(fallback, /<a class="button"[^>]*style="[^"]*background-color:[^;]+;color:#ffffff/)
    assert.match(fallback, /<p class="opening"[^>]*style="[^"]*font-size:14px;line-height:22px/)
    assert.match(fallback, kind === 'welcome' ? /Your spot is saved/ : /Three friends joined through your link/)
    assert.ok(anchors(fallback).some((link) => link.href === productUrl))
    assert.ok(anchors(fallback).some((link) => link.href === options.unsubscribeUrl))
    assert.ok(email.text.includes(`Unsubscribe: ${options.unsubscribeUrl}`))
    assert.doesNotMatch(email.html, /<script\b|<iframe\b|<form\b|backdrop-filter|data:image|first.?name/i)
    assert.doesNotMatch(email.html, /display\s*:\s*(?:inline-)?(?:grid|flex)\b|grid-template|flex-direction|\bvar\s*\(|--[a-z][\w-]*\s*:/i)
  }
})

test('selected artwork and all three self-hosted fonts are packaged as real public assets', () => {
  const email = renderWaitlistEmail(options)
  const fonts = ['newsreader-400', 'manrope-400', 'manrope-500']
  const fontUrls = [...email.html.matchAll(/src:url\('([^']+\.ttf)'\)/g)].map((match) => match[1])
  assert.deepEqual(fontUrls, fonts.map((name) => `https://example.com/launch/media/email/fonts/${name}.ttf`))
  for (const name of fonts) {
    const bytes = readFileSync(new URL(`../public/media/email/fonts/${name}.ttf`, import.meta.url))
    assert.ok(bytes.length > 1_000, `${name} contains a font, not an empty placeholder`)
    assert.ok([0x00010000, 0x4f54544f, 0x74727565].includes(bytes.readUInt32BE(0)), `${name} has a valid SFNT signature`)
  }
  const artwork = readFileSync(new URL('../public/media/email/forty/motion-13.jpg', import.meta.url))
  assert.ok(artwork.length > 10_000, 'Selected artwork is packaged, not a placeholder')
  assert.equal(artwork.subarray(0, 3).toString('hex'), 'ffd8ff')
  const logo = readFileSync(new URL('../public/media/logo-256.png', import.meta.url))
  assert.equal(logo.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
  assert.doesNotMatch(email.html, /fonts\.googleapis\.com|fonts\.gstatic\.com/)
})

test('dynamic postal data and signed unsubscribe query parameters are escaped without changing destinations', () => {
  const postalAddress = 'A & B <script>alert("x")</script> \'Suite 2\''
  const unsubscribeUrl = 'https://example.com/launch/api/waitlist/unsubscribe?token=signed&label="A"&tag=<example>'
  const expectedUrl = new URL(unsubscribeUrl).href
  for (const kind of ['welcome', 'priority'] as const) {
    const email = renderWaitlistEmail({ ...options, kind, postalAddress, unsubscribeUrl })
    assert.ok(email.html.includes('A &amp; B &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &#39;Suite 2&#39;'))
    assert.doesNotMatch(email.html, /<script\b/)
    assert.ok(email.html.includes('token=signed&amp;label=%22A%22&amp;tag=%3Cexample%3E'))
    assert.equal(anchors(email.html).find((link) => link.text === 'Unsubscribe')?.href, expectedUrl)
    assert.ok(email.text.includes(`Unsubscribe: ${expectedUrl}`))
    assert.ok(email.text.includes(postalAddress), 'Plain text retains literal postal data without HTML entities')
  }
})

test('unsafe or inconsistent URLs and invalid email events fail before rendering', () => {
  for (const publicUrl of ['javascript:alert(1)', 'http://example.com', 'https://user:secret@example.com', 'not a URL']) {
    assert.throws(() => renderWaitlistEmail({ ...options, publicUrl }))
  }
  for (const unsubscribeUrl of ['https://elsewhere.test/unsubscribe', 'http://example.com/unsubscribe', 'javascript:alert(1)', 'https://user:secret@example.com/unsubscribe']) {
    assert.throws(() => renderWaitlistEmail({ ...options, unsubscribeUrl }))
  }
  for (const referralCode of ['not-a-valid-token', 'A'.repeat(31), 'A'.repeat(33), 'A'.repeat(31) + '"']) {
    assert.throws(() => renderWaitlistEmail({ ...options, referralCode }))
  }
  assert.throws(() => renderWaitlistEmail({ ...options, kind: 'unexpected' as WaitlistEmailKind }))
})
