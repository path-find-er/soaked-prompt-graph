import { type NextPage } from 'next';
import Head from 'next/head';
import { Suspense } from 'react';

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
        <Suspense fallback={<div>Loading...</div>}>
          <GraphEditor />
          <TryPrompts className='' />
        </Suspense>
      </Layout>
    </>
  );
};

export default Home;

// SAP/ui5-webcomponents graphql example
// query {
//   repository(name: "SAP/ui5-webcomponents", owner: "")
//   {
//     issues(last: 100, states: OPEN) {
//       nodes {
//         title
//         url
// }
// }
// }
