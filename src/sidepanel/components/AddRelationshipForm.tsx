export default function AddRelationshipForm() {
  return (
    <>
      <div className='text-xl'>Add Relationship</div>
      <label className='input input-sm input-bordered flex items-center gap-2'>
        <input type='text' className='grow' placeholder='Entity 1' />
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='h-4 w-4 opacity-70'
        >
          <path
            fillRule='evenodd'
            d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
            clipRule='evenodd'
          />
        </svg>
      </label>

      <label className='input input-sm input-bordered flex items-center gap-2'>
        <input type='text' className='grow' placeholder='Entity 2' />
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 16 16'
          fill='currentColor'
          className='h-4 w-4 opacity-70'
        >
          <path
            fillRule='evenodd'
            d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
            clipRule='evenodd'
          />
        </svg>
      </label>

      <details className='dropdown'>
        <summary className='btn btn-sm m-1'>Relationship type</summary>
        <ul className='menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 text-sm shadow'>
          <li>
            <a>Position</a>
          </li>
          <li>
            <a>Membership</a>
          </li>
        </ul>
      </details>
    </>
  );
}
