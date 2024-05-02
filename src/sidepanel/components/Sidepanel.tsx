import { useState, useEffect } from 'preact/hooks';
import { getToken, openLoginTab } from '@src/api';
import { TokenContext } from '@src/util';
import TokenLoadingIndicator from './TokenLoadingIndicator';
import AddRelationshipForm from './AddRelationshipForm';

export default function Sidepanel() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function startup() {
    setIsLoading(true);
    const token = await getToken();
    setToken(token);
    if (!token) openLoginTab();
    setIsLoading(false);
  }

  useEffect(() => {
    startup();
  }, []);

  if (isLoading) return <TokenLoadingIndicator />;

  return (
    <div className='w-full'>
      {token && (
        <TokenContext.Provider value={token}>
          <AddRelationshipForm />
        </TokenContext.Provider>
      )}
      {!token && (
        <div className='p-1 text-lg'>
          Login to LittleSis then{' '}
          <button className='btn btn-outline btn-sm' onClick={startup}>
            reload
          </button>
        </div>
      )}
    </div>
  );
}
