# StayFinder Design System

## Overview

StayFinder uses a modern, travel-focused design system that emphasizes trust, comfort, and adventure. The design is clean, minimal, and optimized for both desktop and mobile experiences.

## Color Palette

### Primary Colors (Teal/Blue)

- **Primary 50**: `#f0fdfa` - Very light teal background
- **Primary 100**: `#ccfbf1` - Light teal background
- **Primary 200**: `#99f6e4` - Light teal accent
- **Primary 300**: `#5eead4` - Medium light teal
- **Primary 400**: `#2dd4bf` - Medium teal
- **Primary 500**: `#14b8a6` - Base teal
- **Primary 600**: `#0d9488` - Primary button/links
- **Primary 700**: `#0f766e` - Hover states
- **Primary 800**: `#115e59` - Dark teal
- **Primary 900**: `#134e4a` - Very dark teal

### Secondary Colors (Warm Sand)

- **Secondary 50**: `#fffbeb` - Very light sand
- **Secondary 100**: `#fef3c7` - Light sand background
- **Secondary 200**: `#fde68a` - Light sand accent
- **Secondary 300**: `#fcd34d` - Medium light sand
- **Secondary 400**: `#fbbf24` - Medium sand
- **Secondary 500**: `#f59e0b` - Base sand (accent color)
- **Secondary 600**: `#d97706` - Dark sand
- **Secondary 700**: `#b45309` - Very dark sand
- **Secondary 800**: `#92400e` - Darkest sand
- **Secondary 900**: `#78350f` - Very darkest sand

### Accent Colors (Coral)

- **Accent 50**: `#fff7ed` - Very light coral
- **Accent 100**: `#ffedd5` - Light coral background
- **Accent 200**: `#fed7aa` - Light coral accent
- **Accent 300**: `#fdba74` - Medium light coral
- **Accent 400**: `#fb923c` - Medium coral
- **Accent 500**: `#f97316` - Base coral (highlight color)
- **Accent 600**: `#ea580c` - Dark coral
- **Accent 700**: `#c2410c` - Very dark coral
- **Accent 800**: `#9a3412` - Darkest coral
- **Accent 900**: `#7c2d12` - Very darkest coral

### Neutral Colors (Cool Grays)

- **Gray 50**: `#f8fafc` - Very light gray (background)
- **Gray 100**: `#f1f5f9` - Light gray background
- **Gray 200**: `#e2e8f0` - Light gray borders
- **Gray 300**: `#cbd5e1` - Medium light gray
- **Gray 400**: `#94a3b8` - Medium gray (placeholder text)
- **Gray 500**: `#64748b` - Medium gray (secondary text)
- **Gray 600**: `#475569` - Dark gray (body text)
- **Gray 700**: `#334155` - Dark gray
- **Gray 800**: `#1e293b` - Very dark gray (headings)
- **Gray 900**: `#0f172a` - Darkest gray

### Semantic Colors

- **Success 50**: `#ecfdf5` - Light success background
- **Success 100**: `#d1fae5` - Success background
- **Success 500**: `#10b981` - Success text/icon
- **Success 600**: `#059669` - Dark success

- **Error 50**: `#fef2f2` - Light error background
- **Error 100**: `#fee2e2` - Error background
- **Error 500**: `#f43f5e` - Error text/icon
- **Error 600**: `#e11d48` - Dark error

## Typography

### Font Families

- **Primary Font**: Inter - Clean, modern sans-serif for body text
- **Heading Font**: Poppins - Friendly, approachable sans-serif for headings

### Font Weights

- **300**: Light (Inter only)
- **400**: Regular
- **500**: Medium
- **600**: Semibold
- **700**: Bold

### Font Sizes

- **H1**: 2.5rem (40px) - Page titles
- **H2**: 2rem (32px) - Section headings
- **H3**: 1.5rem (24px) - Subsection headings
- **Body**: 1rem (16px) - Default text
- **Small**: 0.875rem (14px) - Secondary text
- **Extra Small**: 0.75rem (12px) - Captions

### Line Heights

- **Headings**: 1.2
- **Body**: 1.6

## Spacing System

### Border Radius

- **Small**: 0.375rem (6px) - Small elements
- **Medium**: 0.5rem (8px) - Buttons, inputs
- **Large**: 0.75rem (12px) - Cards
- **Extra Large**: 1rem (16px) - Large cards

### Shadows

- **Small**: `0 1px 2px 0 rgb(0 0 0 / 0.05)` - Subtle elevation
- **Medium**: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` - Cards
- **Large**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` - Elevated cards
- **Extra Large**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` - Modals

## Components

### Button Component

```tsx
import Button from '@/components/Button';

// Primary button (default)
<Button variant="primary">Sign In</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Outline button
<Button variant="outline">Learn More</Button>

// Ghost button
<Button variant="ghost">Skip</Button>

// With loading state
<Button variant="primary" isLoading={true}>Processing...</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Input Component

```tsx
import Input from '@/components/Input';

// Basic input
<Input label="Email" placeholder="Enter your email" />

// With icon
<Input
  label="Email"
  leftIcon={<EmailIcon />}
  placeholder="Enter your email"
/>

// With error
<Input
  label="Email"
  error="Please enter a valid email address"
/>

// With helper text
<Input
  label="Password"
  helperText="Must be at least 8 characters"
/>
```

### Card Component

```tsx
import Card from '@/components/Card';

// Default card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Elevated card
<Card variant="elevated">
  <h3>Elevated Card</h3>
</Card>

// Outlined card
<Card variant="outlined">
  <h3>Outlined Card</h3>
</Card>

// Different padding
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding (default)</Card>
<Card padding="lg">Large padding</Card>
<Card padding="none">No padding</Card>

// Clickable card
<Card onClick={() => console.log('Card clicked')}>
  <h3>Clickable Card</h3>
</Card>
```

### Navigation Component

```tsx
import Navigation from '@/components/Navigation';

// Default navigation (shows user info and logout)
<Navigation />

// Navigation without user info
<Navigation showUserInfo={false} />

// Navigation without logout button
<Navigation showLogout={false} />
```

## CSS Classes

### Utility Classes

- `.btn` - Base button styles
- `.btn-primary` - Primary button variant
- `.btn-secondary` - Secondary button variant
- `.btn-outline` - Outline button variant
- `.form-input` - Base input styles
- `.card` - Base card styles
- `.fade-in` - Fade in animation
- `.slide-up` - Slide up animation

### Color Classes

- `.text-primary-600` - Primary text color
- `.bg-primary-50` - Primary background color
- `.border-primary-200` - Primary border color
- `.text-secondary-500` - Secondary text color
- `.bg-secondary-100` - Secondary background color
- `.text-accent-500` - Accent text color
- `.bg-accent-100` - Accent background color

## Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations

- Reduced font sizes for headings
- Smaller button padding
- Stacked layouts instead of grids
- Touch-friendly button sizes (minimum 44px)

## Animation Guidelines

### Transitions

- **Duration**: 200ms for most interactions
- **Easing**: ease-in-out for smooth feel
- **Hover Effects**: Subtle scale and shadow changes

### Loading States

- Use spinning icons for loading states
- Maintain button size during loading
- Show loading text when appropriate

## Accessibility

### Color Contrast

- All text meets WCAG AA standards (4.5:1 ratio)
- Interactive elements have sufficient contrast
- Error states are clearly distinguishable

### Focus States

- All interactive elements have visible focus indicators
- Focus rings use primary color with proper offset
- Keyboard navigation is fully supported

### Screen Readers

- Proper ARIA labels on form inputs
- Semantic HTML structure
- Descriptive alt text for images

## Best Practices

### Color Usage

- Use primary colors for main actions and branding
- Use secondary colors for highlights and accents
- Use accent colors sparingly for important calls-to-action
- Use neutral colors for text and backgrounds

### Typography

- Use Poppins for headings to create hierarchy
- Use Inter for body text for readability
- Maintain consistent font weights within sections
- Use appropriate line heights for readability

### Spacing

- Use consistent spacing throughout the interface
- Group related elements with appropriate spacing
- Use white space to create visual hierarchy
- Ensure touch targets are at least 44px on mobile

### Component Usage

- Use the provided components for consistency
- Extend components rather than creating new ones
- Follow the established patterns for similar functionality
- Test components across different screen sizes
