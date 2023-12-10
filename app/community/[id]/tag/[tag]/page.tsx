import CommunityHeader from "@/app/components/communityHeader";
import InfiniteFeed from "@/app/components/infiniteFeed";
import { createNomland } from "@/app/config/nomland";
import Layout from "@/app/layout";

async function getInitialData(communityId: string, tag: string) {
    const nomland = createNomland();
    const { curationNotes } = await nomland.getFeeds(communityId, tag);

    return { curationNotes };
}

export default async function CommunityTagPage({
    params,
}: {
    params: { tag: string; id: string };
}) {
    const communityId = params.id;
    const tag = decodeURIComponent(params.tag);

    const { curationNotes } = await getInitialData(communityId, tag);

    return (
        <Layout>
            <div className="container mx-auto my-5 p-3">
                <div>
                    <CommunityHeader
                        communityId={communityId}
                        excludeDescription={true}
                    ></CommunityHeader>

                    <div className="gap-5 w-full md:flex md:my-3">
                        <section className="md:w-2/3 md:flex-grow">
                            <div className="text-3xl font-500 py-8 px-3">
                                #{tag}
                            </div>

                            <InfiniteFeed
                                initialNotes={curationNotes}
                                communityId={communityId}
                                tag={tag}
                            />
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
