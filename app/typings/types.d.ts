export type ViewMode = "normal" | "analyzed";
export interface CurationNote {
    postId: string;
    raw: NoteEntity;
    dateString: string;
    content: string;
    curatorAvatars: string[];
    curatorName: string;
    curatorHandle: string;
    suggestedTags: string[];
    listNames: string[];
    recordId: string;
    communityId: string;
}
