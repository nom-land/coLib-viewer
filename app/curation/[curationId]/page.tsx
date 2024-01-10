import NoteCard from "../../components/noteCard";
import RecordCard from "@/app/components/recordCard";
import CommunityHeader from "@/app/components/communityHeader";
import RepliesList from "@/app/components/repliesList";
import { site } from "@/app/config";
import { createNomland } from "@/app/config/nomland";

export async function generateMetadata({
    params,
}: {
    params: { curationId: string };
}) {
    const { curationId } = params;
    const [cid, rid] = curationId.split("-");
    const note = await getData(cid, rid);

    return {
        title: note?.raw?.toCharacter?.metadata?.content?.title || site.title, // TODO:
        description: note?.content || site.description,
        icons: note?.curatorAvatars?.[0] || `${site.url}/favicon.ico`,
    };
}

export default async function CurationPage({
    params,
}: {
    params: { curationId: string };
}) {
    // character id and note id is split by "-" in curationId
    const { curationId } = params;

    const [cid, rid] = curationId.split("-");
    const note = await getData(cid, rid);
    const repliesCount = await getRepliesCount(cid, rid);

    if (!note) return <div>This is not a valid curation.</div>;
    else
        return (
            <div className="container mx-auto my-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5">
                    <div className="lg:order-last">
                        <div className="m-3">
                            <CommunityHeader
                                communityId={note.communityId}
                                excludeDescription={true}
                            ></CommunityHeader>{" "}
                        </div>

                        <RecordCard
                            id={note?.recordId || ""}
                            context="community"
                        ></RecordCard>
                    </div>
                    <div>
                        <div>
                            <NoteCard
                                noteType="curation"
                                note={note}
                            ></NoteCard>
                        </div>
                        <div className="mx-3 my-2">
                            {repliesCount}{" "}
                            {repliesCount > 1 ? "discussions" : "discussion"}
                        </div>
                        <hr className="mx-3 mb-5 border-gray-300 border-b-2"></hr>
                        <RepliesList params={{ curationId }}></RepliesList>
                    </div>
                </div>
            </div>
        );
}

async function getData(characterId: string, noteId: string) {
    const nomland = createNomland();
    try {
        const curationNote = await nomland.getCuration(characterId, noteId);

        return curationNote;
    } catch (e) {
        console.log(e);
    }
}

async function getRepliesCount(characterId: string, noteId: string) {
    const nomland = createNomland();
    return await nomland.getDiscussionsCount(characterId, noteId);
}

export const revalidate = 60; // revalidate this page every 60 seconds
