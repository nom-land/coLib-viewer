import { getCharacterData } from "@/app/apis";
import InfiniteFeed from "@/app/components/infiniteFeed";
import { communityProfiles, site } from "@/app/config";
import { createNomland } from "@/app/config/nomland";
import { CharacterInfo } from "nomland.js";

async function getInitialData(tag: string) {
    const nomland = createNomland();
    const curationNotes = await nomland.getFeeds({
        tag,
    });

    const communitiesInfo: CharacterInfo[] = await Promise.all(
        communityProfiles.map(async (p) => {
            const char = await getCharacterData(p.id);
            return {
                handle: char.handle,
                characterId: p.id,
                metadata: {
                    name: p.name,
                    avatars: [p.image],
                },
            } as CharacterInfo;
        })
    );

    return { curationNotes, communitiesInfo };
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

    const { curationNotes, communitiesInfo } = await getInitialData(tag);

    return (
        <div className="container mx-auto my-5 p-3">
            <div>
                <div className="gap-5 w-full md:flex md:my-3">
                    <section className="md:w-2/3 md:flex-grow">
                        <div className="text-3xl font-500 py-8 px-3">
                            #{tag}
                        </div>

                        <InfiniteFeed
                            initialNotes={curationNotes}
                            tag={tag}
                            communities={communitiesInfo}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
