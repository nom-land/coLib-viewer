export default function NoteStatLine({ replies }: { replies: number }) {
    return (
        <div className="flex gap-1 items-center">
            <svg
                className="h-5 w-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
            </svg>

            <span className="text-sm">{replies}</span>
        </div>
    );
}
