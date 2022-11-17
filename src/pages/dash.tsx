import { useNodeStore } from '@/utils/flow/nodeGraph';
export default function DashPage() {
  const { graph } = useNodeStore();

  return (
    <>
      <main className='container'>
        <div className='mx-auto h-full w-full overflow-auto rounded-xl bg-white p-4 text-xs'>
          <h1>graph:</h1>
          <pre>{JSON.stringify(graph, null, 2)}</pre>
          {/* button to save graph */}
        </div>
      </main>
    </>
  );
}
