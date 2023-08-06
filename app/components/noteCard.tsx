import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { CurationNote } from "../typings/types";
import CharacterHeader from "./characterHeader";

// return a component
export default function NoteCard({
    note,
    noteType,
    children,
}: {
    note: CurationNote;
    noteType: "curation" | "discussion";
    children?: JSX.Element;
}) {
    const noteCss = noteType === "curation" ? "card p-5 my-5 w-[48rem]" : "p-3";
    return (
        <div className={noteCss} key={note.raw.transactionHash}>
            <CharacterHeader
                name={note.curatorName}
                date={note.dateString}
                handle={note.curatorHandle}
                avatar={note.curatorAvatars[0]}
            />
            {noteType === "curation" && (
                <div className="text-lg my-5">
                    <span className="text-sm font-extralight">
                        {" "}
                        add it to list{" "}
                    </span>
                    <span className="m-1 text-2xl">
                        {note.listNames.join(", ")}
                    </span>
                </div>
            )}

            <div className="my-3">
                <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
            <div className="flex gap-3">
                {note.suggestedTags.map((tag, i) => (
                    <div
                        key={i}
                        className="tag flex justify-center items-center gap-1 my-3"
                    >
                        <svg
                            className="h-4 w-4 text-black"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
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

            <div className="mt-3">{children}</div>
        </div>
    );
}
