import { getCharacterData } from "@/app/apis";
import { MetaLine } from "@/app/components/metaLine";
import SimpleRecordCard from "@/app/components/simpleRecordCard";
import { appName } from "@/app/config";
import { createContract, createIndexer } from "crossbell";
import Link from "next/link";

export default async function ListPage({ params }: { params: { id: number } }) {
    const { id } = params;
    const {
        fromCharacterId: communityId,
        linkType,
        curations,
        lastUpdated,
    } = await getData(id);
    const community = await getCharacterData(communityId.toString());
    const listName = linkType.slice(appName.length + 1);
    // TODO: top curators
    return (
        <div className="container mx-auto min-h-screen">
            <div className="flex gap-5 py-5">
                <div className="list-data card my-5 fixed w-[24rem]">
                    <div className="text-4xl font-bold">{listName}</div>

                    <Link href={`/community/${communityId}`}>
                        <div className="mt-10 text-2xl mb-2">
                            {community.metadata?.name || community.handle}
                        </div>
                    </Link>
                    <MetaLine lastUpdated={lastUpdated} l={curations.length} />
                </div>
                <div className="list-items grid grid-cols-3 gap-4 pl-[25rem]">
                    {curations.map((c) => (
                        <Link
                            key={c.characterId.toString()}
                            href={`/community/${communityId}/record/${c.characterId}`}
                        >
                            <SimpleRecordCard
                                key={c.handle}
                                recordId={c.characterId.toString()}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

// TODO: mock function
async function getData(id: number) {
    const indexer = createIndexer();
    const { list } = await indexer.link.getManyByLinklistId(id);
    const fromCharacterId = list[0].fromCharacterId;
    if (!fromCharacterId) throw new Error("No fromCharacterId");

    const lastUpdated = list[0].createdAt;

    const linkType = list[0].linkType;
    const c = createContract();
    const { data: curations } = await c.link.getLinkingCharacters({
        fromCharacterId,
        linkType,
    });

    return {
        fromCharacterId,
        linkType,
        curations,
        lastUpdated,
    };
}
