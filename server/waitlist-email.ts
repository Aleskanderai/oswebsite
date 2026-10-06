/** Ink margin (concept 13), adapted to tables with live HTML and plain-text content. */
export type WaitlistEmailKind = 'welcome' | 'priority'
export type WaitlistEmailOptions = {
  kind: WaitlistEmailKind
  referralCode: string
  publicUrl: string
  unsubscribeUrl: string
  postalAddress?: string
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]!)

function httpsUrl(value: string) {
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Email links require a public HTTPS URL.')
  return url
}

export function renderWaitlistEmail(options: WaitlistEmailOptions): { subject: string; html: string; text: string } {
  if (!['welcome', 'priority'].includes(options.kind) || !/^[A-Za-z0-9_-]{32}$/.test(options.referralCode)) {
    throw new Error('Invalid waitlist email event.')
  }
  const site = httpsUrl(options.publicUrl)
  site.search = ''
  site.hash = ''
  if (!site.pathname.endsWith('/')) site.pathname += '/'
  const unsubscribe = httpsUrl(options.unsubscribeUrl)
  if (unsubscribe.origin !== site.origin) throw new Error('Unsubscribe must use the configured site origin.')
  const invite = new URL(site)
  invite.searchParams.set('ref', options.referralCode)
  const product = new URL('#product', site).href
  const logo = new URL('media/logo-256.png', site).href
  const artwork = new URL('media/email/forty/motion-13.jpg', site).href
  const fontUrl = (name: string) => escapeHtml(new URL(`media/email/fonts/${name}.ttf`, site).href)
  const priority = options.kind === 'priority'
  const subject = priority ? 'You’ve unlocked priority early access' : 'Your own Jarvis. You’re on the list.'
  const preheader = priority
    ? 'Three friends joined. Your priority status is confirmed. Your invitation will follow.'
    : 'Your Open Swarm waitlist spot is saved. We’ll email you when early access opens.'
  const headline = priority ? 'Your Jarvis.<br>With<br>priority.' : 'A Jarvis<br>of your<br>own.'
  const subhead = priority ? 'You’ve unlocked priority.' : 'You’re on the list.'
  const opening = priority
    ? 'Three friends joined through your link. Your priority early access is confirmed.'
    : 'Your spot is saved. We’ll email you when early access opens.'
  const next = priority
    ? 'Your place is saved. We’ll email you when your invitation is ready.'
    : 'Your AI desktop for Mac. Agents that browse, research, and build useful tools alongside you.'
  const referral = 'When 3 friends join through your link, you’ll get priority early access.'
  const shareMessage = `I’m on the waitlist for Open Swarm, an AI desktop for Mac. Thought you’d like it too.\n\n${invite.href}`
  const share = `mailto:?subject=${encodeURIComponent('Join me on Open Swarm')}&body=${encodeURIComponent(shareMessage)}`
  const actionLabel = priority ? 'Explore Open Swarm' : 'Take a closer look'
  const font = "'Manrope','Helvetica Neue',Helvetica,Arial,sans-serif"
  const serif = "'Newsreader',Georgia,'Times New Roman',serif"
  const ink = '#53172e'
  const muted = '#614454'
  const accent = '#98374b'
  const footerAddress = options.postalAddress?.trim()
  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(subject)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><style>td,p,a{font-family:Arial,sans-serif!important}.headline{font-family:Georgia,serif!important}</style><![endif]-->
<style>
@font-face{font-family:'Newsreader';font-style:normal;font-weight:400;src:url('${fontUrl('newsreader-400')}') format('truetype')}
@font-face{font-family:'Manrope';font-style:normal;font-weight:400;src:url('${fontUrl('manrope-400')}') format('truetype')}
@font-face{font-family:'Manrope';font-style:normal;font-weight:500;src:url('${fontUrl('manrope-500')}') format('truetype')}
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}a:focus-visible{outline:2px solid ${accent};outline-offset:4px}
@media only screen and (max-width:600px){.outer{padding:0!important}}
@media only screen and (max-width:420px){.brand{padding:23px 24px!important}.brand-name{font-size:13px!important}.artwork{width:29%!important}.ink-content{padding:28px 21px 26px!important;height:439px!important}.headline{font-size:30px!important;line-height:33.6px!important}.status{font-size:8px!important;padding-bottom:16px!important}.subhead{font-size:13px!important;line-height:19px!important;margin-top:14px!important}.opening,.next{font-size:13px!important;line-height:21px!important}.opening{margin-top:17px!important}.button-wrap{padding-top:20px!important}.button{font-size:12px!important;border-width:11px 13px!important}.button-arrow{padding-left:12px!important}.signoff{padding-left:24px!important;padding-right:24px!important}}
@media only screen and (max-width:340px){.ink-content{padding-left:17px!important;padding-right:15px!important}.button{border-left-width:10px!important;border-right-width:10px!important;font-size:11px!important}.button-arrow{padding-left:7px!important}}
@media (prefers-color-scheme:dark){.body,.outer{background-color:#241d25!important}.canvas,.brand,.ink-content,.signoff{background-color:#ffffff!important}.headline,.brand-name,.strong{color:${ink}!important}.opening,.next,.signoff,.footer-link{color:${muted}!important}.status,.subhead{color:${accent}!important}.button-cell,.button{background-color:${ink}!important;border-color:${ink}!important;color:#ffffff!important}}
</style>
</head>
<body class="body" bgcolor="#eaebef" style="margin:0;padding:0;width:100%;background-color:#eaebef;font-family:${font};-webkit-font-smoothing:antialiased;">
<div style="display:none;font-size:1px;line-height:1px;color:#ffffff;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}${'&#847; &zwnj; &nbsp;'.repeat(18)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td class="outer" align="center" style="padding:20px 16px;background-color:#eaebef;">
<!--[if mso]><table role="presentation" width="600" align="center" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
<table class="canvas" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background-color:#ffffff;">
<tr><td class="brand" style="padding:25px 31px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td width="22" valign="middle"><img src="${escapeHtml(logo)}" alt="" width="22" height="22" style="display:block;width:22px;height:22px;"></td><td class="brand-name" valign="middle" style="padding-left:9px;color:${ink};font-size:14px;line-height:24px;font-weight:500;letter-spacing:-0.025em;">Open Swarm</td></tr></table>
</td></tr>
<tr><td>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout:fixed;">
<tr><td class="artwork" width="185" valign="top" bgcolor="#172e68" background="${escapeHtml(artwork)}" aria-hidden="true" style="width:30.833333%;background-color:#172e68;background-image:url('${escapeHtml(artwork)}');background-position:72% center;background-size:cover;background-repeat:no-repeat;border-top:1px solid #cdaeb9;border-bottom:1px solid #cdaeb9;font-size:0;line-height:0;filter:saturate(1.1) contrast(1.13);">
<!--[if mso]><v:rect fill="true" stroke="false" style="width:185px;height:468px;"><v:fill type="frame" src="${escapeHtml(artwork)}" color="#172e68" aspect="atleast" position="0.72,0.5"/><v:textbox inset="0,0,0,0"><div></div></v:textbox></v:rect><![endif]-->
</td><td class="ink-content" valign="top" height="410" style="height:410px;padding:30px 31px 28px;color:${ink};font-family:${font};">
<p class="status" style="margin:0;padding-bottom:17px;color:#9b3b50;font-size:9px;line-height:16px;font-weight:500;letter-spacing:0.025em;">${priority ? 'Priority confirmed' : 'Waitlist confirmed'}</p>
<h1 class="headline" style="margin:0;color:${ink};font-family:${serif};font-size:40px;line-height:44.8px;font-weight:400;letter-spacing:-0.02em;">${headline}</h1>
<p class="subhead" style="margin:15px 0 0;color:${accent};font-size:15px;line-height:21px;">${subhead}</p>
<p class="opening" style="margin:18px 0 0;color:${muted};font-size:14px;line-height:22px;">${opening}</p>
<p class="next" style="margin:12px 0 0;color:${muted};font-size:14px;line-height:22px;">${next}</p>
<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td class="button-wrap" style="padding-top:22px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td class="button-cell" bgcolor="${ink}" style="background-color:${ink};"><a class="button" href="${escapeHtml(product)}" style="display:inline-block;border:12px solid ${ink};border-left-width:15px;border-right-width:15px;background-color:${ink};color:#ffffff;font-family:${font};font-size:13px;line-height:20px;font-weight:500;text-decoration:none;text-align:center;mso-padding-alt:0;">${actionLabel}<span class="button-arrow" aria-hidden="true" style="padding-left:18px;font-size:17px;font-weight:400;">↗</span></a></td></tr></table></td></tr></table>
</td></tr></table>
</td></tr>
<tr><td class="signoff" style="padding:22px 36px 0;border-top:1px solid #d0b5bf;color:${muted};font-family:${font};font-size:10px;line-height:16px;">
${priority ? '<p style="margin:0;">Your priority status is saved. Access arrives in a separate invitation.</p>' : `<p style="margin:0;">When <strong class="strong" style="color:${ink};font-weight:500;">3 friends join through your link</strong>, you’ll get priority early access.</p>
<p style="margin:7px 0 0;"><a class="footer-link" href="${escapeHtml(share)}" style="color:${muted};text-decoration:underline;">Share your invite ↗</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="footer-link" href="${escapeHtml(invite.href)}" style="color:${muted};text-decoration:none;">Your personal link</a></p>`}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding:23px 0 26px;font-size:9px;line-height:16px;">Open Swarm · For Mac</td><td align="right" style="padding:23px 0 26px;font-size:9px;line-height:16px;"><a class="footer-link" href="${escapeHtml(unsubscribe.href)}" style="color:${muted};text-decoration:none;">Unsubscribe</a></td></tr></table>
${footerAddress ? `<p style="margin:0 0 22px;font-size:9px;line-height:16px;">${escapeHtml(footerAddress)}</p>` : ''}
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>`
  const text = priority
    ? `OPEN SWARM\n\nYour Jarvis. With priority.\n\nYou’ve unlocked priority early access.\n${opening}\n\n${next}\n\nExplore Open Swarm: ${product}\n\nYour priority status is saved. Access arrives in a separate invitation.`
    : `OPEN SWARM\n\nA Jarvis of your own.\nYou’re on the list.\n\n${opening}\n\n${next}\n\nTake a closer look: ${product}\n\n${referral}\nShare your invite — your personal link:\n${invite.href}`
  return { subject, html, text: `${text}\n\nOpen Swarm · For Mac\nYou’re receiving this because you joined the Open Swarm waitlist.\nUnsubscribe: ${unsubscribe.href}${footerAddress ? `\n${footerAddress}` : ''}\n` }
}
