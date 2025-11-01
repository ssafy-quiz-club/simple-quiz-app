import styled from 'styled-components';

interface QuestionBlockProps {
    content: string;
}

export function QuestionBlock({ content }: QuestionBlockProps) {
    const regex = /```([\s\S]*?)```/g;
    const elements: JSX.Element[] = [];
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(content)) !== null) {
        // 코드 블록 전 일반 텍스트
        if (match.index > lastIndex) {
            elements.push(<Q key={lastIndex}>{content.slice(lastIndex, match.index)}</Q>);
        }

        // 코드 블록
        elements.push(
            <pre
                key={match.index}
                style={{
                    background: '#0d1322',
                    color: '#e8edf3',
                    padding: '12px',
                    borderRadius: '12px',
                    overflowX: 'auto',
                }}
            >
        <code>{match[1]}</code>
      </pre>
        );

        lastIndex = match.index + match[0].length;
    }

    // 마지막 코드 블록 이후 일반 텍스트
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
