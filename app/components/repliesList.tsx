import { createContract, createIndexer } from "crossbell";
import { getAttr, getCuration } from "../utils";
import NoteCard from "./noteCard";

export default async function RepliesList({
    params,
}: {
    params: { curationId: string; noBorder?: boolean };
}) {
    // character id and note id is split by "-" in curationId
    const { curationId } = params;
    const [id, rid] = curationId.split("-");
    const replies = await getReplies(id, rid);

    let borderCss = "border-gray-200 border-b-2";
    if (params.noBorder) {
        borderCss = "";
    }

    console.log(borderCss);
    return (
        <>
            <div>
                {replies.map((r) => (
                    <div className={borderCss} key={r.postId}>
                        <div>
                            <NoteCard noteType="discussion" note={r}></NoteCard>
                        </div>
                        <div className="ml-[50px]">
                            <RepliesList
                                params={{
                                    curationId: r.postId,
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
