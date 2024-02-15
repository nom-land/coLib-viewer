import { createNomland } from "../config/nomland";
import NoteCard from "./noteCard";
import { getFeeds, FeedNote } from "../utils";

export default async function RepliesList({
    params,
}: {
    params: { curationId: string; noBorder?: boolean };
}) {
    // character id and note id is split by "-" in curationId
    const { curationId } = params;
    const [id, rid] = curationId.split("-");
    const { feeds: replies } = await getReplies(id, rid);
    let borderCss = "border-gray-200 border-b-2";
    if (params.noBorder) {
        borderCss = "";
    }

    return (
        <>
            <div>
                {replies.map((r: FeedNote) => (
                    <div className={borderCss} key={r.note.postId}>
                        <div>
                            <NoteCard noteType="discussion" note={r}></NoteCard>
                        </div>
                        <div className="ml-[50px]">
                            <RepliesList
                                params={{
                                    curationId: r.note.postId,
                                    noBorder: true,
                                }}
                            ></RepliesList>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

async function getReplies(characterId: string, noteId: string) {
    const nomland = createNomland();
    const replies = await nomland.getDiscussions(characterId, noteId);

    return getFeeds(replies, true);
}
