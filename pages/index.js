import BuyAntivirus from './buyantivirus/index';

export default function Home() {
  return <BuyAntivirus />;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/buyantivirus',
      permanent: false,
    },
  };
}