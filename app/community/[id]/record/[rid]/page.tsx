import ViewSwitcher from "../../../../components/viewSwitcher";
import CommunityRecordDisplay from "../../../../components/communityRecordDisplay";

export default function CommunityRecordPage({
    params,
}: {
    params: { id: string; rid: string };
}) {
    const { id, rid } = params;
    return (
        <>
            <ViewSwitcher>
                <CommunityRecordDisplay
                    props={{ id, rid, viewMode: "normal" }}
                ></CommunityRecordDisplay>
                <CommunityRecordDisplay
                    props={{ id, rid, viewMode: "analyzed" }}
                ></CommunityRecordDisplay>
            </ViewSwitcher>
        </>
    );
}
export const revalidate = 60; // revalidate this page every 60 seconds
