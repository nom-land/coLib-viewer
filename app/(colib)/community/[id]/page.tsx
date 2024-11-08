import React from "react";
import CommunityHeader from "@/components/communityHeader";
import { createNomland } from "@/app/config/nomland";
import InfiniteFeed from "@/components/infiniteFeed";
import { communityProfiles, site } from "@/app/config";
import { getFeeds } from "@/app/utils";
import UserHeader from "@/components/userHeader";
import { CharacterInfo } from "nomland.js";

async function getInitialData(communityId: string) {
    const nomland = createNomland();
    const feedsData = getFeeds(
        await nomland.getFeeds({ context: communityId })
    );

    const members = await nomland.getCommunityMembers(communityId);
    return { feeds: feedsData.feeds, members, community: feedsData.community };
}

export async function generateMetadata(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const c = communityProfiles.find((c) => c.id === params.id);

    return {
        title: c?.name || site.title,
        description: c?.description || site.description,
        icons: c?.image || `${site.url}/favicon.ico`,
    };
}

export default async function CommunityPage(props: {
    params: Promise<{ id: string }>;
}) {
    const params = await props.params;
    const communityId = params.id;
    const data = await getInitialData(communityId);
    if (!data) {
        return <div>NOT FOUND</div>;
    }

    const { members, feeds, community } = data;
    if (!community) return <div>NOT FOUND</div>;

    return (
        //TODO: if this is not a community character...
        <div className="container mx-auto my-5 p-3">
            <div>
                <CommunityHeader community={community}></CommunityHeader>

                <div className="gap-5 w-full md:flex md:my-3">
                    <section className="my-3">
                        <div className="gap-1 grid grid-cols-8 md:grid-cols-5">
                            {members.map((member: CharacterInfo) => (
                                <div
                                    className="mb-1"
                                    key={member.id.toString()}
                                >
                                    <UserHeader
                                        user={member}
                                        size="m"
                                        onlyAvatar={true}
                                    ></UserHeader>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="md:w-2/3 md:flex-grow">
                        <InfiniteFeed
                            initialNotes={feeds}
                            communityId={communityId}
                            tag={""}
                            showCommunity={false}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
