import { CharacterInfo, Feeds, NoteKey, NotePack } from "nomland.js";
import { blacklistCommunities, communityProfiles } from "../config";

export function shortenUrl(url: string, length?: number) {
    length = length || 60;
    const off = (length * 5) / 12;
    return url.length > length
        ? url.slice(0, off) + "..." + url.slice(-off)
        : url;
}

export function getCommunity(community: CharacterInfo, noBl?: boolean) {
    const useBl = !noBl;
    if (useBl) {
        if (blacklistCommunities.includes(community.id)) return null;
    }
    const c = communityProfiles.find((p) => p.id === community.id);
    if (!c) return community;

    community.metadata.name = c.name;
    community.metadata.avatars = [c?.image];
    community.metadata.bio = c.description;

    return community;
}

function getFeedsData(data: Feeds) {
    const { notes, contexts, entities, authors } = data;
    console.log("getFeedsData(input)", data);
    const feeds = notes
        .map((note) => {
            const userId = note.key.characterId;

            const context = contexts.find((c) => c.id === note.contextId);

            if (!context) {
                console.log(contexts, note);
            }
            const entity = entities.find((e) => e.id === note.entityId);
            const author = authors.find((u) => u.id === userId);

            // entry can be null if it's a discussion note
            // p.s. for discussion note, community id will be the same as the original one
            if (!author || !context) {
                return null;
            } else {
                return {
                    note,
                    context,
                    entity,
                    author,
                };
            }
        })
        .filter((f) => f !== null);
    console.log("getFeedsData", feeds);
    return feeds as NotePack[];
}

export function getFeeds(data: Feeds | undefined, noBl?: boolean) {
    if (!data) {
        return {
            feeds: [],
            note: null,
            entry: null,
            user: null,
            community: null,
        };
    }
    const {
        notes,
        authors: users,
        entities: entries,
        contexts: communities,
    } = data;
    const detailedCommunities = communities
        .map((c) => getCommunity(c, noBl))
        .filter((c) => !!c) as CharacterInfo[];

    return {
        feeds: getFeedsData({
            contexts: detailedCommunities,
            notes,
            authors: users,
            entities: entries,
        }),
        community:
            detailedCommunities.length > 0 ? detailedCommunities[0] : null,
        user: users.length > 0 ? users[0] : null,
        entry: entries.length > 0 ? entries[0] : null,
        note: notes.length > 0 ? notes[0] : null,
    };
}

export function getId(key: NoteKey) {
    return key.characterId + "-" + key.noteId;
}
