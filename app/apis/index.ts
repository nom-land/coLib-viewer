import { createContract, createIndexer } from "crossbell";
import { CurationNote } from "../typings/types";
import { getAttr, getCuration } from "../utils";

interface CurationStat {
    replies: number;
}
export async function getCharacterData(id: string) {
    const c = createContract();

    const { data } = await c.character.get({
        characterId: id,
    });
    return data;
}

export async function getCurationData(
    recordId: string,
    communityId?: string,
    listName?: string
) {
    const indexer = createIndexer();

    const curations = await indexer.note.getMany({
        toCharacterId: recordId,
        includeCharacter: true,
    });
    const curationList = [] as CurationNote[];
    const curationStat = new Map<string, CurationStat>();
    curations.list.map((curationNote) => {
        const attrs = curationNote.metadata?.content?.attributes;
        const entityType = getAttr(attrs, "entity type");
        if (entityType === "curation" || entityType === "discussion") {
            if (communityId) {
                if (
                    getAttr(attrs, "curation community")?.toString() !==
                        communityId &&
                    getAttr(attrs, "discussion community")?.toString() !==
                        communityId
                ) {
                    return;
                }
            }

            if (listName) {
                if (
                    !(
                        JSON.parse(
                            getAttr(attrs, "curation lists")?.toString() || "[]"
                        ) as string[]
                    ).includes(listName)
                ) {
                    return;
                }
            }

            const curation = getCuration(curationNote);

            curationList.push(curation);
        }
    });

    await Promise.all(
        curations.list.map(async (curationNote) => {
            const { count } = await indexer.note.getMany({
                toCharacterId: curationNote.characterId,
                toNoteId: curationNote.noteId,
                limit: 0,
            });
            const curationId =
                curationNote.characterId.toString() +
                "-" +
                curationNote.noteId.toString();
            curationStat.set(curationId, {
                replies: count,
            });
        })
    );

    return { curationList, curationStat } as CurationListData;
}

export interface CurationListData {
    curationList: CurationNote[];
    curationStat: Map<string, CurationStat>; // curationId -> CurationStat
}
