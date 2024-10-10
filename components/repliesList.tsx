import { createNomland } from "../app/config/nomland";
import NoteCard from "./noteCard";
import { getFeeds, getId } from "../app/utils";
import SharingCard from "./sharingCard";
import { unstable_cache } from 'next/cache';

const getReplies = async (characterId: string, noteId: string) => {
    const nomland = createNomland();
    const replies = await nomland.getReplies({ characterId, noteId });
    return getFeeds(replies, true);
};

export default async function RepliesList({
    params,
    depth = 0,
}: {
    params: { curationId: string; noBorder?: boolean };
    depth?: number;
}) {
    // character id and note id is split by "-" in curationId
    const { curationId } = params;
    const [id, rid] = curationId.split("-");
    console.log(`RepliesList: Fetching replies for curation ${curationId} at depth ${depth}`);

    let replies: Awaited<ReturnType<typeof getReplies>>['feeds'] = [];
    let error = null;

    // Cache the getReplies function with a 60-second revalidation period
    const getCachedReplies = unstable_cache(
      async (characterId: string, noteId: string) => {
        //   console.log(`Fetching replies for character ${characterId} and note ${noteId}`);
          return await getReplies(characterId, noteId);
      },
      ['replies'],
      { revalidate: 60 } // Revalidate every 60 seconds
    );

    try {
        const { feeds } = await getCachedReplies(id, rid);
        replies = feeds;
        // console.log(`RepliesList: Received ${replies.length} replies at depth ${depth}`);
    } catch (e) {
        error = e;
        console.error('Error in RepliesList:', e);
    }

    let borderCss = "border-gray-200 border-b-2";
    if (params.noBorder) {
        borderCss = "";
    }

    if (error) {
        return <div>Error loading replies. Please try again later.</div>;
    }
    if (replies.length === 0 && depth === 0) {
        return <div>No replies yet.</div>;
    }

    const maxDepth = 5; // Set a maximum depth to prevent excessive recursion

    return (
        <>
            <div>
                {replies.map((r) => (
                    <div className={borderCss} key={getId(r.note.key)} data-depth={depth}>
                        <div>
                            {r.entity ? (
                                <SharingCard
                                    note={r.note}
                                    user={r.author}
                                    entry={r.entity}
                                    community={r.context}
                                ></SharingCard>
                            ) : (
                                <NoteCard
                                    noteType="discussion"
                                    note={r}
                                ></NoteCard>
                            )}
                        </div>
                        {depth < maxDepth && (
                            <div className="ml-[50px]">
                                <RepliesList
                                    params={{
                                        curationId: getId(r.note.key),
                                        noBorder: true,
                                    }}
                                    depth={depth + 1}
                                ></RepliesList>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}