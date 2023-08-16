import RecordDisplay from "../../components/recordDisplay";
import ViewSwitcher from "../../components/viewSwitcher";

export default function RecordPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <>
            <RecordDisplay props={{ rid: id }}></RecordDisplay>
        </>
    );
}
