import NoteCard from "../../components/noteCard";
import RecordCard from "@/app/components/recordCard";
import CommunityHeader from "@/app/components/communityHeader";
import RepliesList from "@/app/components/repliesList";
import { site } from "@/app/config";
import { createNomland } from "@/app/config/nomland";
import { FeedNote, getCommunity } from "@/app/utils";

export async function generateMetadata({
    params,
}: {
    params: { sharingId: string };
}) {
    const { sharingId } = params;
    const [cid, rid] = sharingId.split("-");
    const note = await getData(cid, rid);

    return {
        title: note?.entry.metadata.title || site.title, // TODO:
        description: note?.entry.metadata.description || site.description,
        icons: note?.user.metadata.avatars
            ? note?.user.metadata.avatars[0]
            : `${site.url}/favicon.ico`,
    };
}

export default async function CurationPage({
    params,
}: {
    params: { sharingId: string };
}) {
    // character id and note id is split by "-" in curationId
    const { sharingId } = params;

    const [cid, rid] = sharingId.split("-");
    const sharing = await getData(cid, rid);
    // const repliesCount = await getRepliesCount(cid, rid);

    if (!sharing) return <div>This is not a valid curation.</div>;

    const c = getCommunity(sharing.community);

    sharing.community = c;

    return (
        <div className="container mx-auto my-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5">
                <div className="lg:order-last">
                    <div className="m-3">
                        <CommunityHeader
                            community={sharing.community}
                            excludeDescription={true}
                        ></CommunityHeader>{" "}
                    </div>

                    <RecordCard
                        id={sharing.entry.characterId.toString()}
                        context="community"
                        recordData={sharing.entry}
                    ></RecordCard>
                </div>
                <div>
                    <div>
                        <NoteCard noteType="curation" note={sharing}></NoteCard>
                    </div>
                    <div className="mx-3 my-2">
                        {sharing.note.repliesCount}{" "}
                        {sharing.note.repliesCount > 1
                            ? "discussions"
                            : "discussion"}
                    </div>
                    <hr className="mx-3 mb-5 border-gray-300 border-b-2"></hr>
                    <RepliesList
                        params={{ curationId: sharingId }}
                    ></RepliesList>
                </div>
            </div>
        </div>
    );
}

async function getData(
    characterId: string,
    noteId: string
): Promise<FeedNote | undefined> {
    const nomland = createNomland();
    try {
        return await nomland.getSharing(characterId, noteId);
    } catch (e) {
        console.log(e);
    }
}

export const revalidate = 60; // revalidate this page every 60 seconds
