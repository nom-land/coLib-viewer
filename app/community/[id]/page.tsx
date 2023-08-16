import CommunityDisplay from "../../components/communityDisplay";

export default function CommunityPage({ params }: { params: { id: string } }) {
    const { id } = params;
    return <CommunityDisplay props={{ id }}></CommunityDisplay>;
}

export const revalidate = 60; // revalidate this page every 60 seconds
