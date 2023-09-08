export default function Tags({ tags }: { tags: string[] }) {
    return (
        <div className="flex gap-3">
            {tags.map((tag, i) => (
                <div
                    key={i}
                    className="tag flex justify-center items-center gap-1 my-3"
                >
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
                    <span>{tag}</span>
                </div>
            ))}
        </div>
    );
}
