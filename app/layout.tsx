import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import RegisterModal from './components/modals/RegisterModal';
import Navbar from './components/navbar/Navbar';
import './globals.css';
import ToasterProvider from './providers/ToasterProvider';
import ClientOnly from './components/ClientOnly';
import LoginModal from './components/modals/LoginModal';
import getCurrentUser from './actions/getCurrentUser';

export const metadata: Metadata = {
  title: 'The Wild Oasis',
  description: 'A Room Booking App',
};

const font = Nunito({
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang='en'>
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        {children}
      </body>
    </html>
  );
}
