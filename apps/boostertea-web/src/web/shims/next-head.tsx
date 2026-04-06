/**
 * Shim: next/head → noop
 * next/head is not needed in Vite SPA (we use our SEO component)
 */
import React from 'react';

export default function Head({ children }: { children?: React.ReactNode }) {
  return null;
}
