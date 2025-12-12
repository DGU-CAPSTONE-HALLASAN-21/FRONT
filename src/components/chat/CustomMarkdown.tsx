import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CustomMarkdownProps {
  message: string;
}

const CustomMarkdown = ({ message }: CustomMarkdownProps) => {
  return (
    <div className="prose prose-sm max-w-none prose-table:border-collapse prose-th:bg-gray-100 prose-td:border prose-td:border-gray-300 prose-th:border prose-th:border-gray-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 1. 본문 (가장 중요): 줄간격 넓히고(leading-relaxed), 문단 사이 띄우기(mb-4)
          p: (props) => (
            <p
              className="leading-relaxed mb-4 text-gray-700 last:mb-0"
              {...props}
            />
          ),

          // 2. 리스트 아이템: 줄간격 맞추고, 항목 사이 살짝 띄우기
          li: (props) => (
            <li
              className="leading-relaxed my-1 marker:text-gray-400"
              {...props}
            />
          ),
          // --- 제목 스타일 ---
          h1: (props) => (
            <h1
              className="text-2xl font-bold mt-10 mb-4 text-red-900 border-b pb-2 border-purple-100"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="text-xl font-bold mt-5 mb-3 text-gray-800"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="text-lg font-bold mt-4 mb-2 text-gray-800"
              {...props}
            />
          ),

          // 1. 표 전체 틀: 테두리 없애고(border-none), 너비 꽉 채움
          table: (props) => (
            <div className="overflow-x-auto my-4">
              <table
                className="w-full text-sm text-left border-collapse"
                {...props}
              />
            </div>
          ),
          // 2. 헤더 배경: 아주 연한 보라색으로 포인트
          thead: (props) => (
            <thead className="bg-purple-50/50 text-gray-700" {...props} />
          ),
          // 3. 행 스타일: 마우스 올리면 살짝 회색
          tr: (props) => (
            <tr
              className="border-b border-gray-100 last:border-none hover:bg-gray-50/50 transition-colors"
              {...props}
            />
          ),
          // 4. 헤더 셀: 굵은 글씨, 패딩 넉넉하게
          th: (props) => (
            <th
              className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-gray-500"
              {...props}
            />
          ),
          // 5. 데이터 셀: 패딩 넉넉하게, 기본 글씨
          td: (props) => <td className="px-4 py-3 text-gray-600" {...props} />,
          // 6. 리스트 스타일 복구 (마크다운 점/숫자)
          ul: (props) => (
            // list-outside: 점을 글자 바깥으로 뺌
            // ml-5: 바깥으로 빠진 점이 잘리지 않게 왼쪽 여백 확보
            <ul
              className="list-disc list-outside ml-5 space-y-2 my-4 text-gray-700"
              {...props}
            />
          ),
          ol: (props) => (
            // list-decimal: 숫자 스타일
            <ol
              className="list-decimal list-outside ml-5 space-y-2 my-4 text-gray-700"
              {...props}
            />
          ),
          // 7. 강조 구문 (Bold)
          strong: (props) => (
            <strong className="font-semibold text-purple-700" {...props} />
          ),
          // 8. 링크
          a: (props) => (
            <a
              className="text-blue-500 hover:underline cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // 인용구 스타일 (AI 답변에서 자주 쓰임)
          blockquote: (props) => (
            <blockquote
              className="border-l-4 border-purple-200 pl-4 py-1 my-2 italic text-gray-600 bg-gray-50/50 rounded-r"
              {...props}
            />
          ),
        }}
      >
        {message}
      </ReactMarkdown>
    </div>
  );
};

export default CustomMarkdown;
