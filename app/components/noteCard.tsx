import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import UserHeader from "./userHeader";
import Tags from "./tags";
import Image from "next/image";
import { NoteMetadataAttachmentBase } from "crossbell";
import CommunityHeader from "./communityHeader";
import LinkPreview from "./linkPreview";
import { FeedNote } from "../utils";

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
    const curationUrl = sharing.entry?.metadata.url;
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
            key={sharing.note.raw.transactionHash}
            onClick={(e) => {
                if (noteType === "discussion" && curationUrl) {
                    e.preventDefault();
                    window.open(`/curation/${sharing.note.postId}`, "_blank");
                }
            }}
        >
            <UserHeader user={sharing.user} date={sharing.note.dateString} />
            {showCommunity && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    <CommunityHeader
                        community={sharing.community}
                        excludeDescription={true}
                        excludeName={true}
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
            <div>
                {sharing.note.attachments?.map(
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
                cid={sharing.note.communityId?.toString()}
                tags={sharing.note.tags}
            ></Tags>
        </div>
    );
}
