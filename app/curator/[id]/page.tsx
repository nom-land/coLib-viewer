import UserHeader from "@/app/components/userHeader";
import CommunityHeader from "@/app/components/communityHeader";
import InfiniteFeed from "@/app/components/infiniteFeed";
import { communityProfiles } from "@/app/config";
import { createNomland } from "@/app/config/nomland";
import { getFeeds } from "@/app/utils";
import { UserInfo } from "nomland.js";

export default async function CuratorPage({
    params,
}: {
    params: { id: string };
}) {
    const userId = params.id;
    const nomland = createNomland();
    const communities = await nomland.getUserCommunities(userId);

    // TODO: replace filter communities
    const displayCommunities = communities.filter((c: UserInfo) => {
        if (communityProfiles.find((p) => p.id === c.characterId.toString())) {
            return true;
        }
    });

    const communityInfos = displayCommunities.map((c: UserInfo) => {
        c.metadata.avatars = [
            communityProfiles.find((p) => p.id === c.characterId.toString())
                ?.image || "",
        ];
        return c;
    });

    const feedsData = await nomland.getFeeds({
        user: userId,
    });

    const { feeds, user } = getFeeds(feedsData);
    if (!user) return <div>NOT FOUND</div>;

    const avatar = user.metadata?.avatars ? user.metadata?.avatars[0] : "";

    return (
        <div className="container mx-auto my-5 p-3">
            <div className="card my-3 flex gap-5">
                <div>
                    <UserHeader user={user}></UserHeader>
                </div>

                <div>
                    <div>Communities</div>
                    <div className="flex relative">
                        {communityInfos.map((community: UserInfo) => (
                            <div
                                key={community.characterId.toString()}
                                className="mx-1"
                            >
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
                initialNotes={feeds}
                curatorId={user.characterId.toString()}
            ></InfiniteFeed>
        </div>
    );
}
