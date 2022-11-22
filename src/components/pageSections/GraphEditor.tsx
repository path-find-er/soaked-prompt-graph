import { AiFillSave } from 'react-icons/ai';
import { GiTransform } from 'react-icons/gi';
import ReactFlow, { Background, Controls } from 'reactflow';

import ButtonCustom from '@/components/buttons/ButtonCustom';
import { edgeTypes } from '@/components/reactflow/Edges';
import { nodeTypes } from '@/components/reactflow/Nodes';

import clsxm from '@/utils/clsxm';
import { useGraphStore } from '@/utils/graph/store';
import { checkForGraph, loadGraph, saveGraph } from '@/utils/helpers';

type GraphEditorProps = {
  className?: string;
} & React.ComponentPropsWithoutRef<'section'>;

const GraphEditor: React.FC<GraphEditorProps> = ({ className }) => {
  const { reactFlow } = useGraphStore();

  return (
    <section
      className={clsxm('rounded-x relative h-full w-full p-5', className)}
    >
      <>
        <h2 className='m-auto py-3 '>Design template:</h2>

        <div className='flex-1'>
          <ReactFlow
            className=' h-full min-h-[80vh] w-full rounded-xl bg-white'
            nodes={reactFlow.nodes()}
            edges={reactFlow.edges()}
            // onNodesChange={(nodeChanges) => {
            //   reactFlow.onNodeChanges(nodeChanges);
            // }}
            // onEdgesChange={(edgeChanges) => {
            //   reactFlow.onEdgeChanges(edgeChanges);
            // }}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={{ hideAttribution: true }}
            fitView
            draggable={false}
            // on touch devices panning is handles by touch-action: pan-x pan-y
            minZoom={0.1}
            maxZoom={10}
            zoomOnPinch={true}
          >
            <Controls />
            <Background gap={20} />
          </ReactFlow>
        </div>
        <GraphSaveBar />

        <hr className='border-white' />
      </>
    </section>
  );
};

export default GraphEditor;

import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { HiCheckCircle, HiChevronDown } from 'react-icons/hi';

type GraphSaveBarProps = {
  className?: string;
} & React.ComponentPropsWithoutRef<'div'>;

const options = ['Graph 1', 'Graph 2', 'Graph 3', 'Graph 4', 'Graph 5'];

const GraphSaveBar: React.FC<GraphSaveBarProps> = ({ className }) => {
  const { graph, update } = useGraphStore();
  const [selected, setSelected] = useState(options[0]);
  const [query, setQuery] = useState('');

  const handleGraphSave = () => {
    selected
      ? saveGraph(graph, selected)
      : alert('Please select a graph option');
  };

  const handleGraphLoad = () => {
    selected && checkForGraph(selected)
      ? update.graph.set(loadGraph(selected))
      : alert('Please select a graph option');
  };

  const handleGraphReset = () => {
    update.graph.reset();
  };

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div
      className={clsxm(
        'mb-5 mt-3 flex flex-col-reverse items-center justify-start space-x-2 space-y-2 sm:flex-row sm:items-start sm:space-y-0',
        className
      )}
    >
      <Combobox value={selected} onChange={setSelected}>
        <div className='relative mt-3 h-full sm:mt-0'>
          <div className='relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
            <Combobox.Input
              className='w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0'
              displayValue={(option: string) => option}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
              <HiChevronDown
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className='absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {filteredOptions.length === 0 && query !== '' ? (
                <div className='relative cursor-default select-none py-2 px-4 text-gray-700'>
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <Combobox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <HiCheckCircle
                              className='h-5 w-5'
                              aria-hidden='true'
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      <div id='graph-buttons' className='flex flex-row items-center'>
        <ButtonCustom
          variant='outline'
          className=' group  rounded-r-none'
          onClick={handleGraphSave}
          // ad a toothip explaining what this button does
          title='Save the graph to local storage'
        >
          Save
          <AiFillSave className=' fill-slate-700 group-hover:fill-white' />
        </ButtonCustom>
        <ButtonCustom
          onClick={handleGraphLoad}
          className='group rounded-l-none border-l-0'
          variant='outline'
          title='Load a graph saved in local storage'
        >
          Load
          <GiTransform className=' fill-slate-700 group-hover:fill-white' />
        </ButtonCustom>
      </div>
      <ButtonCustom
        onClick={handleGraphReset}
        className='bg-danger-500 hover:bg-danger-600'
        variant='light'
      >
        Reset
      </ButtonCustom>
    </div>
  );
};
