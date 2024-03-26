import UserHeader from "@/app/components/userHeader";
import CommunityHeader from "@/app/components/communityHeader";
import InfiniteFeed from "@/app/components/infiniteFeed";
import { createNomland } from "@/app/config/nomland";
import { getCommunity, getFeeds } from "@/app/utils";
import { CharacterInfo } from "nomland.js";

export default async function CuratorPage({
    params,
}: {
    params: { id: string };
}) {
    const userId = params.id;
    const nomland = createNomland();
    const communities = (await nomland.getCharacterContexts(userId))
        .map((c: CharacterInfo) => getCommunity(c))
        .filter((c: CharacterInfo | null) => !!c) as CharacterInfo[];

    const feedsData = await nomland.getFeeds({
        character: userId,
    });

    const { feeds, user } = getFeeds(feedsData);
    if (!user) return <div>NOT FOUND</div>;

    return (
        <div className="container mx-auto my-5 p-3">
            <div className="card my-3 flex gap-5">
                <div>
                    <UserHeader user={user}></UserHeader>
                </div>

                <div>
                    <div>Communities</div>
                    <div className="flex relative">
                        {communities.map((community: CharacterInfo) => (
                            <div key={community.id} className="mx-1">
                                <CommunityHeader
                                    community={community}
                                    excludeDescription={true}
                                    excludeName={true}
                                ></CommunityHeader>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <InfiniteFeed
                showCommunity={true}
                initialNotes={feeds}
                curatorId={user.id.toString()}
            ></InfiniteFeed>
        </div>
    );
}
