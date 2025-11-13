import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Loading from "../components/general-components/Loading";
import { getInitialLanguage } from '../util/function_utils';

export default function InitialLanguageRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const initialLang = getInitialLanguage(); 
    navigate(`/${initialLang.id}`, { replace: true });
    
  }, [navigate]);

  return <Loading />; 
}