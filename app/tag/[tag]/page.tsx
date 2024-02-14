import InfiniteFeed from "@/app/components/infiniteFeed";
import { site } from "@/app/config";
import { createNomland } from "@/app/config/nomland";
import { getFeeds } from "@/app/utils";

async function getInitialData(tag: string) {
    const nomland = createNomland();

    const feedsData = await nomland.getFeeds({
        tag,
    });

    const feeds = getFeeds(feedsData).feeds;

    return { feeds };
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

    const { feeds } = await getInitialData(tag);
    return (
        <div className="container mx-auto my-5 p-3">
            <div>
                <div className="gap-5 w-full md:flex md:my-3">
                    <section className="md:w-2/3 md:flex-grow">
                        <div className="text-3xl font-500 py-8 px-3">
                            #{tag}
                        </div>

                        <InfiniteFeed
                            showCommunity={true}
                            initialNotes={feeds}
                            tag={tag}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
