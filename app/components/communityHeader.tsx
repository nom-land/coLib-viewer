import Link from "next/link";
import { getCharacterData } from "../apis";

// return a component that displays the community header
export default async function CommunityHeader(props: { communityId: string }) {
    const communityChar = await getCharacterData(props.communityId);
    return (
        <>
            <Link href={`/community/${props.communityId}`}>
                <section className="px-3">
                    Libirary of{" "}
                    <span className="text-4xl ">
                        {communityChar.metadata?.name}
                    </span>
                </section>
            </Link>
        </>
    );
}
