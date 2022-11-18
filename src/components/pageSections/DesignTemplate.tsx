import ReactFlow, { Background, Controls } from 'reactflow';

import ButtonCustom from '@/components/buttons/ButtonCustom';
import { edgeTypes } from '@/components/reactflow/Edges';
import { nodeTypes } from '@/components/reactflow/Nodes';

import clsxm from '@/utils/clsxm';
import { useNodeStore } from '@/utils/flow/nodeGraph';
import { loadGraph, saveGraph } from '@/utils/helpers';

type DesignTemplateProps = {
  className?: string;
} & React.ComponentPropsWithoutRef<'section'>;

const DesignTemplate: React.FC<DesignTemplateProps> = ({ className }) => {
  const { reactFlowNodes, reactFlowEdges, graph, setGraph } = useNodeStore();

  const handleGraphSave = () => {
    saveGraph(graph);
  };

  const handleGraphLoad = () => {
    const loadedGraph = loadGraph();
    setGraph(loadedGraph);
  };

  return (
    <section
      className={clsxm('rounded-x relative h-full w-full p-5', className)}
    >
      <h2 className='m-auto py-3 '>Design template: </h2>
      <div className='flex '>
        <ReactFlow
          className=' h-full min-h-[80vh] w-full rounded-xl bg-white'
          nodes={reactFlowNodes()}
          edges={reactFlowEdges()}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <div className='mb-5 mt-3 flex flex-row items-center justify-center'>
        <ButtonCustom
          variant='outline'
          className=' rounded-r-none '
          onClick={handleGraphSave}
        >
          Save Graph
        </ButtonCustom>
        <ButtonCustom
          onClick={handleGraphLoad}
          className='rounded-l-none border-l-0'
          variant='outline'
        >
          Load Graph
        </ButtonCustom>
      </div>
      <hr className='border-white' />
    </section>
  );
};

export default DesignTemplate;
