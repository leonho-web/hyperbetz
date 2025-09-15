import { AppStateCreator } from "@/store/store";

/**
 * Chat Sidebar State Interface
 */
export interface ChatSliceState {
	isOpen: boolean;
	messageCount: number;
	lastReadMessageIndex: number;
}

/**
 * Chat Sidebar Actions Interface
 */
export interface ChatSliceActions {
	toggleChat: () => void;
	openChat: () => void;
	closeChat: () => void;
	setMessageCount: (count: number) => void;
	markMessagesAsRead: (totalMessages: number) => void;
	incrementUnreadCount: () => void;
	resetUnreadCount: () => void;
}

/**
 * Chat Sidebar Slice Creator
 */
export const createChatSlice: AppStateCreator<
	ChatSliceState & ChatSliceActions
> = (set) => ({
	// Initial state
	isOpen: false,
	messageCount: 0,
	lastReadMessageIndex: 0,

	// Actions
	toggleChat: () =>
		set((state) => {
			const wasOpen = state.uiDefinition.chat.isOpen;
			state.uiDefinition.chat.isOpen = !wasOpen;
			// Reset message count when opening chat
			if (!wasOpen) {
				state.uiDefinition.chat.messageCount = 0;
			}
		}),

	openChat: () =>
		set((state) => {
			state.uiDefinition.chat.isOpen = true;
			// Reset message count when opening chat
			state.uiDefinition.chat.messageCount = 0;
		}),

	closeChat: () =>
		set((state) => {
			state.uiDefinition.chat.isOpen = false;
		}),

	setMessageCount: (count: number) =>
		set((state) => {
			state.uiDefinition.chat.messageCount = count;
		}),

	markMessagesAsRead: (totalMessages: number) =>
		set((state) => {
			state.uiDefinition.chat.lastReadMessageIndex = totalMessages;
			if (state.uiDefinition.chat.isOpen) {
				state.uiDefinition.chat.messageCount = 0;
			}
		}),

	incrementUnreadCount: () =>
		set((state) => {
			if (!state.uiDefinition.chat.isOpen) {
				state.uiDefinition.chat.messageCount += 1;
			}
		}),

	resetUnreadCount: () =>
		set((state) => {
			state.uiDefinition.chat.messageCount = 0;
		}),
});
