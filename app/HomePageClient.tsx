'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Container from './components/Container';
import EmptyState from './components/EmptyState';
import Loader from './components/Loader';
import ListingCard from './components/listings/ListingCard';
import { SafeListing, SafeUser } from './types';
import { useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { toast } from 'react-hot-toast';

interface HomeProps {
  currentUser: SafeUser | null;
}

const HomePageClient: React.FC<HomeProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<SafeListing[] | []>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    //CREATE QUERY OBJECT
    let query: any = {};

    if (searchParams) {
      query = qs.parse(searchParams.toString());
    }

    const url = qs.stringifyUrl(
      {
        url: '/api/listings',
        query: query,
      },
      { skipNull: true }
    );

    setLoading(true);
    axios
      .get(url)
      .then((res) => res.data)
      .then((listings: any) => {
        setListings(listings);
        setLoading(false);
      })
      .catch((error) => toast.error(error));
  }, [searchParams]);

  if (loading) {
    return <Loader />;
  }
  if (listings.length === 0) {
    return <EmptyState showReset />;
  }
  return (
    <Container>
      <div
        className='
            pt-24
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8
          '
      >
        {listings.map((listing: any) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </Container>
  );
};

export default HomePageClient;
