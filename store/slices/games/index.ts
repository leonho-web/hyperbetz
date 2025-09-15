import { StateCreator } from "zustand";
import {
	createGameListSlice,
	GameListActions,
	GameListInitialState,
} from "./gameList.slice";
import {
	createProviderListSlice,
	ProviderListActions,
	ProviderListInitialState,
} from "./providerList.slice";
import {
	CategoryListActions,
	CategoryListInitialState,
	createCategoryListSlice,
} from "./categoryList.slice";
import { AppStore } from "../../store";

export interface GameSlice {
	list: GameListActions & GameListInitialState;
	providers: ProviderListActions & ProviderListInitialState;
	categories: CategoryListActions & CategoryListInitialState;
	// will add more features in this once created
}

export const createGameSlice: StateCreator<AppStore, [], [], GameSlice> = (
	...args
) => ({
	list: createGameListSlice(...args),
	providers: createProviderListSlice(...args),
	categories: createCategoryListSlice(...args),
});
