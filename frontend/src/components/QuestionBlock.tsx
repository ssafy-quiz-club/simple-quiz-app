interface QuestionBlockProps {
    content: string;
}

export function QuestionBlock({ content }: QuestionBlockProps) {
    if (content.includes("```")) {
        // 백틱 제거 후 코드블록으로 감싸기
        const code = content.replace(/```/g, '');
        return (
            <pre style={{ background: '#0d1322', color: '#e8edf3', padding: '12px', borderRadius: '12px', overflowX: 'auto' }}>
        <code>{code}</code>
      </pre>
        );
    }

    // 일반 텍스트는 기존 Q 스타일 유지
    return <Q>{content}</Q>;
}
