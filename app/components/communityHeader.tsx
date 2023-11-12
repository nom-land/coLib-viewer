import Link from "next/link";
import { getCharacterData } from "../apis";
import { communityProfiles } from "../config";
import Image from "next/image";

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
        <>
            <Link href={`/community/${props.communityId}`}>
                <div>
                    <div className="flex gap-3 p-3">
                        <div className="flex-shrink-0">
                            <Image
                                src={community?.image!}
                                width={50}
                                height={50}
                                className="w-20 h-20 mb-5"
                                alt={communityChar.metadata?.name || ""}
                            />
                        </div>

                        <div className="flex items-center">
                            <span className="text-3xl">
                                {communityChar.metadata?.name}
                            </span>
                        </div>
                    </div>
                    {!props.excludeDescription && (
                        <div>{community?.description}</div>
                    )}
                </div>
            </Link>
        </>
    );
}
