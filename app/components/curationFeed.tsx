"use client";

import Link from "next/link";
import UserHeader from "./userHeader";
import LinkPreview from "./linkPreview";
import NoteStatLine from "./noteStatLine";
import Tags from "./tags";
import { FeedNote } from "../utils";
import CommunityHeader from "./communityHeader";

export default function CurationFeed(props: {
    feeds: FeedNote[];
    includeCommunity?: boolean;
    excludeRecord?: boolean;
}) {
    const { feeds, includeCommunity, excludeRecord } = props;

    return (
        <div className="list-items gap-4">
            {feeds.map((cur, i) => (
                <div className="card my-3" key={i}>
                    <Link
                        key={cur.note.postId}
                        href={`/curation/${cur.note.postId}`}
                    >
                        <div>
                            <div className="relative">
                                <UserHeader
                                    user={cur.user}
                                    date={cur.note.dateString}
                                ></UserHeader>
                                {includeCommunity && (
                                    <div className="absolute right-0 top-0">
                                        <CommunityHeader
                                            community={cur.community}
                                            excludeName={true}
                                            excludeDescription={true}
                                            size="s"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="my-3">
                                {/* <blockquote className="py-2 px-3 my-4 border-l-4 border-gray-300 dark:border-gray-500"> */}
                                <div className="leading-relaxed text-gray-900 whitespace-pre-line">
                                    {cur.note.content}
                                </div>
                                {/* </blockquote> */}
                            </div>

                            {!excludeRecord && cur.entry && (
                                <LinkPreview url={cur.entry.metadata.url} />
                            )}
                            <Tags
                                cid={cur.note.communityId.toString()}
                                tags={cur.note.tags}
                            />

                            <NoteStatLine
                                replies={cur.note.repliesCount || 0}
                            ></NoteStatLine>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
