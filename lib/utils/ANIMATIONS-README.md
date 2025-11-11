# Animation System Documentation

This document describes the animation system implemented in the Hotel Management System using Framer Motion.

## Overview

The animation system provides consistent, performant animations across the application. All animation variants are centralized in `lib/utils/animations.ts` for easy maintenance and reusability.

## Animation Variants

### Page Transitions

**`pageVariants`** - For page-level transitions

- Fade in/out with subtle vertical movement
- Duration: 300ms (in), 200ms (out)
- Use in: Page components, route transitions

```tsx
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/utils/animations';

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {/* Page content */}
</motion.div>;
```

### Fade Animations

**`fadeInVariants`** - Simple fade in/out

- Duration: 300ms (in), 200ms (out)
- Use in: Overlays, tooltips, simple reveals

**`slideUpVariants`** - Slide up with fade

- Starts 30px below, fades in
- Duration: 400ms
- Use in: Cards, sections, content blocks

**`slideInLeftVariants`** / **`slideInRightVariants`** - Horizontal slides

- Starts 30px from side, fades in
- Duration: 400ms
- Use in: Sidebars, drawers, side panels

### Interactive Animations

**`cardHoverVariants`** - Card hover effect

- Lifts card 4px on hover
- Adds shadow
- Duration: 200ms
- Use in: Property cards, room cards, any hoverable cards

```tsx
<motion.div variants={cardHoverVariants} initial="initial" whileHover="hover">
  <Card>{/* Card content */}</Card>
</motion.div>
```

**`buttonHoverVariants`** - Button interactions

- Scale: 1.02 on hover, 0.98 on tap
- Duration: 150ms (hover), 100ms (tap)
- Use in: Buttons, clickable elements

```tsx
<motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
  <Button>Click me</Button>
</motion.div>
```

### Modal & Dialog Animations

**`modalVariants`** - Modal/dialog entrance

- Scale from 0.95 with fade and slight vertical movement
- Duration: 300ms (in), 200ms (out)
- Easing: Custom cubic-bezier
- Use in: Dialogs, modals, popups

**`drawerVariants`** - Side drawer slide

- Slides from right (100% to 0)
- Duration: 300ms
- Use in: Side panels, navigation drawers

### Scroll Animations

**`scrollRevealVariants`** - Scroll-triggered reveal

- Starts 50px below with opacity 0
- Duration: 600ms
- Use in: Sections that should reveal on scroll

```tsx
import { ScrollReveal } from '@/components/shared/scroll-reveal';

<ScrollReveal>
  <Section>{/* Content */}</Section>
</ScrollReveal>;
```

### Loading Animations

**`pulseVariants`** - Pulsing opacity

- Oscillates between 0.6 and 1.0
- Duration: 1s, infinite loop
- Use in: Skeleton loaders, loading states

**`bounceVariants`** - Bouncing animation

- Moves up 10px and back
- Duration: 600ms, infinite loop
- Use in: Loading indicators, attention grabbers

### Stagger Animations

**`staggerContainerVariants`** - Container for staggered children

- Staggers children by 100ms
- Use in: Lists, grids that should animate in sequence

```tsx
<motion.div
  variants={staggerContainerVariants}
  initial="initial"
  animate="animate"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={slideUpVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Reusable Components

### PageTransition

Wraps page content with automatic route-based transitions.

```tsx
import { PageTransition } from '@/components/shared/page-transition';

<PageTransition>
  <YourPageContent />
</PageTransition>;
```

### ScrollReveal

Reveals content when scrolled into view.

```tsx
import { ScrollReveal } from '@/components/shared/scroll-reveal';

<ScrollReveal delay={0.2} once={true}>
  <YourContent />
</ScrollReveal>;
```

### StaggeredScrollReveal

Reveals multiple items with stagger effect.

```tsx
import { StaggeredScrollReveal } from '@/components/shared/scroll-reveal';

<StaggeredScrollReveal staggerDelay={0.1}>
  {items.map((item) => (
    <ItemComponent key={item.id} {...item} />
  ))}
</StaggeredScrollReveal>;
```

### AnimatedButton

Button with built-in hover and tap animations.

```tsx
import { AnimatedButton } from '@/components/shared/animated-button';

<AnimatedButton variant="default" size="lg">
  Click Me
</AnimatedButton>;
```

### Skeleton Loaders

Animated skeleton components for loading states.

```tsx
import {
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  StatsCardSkeleton,
  ChartSkeleton,
  FormSkeleton,
  PageSkeleton,
} from '@/components/shared/skeleton';

// Use specific skeleton for your use case
<CardSkeleton />
<TableSkeleton rows={5} />
<StatsCardSkeleton />
```

## Enhanced UI Components

### Dialog

Dialogs now have smooth scale and fade animations with backdrop blur.

```tsx
import { Dialog, DialogContent } from '@/components/ui/dialog';

<Dialog>
  <DialogContent>{/* Automatically animated */}</DialogContent>
</Dialog>;
```

### StatsCard

Stats cards animate in with stagger effect when index is provided.

```tsx
<StatsCard
  title="Total Revenue"
  value="$12,345"
  icon={DollarSign}
  index={0} // Enables stagger animation
/>
```

## Best Practices

### Performance

1. **Use `initial={false}`** for components that mount frequently to skip initial animation
2. **Set `once={true}`** on scroll animations to prevent re-triggering
3. **Avoid animating expensive properties** like `width`, `height` - use `transform` instead
4. **Use `will-change` sparingly** - Framer Motion handles this automatically

### Accessibility

1. **Respect `prefers-reduced-motion`** - Framer Motion respects this by default
2. **Keep animations short** - Most animations are 200-400ms
3. **Provide skip options** for long animations
4. **Don't rely solely on animation** to convey information

### Consistency

1. **Use predefined variants** from `animations.ts` instead of inline animations
2. **Follow the timing conventions**:
   - Quick interactions: 150-200ms
   - Standard transitions: 300-400ms
   - Scroll reveals: 500-600ms
3. **Use consistent easing**: `easeOut` for entrances, `easeIn` for exits

### Common Patterns

#### Animated List

```tsx
<motion.div
  variants={staggerContainerVariants}
  initial="initial"
  animate="animate"
>
  {items.map((item, index) => (
    <motion.div key={item.id} variants={slideUpVariants}>
      <ItemCard {...item} />
    </motion.div>
  ))}
</motion.div>
```

#### Hover Card

```tsx
<motion.div variants={cardHoverVariants} initial="initial" whileHover="hover">
  <Card>
    <CardContent>{/* Content */}</CardContent>
  </Card>
</motion.div>
```

#### Scroll Section

```tsx
<ScrollReveal delay={0.2}>
  <section className="py-16">
    <h2>Section Title</h2>
    <p>Section content...</p>
  </section>
</ScrollReveal>
```

## Troubleshooting

### Animation not working

1. Check if component is wrapped in `'use client'` directive
2. Verify Framer Motion is imported correctly
3. Ensure variants are properly defined
4. Check if `AnimatePresence` is needed for exit animations

### Janky animations

1. Avoid animating `width`, `height`, `top`, `left` - use `transform` instead
2. Check for layout shifts during animation
3. Reduce number of simultaneous animations
4. Use `layout` prop for layout animations

### Exit animations not playing

1. Wrap with `AnimatePresence` component
2. Ensure component has a unique `key` prop
3. Set `mode="wait"` on `AnimatePresence` if needed

## Examples

See the following components for implementation examples:

- **Public Portal**: `components/public/property-card.tsx`, `components/public/navbar.tsx`
- **Admin Dashboard**: `components/admin/stats-card.tsx`
- **Shared Components**: `components/shared/skeleton.tsx`, `components/shared/scroll-reveal.tsx`
- **UI Components**: `components/ui/dialog.tsx`

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Animation Principles](https://www.framer.com/motion/animation/)
- [Gestures](https://www.framer.com/motion/gestures/)
- [Scroll Animations](https://www.framer.com/motion/scroll-animations/)
