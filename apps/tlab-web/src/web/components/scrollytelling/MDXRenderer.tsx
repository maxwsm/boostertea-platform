import { MDXRemote } from 'next-mdx-remote/rsc';
import { BiometricPulse } from './BiometricPulse';
import { LiveMathB2B } from './LiveMathB2B';
import { WebGLXRay } from './WebGLXRay';
import { SugarRushTrigger } from './SugarRushTrigger';
// @ts-ignore
import { TeaTimeline } from '../blog/TeaTimeline';
// @ts-ignore
import { RecipeCard } from '../blog/RecipeCard';

const extractText = (node: any): string => {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && node.props && node.props.children) return extractText(node.props.children);
  return '';
};

const getSlug = (node: any) => extractText(node).toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');

const mdxComponents: any = {
  BiometricPulse,
  LiveMathB2B,
  WebGLXRay,
  SugarRushTrigger,
  TeaTimeline,
  RecipeCard,
  h1: (props: any) => <h1 className="text-4xl sm:text-6xl font-black mb-8 leading-tight tracking-tight" {...props} />,
  h2: (props: any) => <h2 id={getSlug(props.children)} className="text-3xl sm:text-4xl font-bold mt-12 mb-6 scroll-mt-24" {...props} />,
  h3: (props: any) => <h3 id={getSlug(props.children)} className="text-xl font-semibold mt-8 mb-3 scroll-mt-24" {...props} />,
  p: (props: any) => <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-6 leading-relaxed" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-[var(--accent)] pl-6 py-2 my-8 italic text-xl text-white/80 bg-white/5 rounded-r-lg" {...props} />
  ),
  hr: () => <hr className="border-t border-white/10 my-12" />,
  img: (props: any) => <img className="rounded-2xl max-w-full my-8" {...props} />
};

export const MDXRenderer = ({ source }: { source: string }) => {
  const contentMatch = source.match(/---[\s\S]*?---\s*([\s\S]*)/);
  const mdxBody = contentMatch ? contentMatch[1].trim() : source;

  return (
    <div className="prose prose-invert max-w-none w-full generative-scrollytelling-content">
      <MDXRemote source={mdxBody} components={mdxComponents} />
    </div>
  );
};
