import { useState, useEffect } from 'react';
import { getHabits, addHabit } from '../db/indexedDB/habitStore';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    getHabits().then(setHabits);
  }, []);

  const createHabit = async (habit) => {
    await addHabit(habit);
    getHabits().then(setHabits);
  };

  return { habits, createHabit };
};