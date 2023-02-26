import { useRef } from 'react';
import { useEffect } from 'react';
import { ChartsContainer, StatsContainer } from '../../components';
import Loading from '../../components/Loading';
import { useAppContext } from '../../context/appContext';

const Stats = () => {
  const { showStats, isLoading, monthlyApplications } = useAppContext();

  const showChartsRef = useRef(showStats);

  useEffect(() => {
    showChartsRef.current();
  }, []);

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
};

export default Stats;
