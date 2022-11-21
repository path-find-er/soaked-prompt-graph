import { type NextPage } from 'next';
import Head from 'next/head';

import GraphEditor from '@/components/pageSections/GraphEditor';
import TryPrompts from '@/components/pageSections/TryPrompts';

import Layout from '../components/layout/Layout';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>prompt engine</title>
        <meta name='promp engine' content='Prompt Engine' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Layout>
        <GraphEditor />
        <TryPrompts className='h-[100vh]' />
      </Layout>
    </>
  );
};

export default Home;
