# O'zGezer UI/UX Specification

## Global Navigation

- Desktop: top header with logo, primary navigation, search trigger, locale switcher, auth entry
- Mobile: compact header with menu drawer and sticky bottom access reserved for future validation if needed
- Protected admin access stays outside public navigation and is route-guarded

## Shared Components

The following components are locked for the first implementation cycle:

- `Button`
- `Card`
- `Badge`
- `Input`
- `Modal`
- `MapMarker`
- `FilterPanel`
- `PlaceCard`
- `ReviewCard`

## Responsive Rules

- Mobile-first layout
- Breakpoints should align to Tailwind defaults unless product needs justify override
- All page templates need dedicated mobile and desktop compositions before implementation

## Page Specifications

### Homepage

Desktop:

- cinematic hero with large search input and scenic Uzbekistan imagery
- category grid directly under hero
- region discovery block with 14 regions
- "Most Popular Places" and "Newly Added" content rails

Mobile:

- stacked hero with compact search
- swipe-friendly card rows
- simplified region selector with 2-column rhythm

Primary goals:

- communicate trust and destination breadth
- push users toward search, explore, and regional discovery

### Explore

Desktop:

- split layout with filter/list on the left and map on the right
- persistent filter visibility while browsing results

Mobile:

- list and map toggle
- filters open in modal or sheet

Primary goals:

- fast narrowing by region, category, rating, and price
- easy handoff between list discovery and map context

### Place Detail

Desktop:

- image gallery first
- summary info block with key logistics
- map and route information visible without excessive scrolling
- review summary near the top

Mobile:

- swipe gallery
- sticky action cluster reserved for save/share/review in later phases

Primary goals:

- answer whether the place is worth visiting
- surface practical data and nearby alternatives

### Categories

- category cards with clear iconography
- content drill-down into filtered explore results
- supports editorial positioning for different travel intents

### Profile

- saved places
- visited vs want-to-go lists
- user reviews overview
- contributor state when relevant

### Admin

- metrics dashboard
- place management table
- draft review queue
- contributor request queue
- review moderation tools

## Interaction Notes

- Search suggestions begin after 2 characters with debounce
- Empty states should be reassuring and action-oriented
- Loading states should use skeletons instead of spinners where possible
- Review UX must prominently expose the `wouldRecommend` choice
