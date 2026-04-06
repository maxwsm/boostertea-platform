/**
 * Shim: next/link → wouter <Link>
 * Allows legacy Next.js Link imports to work in Vite SPA
 */
import React from 'react';
import { Link as WouterLink } from 'wouter';

const Link = React.forwardRef<HTMLAnchorElement, any>(
  ({ href, children, className, ...props }, ref) => {
    return (
      <WouterLink href={href || '/'} className={className} {...props}>
        {children}
      </WouterLink>
    );
  }
);

Link.displayName = 'NextLinkShim';

export default Link;
