export interface CurationNote {
    postId: string; // postId is {curationId}-{noteId}
    raw: NoteEntity;
    dateString: string;
    title: string;
    content: string;
    curatorAvatars: string[];
    curatorName: string;
    curatorHandle: string;
    tags: string[];
    listNames: string[];
    recordId: string;
    communityId: string;
}
