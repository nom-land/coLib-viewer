import RecordDisplay from "../../components/recordDisplay";
import ViewSwitcher from "../../components/viewSwitcher";

export default function RecordPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <>
            <ViewSwitcher>
                <RecordDisplay
                    props={{ rid: id, viewMode: "normal" }}
                ></RecordDisplay>
                <RecordDisplay
                    props={{ rid: id, viewMode: "analyzed" }}
                ></RecordDisplay>
            </ViewSwitcher>
        </>
    );
}
