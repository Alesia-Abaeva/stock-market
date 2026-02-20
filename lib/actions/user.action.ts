'use server'

import { connectToDataBase } from '@/database/mongoose'

export const getAllUserForNewsEmailAction = async () => {
  try {
    const mongoose = await connectToDataBase()
    const db = mongoose?.connection.db

    if (!db) {
      throw new Error('Database connection is not established')
    }

    const usersCollection = db.collection('user')
    const users = await usersCollection
      .find(
        { email: { $exists: true, $ne: null } },
        { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1 } }
      )
      .toArray()

    return {
      data: users
        .filter((user) => user.email && user.name)
        .map((user) => ({
          id: user.id || user._id.toString() || '',
          email: user.email,
          name: user.name,
        })),
    }
  } catch (error) {
    console.error('Error fetching users for news email:', error)
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : 'An error occurred while fetching users for news email. Please try again later.',
    }
  }
}
