import TMAProvider from '../../components/TMAProvider';

export const metadata = {
  title: 'TITAN TMA',
  description: 'Premium Omnichannel Interface',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function TMALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TMAProvider>
      {children}
    </TMAProvider>
  );
}
