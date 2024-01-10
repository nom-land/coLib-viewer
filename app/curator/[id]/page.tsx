import CharacterHeader from "@/app/components/characterHeader";
import CommunityHeader from "@/app/components/communityHeader";
import InfiniteFeed from "@/app/components/infiniteFeed";
import { communityProfiles } from "@/app/config";
import { createNomland } from "@/app/config/nomland";
import { CharacterInfo } from "nomland.js";

export default async function CuratorPage({
    params,
}: {
    params: { id: string };
}) {
    const nomland = createNomland();
    const { curator, communities } = await nomland.getCharacter(params.id);

    const displayCommunities = communities.filter((c: CharacterInfo) => {
        if (communityProfiles.find((p) => p.id === c.characterId.toString())) {
            return true;
        }
    });

    const communityInfos = displayCommunities.map((c: CharacterInfo) => {
        c.metadata.avatars = [
            communityProfiles.find((p) => p.id === c.characterId.toString())
                ?.image || "",
        ];
        return c;
    });

    const curationNotes = await nomland.getFeeds({
        curator: curator.characterId,
    });

    const avatar = curator.metadata?.avatars
        ? curator.metadata?.avatars[0]
        : "";

    return (
        <div className="container mx-auto my-5 p-3">
            <div className="card my-3 flex gap-5">
                <div>
                    <CharacterHeader
                        id={curator.characterId.toString()}
                        name={curator.metadata?.name || "Unknown"}
                        handle={curator.handle}
                        avatar={avatar}
                    ></CharacterHeader>
                </div>

                <div>
                    <div>Communities</div>
                    <div className="flex relative">
                        {displayCommunities.map((community: CharacterInfo) => (
                            <div
                                key={community.characterId.toString()}
                                className="mx-1"
                            >
                                <CommunityHeader
                                    communityId={community.characterId.toString()}
                                    excludeDescription={true}
                                    excludeName={true}
                                ></CommunityHeader>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <InfiniteFeed
                initialNotes={curationNotes}
                curatorId={curator.characterId.toString()}
                communities={communityInfos}
            ></InfiniteFeed>
        </div>
    );
}
