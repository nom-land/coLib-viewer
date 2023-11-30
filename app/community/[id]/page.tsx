import React from "react";
import CommunityHeader from "../../components/communityHeader";
import CharacterAvatar from "../../components/characterAvatar";
import { createNomland } from "@/app/config/nomland";
import { MetaLine } from "@/app/components/metaLine";
import CurationFeed from "@/app/components/curationFeed";

async function getData(communityId: string) {
    const nomland = createNomland();
    const { curationNotes, lastUpdated } = await nomland.getFeeds(communityId);

    // const { list } = await nomland.ls(communityId);
    const members = await nomland.getCommunityMembers(communityId);
    return { curationNotes, lastUpdated, members };
}

export default async function CommunityPage({
    params,
}: {
    params: { id: string };
}) {
    const communityId = params.id;
    const { members, lastUpdated, curationNotes } = await getData(communityId);
    const count = curationNotes.length;
    return (
        //TODO: if this is not a community character...

        <div className="min-h-screen flex flex-col">
            <div className="container mx-auto my-5 p-3  flex-grow">
                <div>
                    <CommunityHeader
                        communityId={communityId}
                    ></CommunityHeader>
                    <div className="gap-5 w-full md:flex md:my-3">
                        <section className="flex-none my-3">
                            <div className="flex gap-1 grid grid-cols-8 md:grid-cols-5">
                                {members.map((member: any) => (
                                    <div
                                        className="mb-1"
                                        key={member.characterId.toString()}
                                    >
                                        <CharacterAvatar
                                            name={
                                                member.metadata?.name ||
                                                "Unknown"
                                            }
                                            handle={member.handle}
                                            avatar={
                                                (member.metadata?.avatars ||
                                                    [])[0]
                                            }
                                            size={40}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className="md:w-2/3 md:flex-grow">
                            <MetaLine lastUpdated={lastUpdated} l={count} />

                            <CurationFeed curationNotes={curationNotes} />
                        </section>
                        {/* <section className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-5">
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
                    </section> */}
                    </div>
                </div>
            </div>
            <div className="text-center mb-5">
                <div className="text-sm">
                    Powered by{" "}
                    <a
                        className="text-blue-500 hover:text-blue-800"
                        href="https://colib.app"
                    >
                        Colib.app
                    </a>
                </div>
            </div>
        </div>
    );
}

export const revalidate = 60; // revalidate this page every 60 seconds
