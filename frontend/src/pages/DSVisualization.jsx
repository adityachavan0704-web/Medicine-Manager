import { useState, useEffect } from 'react';
import { Network, Database, List, GitBranch } from 'lucide-react';
import { dsAPI } from '../services/api';

const DSVisualization = () => {
  const [activeDS, setActiveDS] = useState('minheap');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisualization();
  }, [activeDS]);

  const loadVisualization = async () => {
    setLoading(true);
    try {
      let response;
      switch (activeDS) {
        case 'minheap':
          response = await dsAPI.getMinHeap();
          break;
        case 'hashmap':
          response = await dsAPI.getHashMap();
          break;
        case 'queue':
          response = await dsAPI.getQueue();
          break;
        case 'linkedlist':
          response = await dsAPI.getLinkedList();
          break;
      }
      setData(response.data);
    } catch (error) {
      console.error('Failed to load visualization:', error);
    } finally {
      setLoading(false);
    }
  };

  const dataStructures = [
    { id: 'minheap', name: 'MinHeap', icon: GitBranch, description: 'Expiry Priority Queue' },
    { id: 'hashmap', name: 'HashMap', icon: Database, description: 'Fast O(1) Lookups' },
    { id: 'queue', name: 'Alert Queue', icon: List, description: 'FIFO Alert Management' },
    { id: 'linkedlist', name: 'LinkedList', icon: Network, description: 'History Tracking' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Structure Visualization</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Interactive visualization of custom data structure implementations
        </p>
      </div>

      {/* DS Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dataStructures.map((ds) => {
          const Icon = ds.icon;
          return (
            <button
              key={ds.id}
              onClick={() => setActiveDS(ds.id)}
              className={`card text-left transition-all ${
                activeDS === ds.id
                  ? 'ring-2 ring-medical-600 border-medical-600'
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-3 rounded-lg ${
                  activeDS === ds.id
                    ? 'bg-medical-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{ds.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ds.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Visualization Area */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-600"></div>
          </div>
        ) : data ? (
          <>
            {activeDS === 'minheap' && <MinHeapVisualization data={data} />}
            {activeDS === 'hashmap' && <HashMapVisualization data={data} />}
            {activeDS === 'queue' && <QueueVisualization data={data} />}
            {activeDS === 'linkedlist' && <LinkedListVisualization data={data} />}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// MinHeap Visualization
const MinHeapVisualization = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">MinHeap - Expiry Priority Queue</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Binary min-heap maintaining medicines sorted by expiry date
        </p>
      </div>

      {/* Complexity Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(data.complexity || {}).map(([operation, complexity]) => (
          <div key={operation} className="bg-medical-50 dark:bg-medical-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{operation}</p>
            <p className="text-lg font-semibold text-medical-700 dark:text-medical-400">{complexity}</p>
          </div>
        ))}
      </div>

      {/* Heap Tree */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Heap Structure</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 overflow-x-auto">
          {data.nodes && data.nodes.length > 0 ? (
            <div className="space-y-8">
              {Array.from(new Set(data.nodes.map(n => n.level))).map((level) => {
                const levelNodes = data.nodes.filter(n => n.level === level);
                return (
                  <div key={level} className="flex justify-center items-center space-x-4">
                    {levelNodes.map((node) => (
                      <div
                        key={node.medicine.id}
                        className="bg-white dark:bg-gray-800 border-2 border-medical-600 rounded-lg p-3 min-w-[200px] shadow-md"
                      >
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {node.medicine.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Expires: {new Date(node.medicine.expiryDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Level: {level}, Position: {node.position}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Heap is empty</p>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p><strong>Algorithm:</strong> Complete binary tree where each parent node has an expiry date earlier than or equal to its children. Root always contains the medicine expiring soonest (FEFO - First Expire First Out).</p>
      </div>
    </div>
  );
};

// HashMap Visualization
const HashMapVisualization = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">HashMap - Fast Medicine Lookup</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Hash table with chaining for O(1) average-case lookups
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-medical-50 dark:bg-medical-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Load Factor</p>
          <p className="text-2xl font-semibold text-medical-700 dark:text-medical-400">
            {(data.loadFactor || 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-medical-50 dark:bg-medical-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Collisions</p>
          <p className="text-2xl font-semibold text-medical-700 dark:text-medical-400">
            {data.collisions || 0}
          </p>
        </div>
        <div className="bg-medical-50 dark:bg-medical-900/20 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Buckets</p>
          <p className="text-2xl font-semibold text-medical-700 dark:text-medical-400">
            {data.buckets?.length || 0}
          </p>
        </div>
      </div>

      {/* Complexity Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(data.complexity || {}).map(([operation, complexity]) => (
          <div key={operation} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{operation}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">{complexity}</p>
          </div>
        ))}
      </div>

      {/* Bucket Visualization */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bucket Structure (First 10)</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {data.buckets?.slice(0, 10).map((bucket) => (
            <div key={bucket.index} className="flex items-start space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex-shrink-0 w-20 text-center">
                <span className="inline-block bg-medical-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  #{bucket.index}
                </span>
              </div>
              <div className="flex-1">
                {bucket.entries && bucket.entries.length > 0 ? (
                  <div className="space-y-2">
                    {bucket.entries.map((entry, idx) => (
                      <div key={idx} className="bg-white dark:bg-gray-800 rounded p-2 border border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.medicine.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {entry.key}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">Empty</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <p><strong>Algorithm:</strong> Hash function maps medicine IDs to bucket indices. Collisions handled via chaining (linked lists). Automatic resizing when load factor exceeds 0.75.</p>
      </div>
    </div>
  );
};

// Queue Visualization
const QueueVisualization = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Alert Queue - FIFO Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          First-In-First-Out queue for alert processing
        </p>
      </div>

      {/* Complexity Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data.complexity || {}).map(([operation, complexity]) => (
          <div key={operation} className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{operation}</p>
            <p className="text-lg font-semibold text-amber-700 dark:text-amber-400">{complexity}</p>
          </div>
        ))}
      </div>

      {/* Queue State */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Queue State</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Front: <span className="font-semibold">{data.front}</span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Rear: <span className="font-semibold">{data.rear}</span>
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 overflow-x-auto">
          {data.items && data.items.length > 0 ? (
            <div className="flex space-x-4">
              {data.items.slice(0, 10).map((alert, idx) => (
                <div
                  key={alert.id}
                  className={`flex-shrink-0 w-64 rounded-lg p-4 border-2 ${
                    idx === 0
                      ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  {idx === 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-2">FRONT</p>
                  )}
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {alert.medicineName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Type: {alert.type}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                    alert.severity === 'critical'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : alert.severity === 'warning'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Queue is empty</p>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
        <p><strong>Algorithm:</strong> Circular array implementation. Alerts enqueued at rear and dequeued from front. Maintains FIFO order for fair alert processing.</p>
      </div>
    </div>
  );
};

// LinkedList Visualization
const LinkedListVisualization = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">History LinkedList - Activity Tracking</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Doubly linked list for chronological history
        </p>
      </div>

      {/* Complexity Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(data.complexity || {}).map(([operation, complexity]) => (
          <div key={operation} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{operation}</p>
            <p className="text-lg font-semibold text-purple-700 dark:text-purple-400">{complexity}</p>
          </div>
        ))}
      </div>

      {/* LinkedList Visualization */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">List Structure (Recent 10)</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 overflow-x-auto">
          {data.nodes && data.nodes.length > 0 ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-medical-600 dark:text-medical-400">HEAD</span>
              {data.nodes.slice(0, 10).map((node, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="bg-white dark:bg-gray-800 border-2 border-medical-600 rounded-lg p-3 min-w-[200px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{node.data.action}</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {node.data.medicineName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {new Date(node.data.timestamp).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{node.hasPrev ? '← Prev' : 'null'}</span>
                      <span>{node.hasNext ? 'Next →' : 'null'}</span>
                    </div>
                  </div>
                  {idx < Math.min(data.nodes.length - 1, 9) && (
                    <div className="flex flex-col items-center mx-2">
                      <div className="w-8 h-0.5 bg-medical-600"></div>
                      <div className="text-xs text-gray-500">↔</div>
                      <div className="w-8 h-0.5 bg-medical-600"></div>
                    </div>
                  )}
                </div>
              ))}
              <span className="text-sm font-semibold text-medical-600 dark:text-medical-400">TAIL</span>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">List is empty</p>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
        <p><strong>Algorithm:</strong> Doubly linked list with head and tail pointers. Each node has references to previous and next nodes, enabling bidirectional traversal and O(1) insertion at both ends.</p>
      </div>
    </div>
  );
};

export default DSVisualization;
