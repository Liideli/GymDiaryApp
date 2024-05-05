type Groups = {
    id?: string;
    name?: string;
    description?: string;
    owner?: string;
    members?: string;
}

type GroupInput = {
    name: string;
    description: string;
    owner: string;
    members: string;
};

type createGroupModalProps = {
    show: boolean;
    onHide: () => void;
    onGroupCreated: () => void;
};

export type { Groups, GroupInput, createGroupModalProps };