import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/validateToken');
      if (!response.ok) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { loading };
};

export default useAuth;
