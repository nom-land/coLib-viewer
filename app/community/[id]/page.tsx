import CommunityDisplay from "../../components/communityDisplay";
import ViewSwitcher from "../../components/viewSwitcher";

export default function CommunityPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <>
            <ViewSwitcher>
                <CommunityDisplay
                    props={{ id, viewMode: "normal" }}
                ></CommunityDisplay>
                <CommunityDisplay
                    props={{ id, viewMode: "analyzed" }}
                ></CommunityDisplay>
            </ViewSwitcher>
        </>
    );
}
