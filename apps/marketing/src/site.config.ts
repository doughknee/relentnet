export const siteConfig = {
  name: 'RelentNet',
  domain: 'https://relentnet.com',
  contact: {
    email: 'inquiries@relentnet.com',
    phone: '858-859-1851',
    phoneFormatted: '+1 (858) 859-1851',
    /** Cal.com or Calendly link for the 20-minute call. Brandon fills this in;
     *  while it is empty the /inquire booking button is not rendered. */
    bookingUrl: '',
    hours: '9am - 5pm CST (Mon-Fri)',
  },
  regions: ['Tennessee', 'Louisiana', 'Georgia', 'Florida'],
  /** Both founders' cities. Brandon reaches Georgia and Tennessee from
   *  Nashville, Dan covers Louisiana and Florida from New Orleans, which is
   *  why `regions` is those four and not some other four. */
  locations: [
    { city: 'Nashville', state: 'TN' },
    { city: 'New Orleans', state: 'LA' },
  ],
  meta: {
    title: 'RelentNet | Workflow Diagnostic & Technology Stewardship',
    description:
      'White-glove technology partnership for owner-led businesses. We diagnose operational friction with a workflow diagnostic, then clarify what technology is worth building.',
    ogImage: '/og-default.png',
  },
  social: {
    // Add social links here if available
  },
}
