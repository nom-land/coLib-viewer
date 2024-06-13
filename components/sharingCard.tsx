import Link from "next/link";
import CommunityHeader from "./communityHeader";
import LinkPreview from "./linkPreview";
import NoteStatLine from "./noteStatLine";
import Tags from "./tags";
import UserHeader from "./userHeader";
import { EntityInfo, CharacterInfo, NoteInfo } from "nomland.js";
import Attachments from "./attachments";
import { getId } from "../app/utils";

export default function SharingCard(props: {
    note: NoteInfo;
    user: CharacterInfo;
    entry?: EntityInfo;
    showCommunity?: boolean;
    community: CharacterInfo;
    excludeRecord?: boolean;
}) {
    const { note, user, showCommunity, community, entry, excludeRecord } =
        props;

    return (
        <div className="card my-3">
            <Link key={getId(note.key)} href={`/curation/${getId(note.key)}`}>
                <div>
                    <div className="relative">
                        <UserHeader
                            user={user}
                            date={note.details.date_published}
                        ></UserHeader>
                        {showCommunity && (
                            <div className="absolute right-0 top-0">
                                <CommunityHeader
                                    community={community}
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
                            {note.details.content}
                        </div>
                        {/* </blockquote> */}
                    </div>

                    <Attachments note={note} />

                    {!excludeRecord && entry && (
                        <LinkPreview url={entry.metadata.url} />
                    )}
                    <Tags
                        cid={note.contextId.toString()}
                        tags={note.details.tags || []}
                    />

                    <NoteStatLine
                        replies={note.repliesCount || 0}
                    ></NoteStatLine>
                </div>
            </Link>
        </div>
    );
}
