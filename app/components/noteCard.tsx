"use client";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import CharacterHeader from "./characterHeader";
import Tags from "./tags";
import { FeedNote } from "nomland.js";
import Image from "next/image";
import { NoteMetadataAttachmentBase } from "crossbell";
import CommunityHeader from "./communityHeader";
import LinkPreview from "./linkPreview";

// return a component
export default function NoteCard({
    note,
    noteType,
    showCommunity = false,
}: {
    note: FeedNote;
    noteType: "curation" | "discussion";
    showCommunity?: boolean;
}) {
    const curationUrl = note.record?.metadata.url;
    let noteCss = "";
    if (noteType === "curation") {
        noteCss = "px-3 py-5 w-content";
    } else if (curationUrl) {
        noteCss = "card my-3 hover:bg-gray-100 cursor-pointer";
    } else {
        noteCss = "p-3";
    }
    return (
        <div
            className={noteCss}
            key={note.n.raw.transactionHash}
            onClick={(e) => {
                if (noteType === "discussion" && curationUrl) {
                    e.preventDefault();
                    window.open(`/curation/${note.n.postId}`, "_blank");
                }
            }}
        >
            <CharacterHeader
                id={note.n.postId.split("-")[0]}
                name={note.n.curatorName}
                date={note.n.dateString}
                handle={note.n.curatorHandle}
                avatar={note.n.curatorAvatars[0]}
            />
            {showCommunity && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <CommunityHeader
                        communityId={note.n.communityId.toString()}
                        excludeDescription={true}
                        excludeName={true}
                    />
                </div>
            )}
            {note.n.title.length > 0 && (
                <div className="text-2xl font-bold my-3">{note.n.title}</div>
            )}
            <div className="my-3">
                <ReactMarkdown>{note.n.content}</ReactMarkdown>
            </div>
            <div>
                {note.n.attachments?.map(
                    (
                        a: NoteMetadataAttachmentBase<"address" | "content">,
                        i: number
                    ) =>
                        a.address && (
                            <div key={i} className="my-3">
                                <Image
                                    priority
                                    src={
                                        a.address?.startsWith("ipfs://")
                                            ? `https://ipfs.crossbell.io/ipfs/${a.address.slice(
                                                  7
                                              )}`
                                            : a.address
                                    }
                                    width={200}
                                    height={200}
                                    alt="attachment"
                                ></Image>
                            </div>
                        )
                )}
            </div>
            {noteType === "discussion" && curationUrl && (
                <LinkPreview url={curationUrl} />
            )}
            <Tags
                cid={note.n.communityId?.toString()}
                tags={note.n.tags}
            ></Tags>
        </div>
    );
}
