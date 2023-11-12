import Link from "next/link";
import { communityProfiles } from "../config";
import Image from "next/image";

export default async function Home() {
    return (
        <div className="container mx-auto py-10 px-10 lg:px-40 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {communityProfiles.map((profile) => (
                    <Link
                        className="card"
                        key={profile.id}
                        href={`./community/${profile.id}`}
                    >
                        <div className="flex flex-col items-center">
                            <Image
                                alt="community image"
                                className="w-20 h-20 mb-5"
                                src={profile.image}
                                width={80}
                                height={80}
                            />
                            <div className="text-lg font-bold">
                                {profile.name}
                            </div>
                            <div className="text-sm">{profile.description}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export const revalidate = 60; // revalidate this page every 60 seconds
