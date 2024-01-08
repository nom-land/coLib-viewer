import Link from "next/link";
import { getCharacterData } from "../apis";
import { communityProfiles } from "../config";
import CharacterAvatar from "./characterAvatar";
import DescriptionSection from "./descriptionSection";

// return a component that displays the community header
export default async function CommunityHeader(props: {
    communityId: string;
    excludeDescription?: boolean;
}) {
    const communityChar = await getCharacterData(props.communityId);
    const community = communityProfiles.find(
        (p) => p.id.toString() === props.communityId.toString()
    );

    return (
        <div>
            <Link href={`/community/${props.communityId}`}>
                <div className="flex gap-3 my-3">
                    <div className="w-12 h-12 relative">
                        <CharacterAvatar
                            name={communityChar.metadata?.name || ""}
                            handle={communityChar.handle}
                            avatar={community?.image!}
                            size={48}
                        />
                    </div>

                    <div className="flex items-center">
                        <span className="text-3xl">
                            {communityChar.metadata?.name}
                        </span>
                    </div>
                </div>
            </Link>
            {!props.excludeDescription && (
                <DescriptionSection
                    description={community?.description || ""}
                />
            )}
        </div>
    );
}
