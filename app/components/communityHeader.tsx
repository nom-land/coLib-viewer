"use client";

import { CommunityAvatar } from "./communityAvatar";
import DescriptionSection from "./descriptionSection";
import { UserInfo } from "nomland.js";

// return a component that displays the community header
export default function CommunityHeader(props: {
    community: UserInfo;
    excludeDescription?: boolean;
    excludeName?: boolean;
    size?: "s" | "m" | "l";
}) {
    const communityProfile = props.community;

    return (
        <div>
            <CommunityAvatar
                name={communityProfile?.metadata?.name || "Unknown"}
                handle={communityProfile.handle}
                avatar={
                    communityProfile?.metadata.avatars
                        ? communityProfile?.metadata.avatars[0]
                        : ""
                }
                size="l"
                excludeName={props.excludeName}
                communityId={communityProfile.characterId}
            />
            {!props.excludeDescription && (
                <DescriptionSection
                    description={communityProfile?.metadata.bio || ""}
                />
            )}
        </div>
    );
}
