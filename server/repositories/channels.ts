import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import type { CreateChannelInput, UpdateChannelInput } from '#shared/channel'
import { channel } from '@server/database/schema'
import { db } from '@server/utils/db'

export function findChannelByOwnerId(ownerId: string) {
  return db.query.channel.findFirst({ where: eq(channel.ownerId, ownerId) })
}

export function findChannelByHandle(handle: string) {
  return db.query.channel.findFirst({ where: eq(channel.handle, handle) })
}

export async function insertChannel(ownerId: string, input: CreateChannelInput) {
  const [created] = await db
    .insert(channel)
    .values({
      id: randomUUID(),
      ownerId,
      ...input
    })
    .returning()

  return created!
}

export async function updateChannel(ownerId: string, input: UpdateChannelInput) {
  const [updated] = await db
    .update(channel)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(channel.ownerId, ownerId))
    .returning()

  return updated
}
