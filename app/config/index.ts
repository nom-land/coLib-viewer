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
