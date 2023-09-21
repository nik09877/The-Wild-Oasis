import getCurrentUser from '@/app/actions/getCurrentUser';
import ClientOnly from './components/ClientOnly';
import HomePageClient from './HomePageClient';

//SERVER COMPONENT
const Home = async () => {
  const currentUser = await getCurrentUser();

  return (
    <ClientOnly>
      <HomePageClient currentUser={currentUser} />
    </ClientOnly>
  );
};

export default Home;
