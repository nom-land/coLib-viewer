export type ViewMode = "normal" | "analyzed";
export interface CurationNote {
    postId: string; // postId is {curationId}-{noteId}
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
