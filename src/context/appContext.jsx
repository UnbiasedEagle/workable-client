import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  DELETE_JOB_ERROR,
  GET_CURRENT_USER_SUCCESS,
  GET_CURRENT_USER_BEGIN,
} from './actions';
import reducer from './reducer';

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  userLocation: '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
  userLoading: true,
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: 'https://odd-moth-tunic.cyclic.app/api/v1',
  });

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post(
        `https://odd-moth-tunic.cyclic.app/api/v1/auth/register`,
        currentUser
      );
      const { user, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const response = await axios.post(
        `https://odd-moth-tunic.cyclic.app/api/v1/auth/login`,
        currentUser
      );
      const { user, location } = response.data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      const { user, location } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };
  const logoutUser = async () => {
    await authFetch.get('/auth/logout');
    dispatch({ type: LOGOUT_USER });
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });

    try {
      const { position, company, jobLocation, jobType, status } = state;

      await authFetch.post('/jobs', {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({
        type: CREATE_JOB_SUCCESS,
      });

      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }

    clearAlert();
  };

  const getJobs = async () => {
    const { search, searchStatus, searchType, sort, page } = state;

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;

    if (search) {
      url = url + `&search=${search}`;
    }

    dispatch({ type: GET_JOBS_BEGIN });

    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }

    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({
      type: SET_EDIT_JOB,
      payload: { id },
    });
  };

  const editJob = async () => {
    dispatch({
      type: EDIT_JOB_BEGIN,
    });

    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });

      dispatch({
        type: EDIT_JOB_SUCCESS,
      });

      dispatch({
        type: CLEAR_VALUES,
      });
    } catch (error) {
      if (error.response.status === 401) {
        return;
      }
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }

    clearAlert();
  };

  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });

    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      if (error.response.data.status === 401) {
        return;
      }

      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }

    clearAlert();
  };

  const showStats = async () => {
    dispatch({
      type: SHOW_STATS_BEGIN,
    });

    try {
      const { data } = await authFetch('/jobs/stats');
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }

    clearAlert();
  };

  const clearFilters = () => {
    dispatch({
      type: CLEAR_FILTERS,
    });
  };

  const changePage = (page) => {
    dispatch({
      type: CHANGE_PAGE,
      payload: { page },
    });
  };

  const getCurrentUser = async () => {
    dispatch({
      type: GET_CURRENT_USER_BEGIN,
    });
    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      const { user, location } = data;
      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: {
          user,
          location,
        },
      });
    } catch (error) {
      if (error.response.status === 401) {
        return;
      }
      logoutUser();
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
        getCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppProvider, initialState, useAppContext };
