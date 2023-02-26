import moment from 'moment';
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/appContext';
import Wrapper from './Job.styles';
import JobInfo from '../JobInfo/JobInfo';

const Job = ({
  _id,
  position,
  jobLocation,
  status,
  jobType,
  company,
  createdAt,
}) => {
  const { setEditJob, deleteJob } = useAppContext();

  let date = moment(createdAt);
  date = date.format('MMM Do, YYYY');

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{company.charAt(0)}</div>
        <div className='info'>
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className='actions'>
            <Link
              to='/add-job'
              onClick={() => setEditJob(_id)}
              className='btn edit-btn'
            >
              edit
            </Link>
            <button
              type='button'
              className='btn delete-btn'
              onClick={() => deleteJob(_id)}
            >
              delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
