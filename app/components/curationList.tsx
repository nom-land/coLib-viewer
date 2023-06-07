import { createIndexer } from "crossbell";
import { curationNote } from "../typings/types";
import { getAttr } from "../utils";

async function getData(recordId: string, communityId?: string) {
    const indexer = createIndexer();

    const backNotes = await indexer.note.getMany({
        toCharacterId: recordId,
        includeCharacter: true,
    });

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
    const curationNotesList = await getData(recordId);
    return (
        <div>
            Related notes:
            {/* <JsonViewer props={backNotes.list[0]}></JsonViewer> */}
            {curationNotesList.map((note) => (
                <div className="border p-5 my-5" key={note.raw.transactionHash}>
                    <div className="my-5">
                        Summary: Curator(id: {note.raw.characterId}) curates
                        this record on {note.dateString}
                    </div>
                    <div>Curator: {note.raw.characterId} </div>
                    <div>
                        {" "}
                        Curating in community#
                        {getAttr(
                            note.raw.metadata.content.attributes,
                            "curation community"
                        )}{" "}
                    </div>
                    <div>
                        Date:
                        {note.dateString}
                    </div>
                </div>
            ))}
        </div>
    );
}
