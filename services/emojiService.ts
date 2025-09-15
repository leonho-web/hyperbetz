// Emoji Service - Handles emoji data from multiple sources
import { createApiUrl } from './api-config'

export interface EmojiResult {
  character: string
  name: string
  slug: string
  group: string
  subGroup: string
  codePoint: string
}

export interface EmojiCategory {
  name: string
  group: string
  icon: string
  emojis: EmojiResult[]
}

interface normalizedEmoji {
  character: string
  unicodeName?: string
  name?: string
  slug: string
  group?: string
  subGroup?: string
  codePoint: string
}

export class EmojiService {
  private static instance: EmojiService
  private cache = new Map<string, { data: EmojiResult[], timestamp: number }>()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes (emojis don't change often)

  static getInstance(): EmojiService {
    if (!EmojiService.instance) {
      EmojiService.instance = new EmojiService()
    }
    return EmojiService.instance
  }

  private getCacheKey(query: string, group?: string): string {
    return group ? `${group}:${query}` : query
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION
  }

  async getAllEmojis(): Promise<EmojiCategory[]> {
    const cacheKey = 'all-emojis'
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached.timestamp)) {
      return this.groupEmojis(cached.data)
    }

    try {
      const url = createApiUrl('emoji', 'emojis', {})
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Emoji API error: ${response.status}`)
      }

      const data = await response.json()
      const emojis = this.normalizeEmojiData(data)
      
      this.cache.set(cacheKey, { data: emojis, timestamp: Date.now() })
      return this.groupEmojis(emojis)
    } catch (error) {
      console.error('Error fetching emojis:', error)
      return this.getFallbackEmojis()
    }
  }

  async searchEmojis(query: string): Promise<EmojiResult[]> {
    const cacheKey = `search:${query.toLowerCase()}`
    const cached = this.cache.get(cacheKey)

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data
    }

    try {
      const url = createApiUrl('emoji', 'emojis', { search: query })
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Emoji API error: ${response.status}`)
      }

      const data = await response.json()
      const emojis = this.normalizeEmojiData(data).slice(0, 50) // Limit search results
      
      this.cache.set(cacheKey, { data: emojis, timestamp: Date.now() })
      return emojis
    } catch (error) {
      console.error('Error searching emojis:', error)
      return []
    }
  }

  private normalizeEmojiData(data: normalizedEmoji[]): EmojiResult[] {
    return data.map(emoji => ({
      character: emoji.character,
      name: emoji.unicodeName || emoji.name || 'Unknown',
      slug: emoji.slug,
      group: emoji.group || 'Other',
      subGroup: emoji.subGroup || 'other',
      codePoint: emoji.codePoint
    }))
  }

  private groupEmojis(emojis: EmojiResult[]): EmojiCategory[] {
    const groups = emojis.reduce((acc, emoji) => {
      const group = emoji.group
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(emoji)
      return acc
    }, {} as Record<string, EmojiResult[]>)

    const categoryMap: Record<string, string> = {
      'Smileys & Emotion': '😀',
      'People & Body': '👋',
      'Animals & Nature': '🐶',
      'Food & Drink': '🍕',
      'Activities': '⚽',
      'Travel & Places': '🚗',
      'Objects': '💎',
      'Symbols': '❤️',
      'Flags': '🏁'
    }

    return Object.entries(groups).map(([group, emojis]) => ({
      name: group,
      group,
      icon: categoryMap[group] || '📁',
      emojis: emojis.slice(0, 100) // Limit per category
    }))
  }

  private getFallbackEmojis(): EmojiCategory[] {
    return [
      {
        name: 'Smileys & Emotion',
        group: 'Smileys & Emotion',
        icon: '😀',
        emojis: [
          { character: '😀', name: 'grinning face', slug: 'grinning-face', group: 'Smileys & Emotion', subGroup: 'face-smiling', codePoint: '1F600' },
          { character: '😃', name: 'grinning face with big eyes', slug: 'grinning-face-with-big-eyes', group: 'Smileys & Emotion', subGroup: 'face-smiling', codePoint: '1F603' },
          { character: '😂', name: 'face with tears of joy', slug: 'face-with-tears-of-joy', group: 'Smileys & Emotion', subGroup: 'face-smiling', codePoint: '1F602' },
          { character: '❤️', name: 'red heart', slug: 'red-heart', group: 'Smileys & Emotion', subGroup: 'heart', codePoint: '2764' },
          { character: '👍', name: 'thumbs up', slug: 'thumbs-up', group: 'People & Body', subGroup: 'hand-fingers-closed', codePoint: '1F44D' },
          { character: '🔥', name: 'fire', slug: 'fire', group: 'Travel & Places', subGroup: 'sky-weather', codePoint: '1F525' },
          { character: '💯', name: 'hundred points', slug: 'hundred-points', group: 'Symbols', subGroup: 'other-symbol', codePoint: '1F4AF' },
          { character: '🎉', name: 'party popper', slug: 'party-popper', group: 'Activities', subGroup: 'event', codePoint: '1F389' }
        ]
      }
    ]
  }

  clearCache(): void {
    this.cache.clear()
  }
}
