// import { NextResponse } from 'next/server';

// import prisma from '@/app/libs/prismadb';
// import getCurrentUser from '@/app/actions/getCurrentUser';

// export async function POST(request: Request) {
//   const currentUser = await getCurrentUser();

//   if (!currentUser) {
//     return NextResponse.error();
//   }

//   const body = await request.json();
//   const { listingId, startDate, endDate, totalPrice } = body;

//   if (!listingId || !startDate || !endDate || !totalPrice) {
//     return NextResponse.error();
//   }

//   const listingAndReservation = await prisma.listing.update({
//     where: {
//       id: listingId,
//     },
//     data: {
//       reservations: {
//         create: {
//           userId: currentUser.id,
//           startDate,
//           endDate,
//           totalPrice,
//         },
//       },
//     },
//   });

//   return NextResponse.json(listingAndReservation);
// }

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

  try {
    const listingAndReservation = await prisma.$transaction(async (tx) => {
      //1. find suitable listing
      let query: any = {};
      query.id = listingId;
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
      const listings = await tx.listing.findMany({
        where: query,
        orderBy: {
          createdAt: 'desc',
        },
      });

      // 2. Verify availability
      const isListingAvailable = listings.some(
        (listing) => listing.id === listingId
      );
      if (!isListingAvailable) {
        throw new Error('Listing Not available');
      }

      // 3. Return reservation
      const listingAndReservation = await tx.listing.update({
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

      return listingAndReservation;
    });
    return NextResponse.json(listingAndReservation);
  } catch (error) {
    return NextResponse.error();
  }
}
