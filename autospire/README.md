Autospire — one-page Next.js site
Run: npm install && npm run dev

Project structure (each component has its own folder: Name.jsx + Name.module.css)
  app/
    layout.jsx        fonts + page title
    page.jsx          the one page; holds shared state and lists the sections in order
    globals.css       colours, reset, shared .btn buttons only
  components/
    Header/           Header.jsx, Header.module.css     menu, location dropdown, mobile menu
    Logo/             Logo.jsx, Logo.module.css
    Dropdown/         Dropdown.jsx, Dropdown.module.css  reusable dropdown (hero fields, header location)
    Hero/             Hero.jsx, Hero.module.css          headline, 3 entry tabs, search, plate lookup, trust row
    Services/         Services.jsx, Services.module.css  Popular Services slider (9 services)
    Slider/           Slider.jsx, Slider.module.css      arrows + scrolling track used by 3 sections
    Garages/          Garages.jsx, Garages.module.css    Featured Garages slider
    HowItWorks/       HowItWorks.jsx, HowItWorks.module.css   steps + reviews slider
    Enquiry/          Enquiry.jsx, Enquiry.module.css    enquiry form + contact details
    Footer/           Footer.jsx, Footer.module.css      tagline band + copyright
    Modal/            Modal.jsx, Modal.module.css        pop-up base
    ServiceModal/     pop-up for a clicked service
    GarageModal/      pop-up for a clicked garage profile
    Icon/             Icon.jsx                           all icons
  lib/
    data.js           contact details, 9 services + paragraphs, garages (SAMPLE), reviews (SAMPLE)
    cx.js             helper that maps class names to each component's CSS module

Images (public/images): hero.jpg, garage-1.jpg ... garage-6.jpg
Colours: :root in app/globals.css
