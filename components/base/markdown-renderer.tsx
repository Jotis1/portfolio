import ReactMarkdown from 'react-markdown';

type MarkdownRendererProps = { content: string };

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className='prose'>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
