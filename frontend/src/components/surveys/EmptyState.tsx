interface EmptyStateProps {
  searchTerm: string;
  onCreateClick: () => void;
  onClearSearch: () => void;
}

const EmptyState = ({ searchTerm, onCreateClick, onClearSearch }: EmptyStateProps) => {
  if (searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No surveys found</h3>
        <p className="text-gray-600 mb-6">No surveys match your search criteria</p>
        <button
          onClick={onClearSearch}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Clear Search
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">No surveys yet</h3>
      <p className="text-gray-600 mb-6">Get started by creating your first survey</p>
      <button
        onClick={onCreateClick}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        + Create Your First Survey
      </button>
    </div>
  );
};

export default EmptyState;
