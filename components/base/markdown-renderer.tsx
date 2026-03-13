import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

type MarkdownRendererProps = { children: string };

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
    return (
        <div className='max-w-full w-3xl prose prose-minimal-quote mx-auto'>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[remarkRehype]}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
