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
                        <div className="w-12 h-12 relative">
                            <Image
                                src={community?.image!}
                                width={48}
                                height={48}
                                // height attribute conflicts with tailwindcss {img {height: auto}},
                                // and when the width of the image is set to a specific value, and
                                // the height is set to auto, the browser automatically adjusts the
                                // height of the image to maintain its original aspect ratio. So we
                                // have to set 'h-full' to resize the image.
                                className="rounded-full h-full"
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
