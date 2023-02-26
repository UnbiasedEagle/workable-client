import Wrapper from './JobInfo.styles';

const JobInfo = ({ text, icon }) => {
  return (
    <Wrapper>
      <span className='icon'>{icon}</span>
      <span className='text'>{text}</span>
    </Wrapper>
  );
};

export default JobInfo;
