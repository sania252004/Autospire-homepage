const ICONS = {
  /* ----- services ----- */
  servicing: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  repairs: (<><circle cx="12" cy="12" r="3" /><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /></>),
  brakes: (<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" /><path d="M12 6.5v.01M12 17.5v.01M6.5 12h.01M17.5 12h.01M16.5 3.2A10 10 0 0 1 21 8" /></>),
  tyres: (<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="1.8" /><path d="M12 6v4.2M12 13.8V18M6.8 9l3.6 2.1M13.6 12.9 17.2 15M6.8 15l3.6-2.1M13.6 11.1 17.2 9" /></>),
  diagnostics: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  battery: <path d="M3 8h18v12H3zM7 8V5h3v3M14 8V5h3v3M12 12v4M10 14h4" />,
  ac: <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 2 3-2M9 20l3-2 3 2M3 10.5l3.2 1-.7 3.3M21 13.5l-3.2-1 .7-3.3" />,
  body: (<><rect x="2" y="2" width="16" height="6" rx="2" /><path d="M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" /><rect x="8" y="16" width="4" height="6" rx="1" /></>),
  rta: (<><path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5l8-3Z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>),

  /* ----- general ----- */
  car: (<><path d="M5 17H3a1 1 0 0 1-1-1v-4a3.7 3.7 0 0 1 .2-1.1L3.6 7.9A1.5 1.5 0 0 1 5 7h8.2a2 2 0 0 1 1.5.7L17 10s3 .6 4.5 1A2 2 0 0 1 23 13v3a1 1 0 0 1-1 1h-2M9 17h6" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  pin: (<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>),
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />,
  mail: (<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  scale: <path d="M12 3v18M5 21h14M3 8h18M6 8l-3 8a3 3 0 0 0 6 0L6 8ZM18 8l-3 8a3 3 0 0 0 6 0l-3-8Z" />,
  headset: <path d="M3 14v-2a9 9 0 0 1 18 0v2M21 14v3a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 1ZM3 14v3a2 2 0 0 0 2 2h2v-6H5a2 2 0 0 0-2 1ZM19 19c0 1.5-2 2-4 2h-2" />,
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2Z" />,
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 10h18M8 2v4M16 2v4M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></>),
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-5.4A8 8 0 1 1 21 12ZM8 11h.01M12 11h.01M16 11h.01" />,
  garage: <path d="M3 10l9-7 9 7v11H3zM8 21v-6h8v6" />,
  quote: <path d="M9 7H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1 3 3 0 0 1-3 3M19 7h-3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1 3 3 0 0 1-3 3" />,
  tag: (<><path d="M20 12 12 20a2 2 0 0 1-2.8 0L3 13.8V4h9.8L20 11.2a1.2 1.2 0 0 1 0 .8Z" /><circle cx="8" cy="8" r="1.2" /></>),

  /* ----- arrows and controls ----- */
  down: <path d="m6 9 6 6 6-6" />,
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 13l4 4L19 7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
};

// name = which icon, size = pixels, sw = line thickness, fill = colour inside the shape
export default function Icon({ name, size = 24, sw = 1.6, fill = "none" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}