import AboutPage from "../AboutPage";
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function About() {
  const router = useRouter();

  // Handle any potential errors
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>About Us | SecureKeyMaster</title>
        <meta name="description" content="Learn about SecureKeyMaster. We're dedicated to providing authentic antivirus license keys at the best prices with exceptional customer service." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://securekeymaster.com/about" />
      </Head>
      <AboutPage />
    </>
  );
} 