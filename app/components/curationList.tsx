import { createIndexer } from "crossbell";
import { CurationNote } from "../typings/types";
import { getAttr, getCuration } from "../utils";
import NoteCard from "./noteCard";
import Link from "next/link";

interface CurationStat {
    replies: number;
}

async function getData(recordId: string, communityId?: string) {
    const indexer = createIndexer();

    const curations = await indexer.note.getMany({
        toCharacterId: recordId,
        includeCharacter: true,
    });
    const curationList = [] as CurationNote[];
    const curationStat = new Map<string, CurationStat>();
    curations.list.map((curationNote) => {
        const attrs = curationNote.metadata?.content?.attributes;
        const entityType = getAttr(attrs, "entity type");
        if (entityType === "curation" || entityType === "discussion") {
            if (communityId) {
                if (
                    getAttr(attrs, "curation community")?.toString() !==
                        communityId &&
                    getAttr(attrs, "discussion community")?.toString() !==
                        communityId
                ) {
                    return;
                }
            }
            console.log("Metadata", curationNote.metadata?.content?.attributes);

            const curation = getCuration(curationNote);

            curationList.push(curation);
        }
    });

    await Promise.all(
        curations.list.map(async (curationNote) => {
            const { count } = await indexer.note.getMany({
                toCharacterId: curationNote.characterId,
                toNoteId: curationNote.noteId,
                limit: 0,
            });
            const curationId =
                curationNote.characterId.toString() +
                "-" +
                curationNote.noteId.toString();
            curationStat.set(curationId, {
                replies: count,
            });
        })
    );

    return { curationList, curationStat };
}

export default async function CurationList({
    recordId,
    communityId,
}: {
    recordId: string;
    communityId?: string;
}) {
    const { curationList, curationStat } = await getData(recordId, communityId);
    return (
        <div className="my-5">
            Curated by:
            {/* <JsonViewer props={backNotes.list[0]}></JsonViewer> */}
            {curationList.map((note) => (
                <Link href={`/curation/${note.postId}`} key={note.postId}>
                    <NoteCard noteType="curation" note={note}>
                        <div className="flex gap-1 items-center">
                            <svg
                                className="h-5 w-5 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>

                            <span className="text-sm">
                                {curationStat.get(note.postId)?.replies || 0}
                            </span>
                        </div>
                    </NoteCard>
                </Link>
            ))}
        </div>
    );
}
