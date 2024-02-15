import { EntryInfo, UserInfo, UserNote } from "nomland.js";
import { blacklistCommunities, communityProfiles } from "../config";

export interface FeedNote {
    note: UserNote;
    community: UserInfo;
    entry: EntryInfo;
    user: UserInfo;
}

export function shortenUrl(url: string, length?: number) {
    length = length || 60;
    const off = (length * 5) / 12;
    return url.length > length
        ? url.slice(0, off) + "..." + url.slice(-off)
        : url;
}

export function getCommunity(community: UserInfo, noBl?: boolean) {
    const useBl = !noBl;
    if (useBl) {
        if (blacklistCommunities.includes(community.characterId)) return null;
    }
    const c = communityProfiles.find((p) => p.id === community.characterId);
    if (!c) return community;

    community.metadata.name = c.name;
    community.metadata.avatars = [c?.image];
    community.metadata.bio = c.description;

    return community;
}

function getFeedsData(data: {
    notes: UserNote[];
    communities: UserInfo[];
    entries: EntryInfo[];
    users: UserInfo[];
}) {
    const { notes, communities, entries, users } = data;
    const feeds = notes
        .map((note) => {
            const [userId] = note.postId.split("-");

            const community = communities.find(
                (c) => c.characterId === note.contextId
            );

            if (!community) {
                console.log(communities, note);
            }
            const entry = entries.find((e) => e.characterId === note.entryId);
            const user = users.find((u) => u.characterId === userId);

            // entry can be null if it's a discussion note
            // p.s. for discussion note, community id will be the same as the original one
            if (!user || !community) {
                return null;
            } else {
                return {
                    note,
                    community,
                    entry,
                    user,
                };
            }
        })
        .filter((f) => f !== null);
    return feeds as FeedNote[];
}

export function getFeeds(
    data:
        | {
              notes: UserNote[];
              communities: UserInfo[];
              entries: EntryInfo[];
              users: UserInfo[];
          }
        | undefined,
    noBl?: boolean
) {
    if (!data) {
        return {
            feeds: [],
            note: null,
            entry: null,
            user: null,
            community: null,
        };
    }
    const { notes, users, entries, communities } = data;
    const detailedCommunities = communities
        .map((c) => getCommunity(c, noBl))
        .filter((c) => !!c) as UserInfo[];

    return {
        feeds: getFeedsData({
            communities: detailedCommunities,
            notes,
            users,
            entries,
        }),
        community:
            detailedCommunities.length > 0 ? detailedCommunities[0] : null,
        user: users.length > 0 ? users[0] : null,
        entry: entries.length > 0 ? entries[0] : null,
        note: notes.length > 0 ? notes[0] : null,
    };
}
