import JsonViewer from "@/app/components/jsonViewer";
import { Character, Numberish, createContract, createIndexer } from "crossbell";
import Link from "next/link";
import { getListLinkTypePrefix, getMembersLinkType } from "../config";
import React from "react";
import CommunityHeader from "./communityHeader";
import CharacterAvatar from "./characterAvatar";

interface CurationListData {
    listId: number;
    listName: string;
    data: Character[];
}

async function getFirstCuration(recordId: Numberish) {
    const indexer = createIndexer();
    const backNotes = await indexer.note.getMany({
        toCharacterId: recordId,
        includeCharacter: true,
        orderBy: "createdAt",
    });
    const { characterId, noteId } = backNotes.list[0];
    return { characterId, noteId };
}

async function getData(communityId: string) {
    const c = createContract();

    const { data: cData } = await c.character.get({
        characterId: communityId,
    });

    const indexer = createIndexer();
    // add pagination
    const links = await indexer.linklist.getMany(communityId, { limit: 1000 });

    const curationListIds = links.list
        .filter((l) => l.linkType.startsWith(getListLinkTypePrefix()))
        .map((l) => l.linklistId);
    const idsMap = new Map<number, string>();
    links.list.forEach((l) => {
        idsMap.set(l.linklistId, l.linkType);
    });

    const curationLinkTypes = Array.from(
        new Set(links.list.map((l) => l.linkType))
    ).filter((l) => l.startsWith(getListLinkTypePrefix()));

    const records = [] as CurationListData[];
    await Promise.all(
        curationListIds.map(async (id) => {
            const l = idsMap.get(id)!;
            if (l.startsWith(getListLinkTypePrefix())) {
                // indexer.link.getManyByLinklistId(linklistIds.get(l)!);
                const { data: lData } = await c.link.getLinkingCharacters({
                    fromCharacterId: communityId,
                    linkType: l,
                });
                records.push({
                    listId: id,
                    listName: l.slice(getListLinkTypePrefix().length),
                    data: lData,
                });
            }
        })
    );

    const curationMap = new Map<Numberish, string>(); // recordId -> curationPostId
    await Promise.all(
        records.map(async (c) => {
            await Promise.all(
                c.data.map(async (d) => {
                    const { characterId, noteId } = await getFirstCuration(
                        d.characterId
                    );
                    curationMap.set(d.characterId, characterId + "-" + noteId);
                })
            );
        })
    );

    const { data: mData } = await c.link.getLinkingCharacters({
        fromCharacterId: communityId,
        linkType: getMembersLinkType(),
    });
    const curationLists = curationLinkTypes.map((c) =>
        c.slice(getListLinkTypePrefix().length)
    );
    return { cData, curationLists, curations: records, mData, curationMap };
}

export default async function CommunityDisplay({
    props,
}: {
    props: {
        id: string;
    };
}) {
    const { mData: members, curations: items } = await getData(props.id);

    return (
        //TODO: if this is not a community character...
        <div className="container mx-auto my-5 p-3">
            <div>
                <CommunityHeader communityId={props.id}></CommunityHeader>
                <div className="md:flex gap-5 w-full md:my-3">
                    <section className="flex-none w-85 my-3">
                        <div className="flex gap-1">
                            {members.map((member) => (
                                <div
                                    className="mb-1"
                                    key={member.characterId.toString()}
                                >
                                    <CharacterAvatar
                                        name={
                                            member.metadata?.name || "Unknown"
                                        }
                                        handle={member.handle}
                                        avatar={
                                            (member.metadata?.avatars || [])[0]
                                        }
                                        size={40}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
                        {items.map((list, i) => (
                            <div key={i} className="p-3 card">
                                <Link href={`./list/${list.listId}`}>
                                    <div className="text-lg">
                                        {" "}
                                        {list.listName}{" "}
                                    </div>
                                    <div>{list.data.length} records</div>
                                    {/* <div className="grid grid-cols-3 gap-3">
                                        {list.data.map((record) => (
                                            <>
                                                <Link
                                                    key={record.characterId.toString()}
                                                    href={`./curation/${curationMap.get(
                                                        record.characterId
                                                    )}`}
                                                >
                                                    <SimpleRecordCard
                                                        recordId={record.characterId.toString()}
                                                    />
                                                </Link>
                                            </>
                                        ))}
                                    </div> */}
                                </Link>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
}
