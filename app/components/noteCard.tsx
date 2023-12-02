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
    listIds?: Map<string, number>;
    children?: JSX.Element;
}) {
    const noteCss = noteType === "curation" ? "px-3 py-5 w-content" : "p-3";
    return (
        <div className={noteCss} key={note.raw.transactionHash}>
            <CharacterHeader
                name={note.curatorName}
                date={note.dateString}
                handle={note.curatorHandle}
                avatar={note.curatorAvatars[0]}
            />
            {/* {noteType === "curation" && listIds && (
                <div className="text-lg my-5">
                    add it to list{" "}
                    <span className="text-2xl">
                        {note.listNames.map((l, i) => (
                            <Link key={i} href={`/list/${listIds.get(l)}`}>
                                {l}{" "}
                                {i !== note.listNames.length - 1 ? ", " : ""}
                            </Link>
                        ))}{" "}
                    </span>
                </div>
            )} */}
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
