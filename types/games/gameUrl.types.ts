// src/types/games/game-url-types.ts
import { GameType } from "@/types/games/gameList.types";

/**
 * Defines the structure of the request body required to fetch a game URL.
 */
export interface GetGameUrlRequestBody {
  api_key: string;
  username: string;
  password: string;
  vendor_name: string;
  game_type: GameType;
  gp_id: string | number;
  game_id: string | number;
}

/**
 * Represents the structure of a SUCCESSFUL response from the getGameUrl API.
 * The `error` property is the discriminant and is always `false`.
 */
interface GetGameUrlSuccessResponse {
  error: false;
  message: "Success";
  data: {
    url: string;
  };
}

/**
 * Represents the structure of a FAILED response from the getGameUrl API.
 * The `error` property is the discriminant and is always `true`.
 * Note the absence of the `data` field in an error case.
 */
interface GetGameUrlErrorResponse {
  error: true;
  message: string;
  data?: never; // Explicitly state that data should not exist on an error response
}

/**
 * A discriminated union representing all possible responses from the getGameUrl API.
 * This allows for type-safe handling of both success and error states.
 *
 * @example
 * const response = await apiService.getGameUrl(...);
 * if (response.error === false) {
 *   // TypeScript knows `response.data.url` is a string
 *   console.log(response.data.url);
 * } else {
 *   // TypeScript knows `response.data` does not exist
 *   console.error(response.message);
 * }
 */
export type GetGameUrlApiResponse = GetGameUrlSuccessResponse | GetGameUrlErrorResponse;
