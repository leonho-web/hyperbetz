/**
 * Request body structure for the getLobby API endpoint
 */
export interface GetLobbyRequestBody {
  /**
   * The API key for authentication
   */
  api_key: string;
  /**
   * The username for the lobby access
   */
  username: string;
  /**
   * The password for authentication
   */
  password: string;
  /**
   * The provider name (e.g., "evolution")
   */
  provider_name: string;
}

/**
 * Data structure contained in the getLobby API response
 */
export interface GetLobbyData {
  /**
   * The URL to access the game lobby
   */
  url: string;
}

/**
 * Response structure for the getLobby API endpoint
 */
export type GetLobbyResponse = GetLobbyData;

/**
 * API endpoint configuration for getLobby
 */
export const GET_LOBBY_ENDPOINT = "/api/getLobby" as const;

/**
 * Type for the getLobby API function
 */
export type GetLobbyApiFunction = (request: GetLobbyRequestBody) => Promise<GetLobbyResponse>;
