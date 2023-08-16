import JsonViewer from "@/app/components/jsonViewer";
import RecordCard from "@/app/components/recordCard";
import { ViewMode, CurationNote } from "@/app/typings/types";
import { LinkEntity, createIndexer } from "crossbell";
import CurationList from "./curationList";
import Link from "next/link";
import { getAttr } from "../utils";
import { getListLinkTypePrefix } from "../config";

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
    listId: number;
}

export default async function RecordDisplay({
    props,
}: {
    props: { rid: string };
}) {
    const { rid } = props;
    const { backLinks, backNotes } = await getData(rid);
    const l = backLinks.list.filter((link) =>
        link.linkType.startsWith(getListLinkTypePrefix())
    ).length; //TODO: only "dao" character

    const curationList = [] as CommunityCurationList[];
    backLinks.list.map((l) => {
        if (l.linkType.startsWith(getListLinkTypePrefix())) {
            const listName = l.linkType.slice(getListLinkTypePrefix().length);
            curationList.push({
                raw: l,
                communityId: l.fromCharacterId!.toString(),
                list: listName,
                listId: l.linklistId,
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
                title: n.metadata?.content?.title?.toString() || "",
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
        <div className="container mx-auto">
            <div className="p-3">
                <RecordCard
                    viewMode="normal"
                    id={rid}
                    context="app"
                ></RecordCard>

                <div>
                    <div className="my-5">Related communities:</div>
                    <div className="grid">
                        {curationList.map((c) => (
                            <Link key={c.listId} href={`./list/${c.listId}`}>
                                <div
                                    className="card w-[18rem] my-2"
                                    key={c.raw.transactionHash}
                                >
                                    <div className="text-xl font-bold">
                                        {c.list}
                                    </div>
                                    <div>
                                        in{" "}
                                        <span className="font-bold">
                                            {
                                                c.raw.fromCharacter?.metadata
                                                    ?.content?.name
                                            }
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <CurationList recordId={rid}></CurationList>
            </div>
        </div>
    );
}
