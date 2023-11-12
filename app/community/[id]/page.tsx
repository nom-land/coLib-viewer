import Link from "next/link";
import React from "react";
import CommunityHeader from "../../components/communityHeader";
import CharacterAvatar from "../../components/characterAvatar";
import { sourceName } from "@/app/config";
import Nomland from "nomland.js";

async function getData(communityId: string) {
    const nomland = new Nomland(sourceName);
    const { list } = await nomland.ls(communityId);
    const members = await nomland.getCommunityMembers(communityId);
    return { list, members };
}

export default async function CommunityPage({
    params,
}: {
    params: { id: string };
}) {
    const communityId = params.id;
    const { members, list: items } = await getData(communityId);

    return (
        //TODO: if this is not a community character...
        <div className="container mx-auto my-5 p-3">
            <div>
                <CommunityHeader communityId={communityId}></CommunityHeader>
                <div className="md:flex gap-5 w-full md:my-3">
                    <section className="flex-none my-3 ">
                        <div className="flex gap-1 grid grid-cols-8 md:grid-cols-5">
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
                                <Link href={`/list/${list.listId}`}>
                                    <div className="text-lg">
                                        {" "}
                                        {list.listName}{" "}
                                    </div>
                                    <div>{list.count} records</div>
                                </Link>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
}

export const revalidate = 60; // revalidate this page every 60 seconds
