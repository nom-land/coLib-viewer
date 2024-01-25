import Link from "next/link";
import CharacterHeader from "./characterHeader";
import LinkPreview from "./linkPreview";
import NoteStatLine from "./noteStatLine";
import Tags from "./tags";
import { CharacterInfo, FeedNote } from "nomland.js";
import { CommunityAvatar } from "./communityAvatar";
import { communityProfiles } from "../config";

export default function CurationFeed(props: {
    curationNotes: FeedNote[];
    communities?: CharacterInfo[];
    excludeRecord?: boolean;
}) {
    const { curationNotes, communities, excludeRecord } = props;
    // TODO?
    const displayCurationNotes = curationNotes.filter((curation) => {
        if (
            communityProfiles.find(
                (p) => p.id === curation.n.communityId.toString()
            )
        ) {
            return curation;
        }
    });
    // TODO END
    let communityData = [] as any[];
    if (communities)
        communityData = displayCurationNotes.map((curation) => {
            const c = communities.find(
                (c) =>
                    c.characterId.toString() ===
                    curation.n.communityId.toString()
            );
            return {
                name: c?.metadata?.name || "Unknown",
                avatar: c?.metadata?.avatars ? c?.metadata?.avatars[0] : "",
                handle: c?.handle || "",
            };
        });

    return (
        <div className="list-items gap-4">
            {displayCurationNotes.map((cur, i) => (
                <div className="card my-3" key={i}>
                    <Link key={cur.n.postId} href={`/curation/${cur.n.postId}`}>
                        <div>
                            <div className="relative">
                                <CharacterHeader
                                    id={cur.n.postId.split("-")[0]}
                                    name={cur.n.curatorName}
                                    handle={cur.n.curatorHandle}
                                    avatar={cur.n.curatorAvatars[0]}
                                    date={cur.n.dateString}
                                ></CharacterHeader>

                                {communities && (
                                    <div className="absolute right-0 top-0">
                                        <CommunityAvatar
                                            communityId={cur.n.communityId.toString()}
                                            name={communityData[i].name}
                                            avatar={communityData[i].avatar}
                                            handle={communityData[i].handle}
                                            excludeName={true}
                                            size="s"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="my-3">
                                {/* <blockquote className="py-2 px-3 my-4 border-l-4 border-gray-300 dark:border-gray-500"> */}
                                <div className="leading-relaxed text-gray-900 whitespace-pre-line">
                                    {cur.n.content}
                                </div>
                                {/* </blockquote> */}
                            </div>

                            {!excludeRecord && cur.record && (
                                <LinkPreview url={cur.record.metadata.url} />
                            )}
                            <Tags
                                cid={cur.n.communityId.toString()}
                                tags={cur.n.tags}
                            />

                            <NoteStatLine
                                replies={cur.stat.replies || 0}
                            ></NoteStatLine>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
