"use client";

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import UserHeader from "./userHeader";
import CommunityHeader from "./communityHeader";
import { FeedNote } from "../utils";
import Attachments from "./attachments";
import Tags from "./tags";

// return a component
export default function NoteCard({
    note: sharing,
    noteType,
    showCommunity = false,
}: {
    note: FeedNote;
    noteType: "curation" | "discussion";
    showCommunity?: boolean;
}) {
    let noteCss = "";
    if (noteType === "curation") {
        noteCss = "px-3 py-5 w-content";
    } else {
        noteCss = "p-3";
    }
    return (
        <div className={noteCss} key={sharing.note.raw.transactionHash}>
            <UserHeader user={sharing.user} date={sharing.note.dateString} />
            {showCommunity && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <CommunityHeader
                        community={sharing.community}
                        excludeDescription={true}
                        excludeName={true}
                        size="s" // TODO: check
                    />
                </div>
            )}
            {sharing.note.title.length > 0 && (
                <div className="text-2xl font-bold my-3">
                    {sharing.note.title}
                </div>
            )}
            <div className="my-3">
                <ReactMarkdown>{sharing.note.content}</ReactMarkdown>
            </div>
            <Attachments note={sharing.note} />
            <Tags
                cid={sharing.community.characterId}
                tags={sharing.note.tags}
            />
        </div>
    );
}
