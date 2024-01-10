import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import CharacterHeader from "./characterHeader";
import Tags from "./tags";
import { CurationNote } from "nomland.js";
import Image from "next/image";
import { NoteMetadataAttachmentBase } from "crossbell";
import CommunityHeader from "./communityHeader";

// return a component
export default function NoteCard({
    note,
    noteType,
    children,
    showCommunity = false,
}: {
    note: CurationNote;
    noteType: "curation" | "discussion";
    children?: JSX.Element;
    showCommunity?: boolean;
}) {
    const noteCss = noteType === "curation" ? "px-3 py-5 w-content" : "p-3";
    return (
        <div className={noteCss} key={note.raw.transactionHash}>
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
                            <div key={i}>
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
            <Tags cid={note.communityId} tags={note.suggestedTags}></Tags>

            <div className="mt-3">{children}</div>
        </div>
    );
}
