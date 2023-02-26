import { useState } from 'react';
import { useAppContext } from '../../context/appContext';
import AreaChart from '../Charts/AreaChart';
import BarChart from '../Charts/BarChart';
import Wrapper from './ChartsContainer.styles';

const ChartsContainer = () => {
  const [barChart, setBartChart] = useState(true);
  const { monthlyApplications: data } = useAppContext();
  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type='button' onClick={() => setBartChart(!barChart)}>
        {barChart ? 'Area Chart' : 'Bar Chart'}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  );
};

export default ChartsContainer;
