import type { ChannelProfile, CreateChannelInput, UpdateChannelInput } from '#shared/channel'
import { databaseErrorCode } from '@server/database/errors'
import {
  findChannelByHandle,
  findChannelByOwnerId,
  insertChannel,
  updateChannel
} from '@server/repositories/channels'

function toPublicChannel(
  channel: Awaited<ReturnType<typeof findChannelByHandle>>
): ChannelProfile | null {
  if (!channel) return null

  return {
    id: channel.id,
    handle: channel.handle,
    displayName: channel.displayName,
    bio: channel.bio,
    avatarTheme: channel.avatarTheme,
    topics: channel.topics,
    avatarUrl: channel.avatarUrl,
    bannerUrl: channel.bannerUrl,
    createdAt: channel.createdAt.toISOString()
  }
}

export async function getPublicChannel(handle: string) {
  return toPublicChannel(await findChannelByHandle(handle))
}

export async function getOwnChannel(ownerId: string) {
  return toPublicChannel(await findChannelByOwnerId(ownerId))
}

export async function channelHandleIsAvailable(handle: string, ownerId?: string) {
  const existing = await findChannelByHandle(handle)
  return !existing || existing.ownerId === ownerId
}

export async function createChannelForUser(ownerId: string, input: CreateChannelInput) {
  if (await findChannelByOwnerId(ownerId)) {
    throw createError({ statusCode: 409, statusMessage: 'You already have a channel.' })
  }

  try {
    return toPublicChannel(await insertChannel(ownerId, input))!
  } catch (error) {
    if (databaseErrorCode(error) === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'That handle is already in use.' })
    }
    throw error
  }
}

export async function updateChannelForUser(ownerId: string, input: UpdateChannelInput) {
  try {
    const updated = await updateChannel(ownerId, input)
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'Channel not found' })
    return toPublicChannel(updated)!
  } catch (error) {
    if (databaseErrorCode(error) === '23505') {
      throw createError({ statusCode: 409, statusMessage: 'That handle is already in use.' })
    }
    throw error
  }
}
