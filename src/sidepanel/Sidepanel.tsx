import { useState, useEffect } from 'preact/hooks';
import { getToken, openLoginTab } from '@src/api';
import AddRelationshipForm from './components/AddRelationshipForm';

export default function Sidepanel() {
  const [token, setToken] = useState<string | null>(null);

  async function startup() {
    const token = await getToken();
    setToken(token);
    if (!token) openLoginTab();
  }

  useEffect(() => {
    startup();
  }, []);

  return (
    <div className='p-1 text-lg'>
      {token && <AddRelationshipForm />}
      {!token && (
        <>
          Login to LittleSis then <button onClick={startup}>reload</button>
        </>
      )}
    </div>
  );
}
