import { useAppContext } from '../context/appContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useAppContext();

  if (userLoading) {
    return (
      <div className='loader-container'>
        <div className='spinner'></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/landing' />;
  }

  return children;
};

export default ProtectedRoute;
