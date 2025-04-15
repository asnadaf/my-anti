import ProductDetails from "../../ProductDetails";
import Head from 'next/head';

export default function ProductDetailsPage() {
  return (
    <>
      <Head>
        <title>Product Details | SecureKeyMaster</title>
        <meta name="description" content="View detailed information about our antivirus licenses, including features, pricing, and specifications." />
      </Head>
      <ProductDetails />
    </>
  );
} 