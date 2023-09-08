import { CurationListData, getCharacterData } from "@/app/apis";
import CharacterHeader from "@/app/components/characterHeader";
import { MetaLine } from "@/app/components/metaLine";
import NoteStatLine from "@/app/components/noteStatLine";
import Tags from "@/app/components/tags";
import { createNomland } from "@/app/config";
import Link from "next/link";
import Nomland from "nomland.js";

export default async function ListPage({ params }: { params: { id: number } }) {
    const { id } = params;
    const {
        community,
        communityId,
        listName,
        records,
        curationData,
        lastUpdated,
    } = await getData(id);
    const curations = [] as (CurationListData | undefined)[];
    records!.forEach((r) => {
        curations.push(curationData!.get(r.characterId.toString()));
    });

    // TODO: top curators
    return (
        <div className="container mx-auto my-5">
            <div className="py-5 px-3">
                {community && (
                    <div className="list-data my-5">
                        <div className="text-4xl font-bold">{listName}</div>

                        <Link href={`/community/${communityId}`}>
                            <div className="mt-10 text-2xl mb-2">
                                {community.metadata?.name || community.handle}
                            </div>
                        </Link>
                        <MetaLine
                            lastUpdated={lastUpdated}
                            l={records!.length}
                        />
                    </div>
                )}
                <div className="list-items gap-4">
                    {records!.map((r, i) => (
                        <div className="card my-5" key={i}>
                            {curations[i]?.curationList.map((curation) => (
                                <Link
                                    key={r.characterId.toString()}
                                    href={`/curation/${curation.postId}`}
                                >
                                    <div>
                                        <CharacterHeader
                                            name={curation.curatorName}
                                            handle={curation.curatorHandle}
                                            avatar={curation.curatorAvatars[0]}
                                            date={curation.dateString}
                                        ></CharacterHeader>
                                        <div className="my-3">
                                            <blockquote className="py-2 px-3 my-4 border-l-4 border-gray-300 dark:border-gray-500">
                                                <p className="leading-relaxed text-gray-900 ">
                                                    {curation.content}
                                                </p>
                                            </blockquote>
                                        </div>
                                        <div>
                                            <Tags
                                                tags={curation.suggestedTags}
                                            />
                                        </div>
                                        <div className="flex gap-1 my-5">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                                />
                                            </svg>

                                            {(r.metadata as any).title}
                                        </div>
                                        <NoteStatLine
                                            replies={
                                                curations[i]?.curationStat?.get(
                                                    curation.postId
                                                )?.replies || 0
                                            }
                                        ></NoteStatLine>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// TODO: mock function
async function getData(id: number) {
    try {
        const nomland = createNomland();
        const { communityId, listName, records, curationData, lastUpdated } =
            await nomland.lsById(id);

        const community = await getCharacterData(communityId.toString());

        return {
            community,
            communityId,
            listName,
            records,
            curationData,
            lastUpdated,
        };
    } catch (e) {
        console.log("ERROR", e);
        return {
            communityId: 0,
            listName: "",
            records: [],
            curationData: new Map(),
            lastUpdated: "",
        };
    }
}

export const revalidate = 60; // revalidate this page every 60 seconds
