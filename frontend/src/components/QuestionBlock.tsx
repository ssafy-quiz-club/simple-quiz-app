import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

interface QuestionBlockProps {
    content: string;
}


export function QuestionBlock({ content }: QuestionBlockProps) {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    const elements: JSX.Element[] = [];
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(content)) !== null) {
        // 코드 블록 전 일반 텍스트
        if (match.index > lastIndex) {
            elements.push(<Q key={lastIndex}>{content.slice(lastIndex, match.index)}</Q>);
        }

        const lang = match[1] || 'text'; // 언어 없으면 기본 text
        const code = match[2];

        elements.push(
            <SyntaxHighlighter
                key={match.index}
                language={lang}
                style={materialDark}
                customStyle={{
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    overflowX: 'auto',
                }}
            >
                {code}
            </SyntaxHighlighter>
        );

        lastIndex = match.index + match[0].length;
    }

    // 마지막 텍스트
    if (lastIndex < content.length) {
        elements.push(<Q key={lastIndex}>{content.slice(lastIndex)}</Q>);
    }

    return <>{elements}</>;
}

const Q = styled.div`
    font-size: 22px;
    line-height: 1.6;
    margin: 12px 0 20px;
    letter-spacing: 0.1px;
    color: #e8edf3;
    font-weight: 500;
`;
