/** Original, email-client-safe Open Swarm templates. No browser code or live recipient data. */
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
  const priority = options.kind === 'priority'
  const subject = priority ? 'You’ve unlocked priority early access' : 'You’re on the Open Swarm waitlist'
  const preheader = priority ? 'Three friends joined. Your priority status is saved.' : 'You’re early. Invite 3 friends to unlock priority early access.'
  const headline = priority ? 'Small swarm.<br />Big head start.' : 'You’re on the list.'
  const opening = priority
    ? 'Three friends joined through your link. You’ve unlocked priority early access to Open Swarm.'
    : 'Your spot is saved. Welcome to Open Swarm, one desktop for your agents, apps, and the work you want to hand off.'
  const next = priority
    ? 'There’s nothing else you need to do. We’ll email you when your invitation is ready.'
    : 'We’ll email you when early access opens. Until then, bring a few good people along.'
  const shareMessage = `I joined the Open Swarm waitlist — an AI desktop where agents work together. Thought you might like it too.\n\nJoin me: ${invite.href}`
  const action = priority ? product : `mailto:?subject=${encodeURIComponent('Join me on Open Swarm')}&body=${encodeURIComponent(shareMessage)}`
  const actionLabel = priority ? 'Explore Open Swarm' : 'Invite your people'
  const button = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:8px;text-align:center;"><a href="${escapeHtml(action)}" style="display:block;border:15px solid #ffffff;border-left-width:18px;border-right-width:18px;border-radius:8px;background-color:#ffffff;color:#17232b;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:20px;font-weight:700;text-decoration:none;text-align:center;mso-padding-alt:0;">${actionLabel}<span aria-hidden="true"> &nbsp;↗</span></a></td></tr></table>`
  // These three markers explain the referral goal; they never pretend to show a live count.
  const milestones = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 22px;"><tr>${[1,2,3].map(number => `<td width="33%" align="center" style="padding:0 3px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="padding:13px 4px;background-color:#2e4656;border:1px solid #597080;border-radius:8px;color:#e5f2fa;font-size:18px;line-height:22px;font-weight:700;">${priority ? '✓' : `0${number}`}<br><span style="font-size:10px;line-height:18px;font-weight:400;letter-spacing:0.6px;">${priority ? 'JOINED' : `FRIEND ${number}`}</span></td></tr></table></td>`).join('')}</tr></table>`
  const content = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td class="invite-card" bgcolor="#203744" style="padding:26px 24px;background-color:#203744;border:1px solid #314f62;border-radius:12px;">
<p style="margin:0 0 12px;color:#f8be9e;font-size:10px;line-height:16px;font-weight:700;letter-spacing:1.5px;">${priority ? 'PRIORITY · UNLOCKED' : 'YOUR INVITE. YOUR HEAD START.'}</p>
<h2 style="margin:0 0 10px;color:#ffffff;font-size:24px;line-height:29px;font-weight:700;letter-spacing:-0.6px;">${priority ? 'You made it happen.' : 'Better with your people.'}</h2>
<p style="margin:0 0 22px;color:#d0dfe8;font-size:15px;line-height:24px;">${priority ? '3 friends joined. Your priority status is saved. Your access invitation will arrive in a separate email.' : 'When 3 friends join through your link, you unlock priority early access. Know someone who’d love a desktop like this?'}</p>
${milestones}${button}
${priority ? '' : `<p style="margin:22px 0 7px;color:#b7cbd8;font-size:10px;line-height:17px;font-weight:700;letter-spacing:1px;">OR COPY YOUR PERSONAL INVITE LINK</p><p style="margin:0;word-break:break-all;overflow-wrap:anywhere;"><a href="${escapeHtml(invite.href)}" style="color:#e4f3ff;font-family:Consolas,'Courier New',monospace;font-size:12px;line-height:20px;text-decoration:underline;word-break:break-all;">${escapeHtml(invite.href)}</a></p>`}
</td></tr></table>`
  const footerAddress = options.postalAddress?.trim()
  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(subject)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none}a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}
@media only screen and (max-width:620px){.outer{padding:16px 10px!important}.content{padding:28px 24px!important}.brand{padding:21px 24px!important}.headline{font-size:32px!important;line-height:37px!important}.celebration{padding:26px 20px 30px!important}.invite-card{padding:24px 20px!important}.card{border-radius:12px!important}.footer{padding:24px 14px!important}}
@media (prefers-color-scheme:dark){.body,.outer{background-color:#111a22!important}.card,.brand,.content{background-color:#1c2732!important;border-color:#35444f!important}.ink,.headline,.brand-name{color:#f2f7fa!important}.muted,.footer{color:#b2c3cf!important}.celebration{background-color:#352e2c!important;border-color:#594b45!important}.celebration-label{color:#f4bf9e!important}.invite-card{background-color:#203744!important;border-color:#4b6373!important}.link{color:#acd9f6!important}}
</style>
</head>
<body class="body" bgcolor="#f2f6f9" style="margin:0;padding:0;width:100%;background-color:#f2f6f9;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;font-size:1px;line-height:1px;color:#f2f6f9;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}${'&#847; &zwnj; &nbsp;'.repeat(18)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td class="outer" align="center" style="padding:36px 16px;background-color:#f2f6f9;">
<!--[if mso]><table role="presentation" width="600" align="center" cellspacing="0" cellpadding="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="card" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #dfe8ee;border-radius:16px;border-spacing:0;overflow:hidden;">
<tr><td class="brand" style="padding:24px 32px;background-color:#ffffff;border-radius:16px 16px 0 0;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td valign="middle" class="brand-name" style="color:#17232b;font-size:18px;line-height:24px;font-weight:700;letter-spacing:-0.5px;">Open Swarm</td><td class="muted" align="right" valign="middle" style="color:#718493;font-size:10px;line-height:16px;letter-spacing:1.1px;">${priority ? 'PRIORITY ACCESS' : 'SPOT SAVED'}</td></tr></table>
</td></tr>
<tr><td class="celebration" align="center" bgcolor="#fff1e8" style="padding:28px 32px 32px;background-color:#fff1e8;border-top:1px solid #f5e4d8;border-bottom:1px solid #f5e4d8;">
<table role="presentation" align="center" width="180" cellspacing="0" cellpadding="0" border="0" style="width:180px;margin:0 auto 18px;"><tr><td width="54" align="left" valign="top" aria-hidden="true" style="padding-top:5px;color:#dc7c55;font-size:24px;line-height:30px;">✦</td><td width="72" align="center"><img src="${escapeHtml(logo)}" alt="" width="72" height="72" style="display:block;width:72px;height:72px;"></td><td width="54" align="right" valign="bottom" aria-hidden="true" style="padding-bottom:4px;color:#dc7c55;font-size:17px;line-height:24px;">✦</td></tr></table>
<p class="celebration-label" style="margin:0 0 10px;color:#955638;font-size:11px;line-height:17px;font-weight:700;letter-spacing:1.5px;">${priority ? 'THREE FRIENDS. ONE GOOD MOVE.' : 'NICE MOVE. YOU’RE EARLY.'}</p>
<h1 class="headline" style="margin:0;color:#142431;font-size:38px;line-height:43px;font-weight:700;letter-spacing:-1.3px;">${headline}</h1>
</td></tr>
<tr><td class="content" style="padding:28px 36px 30px;background-color:#ffffff;border-radius:0 0 16px 16px;">
<p class="ink" style="margin:0 0 14px;color:#344854;font-size:16px;line-height:26px;">${opening}</p>
<p class="muted" style="margin:0 0 28px;color:#647783;font-size:15px;line-height:25px;">${next}</p>
${content}
<p class="ink" style="margin:28px 0 0;color:#344854;font-size:14px;line-height:24px;">See you on the desktop,<br><strong style="font-weight:700;">The Open Swarm team</strong></p>
</td></tr></table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;"><tr><td class="footer" align="center" style="padding:24px 28px 4px;color:#71818d;font-size:11px;line-height:18px;">
You’re receiving this because you joined the Open Swarm waitlist.<br>
<a class="link" href="${escapeHtml(unsubscribe.href)}" style="color:#5a7182;text-decoration:underline;">Unsubscribe from waitlist emails</a>${footerAddress ? `<br>${escapeHtml(footerAddress)}` : ''}
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</body></html>`
  const text = priority
    ? `OPEN SWARM\n\nYou’ve unlocked priority early access.\n\n${opening}\n\n${next}\n\nYour place on the waitlist is still saved. Access arrives in a separate invitation.\n\nExplore Open Swarm: ${product}`
    : `OPEN SWARM\n\nNice move. You’re early.\nYou’re on the list.\n\n${opening}\n\n${next}\n\nBetter with your people.\nWhen 3 friends join through your link, you unlock priority early access. Know someone who’d love a desktop like this?\n\nCopy this link and send it to a friend:\n${invite.href}`
  return { subject, html, text: `${text}\n\nSee you on the desktop,\nThe Open Swarm team\n\nYou’re receiving this because you joined the Open Swarm waitlist.\nUnsubscribe from waitlist emails: ${unsubscribe.href}${footerAddress ? `\n${footerAddress}` : ''}\n` }
}
