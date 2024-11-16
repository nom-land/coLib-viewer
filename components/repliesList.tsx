import { createNomland } from "../app/config/nomland";
import NoteCard from "./noteCard";
import { getFeeds, getId } from "../app/utils";
import SharingCard from "./sharingCard";
import RepliesLoadMore from "./repliesLoadMore";

const getReplies = async (
    characterId: string,
    noteId: string,
    skip: number = 0
) => {
    const nomland = createNomland();

    const replies = await nomland.getReplies(
        {
            characterId,
            noteId,
        },
        {
            take: 10,
            skip,
        }
    );
    return getFeeds(replies, true);
};

export default async function RepliesList({
    params,
    depth = 0,
}: {
    params: { curationId: string; noBorder?: boolean };
    depth?: number;
}) {
    const { curationId } = params;
    const [id, rid] = curationId.split("-");

    let initialReplies: Awaited<ReturnType<typeof getReplies>>["feeds"] = [];
    let error = null;

    try {
        const { feeds } = await getReplies(id, rid, 0);
        initialReplies = feeds;
    } catch (e) {
        error = e;
        console.error("Error in RepliesList:", e);
    }

    let borderCss = "border-gray-200 border-b-2";
    if (params.noBorder) {
        borderCss = "";
    }

    if (error) {
        return <div>Error loading replies. Please try again later.</div>;
    }
    if (initialReplies.length === 0 && depth === 0) {
        return <div>No replies yet.</div>;
    }

    const maxDepth = 5;

    return (
        <>
            <div>
                {initialReplies.map((r) => (
                    <div
                        className={borderCss}
                        key={getId(r.note.key)}
                        data-depth={depth}
                    >
                        <div>
                            {r.entity ? (
                                <SharingCard
                                    note={r.note}
                                    user={r.author}
                                    entry={r.entity}
                                    community={r.context}
                                />
                            ) : (
                                <NoteCard noteType="discussion" note={r} />
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
                                />
                            </div>
                        )}
                    </div>
                ))}

                {depth === 0 && initialReplies.length === 10 && (
                    <RepliesLoadMore
                        characterId={id}
                        noteId={rid}
                        initialSkip={10}
                        borderCss={borderCss}
                        depth={depth}
                        maxDepth={maxDepth}
                    />
                )}
            </div>
        </>
    );
}
