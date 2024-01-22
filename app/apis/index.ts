import { createContract, createIndexer } from "crossbell";
import { CurationNote } from "nomland.js";

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

export interface CurationListData {
    curationList: CurationNote[];
    curationStat: Map<string, CurationStat>; // curationId -> CurationStat
}
