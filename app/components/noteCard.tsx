import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { CurationNote } from "../typings/types";
import CharacterHeader from "./characterHeader";
import Tags from "./tags";

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
    const noteCss =
        noteType === "curation"
            ? "card p-5 my-5 w-content md:w-[48rem]"
            : "p-3";
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
            {note.title.length > 0 && (
                <div className="text-2xl font-bold my-3">{note.title}</div>
            )}
            <div className="my-3">
                <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
            <Tags tags={note.suggestedTags}></Tags>

            <div className="mt-3">{children}</div>
        </div>
    );
}
