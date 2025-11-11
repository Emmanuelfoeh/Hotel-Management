# Animation Testing Guide

This guide helps you verify that all animations are working correctly in the Hotel Management System.

## Prerequisites

1. Start the development server: `npm run dev`
2. Open the application in your browser
3. Have browser DevTools open (F12) to check for errors

## Test Checklist

### ✅ Public Portal Animations

#### Home Page (`/`)

- [ ] Hero section fades in with slide up animation
- [ ] Search bar appears smoothly
- [ ] Amenities icons reveal with stagger effect on scroll
- [ ] Statistics section animates in when scrolled into view
- [ ] Property cards have hover effect (lift + shadow)
- [ ] Property images scale on hover
- [ ] Buttons have scale effect on hover and tap

#### Navbar

- [ ] Mobile menu slides down smoothly when opened
- [ ] Menu items appear with stagger effect
- [ ] Menu closes with smooth animation
- [ ] Theme toggle works without breaking animations

#### Rooms Page (`/rooms`)

- [ ] Property cards animate in with stagger
- [ ] Filter tabs transition smoothly
- [ ] Cards lift on hover
- [ ] Images scale on hover

#### Gallery Page (`/gallery`)

- [ ] Images load with fade-in effect
- [ ] Lightbox opens with smooth animation

### ✅ Admin Dashboard Animations

#### Dashboard (`/admin/dashboard`)

- [ ] Stats cards animate in with stagger effect (0.1s delay each)
- [ ] Icons rotate in
- [ ] Values scale in
- [ ] Cards lift slightly on hover
- [ ] Charts render smoothly (Recharts built-in animations)

#### Dialogs/Modals

- [ ] Check-in dialog scales in with fade
- [ ] Check-out dialog scales in with fade
- [ ] Backdrop blurs and fades in
- [ ] Close button has hover effect
- [ ] Dialog closes with smooth exit animation

#### Tables

- [ ] Rows appear smoothly
- [ ] Hover states work on rows
- [ ] Action buttons have hover effects

### ✅ Loading States

#### Skeleton Loaders

Test by throttling network in DevTools:

- [ ] Card skeletons pulse smoothly
- [ ] Table skeletons show loading state
- [ ] Stats card skeletons animate
- [ ] Page skeleton displays correctly

#### Loading Spinners

- [ ] Spinner rotates smoothly
- [ ] Loading text fades in after spinner
- [ ] Full page loader centers correctly

### ✅ Interactive Elements

#### Buttons

- [ ] Primary buttons scale on hover (1.02x)
- [ ] Buttons scale down on click (0.98x)
- [ ] Transition is smooth (150ms)

#### Cards

- [ ] Property cards lift 4px on hover
- [ ] Shadow increases on hover
- [ ] Transition is smooth (200ms)

#### Forms

- [ ] Form fields have focus animations
- [ ] Error messages appear smoothly
- [ ] Success states animate

## Performance Checks

### Frame Rate

1. Open DevTools Performance tab
2. Record while scrolling and interacting
3. Check for consistent 60fps
4. Look for layout shifts or jank

### Animation Smoothness

- [ ] No stuttering during animations
- [ ] Smooth transitions between states
- [ ] No layout shifts during animation
- [ ] GPU acceleration working (check DevTools Layers)

### Accessibility

1. Enable "Reduce Motion" in OS settings
2. Verify animations are reduced/disabled
3. Check that functionality still works
4. Verify keyboard navigation works with animations

## Browser Testing

Test in multiple browsers:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on macOS)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Common Issues & Solutions

### Animations not playing

- Check browser console for errors
- Verify Framer Motion is imported
- Ensure component has `'use client'` directive
- Check if variants are properly defined

### Janky animations

- Check if animating expensive properties (width, height)
- Reduce number of simultaneous animations
- Verify GPU acceleration is enabled
- Check for layout shifts

### Exit animations not working

- Ensure `AnimatePresence` wraps the component
- Verify component has unique `key` prop
- Check if `mode="wait"` is needed

### Mobile issues

- Test touch interactions
- Verify hover states don't stick on mobile
- Check mobile menu animations
- Test on actual devices, not just emulator

## Manual Test Scenarios

### Scenario 1: Browse and Book

1. Visit home page
2. Scroll through sections (check scroll reveals)
3. Hover over property cards (check hover effects)
4. Click "View Details" (check page transition)
5. Open booking form (check modal animation)
6. Submit form (check loading states)

### Scenario 2: Admin Dashboard

1. Login to admin
2. View dashboard (check stats card stagger)
3. Hover over stats cards (check lift effect)
4. Open booking details (check page transition)
5. Click check-in (check dialog animation)
6. Confirm action (check loading state)

### Scenario 3: Mobile Navigation

1. Open site on mobile/narrow viewport
2. Click hamburger menu (check slide animation)
3. Click menu items (check stagger effect)
4. Close menu (check exit animation)
5. Test theme toggle (check smooth transition)

## Automated Testing (Future)

While not implemented in this task, consider adding:

- Visual regression tests (Percy, Chromatic)
- Animation performance tests
- Accessibility tests for reduced motion
- E2E tests with animation assertions

## Success Criteria

All animations should:

- ✅ Run smoothly at 60fps
- ✅ Complete within specified durations
- ✅ Respect user motion preferences
- ✅ Not block functionality
- ✅ Enhance user experience
- ✅ Work across browsers
- ✅ Work on mobile devices

## Reporting Issues

If you find animation issues:

1. Note the specific component/page
2. Describe the expected vs actual behavior
3. Include browser and OS information
4. Check browser console for errors
5. Record a video if possible
6. Note performance metrics if relevant

## Resources

- Animation documentation: `lib/utils/ANIMATIONS-README.md`
- Implementation summary: `.kiro/specs/hotel-management-system/ANIMATIONS-IMPLEMENTATION.md`
- Framer Motion docs: https://www.framer.com/motion/
