// GIF Service - Handles multiple GIF providers
import { createApiUrl } from './api-config'

export interface GifResult {
  id: string
  title: string
  url: string
  previewUrl: string
  width: number
  height: number
  tags: string[]
}


interface TenorGifResult {
  id: string
  title?: string
  content_description?: string
  url?: string
  media_formats: {
    gif?: { url: string; dims?: [number, number] }
    mp4?: { url: string }
    tinygif?: { url: string }
  }
  tags?: string[]
}

interface GiphyGifResult {
  id: string
  title?: string
  images: {
    original: { url: string; width: string; height: string }
    fixed_height_small: { url: string }
  }
  tags?: string[]
}

export class GifService {
  private static instance: GifService
  private cache = new Map<string, { data: GifResult[], timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  static getInstance(): GifService {
    if (!GifService.instance) {
      GifService.instance = new GifService()
    }
    return GifService.instance
  }

  private getCacheKey(query: string, provider: 'tenor' | 'giphy' = 'tenor'): string {
    return `${provider}:${query.toLowerCase()}`
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION
  }

  async searchGifs(query: string = 'trending', limit: number = 20): Promise<GifResult[]> {
    const cacheKey = this.getCacheKey(query)
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data
    }

    try {
      const results = await this.fetchFromTenor(query, limit)
      this.cache.set(cacheKey, { data: results, timestamp: Date.now() })
      return results
    } catch (error) {
      console.error('Error fetching GIFs:', error)
      // Return cached data if available, even if expired
      if (cached) {
        return cached.data
      }
      return []
    }
  }

  private async fetchFromTenor(query: string, limit: number): Promise<GifResult[]> {
    const endpoint = query === 'trending' ? 'featured' : 'search'
    const params: Record<string, string> = {
      limit: limit.toString(),
      media_filter: 'gif'
    }

    if (query !== 'trending') {
      params.q = query
    }

    const url = createApiUrl('tenor', endpoint, params)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Tenor API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.results.map((gif: TenorGifResult): GifResult => ({
      id: gif.id,
      title: gif.title || gif.content_description || 'GIF',
      url: (gif.media_formats.gif?.url || gif.media_formats.mp4?.url) || '',
      previewUrl: (gif.media_formats.tinygif?.url || gif.media_formats.gif?.url) || '',
      width: gif.media_formats.gif?.dims?.[0] || 200,
      height: gif.media_formats.gif?.dims?.[1] || 200,
      tags: gif.tags || []
    }))
  }

  // Alternative Giphy implementation
  private async fetchFromGiphy(query: string, limit: number): Promise<GifResult[]> {
    const endpoint = query === 'trending' ? 'gifs/trending' : 'gifs/search'
    const params: Record<string, string> = {
      limit: limit.toString(),
      rating: 'pg'
    }

    if (query !== 'trending') {
      params.q = query
    }

    const url = createApiUrl('giphy', endpoint, params)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Giphy API error: ${response.status}`)
    }

    const data = await response.json()

    return data.data.map((gif: GiphyGifResult): GifResult => ({
      id: gif.id,
      title: gif.title || 'GIF',
      url: gif.images.original.url,
      previewUrl: gif.images.fixed_height_small.url,
      width: parseInt(gif.images.original.width),
      height: parseInt(gif.images.original.height),
      tags: gif.tags || []
    }))
  }

  clearCache(): void {
    this.cache.clear()
  }
}
