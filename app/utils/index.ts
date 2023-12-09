import {
    AttributesMetadata,
    Character,
    CharacterEntity,
    CharacterMetadata,
    LinkItemAddress,
    LinkItemAnyUri,
    LinkItemCharacter,
    LinkItemERC721,
    LinkItemLinklist,
    LinkItemNote,
    Note,
    NoteEntity,
    NoteMetadata,
} from "crossbell";
import { CurationNote } from "nomland.js";

export function getAttr(attrs: AttributesMetadata["attributes"], key: string) {
    return attrs?.find((a) => a.trait_type === key)?.value;
}

export function getCuration(
    n:
        | Note<
              | LinkItemCharacter
              | LinkItemAddress
              | LinkItemNote
              | LinkItemERC721
              | LinkItemLinklist
              | LinkItemAnyUri
          >
        | NoteEntity,
    c?: Character | CharacterEntity | null // if n is Note, c cannot be undefined
) {
    let nMetadata: NoteMetadata | undefined | null;
    let cMetadata: CharacterMetadata | undefined | null;
    // if n is NoteEntity(which has "character" field)
    if ("character" in n) {
        c = n.character;
        nMetadata = n.metadata?.content;
        cMetadata = n.character?.metadata?.content;
        n.character?.handle;
    } else {
        if (!c) throw new Error("c is undefined");
        nMetadata = n.metadata as NoteMetadata;
        cMetadata = c.metadata as CharacterMetadata;
    }

    const attrs = nMetadata?.attributes || [];

    const curationNote = {
        dateString:
            (nMetadata?.date_published &&
                new Date(nMetadata?.date_published).toISOString()) ||
            "",
        content: nMetadata?.content?.toString() || "",
        curatorAvatars: cMetadata?.avatars || [],
        curatorName: cMetadata?.name || "",
        curatorHandle: c?.handle || "",
        title: nMetadata?.title || "",
        suggestedTags: JSON.parse(
            (getAttr(attrs, "suggested tags") as string) || "[]"
        ) as string[],
        attachments: nMetadata?.attachments || [],
        raw: n,
        recordId: getAttr(attrs, "curation record") as string,
        communityId: getAttr(attrs, "curation community") as string,
        postId: n.characterId.toString() + "-" + n.noteId.toString(),
    } as CurationNote;
    return curationNote;
}

export function shortenUrl(url: string, length?: number) {
    length = length || 60;
    const off = (length * 5) / 12;
    return url.length > length
        ? url.slice(0, off) + "..." + url.slice(-off)
        : url;
}
