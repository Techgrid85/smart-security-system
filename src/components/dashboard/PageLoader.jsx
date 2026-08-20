function PageLoader({ message = "Loading..." }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-none border-4 border-[#9b7740] border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-[#32143b]/55">{message}</p>
      </div>
    </div>
  );
}

export default PageLoader;
