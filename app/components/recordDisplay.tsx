import JsonViewer from "@/app/components/jsonViewer";
import RecordCard from "@/app/components/recordCard";
import { ViewMode, CurationNote } from "@/app/typings/types";
import { LinkEntity, NoteEntity, createIndexer } from "crossbell";
import CurationList from "./curationList";
import Link from "next/link";
import { getAttr } from "../utils";
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

interface CommunityCurationList {
    raw: LinkEntity;
    communityId: string;
    list: string;
}

export default async function RecordDisplay({
    props,
}: {
    props: { rid: string; viewMode: ViewMode };
}) {
    const { rid, viewMode } = props;
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

    const curationNotesList = [] as CurationNote[];
    backNotes.list.map((n) => {
        const attrs = n.metadata?.content?.attributes;

        if (
            attrs?.find((a) => a.trait_type === "entity type")?.value ===
            "curation"
        ) {
            curationNotesList.push({
                postId: n.characterId.toString() + "-" + n.noteId.toString(),
                recordId: getAttr(attrs, "curation record") as string,
                communityId: getAttr(attrs, "curation community") as string,

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
                        getAttr(attrs, "suggested tags") as string
                    ) as string[]) || [],
                listNames: [],
                raw: n,
            });
        }
    });

    return (
        <div>
            {viewMode === "normal" && (
                <div>
                    <RecordCard
                        viewMode="normal"
                        id={rid}
                        context="app"
                    ></RecordCard>

                    <div>
                        <div className="my-5">Related communities:</div>
                        <div className="grid">
                            {curationList.map((c) => (
                                <div
                                    className="card w-[18rem]"
                                    key={c.raw.transactionHash}
                                >
                                    <div className="text-xl font-bold">
                                        {c.list}
                                    </div>
                                    <div>
                                        in{" "}
                                        <Link
                                            href={`./community/${c.communityId}`}
                                        >
                                            <span className="font-bold">
                                                {
                                                    c.raw.fromCharacter
                                                        ?.metadata?.content
                                                        ?.name
                                                }
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <CurationList recordId={rid}></CurationList>
                </div>
            )}
            {viewMode === "analyzed" && (
                <div>
                    <div>Record Id: {props.rid}</div>

                    <RecordCard
                        viewMode="analyzed"
                        id={props.rid}
                        context="app"
                    ></RecordCard>
                    <div>
                        This record is curated in {l} communities. And there are{" "}
                        {backNotes.count} related notes.
                        {/* TODO: It is related with {backLinks.count} links. Parse each link. */}
                    </div>
                    <div>Related communities:</div>
                    {curationList.map((c) => (
                        <div className="border" key={c.raw.transactionHash}>
                            <div>Community id: {c.communityId}</div>
                            <JsonViewer
                                props={c.raw.fromCharacter?.metadata || {}}
                            ></JsonViewer>
                            <div>Curation list: {c.list}</div>
                        </div>
                    ))}
                    <hr></hr>
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
