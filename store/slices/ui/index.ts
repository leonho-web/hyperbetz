import { AppStateCreator } from "@/store/store";
import {
	createHeroBannerSlice,
	HeroBannerSliceState,
	HeroBannerSliceActions,
} from "./heroBanner.slice";
import {
	createModalSlice,
	ModalSliceState,
	ModalSliceActions,
} from "./walletProvider/modal.slice";
import { ChatSliceActions, ChatSliceState, createChatSlice } from "./chat.slice";

/**
 * The complete type for the entire 'uiDefinition' branch.
 * It combines all individual slice types from this domain.
 */
export type UiDefinitionSlice = {
	heroBanner: HeroBannerSliceState & HeroBannerSliceActions;
	modal: ModalSliceState & ModalSliceActions;
	chat: ChatSliceState & ChatSliceActions;
};
// Example for the future:
// export type UiDefinitionSlice = (HeroBannerSliceState & HeroBannerSliceActions) & (FooterSliceState & FooterSliceActions);

/**
 * The state creator for the 'uiDefinition' slice.
 * It combines all the individual slice creators into a single slice object.
 */
export const createUiDefinitionSlice: AppStateCreator<UiDefinitionSlice> = (
	...args
) => ({
	heroBanner: createHeroBannerSlice(...args),
	modal: createModalSlice(...args),
	chat: createChatSlice(...args),
	// When you add a new slice for another dynamic component:
	// ...createFooterSlice(...args),
});
