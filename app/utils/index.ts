import { EntryInfo, UserInfo, UserNote } from "nomland.js";
import { communityProfiles } from "../config";

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

export function getCommunity(community: UserInfo) {
    const c = communityProfiles.find(
        (p) => p.id === community.characterId.toString()
    );
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
                (c) => c.characterId === note.communityId?.toString()
            );
            const entry = entries.find(
                (e) => e.characterId === note.entryId?.toString()
            );
            const user = users.find((u) => u.characterId === userId);

            // community and entry can be null if it's a discussion note
            if (!user) {
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
        .filter((f) => !!f);
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
        | undefined
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
    const detailedCommunities = communities.map((c) => getCommunity(c));

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
