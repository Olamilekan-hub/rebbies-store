# CategoryMenu Component

## Overview
A production-ready, fully accessible React component that displays a grid of product categories with images, hover effects, and navigation links. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### ✅ Production Ready
- **TypeScript Support**: Fully typed with proper interfaces
- **Error Handling**: Graceful fallback for failed image loads
- **Accessibility**: Full ARIA labels and semantic HTML
- **Performance**: Optimized with Next.js Image component
- **Responsive**: Mobile-first design with adaptive grid
- **Dark Mode**: Complete dark mode support

### 🎨 Visual Features
- Smooth hover animations and transitions
- Gradient overlays and decorative elements
- Responsive grid layout (2 cols mobile, 4 cols desktop)
- Category images with fallback to initials
- Call-to-action button with icon

## Props

```typescript
interface CategoryMenuProps {
  maxCategories?: number;  // Limit number of categories to display
  showCTA?: boolean;       // Show/hide "View All Products" button (default: true)
}
```

## Usage

### Basic Usage
```tsx
import CategoryMenu from '@/components/CategoryMenu';

export default function HomePage() {
  return <CategoryMenu />;
}
```

### With Props
```tsx
// Show only first 4 categories without CTA button
<CategoryMenu maxCategories={4} showCTA={false} />

// Show first 6 categories with CTA button
<CategoryMenu maxCategories={6} />
```

## Data Structure

The component uses `categoryMenuList` from `@/lib/utils.ts`:

```typescript
interface CategoryMenuItem {
  id: number;
  title: string;
  src: string;
  href: string;
}
```

## Image Handling

### Optimization
- Uses Next.js `Image` component for automatic optimization
- Priority loading for first 4 categories (above the fold)
- Responsive sizes: `(max-width: 768px) 80px, 80px`

### Error Handling
- Automatically detects failed image loads
- Shows fallback with first letter of category name
- Maintains layout integrity

## Accessibility

### ARIA Attributes
- `aria-label` on all links for screen readers
- `aria-hidden="true"` on decorative elements
- `title` attributes for additional context

### Semantic HTML
- Proper heading hierarchy (`<h2>`, `<h3>`)
- Semantic `<section>` container
- Descriptive alt text for images

## Styling

### Responsive Breakpoints
- **Mobile**: 2 column grid with 6px gap
- **Tablet (md)**: 4 column grid
- **Desktop (lg)**: 8px gap

### Theme Support
- Light mode: Gray gradients with white background
- Dark mode: Dark gray gradients with dark background
- Purple/pink accent colors for hover states

## Performance Considerations

1. **Image Optimization**: Next.js automatically optimizes and serves WebP format
2. **Priority Loading**: First 4 categories load with priority for LCP
3. **Lazy Loading**: Categories 5-8 load lazily
4. **Code Splitting**: Client component with minimal bundle size
5. **CSS-only Animations**: No JavaScript animations for smooth 60fps

## Testing

The component includes a comprehensive test suite (`CategoryMenu.test.tsx`):

```bash
npm test CategoryMenu.test.tsx
```

### Test Coverage
- ✅ Renders all categories
- ✅ Respects maxCategories prop
- ✅ Shows/hides CTA button
- ✅ Accessibility attributes
- ✅ Empty state handling

## Browser Support

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-icons": "^5.0.0",
  "tailwindcss": "^3.0.0"
}
```

## Changelog

### v2.0.0 (Production Ready)
- ✅ Replaced `<img>` with Next.js `<Image>` component
- ✅ Added TypeScript interfaces and props
- ✅ Implemented image error handling with fallback
- ✅ Added full accessibility support (ARIA labels)
- ✅ Added props for flexibility (maxCategories, showCTA)
- ✅ Removed unused imports and variables
- ✅ Added comprehensive test suite
- ✅ Optimized performance with priority loading
- ✅ Added documentation

### v1.0.0 (Initial)
- Basic category grid with hover effects

## Future Enhancements

Potential improvements for future versions:
- [ ] Skeleton loading state
- [ ] Animation on scroll
- [ ] Category count badges
- [ ] Search/filter functionality
- [ ] Virtual scrolling for large lists
- [ ] Drag-to-reorder in admin
- [ ] Analytics tracking

## License

This component is part of Rebbie's Store project.

## Support

For issues or questions, please contact the development team.
