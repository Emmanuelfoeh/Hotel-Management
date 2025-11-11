# Public Portal Design Reference

## Overview

This document describes the visual design and UI patterns for the public-facing hotel booking portal based on the provided reference design.

## Design Characteristics

### Visual Style

- Modern, clean, and professional
- Generous white space
- High-quality property images
- Teal/turquoise accent color (#14b8a6) for CTAs and highlights
- Card-based layouts with subtle shadows
- Smooth transitions and hover effects

### Layout Patterns

- Full-width hero sections
- Grid-based property listings (4 columns on desktop)
- Horizontal scrollable carousels for featured content
- Sticky/floating search bar
- Dark footer with multi-column layout

## Page Sections Breakdown

### 1. Hero Section

**Layout:**

- Full viewport height background image with dark overlay
- Centered content with large heading and search bar
- Background image shows luxury hotel exterior/pool

**Components:**

- Heading: "Your Dream Stay Awaits"
- Subheading: "Book the Perfect Hotel Today"
- Integrated search bar (inline form)
- Optional CTA button

**Styling:**

- White text on dark overlay
- Large, bold typography
- Search bar with white background and teal button

### 2. Integrated Search Bar

**Fields:**

1. Check-in date (calendar icon)
2. Check-out date (calendar icon)
3. Guests (person icon with dropdown)
4. Search button (teal background)

**Behavior:**

- Inline horizontal layout on desktop
- Stacked on mobile
- Becomes sticky on scroll (optional)
- Date pickers open on click
- Guest selector shows dropdown with +/- controls

**Styling:**

- White background with subtle shadow
- Rounded corners
- Teal accent for search button
- Icons in light gray

### 3. Amenities Section

**Heading:** "Luxury & Comfort Choices"

**Layout:**

- Horizontal row of icon cards
- 6-8 amenities displayed
- Equal spacing between items

**Amenity Items:**

- WiFi
- Parking
- Swimming Pool
- Gym/Fitness
- Restaurant
- Room Service
- Spa
- Conference Rooms

**Card Design:**

- Icon at top (line icons or filled)
- Label text below
- Light background or transparent
- Hover effect (scale or color change)

### 4. Premium Stays Section

**Heading:** "Check Out Premium Stays"
**Action:** "View All" button (teal)

**Layout:**

- Horizontal scrollable carousel
- 3-4 cards visible at once
- Overflow hidden with scroll

**Card Design:**

- Large landscape image (16:9 ratio)
- Dark gradient overlay at bottom
- Property name in white text overlay
- Location with pin icon
- No price shown (premium/featured)

**Styling:**

- Cards have rounded corners
- Smooth scroll behavior
- Navigation arrows (optional)

### 5. Property Grid Section

**Heading:** "Explore All Our Hotels"

**Filter Tabs:**

- All (active by default)
- Hotels
- Resorts
- Villas
- Apartments
- Other categories

**Tab Styling:**

- Horizontal row
- Active tab: teal background with white text
- Inactive tabs: transparent with gray text
- Rounded pill shape

**Grid Layout:**

- 4 columns on desktop (1200px+)
- 3 columns on tablet (768px-1199px)
- 2 columns on mobile landscape (480px-767px)
- 1 column on mobile portrait (<480px)
- Equal gaps between cards

**Property Card Design:**

```
┌─────────────────────┐
│                     │
│   Property Image    │
│   (4:3 ratio)       │
│                     │
├─────────────────────┤
│ Property Name       │
│ 📍 Location         │
│ ⭐⭐⭐⭐⭐ (4.5)      │
│ $120 / night        │
└─────────────────────┘
```

**Card Elements:**

- Image with hover zoom effect
- Property name (bold, dark text)
- Location with pin icon (gray text)
- Star rating (gold stars) with numeric score
- Price per night (bold, teal or dark)
- Optional: "View Details" button on hover

**Hover Effects:**

- Image scales up slightly (1.05x)
- Card shadow increases
- Optional overlay with "View Details" button

### 6. Statistics Banner

**Background:** Solid teal (#14b8a6)
**Text Color:** White

**Layout:**

- Full-width section
- 4 statistics in horizontal row
- Equal spacing

**Stat Format:**

```
   100+
Happy Customers

   15+
Years Experience

   800+
Properties

   12+
Awards Won
```

**Styling:**

- Large number (48px+, bold)
- Descriptive text below (16px)
- Centered alignment
- Optional icons above numbers

### 7. Testimonials Section

**Heading:** "Customer Say About Our Services"

**Layout:**

- Centered testimonial card
- Navigation arrows on sides
- Dots indicator below (optional)

**Testimonial Card:**

```
┌─────────────────────────────┐
│  ┌─────┐                    │
│  │Photo│  Customer Name      │
│  └─────┘  Title/Location    │
│                              │
│  "Review text goes here...  │
│   Multiple lines of text    │
│   about their experience."  │
│                              │
│  ⭐⭐⭐⭐⭐                    │
└─────────────────────────────┘
```

**Elements:**

- Customer photo (circular, 60-80px)
- Customer name (bold)
- Title or location (gray text)
- Quote text (larger font, 18-20px)
- Star rating
- Quote marks icon (optional)

**Navigation:**

- Left/right arrows
- Dots indicator for multiple testimonials
- Auto-play carousel (optional)

### 8. Newsletter Section

**Heading:** "The Best Location for a Relaxing Vacation"
**Subheading:** Optional descriptive text

**Layout:**

- Centered content
- Email input with submit button

**Form Design:**

```
┌────────────────────────────────┐
│  Enter your email address...   │  [Subscribe]
└────────────────────────────────┘
```

**Styling:**

- Large input field with placeholder
- Teal submit button
- Inline layout on desktop
- Stacked on mobile

### 9. Footer

**Background:** Dark charcoal (#1a1a1a)
**Text Color:** Light gray (#d4d4d4)

**Layout:** 4-column grid

```
┌──────────────────────────────────────────────────┐
│  About Us          Quick Links    Resources      │
│  Logo              Home           Blog            │
│  Description       About          Help Center    │
│  text here...      Services       FAQs           │
│                    Contact        Terms          │
│                                                   │
│  Social Icons: [f] [t] [i] [l]                  │
│                                                   │
│  © 2024 Hotel Name. All rights reserved.        │
└──────────────────────────────────────────────────┘
```

**Columns:**

1. About - Logo, description, social icons
2. Quick Links - Navigation links
3. Resources - Help, blog, legal links
4. Contact - Address, phone, email

**Styling:**

- Column headings in white
- Links in light gray
- Hover: links turn teal
- Social icons with hover effects
- Copyright text centered at bottom

### 10. Navigation Bar

**Background:** White (transparent on hero, solid on scroll)
**Height:** 70-80px

**Layout:**

```
┌────────────────────────────────────────────────┐
│  [Logo]    Home  About  Services  Contact      │
│                              [Login] [Sign Up] │
└────────────────────────────────────────────────┘
```

**Elements:**

- Logo on left (image + text)
- Navigation links centered or left
- Login/Sign Up buttons on right
- Hamburger menu icon on mobile

**Styling:**

- Links in dark gray
- Active link: teal underline or color
- Login: text button
- Sign Up: teal filled button
- Sticky on scroll with shadow

**Mobile:**

- Hamburger icon (☰)
- Slide-in menu from right
- Full-height overlay
- Close button (×)

## Component Specifications

### Property Card Component

```typescript
interface PropertyCardProps {
  id: string;
  image: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  type: 'hotel' | 'resort' | 'villa' | 'apartment';
  featured?: boolean;
}
```

**Dimensions:**

- Card width: 100% of grid column
- Image aspect ratio: 4:3
- Card height: auto (content-based)
- Border radius: 8-12px
- Shadow: subtle on default, elevated on hover

### Search Bar Component

```typescript
interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  defaultCheckIn?: Date;
  defaultCheckOut?: Date;
  defaultGuests?: number;
  sticky?: boolean;
}

interface SearchParams {
  checkIn: Date;
  checkOut: Date;
  guests: number;
}
```

**Behavior:**

- Validates dates (check-out after check-in)
- Minimum 1 guest, maximum 10
- Shows error states
- Disables search if invalid

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 639px) {
  - Single column layouts
  - Stacked search bar
  - Hamburger menu
  - Full-width cards
}

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  - 2-column property grid
  - Condensed navigation
  - Smaller hero text
}

/* Desktop */
@media (min-width: 1024px) {
  - 4-column property grid
  - Full navigation
  - Inline search bar
  - Larger typography
}

/* Large Desktop */
@media (min-width: 1280px) {
  - Max content width: 1280px
  - Centered container
  - Larger images
}
```

## Animation Guidelines

### Page Load

- Hero: fade in + slide up (500ms)
- Search bar: fade in with delay (300ms)
- Sections: fade in on scroll (intersection observer)

### Interactions

- Card hover: scale image 1.05x (300ms ease)
- Button hover: darken background (150ms)
- Link hover: color change (150ms)
- Carousel: smooth scroll (400ms ease-out)

### Transitions

- Page navigation: fade (200ms)
- Modal open: scale + fade (300ms)
- Dropdown: slide down (200ms)

## Accessibility

- All images have alt text
- Proper heading hierarchy (h1 → h2 → h3)
- Focus visible on interactive elements
- ARIA labels for icons
- Keyboard navigation support
- Color contrast ratios meet WCAG AA
- Form labels and error messages
- Skip to main content link

## Performance

- Lazy load images below fold
- Use Next.js Image component
- Optimize images (WebP format)
- Preload hero image
- Code split heavy components
- Minimize initial bundle size
- Use CSS for simple animations
- Defer non-critical JavaScript
