"use client";

import { communityProfiles } from "../../config";
import Image from "next/image";
import DescriptionSection from "@/components/descriptionSection";

export default function Home() {
    return (
        <div className="container mx-auto py-10 px-10 lg:px-40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {communityProfiles.map((profile) => (
                    <div
                        className="card cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `./community/${profile.id}`;
                        }}
                        key={profile.id}
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
                            <div className="text-sm pt-3">
                                <DescriptionSection
                                    description={profile.description}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
