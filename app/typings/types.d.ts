export type ViewMode = "normal" | "analyzed";
export interface curationNote {
    raw: NoteEntity;
    dateString: string;
    content: string;
    curatorAvatars: string[];
    curatorName: string;
    curatorHandle: string;
    suggestedTags: string[];
}
