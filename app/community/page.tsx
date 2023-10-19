import Link from "next/link";
import { homeName } from "../config";

// Only the selected communities will be displayed
const communityIds = ["57762", "57747", "57798"]; //TODO

export default async function Home() {
    return (
        <div className="container mx-auto py-10 px-10 lg:px-40 min-h-screen">
            <div className="my-10">Welcome to {homeName}!</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {communityIds.map((id) => (
                    <Link className="card" key={id} href={`./community/${id}`}>
                        {id}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export const revalidate = 60; // revalidate this page every 60 seconds
8908;
