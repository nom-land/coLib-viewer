import NoteCard from "@/components/noteCard";
import RecordCard from "@/components/recordCard";
import CommunityHeader from "@/components/communityHeader";
import RepliesList from "@/components/repliesList";
import { site } from "@/app/config";
import { createNomland } from "@/app/config/nomland";
import { getCommunity } from "@/app/utils";
import { unstable_cache } from "next/cache";

const getNote = async (characterId: string, noteId: string) => {
    const nomland = createNomland();
    try {
        return await nomland.getShare({ characterId, noteId });
    } catch (e) {
        console.log(e);
    }
};

export async function generateMetadata(props: {
    params: Promise<{ sharingId: string }>;
}) {
    const params = await props.params;
    const { sharingId } = params;
    const [cid, rid] = sharingId.split("-");
    const note = await getNote(cid, rid);

    return {
        title: note?.entity.metadata.title || site.title, // TODO:
        description: note?.entity.metadata.description || site.description,
        icons: note?.author.metadata.avatars
            ? note?.author.metadata.avatars[0]
            : `${site.url}/favicon.ico`,
    };
}

export default async function CurationPage(props: {
    params: Promise<{ sharingId: string }>;
}) {
    const params = await props.params;
    // character id and note id is split by "-" in curationId
    const { sharingId } = params;

    const [cid, rid] = sharingId.split("-");
    const sharing = await getNote(cid, rid);
    console.log({ sharing });
    // const repliesCount = await getRepliesCount(cid, rid);

    if (!sharing) return <div>This is not a valid curation.</div>;

    const c = getCommunity(sharing.context, true)!;

    sharing.context = c;

    return (
        <div className="container mx-auto my-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5">
                <div className="lg:order-last">
                    <div className="m-3">
                        <CommunityHeader
                            community={sharing.context}
                            excludeDescription={true}
                        ></CommunityHeader>{" "}
                    </div>

                    <RecordCard
                        id={sharing.entity.id.toString()}
                        context="community"
                        recordData={sharing.entity}
                    ></RecordCard>
                </div>
                <div>
                    <div>
                        <NoteCard noteType="curation" note={sharing}></NoteCard>
                    </div>
                    <div className="mx-3 my-2">
                        {sharing.note.repliesCount} {/* // TODO */}
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
