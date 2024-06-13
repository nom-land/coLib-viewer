"use client";

import ReactMarkdown from "react-markdown";

export default function DescriptionSection({
    description,
}: {
    description: string;
}) {
    return (
        <ReactMarkdown className="community-desc" linkTarget="_blank">
            {description}
        </ReactMarkdown>
    );
}
