import { AttributesMetadata, Character } from "crossbell";

export function getCharIdString(c: Character) {
    return `@${c.handle}#${c.characterId.toString()}))`;
}

export function getAttr(attrs: AttributesMetadata["attributes"], key: string) {
    return attrs?.find((a) => a.trait_type === key)?.value;
}
