import { createIndexer } from "crossbell";
import { curationNote } from "../typings/types";
import { getAttr } from "../utils";
import CharacterHeader from "./characterHeader";

async function getData(recordId: string, communityId?: string) {
    const indexer = createIndexer();

    const backNotes = await indexer.note.getMany({
        toCharacterId: recordId,
        includeCharacter: true,
    });
    console.log("count of backnotes: ", backNotes.list.length);

    const curationNotesList = [] as curationNote[];
    backNotes.list.map((n) => {
        const attrs = n.metadata?.content?.attributes;
        if (getAttr(attrs, "entity type") === "curation") {
            if (communityId) {
                if (
                    getAttr(attrs, "curation community")?.toString() !==
                    communityId
                ) {
                    return;
                }
            }
            curationNotesList.push({
                dateString:
                    (n.metadata?.content?.date_published &&
                        new Date(
                            n.metadata?.content?.date_published
                        ).toISOString()) ||
                    "",
                content: n.metadata?.content?.content?.toString() || "",
                curatorAvatars: n.character?.metadata?.content?.avatars || [],
                curatorName: n.character?.metadata?.content?.name || "",
                curatorHandle: n.character?.handle || "",
                suggestedTags:
                    (JSON.parse(
                        getAttr(
                            n.metadata?.content?.attributes,
                            "suggested tags"
                        ) as string
                    ) as string[]) || [],
                raw: n,
            });
        }
    });
    return curationNotesList;
}

export default async function CurationList({
    recordId,
    communityId,
}: {
    recordId: string;
    communityId?: string;
}) {
    const curationNotesList = await getData(recordId, communityId);
    return (
        <div className="my-5">
            Curated by:
            {/* <JsonViewer props={backNotes.list[0]}></JsonViewer> */}
            {curationNotesList.map((note) => (
                <div
                    className="card p-5 my-5 w-[48rem]"
                    key={note.raw.transactionHash}
                >
                    <CharacterHeader
                        name={note.curatorName}
                        date={note.dateString}
                        handle={note.curatorHandle}
                        avatar={note.curatorAvatars[0]}
                    />
                    <div className="py-5">{note.content}</div>
                    {note.suggestedTags.map((tag, i) => (
                        <div key={i}>#{tag}</div>
                    ))}
                </div>
            ))}
        </div>
    );
}
