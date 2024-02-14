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
    const { community, size } = props;

    return (
        <div>
            <CommunityAvatar
                name={community?.metadata?.name || "Unknown"}
                handle={community.handle}
                avatar={
                    community?.metadata.avatars
                        ? community?.metadata.avatars[0]
                        : ""
                }
                size={size || "l"}
                excludeName={props.excludeName}
                communityId={community.characterId}
            />
            {!props.excludeDescription && (
                <DescriptionSection
                    description={community?.metadata.bio || ""}
                />
            )}
        </div>
    );
}
