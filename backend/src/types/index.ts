export interface createChatProps {
  isGroup: boolean;
  groupName?: string | undefined;
  createdBy: string;
  participants: string[];
}

export interface createUserProps {
  email: string;
  password: string;
  username: string;
}
export interface authenticateUserProps {
  email: string;
  password: string;
}

export interface saveContactProps {
  ownerId: string;
  contactId: string;
  nickName?: string | undefined;
}

export interface findContactsProps {
  ownerId: string;
}
