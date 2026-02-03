export const Loading = () => {
  return (
    <div className="text-center py-8">
      <div className="inline-block">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  );
};
