import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        },
      },
    },
  });

  return NextResponse.json(listingAndReservation);
}

/*
TODO ACID TRANSACTION

import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  // Start a new transaction
  const transaction = await prisma.startTransaction();

  try {
    // Update the listing to add the new reservation
    await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        reservations: {
          create: {
            userId: currentUser.id,
            startDate,
            endDate,
            totalPrice,
          },
        },
      },
    });

    // Commit the transaction
    await transaction.commitTransaction();
  } catch (error) {
    // Roll back the transaction if any errors occur
    await transaction.rollbackTransaction();

    // Throw the error to the caller
    throw error;
  }

  // Get the listing and reservation
  const listingAndReservation = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  return NextResponse.json(listingAndReservation);
}

*/
/*
  
  // Start a new transaction
const transaction = await prisma.startTransaction();

// Check the availability of the room
const room = await prisma.room.findUnique({
  where: {
    id: roomId,
  },
});

// If the room is not available, roll back the transaction
if (!room.available) {
  await transaction.rollbackTransaction();
  throw new Error('Room is not available');
}

// Reserve the room for the user
await prisma.room.update({
  where: {
    id: roomId,
  },
  data: {
    bookedBy: userId,
  },
});

// Commit the transaction
await transaction.commitTransaction();

// The room has now been booked for the user

  */
