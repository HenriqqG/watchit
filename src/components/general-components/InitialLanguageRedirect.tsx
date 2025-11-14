import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Loading from "./Loading";
import { getInitialLanguage } from '../../util/function_utils';

export default function InitialLanguageRedirect() {
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const initialLang = getInitialLanguage();

    const cleanPath = location.pathname.replace(/^\/+/, "");
    const redirectTo = cleanPath
      ? `/${initialLang.id}/${cleanPath}`
      : `/${initialLang.id}/`;
      console.log(redirectTo);
    navigate(redirectTo, { replace: true });
  }, [navigate, location]);

  return <Loading />; 
}