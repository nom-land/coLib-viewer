import { createContract } from "crossbell";
import Link from "next/link";

async function getData(communityId: string) {
    const c = createContract();

    const { data } = await c.character.get({
        characterId: communityId,
    });
    return data;
}

// return a component that displays the community header
export default async function CommunityHeader(props: { communityId: string }) {
    const communityChar = await getData(props.communityId);
    return (
        <>
            <Link href={`/community/${props.communityId}`}>
                <section className="px-5">
                    Libirary of{" "}
                    <span className="text-4xl ">
                        {communityChar.metadata?.name}
                    </span>
                </section>
            </Link>
        </>
    );
}
