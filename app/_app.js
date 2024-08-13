// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';  // Adjust path if necessary

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && router.pathname !== '/') {
        router.push('/'); // Redirect to landing page if not authenticated and trying to access other pages
      }
    });
    return () => unsubscribe();
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
