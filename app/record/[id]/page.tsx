import RecordCard from "@/app/components/recordCard";
import { createNomland } from "../../config/nomland";
import CurationFeed from "@/app/components/curationFeed";
import { getFeeds } from "@/app/utils";

async function getData(id: string) {
    const nomland = createNomland();

    const data = await nomland.getEntrySharings(id);

    const { feeds, entry } = getFeeds(data);

    return {
        feeds,
        entry,
    };
}

export default async function RecordDisplay({
    params,
}: {
    params: { id: string };
}) {
    const rid = params.id;

    const { feeds, entry } = await getData(rid);

    if (!entry) return <div>NOT FOUND</div>;

    return (
        <div className="container mx-auto">
            <div className="">
                <RecordCard
                    id={rid}
                    context="app"
                    recordData={entry}
                ></RecordCard>

                {/* TODO: get related communities from sdk */}
                {/* <div className="px-3">
                    <div>
                        <div>Related Communities:</div>
                        <div className="flex relative">
                            {communityInfos.map((community: UserInfo) => (
                                <div
                                    key={community.characterId.toString()}
                                    className="mx-1"
                                >
                                    <CommunityHeader
                                        community={community}
                                        communityId={community.characterId.toString()}
                                        excludeDescription={true}
                                        excludeName={true}
                                    ></CommunityHeader>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}
                <div className="px-3">
                    <div>Curated by:</div>

                    <CurationFeed
                        feeds={feeds}
                        includeCommunity={true}
                        excludeRecord={true}
                    ></CurationFeed>
                </div>
            </div>
        </div>
    );
}
