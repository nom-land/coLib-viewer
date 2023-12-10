"use client";

export default function Tags({ tags, cid }: { tags: string[]; cid: string }) {
    const links = tags.map(
        (tag) =>
            `/community/${encodeURIComponent(cid)}/tag/${encodeURIComponent(
                tag
            )}`
    );

    return (
        <div className="flex flex-wrap justify-start">
            {tags.map((tag, i) => (
                <div key={i}>
                    <div
                        key={i}
                        onClick={(e) => {
                            e.preventDefault();
                            window.open(links[i], "_blank");
                        }}
                    >
                        <div className="hover:bg-callout-background-focused transition-background duration-200 ease-in-out tag flex justify-center items-center gap-1 mb-2 mr-2">
                            <svg
                                className="h-4 w-4 text-black"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {" "}
                                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                                <path d="M11 3L20 12a1.5 1.5 0 0 1 0 2L14 20a1.5 1.5 0 0 1 -2 0L3 11v-4a4 4 0 0 1 4 -4h4" />{" "}
                                <circle cx="9" cy="9" r="2" />
                            </svg>
                            <span className="whitespace-nowrap">{tag}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
