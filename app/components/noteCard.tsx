"use client";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import CharacterHeader from "./characterHeader";
import Tags from "./tags";
import { CurationNote } from "nomland.js";
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
    note: CurationNote;
    noteType: "curation" | "discussion";
    showCommunity?: boolean;
}) {
    // get first url from note
    let curationUrl = "";
    const curationContent = note.raw.metadata?.content?.attributes
        ?.find((a) => a.trait_type === "curation content")
        ?.value?.toString();
    if (curationContent) {
        curationUrl = curationContent.match(/https?:\/\/[^\s]+/)?.[0] ?? "";
    }

    let noteCss = "";
    if (noteType === "curation") {
        noteCss = "px-3 py-5 w-content";
    } else if (note.recordId) {
        noteCss = "card my-3 hover:bg-gray-100 cursor-pointer";
    } else {
        noteCss = "p-3";
    }
    return (
        <div
            className={noteCss}
            key={note.raw.transactionHash}
            onClick={(e) => {
                if (noteType === "discussion" && note.recordId) {
                    e.preventDefault();
                    window.open(`/curation/${note.postId}`, "_blank");
                }
            }}
        >
            <CharacterHeader
                id={note.postId.split("-")[0]}
                name={note.curatorName}
                date={note.dateString}
                handle={note.curatorHandle}
                avatar={note.curatorAvatars[0]}
            />
            {showCommunity && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <CommunityHeader
                        communityId={note.communityId}
                        excludeDescription={true}
                        excludeName={true}
                    />
                </div>
            )}
            {note.title.length > 0 && (
                <div className="text-2xl font-bold my-3">{note.title}</div>
            )}
            <div className="my-3">
                <ReactMarkdown>{note.content}</ReactMarkdown>
            </div>
            <div>
                {note.attachments?.map(
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
            <Tags cid={note.communityId} tags={note.tags}></Tags>
            {noteType === "discussion" && note.recordId && (
                <div>
                    {curationUrl !== "" ? (
                        <LinkPreview url={curationUrl} />
                    ) : (
                        <div className="flex gap-1 my-5">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                            </svg>
                            {note.recordId}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
