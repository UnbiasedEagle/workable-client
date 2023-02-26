import { FaBug, FaCalendarCheck, FaSuitcaseRolling } from 'react-icons/fa';
import { useAppContext } from '../../context/appContext';
import StatItem from '../StatItem/StatItem';
import Wrapper from './StatsContainer.styles';

const StatsContainer = () => {
  const { stats } = useAppContext();
  const defaultStats = [
    {
      title: 'pending applications',
      count: stats.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: '#e9b949',
      bcg: '#fcefc7',
    },
    {
      title: 'interview scheduled',
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#e0e8f9',
    },
    {
      title: 'jobs declined',
      count: stats.declined || 0,
      icon: <FaBug />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
  ];
  return (
    <Wrapper>
      {defaultStats.map((stat, index) => {
        return <StatItem key={index} {...stat} />;
      })}
    </Wrapper>
  );
};

export default StatsContainer;
