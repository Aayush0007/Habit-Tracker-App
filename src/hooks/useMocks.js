import { useState, useEffect } from 'react';
import { addMock, getMocks } from '../db/indexedDB/mockStore'; // Implement getMocks similarly

export const useMocks = () => {
  const [mocks, setMocks] = useState([]);

  useEffect(() => {
    getMocks().then(setMocks);
  }, []);

  const createMock = async (mock) => {
    await addMock(mock);
    getMocks().then(setMocks);
  };

  return { mocks, createMock };
};