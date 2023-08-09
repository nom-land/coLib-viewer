import { createContract, createIndexer } from "crossbell";
import { getAttr, getCuration } from "../../utils";
import NoteCard from "../../components/noteCard";
import RecordCard from "@/app/components/recordCard";
import CommunityHeader from "@/app/components/communityHeader";
import RepliesList from "@/app/components/repliesList";
import Link from "next/link";
import { getListLinkTypePrefix } from "@/app/config";

export default async function CurationPage({
    params,
}: {
    params: { curationId: string };
}) {
    // character id and note id is split by "-" in curationId
    const { curationId } = params;
    const [cid, rid] = curationId.split("-");
    const note = await getData(cid, rid);
    const replies = await getReplies(cid, rid);
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

    if (!note) return <div>This is note a valid curation.</div>;
    else
        return (
            <>
                <div className="container mx-auto ">
                    <div className="grid grid-cols-2 gap-5 py-5">
                        <div>
                            <div>
                                <NoteCard
                                    noteType="discussion"
                                    note={note}
                                ></NoteCard>
                            </div>
                            <div className="mx-5 my-2">
                                {replies.length}{" "}
                                {replies.length > 1
                                    ? "discussions"
                                    : "discussion"}
                            </div>
                            <hr className="mx-5 mb-5 border-gray-300 border-b-2"></hr>
                            <RepliesList params={{ curationId }}></RepliesList>
                        </div>
                        <div>
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
                                viewMode="normal"
                                context="community"
                            ></RecordCard>
                        </div>
                    </div>
                </div>
            </>
        );
}

async function getData(characterId: string, noteId: string) {
    const c = createContract();
    const { data: cData } = await c.character.get({
        characterId,
    });
    const { data: n } = await c.note.get({
        characterId,
        noteId,
    });
    const attrs = n.metadata?.attributes;
    const entityType = getAttr(attrs, "entity type");
    if (entityType !== "curation") return;

    const curationNote = getCuration(n, cData);

    return curationNote;
}

async function getReplies(characterId: string, noteId: string) {
    const indexer = createIndexer();
    const data = await indexer.note.getMany({
        toCharacterId: characterId,
        toNoteId: noteId,
        includeCharacter: true,
    });
    const replies = data.list.map((n) => {
        return getCuration(n);
    });
    return replies;
}

export const revalidate = 60; // revalidate this page every 60 seconds
