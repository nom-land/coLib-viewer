import RecordCard from "@/app/components/recordCard";
import { createNomland } from "../../config/nomland";
import CurationFeed from "@/app/components/curationFeed";
import { CharacterInfo } from "nomland.js";
import { communityProfiles } from "@/app/config";
import CommunityHeader from "@/app/components/communityHeader";

async function getData(id: string) {
    const nomland = createNomland();
    return await nomland.getRecordCuration(id);
}

export default async function RecordDisplay({
    params,
}: {
    params: { id: string };
}) {
    const rid = params.id;

    const { notes, communities } = await getData(rid);
    const communityInfos = communities.map((c: CharacterInfo) => {
        c.metadata.avatars = [
            communityProfiles.find((p) => p.id === c.characterId.toString())
                ?.image || "",
        ];
        return c;
    });

    return (
        <div className="container mx-auto">
            <div className="">
                <RecordCard id={rid} context="app"></RecordCard>

                <div className="px-3">
                    <div>
                        <div>Related Communities:</div>
                        <div className="flex relative">
                            {communityInfos.map((community: CharacterInfo) => (
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
                <div className="px-3">
                    <div>Curated by:</div>

                    <CurationFeed
                        curationNotes={notes}
                        communities={communityInfos}
                    ></CurationFeed>
                </div>
            </div>
        </div>
    );
}
