import * as si from 'simple-icons'

/*
  Real app marks for the page. Alex asked for actual icons instead of generic glyphs
  and initials, so every tool, integration and agent shows the logo of the thing it
  really uses. Paths come from simple-icons (CC0); LinkedIn is no longer in that set,
  so its mark is drawn here.
*/

/** `tile`: a thin mark that reads better white on a tile of its own colour (see AppIcon). */
export type Brand = { title: string; hex: string; path: string; tile?: boolean }

const pick = (i: { title: string; hex: string; path: string }): Brand => ({ title: i.title, hex: i.hex, path: i.path })

export const linkedin: Brand = {
  title: 'LinkedIn',
  hex: '0A66C2',
  path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
}

export const B = {
  gmail: pick(si.siGmail),
  gcal: pick(si.siGooglecalendar),
  gdrive: pick(si.siGoogledrive),
  gdocs: pick(si.siGoogledocs),
  gsheets: pick(si.siGooglesheets),
  gmaps: pick(si.siGooglemaps),
  chrome: pick(si.siGooglechrome),
  notion: pick(si.siNotion),
  github: pick(si.siGithub),
  linear: pick(si.siLinear),
  figma: pick(si.siFigma),
  hubspot: pick(si.siHubspot),
  stripe: pick(si.siStripe),
  shopify: pick(si.siShopify),
  airtable: pick(si.siAirtable),
  zoom: pick(si.siZoom),
  discord: pick(si.siDiscord),
  x: pick(si.siX),
  jira: pick(si.siJira),
  asana: pick(si.siAsana),
  trello: pick(si.siTrello),
  dropbox: pick(si.siDropbox),
  calendly: pick(si.siCalendly),
  whatsapp: pick(si.siWhatsapp),
  youtube: pick(si.siYoutube),
  zapier: pick(si.siZapier),
  reddit: pick(si.siReddit),
  instagram: pick(si.siInstagram),
  threads: pick(si.siThreads),
  medium: pick(si.siMedium),
  pinterest: pick(si.siPinterest),
  spotify: pick(si.siSpotify),
  ycombinator: pick(si.siYcombinator),
  yelp: pick(si.siYelp),
  imessage: pick(si.siImessage),
  telegram: pick(si.siTelegram),
  quickbooks: pick(si.siQuickbooks),
  greenhouse: pick(si.siGreenhouse),
  intercom: pick(si.siIntercom),
  crunchbase: pick(si.siCrunchbase),
  scholar: pick(si.siGooglescholar),
  // arXiv's thin red chi reads as an error cross at icon size, so it sits on its red tile
  arxiv: { ...pick(si.siArxiv), tile: true },
  producthunt: pick(si.siProducthunt),
  todoist: pick(si.siTodoist),
  linkedin,
} satisfies Record<string, Brand>
