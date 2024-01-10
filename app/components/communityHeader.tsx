import { Character } from "crossbell";
import { getCharacterData } from "../apis";
import { communityProfiles } from "../config";
import { CommunityAvatar } from "./communityAvatar";
import DescriptionSection from "./descriptionSection";

// return a component that displays the community header
export default async function CommunityHeader(props: {
    communityId: string;
    excludeDescription?: boolean;
    excludeName?: boolean;
    size?: "s" | "m" | "l";
}) {
    let communityChar = {} as Character;
    try {
        communityChar = await getCharacterData(props.communityId);
    } catch (e) {
        console.log("error getting community data", e);
    }
    const community = communityProfiles.find(
        (p) => p.id.toString() === props.communityId.toString()
    );

    return (
        <div>
            <CommunityAvatar
                name={communityChar?.metadata?.name || ""}
                handle={communityChar?.handle}
                avatar={community?.image!}
                size="l"
                excludeName={props.excludeName}
                communityId={props.communityId}
            />
            {!props.excludeDescription && (
                <DescriptionSection
                    description={community?.description || ""}
                />
            )}
        </div>
    );
}
