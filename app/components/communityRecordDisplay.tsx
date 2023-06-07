import JsonViewer from "@/app/components/jsonViewer";
import RecordCard from "@/app/components/recordCard";
import { ViewMode } from "@/app/typings/types";
import { LinkEntity, NoteEntity, createIndexer } from "crossbell";
import CurationList from "./curationList";
const appName = "coLib";

async function getData(id: string) {
    const indexer = createIndexer();
    const backLinks = await indexer.link.getBacklinksOfCharacter(id); //TODO: limit...

    const backNotes = await indexer.note.getMany({
        toCharacterId: id,
        includeCharacter: true,
    });
    return { backLinks, backNotes };
}

interface curationNote {
    raw: NoteEntity;
    dateString: string;
}

interface CommunityCurationList {
    raw: LinkEntity;
    communityId: string;
    list: string;
}

export default async function CommunityRecordDisplay({
    props,
}: {
    props: { id: string; rid: string; viewMode: ViewMode };
}) {
    const { id, rid, viewMode } = props;
    const { backLinks, backNotes } = await getData(rid);
    const l = backLinks.list.filter((link) =>
        link.linkType.startsWith(appName)
    ).length; //TODO: only "dao" character

    const curationList = [] as CommunityCurationList[];
    backLinks.list.map((l) => {
        if (l.linkType.startsWith(appName + "-")) {
            const listName = l.linkType.slice(appName.length + 1);
            curationList.push({
                raw: l,
                communityId: l.fromCharacterId!.toString(),
                list: listName,
            });
        }
    });

    const curationNotesList = [] as curationNote[];
    backNotes.list.map((n) => {
        if (
            n.metadata?.content?.attributes?.find(
                (a) => a.trait_type === "entity type"
            )?.value === "curation"
        ) {
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

    return (
        <div>
            {viewMode === "normal" && (
                <div>
                    <RecordCard id={rid}></RecordCard>
                    <CurationList
                        recordId={rid}
                        communityId={id}
                    ></CurationList>
                </div>
            )}
            {viewMode === "analyzed" && (
                <div>
                    <div>Record Id: {rid}</div>

                    <RecordCard id={rid}></RecordCard>
                    <div>
                        This record is curated in {l} communities. And there are{" "}
                        {backNotes.count} related notes.
                        {/* TODO: It is related with {backLinks.count} links. Parse each link. */}
                    </div>

                    <div>
                        Related notes:
                        {/* <JsonViewer props={backNotes.list[0]}></JsonViewer> */}
                        {curationNotesList.map((note) => (
                            <div key={note.raw.transactionHash}>
                                <div className="my-5">
                                    Summary: Curator(id: {note.raw.characterId})
                                    curates this record on {note.dateString}
                                </div>
                                <div className="border p-5 my-5">
                                    <div>Curator: {note.raw.characterId} </div>
                                    <JsonViewer
                                        props={
                                            note.raw.character?.metadata || {}
                                        }
                                    ></JsonViewer>
                                    <div>
                                        Date:
                                        {note.dateString}
                                    </div>
                                    <div>
                                        Curation note detailed metadata:{" "}
                                        <JsonViewer
                                            props={note.raw.metadata || {}}
                                        ></JsonViewer>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
