"use client";

import { useEffect, useState, useRef } from "react";
import { createNomland } from "../app/config/nomland";
import { getFeeds, getId } from "../app/utils";
import { InView } from "react-intersection-observer";
import NoteCard from "./noteCard";
import SharingCard from "./sharingCard";

const getReplies = async (
    characterId: string,
    noteId: string,
    skip: number = 0
) => {
    const nomland = createNomland();

    const replies = await nomland.getReplies(
        {
            characterId,
            noteId,
        },
        {
            take: 10,
            skip,
        }
    );
    return getFeeds(replies, true);
};

export default function RepliesLoadMore({
    characterId,
    noteId,
    initialSkip,
    borderCss,
    depth,
    maxDepth,
}: {
    characterId: string;
    noteId: string;
    initialSkip: number;
    borderCss: string;
    depth: number;
    maxDepth: number;
}) {
    const [replies, setReplies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [skip, setSkip] = useState(initialSkip);

    const loadMoreReplies = async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const { feeds } = await getReplies(characterId, noteId, skip);

            if (feeds.length < 10) {
                setHasMore(false);
            }
            if (feeds.length > 0) {
                setReplies((prev) => [...prev, ...feeds]);
                setSkip((prev) => prev + feeds.length);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error("Error loading more replies:", e);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {replies.map((r) => (
                <div className={borderCss} key={r.note.key} data-depth={depth}>
                    <div>
                        {r.entity ? (
                            <SharingCard
                                note={r.note}
                                user={r.author}
                                entry={r.entity}
                                community={r.context}
                            />
                        ) : (
                            <NoteCard noteType="discussion" note={r} />
                        )}
                    </div>
                    {depth < maxDepth && (
                        <div className="ml-[50px]">
                            <RepliesLoadMore
                                characterId={r.note.key.characterId}
                                noteId={r.note.key.noteId}
                                initialSkip={0}
                                borderCss={borderCss}
                                depth={depth + 1}
                                maxDepth={maxDepth}
                            />
                        </div>
                    )}
                </div>
            ))}

            {hasMore && (
                <InView
                    onChange={(inView) => {
                        if (inView) {
                            loadMoreReplies();
                        }
                    }}
                >
                    {isLoading && (
                        <div className="flex justify-center my-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        </div>
                    )}
                </InView>
            )}
        </>
    );
}
