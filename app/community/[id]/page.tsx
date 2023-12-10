import React from "react";
import CommunityHeader from "../../components/communityHeader";
import CharacterAvatar from "../../components/characterAvatar";
import { createNomland } from "@/app/config/nomland";
import InfiniteFeed from "@/app/components/infiniteFeed";
import { communityProfiles } from "@/app/config";
import { site } from "@/app/layout";

async function getInitialData(communityId: string) {
    const nomland = createNomland();
    const { curationNotes } = await nomland.getFeeds(communityId);

    const members = await nomland.getCommunityMembers(communityId);
    return { curationNotes, members };
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const c = communityProfiles.find((c) => c.id === params.id);

    return {
        title: c?.name || site.title,
        description: c?.description || site.description,
        icons: c?.image || `${site.url}/favicon.ico`,
    };
}

export default async function CommunityPage({
    params,
}: {
    params: { id: string };
}) {
    const communityId = params.id;
    const { members, curationNotes } = await getInitialData(communityId);

    return (
        //TODO: if this is not a community character...
        <div className="container mx-auto my-5 p-3">
            <div>
                <CommunityHeader communityId={communityId}></CommunityHeader>

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
                    <section className="md:w-2/3 md:flex-grow">
                        <InfiniteFeed
                            initialNotes={curationNotes}
                            communityId={communityId}
                            tag={""}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}

export const revalidate = 60; // revalidate this page every 60 seconds
