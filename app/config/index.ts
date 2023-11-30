// app name
export const sourceName = "nunti";

export const homeName = "Community Library";

const appPrefix = sourceName.slice(0, 2);

export function makeListLinkType(list: string) {
    return `${appPrefix}-ls-${list}`;
}

export function getListLinkTypePrefix() {
    return `${appPrefix}-ls-`;
}

export function getMembersLinkType() {
    return `${appPrefix}-members`;
}

// TODO: hardcoded community description
export const communityProfiles = [
    {
        id: "59949",
        name: "Uncommons｜💚💊",
        description: "Crypto Salon for Public Goods Builders.",
        image: "/uncommons.jpg",
    },
    {
        id: "57762",
        name: "dDAO-滴叨滴叨滴叨",
        description:
            "在这里，技术与人文相结合，我们共同探索和创造 DAO 的未来。",
        image: "https://cdn.discordapp.com/icons/995771542631890944/f983de7913a29163a0a80874e353b16c.webp",
    },
    {
        id: "57798",
        name: "Ever Not Forever",
        description:
            "岁月不静好，刹那也永恒。我们一起体验分享边界的流动，世界的宽广。",
        image: "https://cdn.discordapp.com/icons/1139223604177948733/b24842e6eaee8415f49d0fb31cf6c37e.webp",
    },
    {
        id: "59538",
        name: "Web3 Frontend",
        description:
            "W3F（前端开发者的快乐老家）——一个致力于连接 Web2 和 Web3，为前端开发者提供技术知识和商业机会的社区。我们提供技术教程、研讨会、实践项目、线下活动和专家互动。我们的使命是帮助前端开发者掌握 Web3 技术，建立声誉，创造商业机会。",
        image: "/w3f.jpg",
    },
];
