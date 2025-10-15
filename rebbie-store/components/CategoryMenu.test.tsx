import { render, screen } from '@testing-library/react';
import CategoryMenu from './CategoryMenu';
import { categoryMenuList } from '@/lib/utils';

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('CategoryMenu', () => {
  it('renders all categories by default', () => {
    render(<CategoryMenu />);
    
    categoryMenuList.forEach(category => {
      expect(screen.getByText(category.title)).toBeInTheDocument();
    });
  });

  it('limits categories when maxCategories prop is provided', () => {
    render(<CategoryMenu maxCategories={4} />);
    
    const categoryLinks = screen.getAllByRole('link', { name: /Browse.*products/i });
    expect(categoryLinks).toHaveLength(4);
  });

  it('hides CTA button when showCTA is false', () => {
    render(<CategoryMenu showCTA={false} />);
    
    expect(screen.queryByText('View All Products')).not.toBeInTheDocument();
  });

  it('shows CTA button by default', () => {
    render(<CategoryMenu />);
    
    expect(screen.getByText('View All Products')).toBeInTheDocument();
  });

  it('renders with proper accessibility attributes', () => {
    render(<CategoryMenu />);
    
    const firstCategory = categoryMenuList[0];
    const link = screen.getByRole('link', { 
      name: `Browse ${firstCategory.title} products` 
    });
    
    expect(link).toHaveAttribute('title', `Shop ${firstCategory.title}`);
    expect(link).toHaveAttribute('aria-label', `Browse ${firstCategory.title} products`);
  });

  it('returns null when categoryMenuList is empty', () => {
    const originalList = [...categoryMenuList];
    (categoryMenuList as any).length = 0;
    
    const { container } = render(<CategoryMenu />);
    expect(container.firstChild).toBeNull();
    
    // Restore original list
    categoryMenuList.push(...originalList);
  });
});
