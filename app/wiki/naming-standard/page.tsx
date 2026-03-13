import fs from 'node:fs';
import path from 'node:path';
import MarkdownRenderer from '@/components/base/markdown-renderer';
import { Sidebar } from '@/components/sidebar';

export default function Page() {
    const filePath = path.join(process.cwd(), 'content', 'naming-standard.md');
    const content = fs.readFileSync(filePath, 'utf8');

    return (
        <main className='py-24 lg:px-8 px-4 flex'>
            <Sidebar />
            <MarkdownRenderer>{content}</MarkdownRenderer>
        </main>
    );
}
