import { createNomland } from "../app/config/nomland";
import NoteCard from "./noteCard";
import { getFeeds, getId } from "../app/utils";
import SharingCard from "./sharingCard";
import { NotePack } from "nomland.js";

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
                {replies.map((r: NotePack) => (
                    <div className={borderCss} key={getId(r.note.key)}>
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
                        <div className="ml-[50px]">
                            <RepliesList
                                params={{
                                    curationId: getId(r.note.key),
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
    const replies = await nomland.getReplies({ characterId, noteId });

    return getFeeds(replies, true);
}
