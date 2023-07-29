import JsonViewer from "@/app/components/jsonViewer";
import { Character, createContract, createIndexer } from "crossbell";
import Link from "next/link";
import { appName } from "../config";
import React from "react";
import CommunityHeader from "./communityHeader";
import CharacterHeader from "./characterHeader";
import SimpleRecordCard from "./simpleRecordCard";

interface CurationListData {
    listId: number;
    listName: string;
    data: Character[];
}

async function getData(communityId: string) {
    const c = createContract();

    const { data: cData } = await c.character.get({
        characterId: communityId,
    });
    // console.log("cData", communityId, cData);
    // Get all lists of the community
    // const indexer = createIndexer();
    // const res = await indexer.liLufthansanklist.getMany(communityId);
    // console.log("res", res);

    const indexer = createIndexer();
    // indexer.link.getManyByLinklistId()
    // add pagination
    const links = await indexer.link.getMany(communityId);
    // TODO:... use another prefix
    const curationListIds = Array.from(
        new Set(
            links.list
                .filter(
                    (l) =>
                        l.linkType.startsWith(appName + "-") &&
                        l.linkType !== appName + "-members"
                )
                .map((l) => l.linklistId)
        )
    );
    const idsMap = new Map<number, string>();
    links.list.forEach((l) => {
        idsMap.set(l.linklistId, l.linkType);
    });

    console.log("curationListIds", curationListIds);

    const curationLinkTypes = Array.from(
        new Set(links.list.map((l) => l.linkType))
    ).filter((l) => l.startsWith(appName + "-") && l !== appName + "-members");

    const curations = [] as CurationListData[];
    await Promise.all(
        curationListIds.map(async (id) => {
            const l = idsMap.get(id)!;
            if (l.startsWith(appName + "-") && l !== appName + "-members") {
                // indexer.link.getManyByLinklistId(linklistIds.get(l)!);
                const { data: lData } = await c.link.getLinkingCharacters({
                    fromCharacterId: communityId,
                    linkType: l,
                });
                curations.push({
                    listId: id,
                    listName: l.slice(appName.length + 1),
                    data: lData,
                });
            }
        })
    );

    const { data: mData } = await c.link.getLinkingCharacters({
        fromCharacterId: communityId,
        linkType: appName + "-members",
    });
    const curationLists = curationLinkTypes.map((c) =>
        c.slice(appName.length + 1)
    );
    return { cData, curationLists, curations, mData };
}

export default async function CommunityDisplay({
    props,
}: {
    props: {
        id: string;
        viewMode: "normal" | "analyzed";
    };
}) {
    const {
        cData: communityChar,
        mData: members,
        curationLists: lists,
        curations: items,
    } = await getData(props.id);

    return (
        //TODO: if this is not a community character...
        <div>
            {props.viewMode === "normal" && (
                <div>
                    <CommunityHeader communityId={props.id}></CommunityHeader>
                    <hr className="my-5"></hr>
                    <div className="flex gap-5 w-full">
                        <section className="flex-1">
                            {items.map((list, i) => (
                                <div key={i} className="p-3">
                                    <Link href={`./list/${list.listId}`}>
                                        <div className="text-lg">
                                            {" "}
                                            {list.listName}{" "}
                                        </div>
                                    </Link>
                                    <div className="grid grid-cols-3 gap-4">
                                        {list.data.map((record) => (
                                            <>
                                                <Link
                                                    key={record.characterId.toString()}
                                                    href={`./community/${
                                                        props.id
                                                    }/record/${record.characterId.toString()}`}
                                                >
                                                    <SimpleRecordCard
                                                        recordId={record.characterId.toString()}
                                                    />
                                                </Link>
                                            </>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </section>
                        <section className="flex-none w-80">
                            <div className="py-5 "> Members </div>
                            {members.map((member) => (
                                <div
                                    className="mb-5"
                                    key={member.characterId.toString()}
                                >
                                    <CharacterHeader
                                        name={
                                            member.metadata?.name || "Unknown"
                                        }
                                        handle={member.handle}
                                        avatar={
                                            (member.metadata?.avatars || [])[0]
                                        }
                                    />
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            )}

            {props.viewMode === "analyzed" && (
                <div>
                    <section>
                        <div className="text-sm italic">
                            <span>
                                Each list is essentially a linklist emitted from
                                the community character.{" "}
                            </span>
                            <br></br>
                            <span>
                                Each record is essentially a character on
                                Crossbell.
                            </span>
                        </div>
                    </section>

                    <hr></hr>
                    <section>
                        <div> Community character </div>
                        <div className="border">
                            <div>
                                id: {communityChar.characterId.toString()}
                            </div>
                            <div>handle: {communityChar.handle}</div>
                            <div>
                                metadata:{" "}
                                <JsonViewer
                                    props={communityChar.metadata || {}}
                                ></JsonViewer>{" "}
                            </div>
                        </div>
                    </section>

                    <hr></hr>
                    <section>
                        <div> Community members(count: {members.length}) </div>
                        {members.map((member) => (
                            <div
                                className="border"
                                key={member.characterId.toString()}
                            >
                                <div>id: {member.characterId.toString()}</div>
                                <div>handle: {member.handle}</div>
                                <div>
                                    metadata:{" "}
                                    <JsonViewer
                                        props={member.metadata || {}}
                                    ></JsonViewer>{" "}
                                </div>
                            </div>
                        ))}
                    </section>
                    <hr></hr>

                    {/* <section>
                        <div>General(count: {generalList.length})</div>
                        {generalList.map((record) => (
                            <>
                                <div
                                    className="border p-5 my-5"
                                    key={record.characterId.toString()}
                                >
                                    <div>
                                        id: {record.characterId.toString()}{" "}
                                    </div>
                                    <div>handle: {record.handle} </div>
                                    <div>
                                        metadata:{" "}
                                        <JsonViewer
                                            props={record.metadata || {}}
                                        ></JsonViewer>{" "}
                                    </div>
                                    <Link
                                        href={`./community/${
                                            props.id
                                        }/record/${record.characterId.toString()}`}
                                    >
                                        <div>➡️details</div>
                                    </Link>
                                </div>
                            </>
                        ))}
                    </section> */}
                </div>
            )}
        </div>
    );
}
