# StitchDoor — Complete Website

## Open the project
Extract the ZIP and open index.html. For consistent browser storage between pages, serve the folder using your normal local development server (for example VS Code Live Server). Opening individual file URLs may isolate storage in some browsers. The hosted version shares the same origin across all pages.

## Pages
Home 1, Home 2, About, Services, Service Details, Book Pickup, Pricing Guide, How It Works, Journal, Journal Article, Contact, Login, Register, Customer Dashboard, 404 and Service Updates.

## Design and typography
The only designed interface colors are Black #000000, Wine Red #7F011F and Light Sand #F5EBD0. Color variables are in assets/css/style.css. System fonts avoid external font downloads. Heading weights are 600 and body weights are 400–500. The original styles are supplemented by apple-style.css and pages.css; the last sheet owns shared height/alignment fixes. Desktop/tablet sections have 30px side padding and mobile sections 18px.

## Replace images
Every photographic/illustrated asset is JPG. Replace files at the existing paths using exactly the same names. assets/images/home-1 and home-2 hold separate homepage assets. about, services and blog hold their page-specific assets. assets/images/background contains page-heading JPGs for internal pages. Both homepages, login, register and the dashboard do not use heading backgrounds. Default illustrations are intentionally replaceable, drawn for this project and contain no remote-image dependencies. Header logo is editable text. Favicon uses the shirt JPG and can be replaced with your own JPG icon.

## Navigation, themes and mirrored layout
The Home dropdown links both homepages. More gives access to process, journal, account and dashboard pages. Active links match the filename. Dark/light preference and mirrored-layout preference persist locally. Mirroring changes layout positions while keeping English reading direction and alignment. Mobile menus and dropdowns support keyboard activation and Escape. Motion respects reduced-motion preferences.

## Booking
Seven steps cover service type, multiple garments, measurement preferences, address, a preferred pickup date/window, review and a locally saved request. Quantities and required fields are validated. INR starting amounts are illustrative and editable in assets/js/data.js. Requests and estimates are saved in browser localStorage. They are not transmitted to a business and are not confirmed pickups. Dates are preferences, not live appointment availability. The request can be downloaded and appears in the dashboard on the same browser origin.

## Measurements and dashboard
Customer tabs include overview, requests, tracking, measurement profiles, garment history, estimated payments, notifications and profile settings. Add/edit/delete measurement profiles with cm/in units. Unit changes clear values rather than silently converting them. Tracking starts at Pickup requested and does not pretend to receive live operational updates. Completion history remains empty until legitimate completed records exist. No fake invoices or successful payments are generated.

## Account interfaces
Login and registration open a local workspace and do not perform secure authentication. Passwords are validated by the interface but never saved, transmitted, hashed or compared against an invented account. Register stores a name/email/phone profile only after explicit local-storage acknowledgement. Use a proper identity provider/backend before offering real customer accounts. Forgot password explains that recovery is unavailable until an account service is connected. Logout clears the remembered workspace email and returns to Login; locally saved data remains on this device.

## Forms, map and service updates
Home/contact enquiries download text files. They do not send mail. Newsletter preferences save locally and do not subscribe the user. Contact contains an actual Google Maps embedded area search; searching a city is not a statement of coverage or office location. No business phone, email, hours or team names were invented.

## Real integrations
Connect validated booking requests to your backend before confirming any pickup. Replace local persistence with authenticated, authorised storage for bookings, measurement data and profiles. Add scheduling availability from an operational API. Use an identity provider for login/recovery and a payment-provider hosted flow for payments; never trust client-entered payment success. Contact/newsletter submission can be connected to a confirmed email-form provider. Keep secrets on a server, never in static JavaScript. Operational status updates and invoice records must originate from the business backend.

## SEO and deployment
Public pages have titles and descriptions. Account and dashboard pages are noindex and excluded from the sitemap. sitemap.xml is configured for the StitchDoor hosted address; replace it before publishing under a different domain. robots.txt permits public crawling. 404.html provides the branded error content; configure your chosen web host to use it for missing routes. No unconfirmed business address or ratings are included in structured data.

## Validation and limits
Executed: JavaScript syntax checks; all 16 page existence checks; local asset links and fragment validation; unique ID checks; exact CSS palette audit; JPG decoding checks; ZIP integrity check. Browser/render QA was unavailable in this environment. Responsive CSS covers mobile/tablet/desktop, but visual layout and operational integrations need verification in the target browsers. No Lighthouse or real payment/authentication tests are claimed.

## Credits
Original StitchDoor copy, interface implementation and placeholder illustrations. Design direction uses product-led presentation inspired by Apple; no Apple logos, imagery or code are included. Google Maps is an external embedded service. No additional package dependencies are required.

## Changelog
Complete 16-page release: shared compact FAQ height/alignment, consistent card/footer rules, internal JPG heading banners, linked navigation, booking request flow, customer workspace, measurement CRUD, journal search/filter/pagination, contact downloads and area-map search.
