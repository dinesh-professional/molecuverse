import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MolecuVerse | Interactive 3D Molecular Platform',
  description: 'Explore the molecular universe with cinematic 3D rendering and gesture controls.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="hologram-noise antialiased">
        {children}
      </body>
    </html>
  );
}
