import { useMemo } from 'react';
import { useState } from 'react';
import { useAppContext } from '../../context/appContext';
import FormRow from '../FormRow/FormRow';
import FormRowSelect from '../FormRowSelect/FormRowSelect';
import Wrapper from './SearchContainer.styles';

const SearchContainer = () => {
  const [localSearch, setLocalSearch] = useState('');

  const {
    isLoading,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext();

  const handleSearch = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalSearch('');
    clearFilters();
  };

  const debounce = () => {
    let timerId;
    return (e) => {
      setLocalSearch(e.target.value);
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        handleChange({ name: e.target.name, value: e.target.value });
      }, 1000);
    };
  };

  const optimizedDebounce = useMemo(() => debounce(), []);

  return (
    <Wrapper>
      <form className='form'>
        <h4>search form</h4>
        <div className='form-center'>
          <FormRow
            type='text'
            name='search'
            value={localSearch}
            handleChange={optimizedDebounce}
          />
          <FormRowSelect
            labelText='status'
            name='searchStatus'
            value={searchStatus}
            handleChange={handleSearch}
            list={['all', ...statusOptions]}
          />
          <FormRowSelect
            labelText='type'
            name='searchType'
            value={searchType}
            handleChange={handleSearch}
            list={['all', ...jobTypeOptions]}
          />
          <FormRowSelect
            name='sort'
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className='btn btn-block btn-danger'
          >
            clear filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
