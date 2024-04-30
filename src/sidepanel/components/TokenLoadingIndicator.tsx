export default function TokenLoadingIndicator() {
  return (
    <div className='rounded-m base-content bg-neutral flex h-screen text-xl'>
      <div className='m-auto'>
        <span className='loading loading-spinner loading-lg'></span>
      </div>
    </div>
  );
}
