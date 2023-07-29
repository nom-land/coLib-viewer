import { createContract } from "crossbell";

export async function getCharacterData(id: string) {
    const c = createContract();

    const { data } = await c.character.get({
        characterId: id,
    });
    return data;
}
