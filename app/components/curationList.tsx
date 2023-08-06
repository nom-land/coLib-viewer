import NoteCard from "./noteCard";
import Link from "next/link";
import { getCurationData } from "../apis";
import NoteStatLine from "./noteStatLine";

export default async function CurationList({
    recordId,
    communityId,
}: {
    recordId: string;
    communityId?: string;
    listName?: string;
}) {
    const { curationList, curationStat } = await getCurationData(
        recordId,
        communityId
    );
    return (
        <div className="my-5">
            Curated by:
            {/* <JsonViewer props={backNotes.list[0]}></JsonViewer> */}
            {curationList.map((note) => (
                <Link href={`/curation/${note.postId}`} key={note.postId}>
                    <NoteCard noteType="curation" note={note}>
                        <NoteStatLine
                            replies={
                                curationStat.get(note.postId)?.replies || 0
                            }
                        />
                    </NoteCard>
                </Link>
            ))}
        </div>
    );
}
