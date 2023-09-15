'use client';

// import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Logo = () => {
  const router = useRouter();

  return (
    <span
      className='hidden md:block cursor-pointer text-rose-500 font-bold text-2xl'
      onClick={() => router.push('/')}
    >
      🏨 Wild Oasis
    </span>
    // <Image
    //   alt='logo'
    //   className='hidden md:block cursor-pointer'
    //   width='100'
    //   height='100'
    //   src='/images/the-wild-oasis-logo.png'
    // />
  );
};

export default Logo;
