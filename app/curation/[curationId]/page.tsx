import { createIndexer } from "crossbell";
import NoteCard from "../../components/noteCard";
import RecordCard from "@/app/components/recordCard";
import CommunityHeader from "@/app/components/communityHeader";
import RepliesList from "@/app/components/repliesList";
import Link from "next/link";
import { getListLinkTypePrefix } from "@/app/config";
import { createNomland } from "@/app/config/nomland";

export default async function CurationPage({
    params,
}: {
    params: { curationId: string };
}) {
    // character id and note id is split by "-" in curationId
    const { curationId } = params;

    const [cid, rid] = curationId.split("-");
    const note = await getData(cid, rid);
    const repliesCount = await getRepliesCount(cid, rid);
    const indexer = createIndexer();
    const communityId = note?.communityId;

    const listIds = new Map<string, number>();

    if (communityId)
        await Promise.allSettled(
            (note?.listNames || []).map(async (l) => {
                const lid = await indexer.linklist.getMany(communityId, {
                    linkType: getListLinkTypePrefix() + l,
                    limit: 1,
                });
                listIds.set(l, lid.list[0].linklistId);
            })
        );
    console.log(listIds);
    if (!note) return <div>This is not a valid curation.</div>;
    else
        return (
            <>
                <div className="container mx-auto my-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className=" md:order-last">
                            <CommunityHeader
                                communityId={note.communityId}
                            ></CommunityHeader>{" "}
                            <div className="px-3 my-2">
                                {"List "}
                                <span className="text-4xl">
                                    {note.listNames.map((l, i) => (
                                        <Link
                                            key={i}
                                            href={`/list/${listIds.get(l)}`}
                                        >
                                            {l}
                                            {i !== note.listNames.length - 1
                                                ? ", "
                                                : ""}
                                        </Link>
                                    ))}
                                </span>
                            </div>
                            <RecordCard
                                id={note?.recordId || ""}
                                context="community"
                            ></RecordCard>
                        </div>
                        <div>
                            <div>
                                <NoteCard
                                    noteType="discussion"
                                    note={note}
                                ></NoteCard>
                            </div>
                            <div className="mx-3 my-2">
                                {repliesCount}{" "}
                                {repliesCount > 1
                                    ? "discussions"
                                    : "discussion"}
                            </div>
                            <hr className="mx-3 mb-5 border-gray-300 border-b-2"></hr>
                            <RepliesList params={{ curationId }}></RepliesList>
                        </div>
                    </div>
                </div>
            </>
        );
}

async function getData(characterId: string, noteId: string) {
    const nomland = createNomland();
    console.log("before");

    const curationNote = await nomland.getCuration(characterId, noteId);
    console.log(curationNote);

    return curationNote;
}

async function getRepliesCount(characterId: string, noteId: string) {
    const nomland = createNomland();
    return await nomland.getDiscussionsCount(characterId, noteId);
}

export const revalidate = 60; // revalidate this page every 60 seconds
