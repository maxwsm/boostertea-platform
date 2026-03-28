'use client'

import dynamic from 'next/dynamic'
import { Providers } from '../../providers'
import type { BlogPostMeta, TocItem } from '../../../src/web/lib/blog/types'

const Page = dynamic(() => import('../../../src/web/pages/blog-post'), { ssr: false })

interface Props {
  slug: string;
  meta: BlogPostMeta;
  toc: TocItem[];
  children?: React.ReactNode;
}

export function BlogPostClient(props: Props) {
  return <Providers><Page {...props} /></Providers>
}
