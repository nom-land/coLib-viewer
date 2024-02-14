import InfiniteFeed from "@/app/components/infiniteFeed";
import { communityProfiles, site } from "@/app/config";
import { createNomland } from "@/app/config/nomland";
import { getFeeds } from "@/app/utils";
import { UserInfo } from "nomland.js";

async function getInitialData(tag: string) {
    const nomland = createNomland();

    const curationNotes = await nomland.getFeeds({
        tag,
    });

    const communities = curationNotes.communities.map((c: UserInfo) => {
        const p = communityProfiles.find(
            (p) => p.id.toString() === c.characterId.toString()
        );
        if (p) {
            c.metadata.name = p.name;
            c.metadata.avatars = [p.image];
            return c;
        } else return c;
    });

    const feeds = getFeeds(curationNotes).feeds;

    return { feeds, communities };
}

export async function generateMetadata({
    params,
}: {
    params: { tag: string };
}) {
    const tag = decodeURIComponent(params.tag);

    return {
        title: tag,
        description: `sharing notes with #${tag} by nomland protocol.`,
        icons: `${site.url}/favicon.ico`,
    };
}

export default async function TagPage({ params }: { params: { tag: string } }) {
    const tag = decodeURIComponent(params.tag);

    const { feeds, communities } = await getInitialData(tag);
    return (
        <div className="container mx-auto my-5 p-3">
            <div>
                <div className="gap-5 w-full md:flex md:my-3">
                    <section className="md:w-2/3 md:flex-grow">
                        <div className="text-3xl font-500 py-8 px-3">
                            #{tag}
                        </div>

                        <InfiniteFeed initialNotes={feeds} tag={tag} />
                    </section>
                </div>
            </div>
        </div>
    );
}
