'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHabitsThunk } from "../features/habit/habitSlice";
import { RootState, AppDispatch } from '../redux/store';
import Habits from '@/app/habits';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: RootState) => state.habits.habits);
  
  useEffect(() => {
    dispatch(fetchHabitsThunk());
  }, [dispatch]);
  if(!habits.length){
    return (
      <div className="pt-12 flex flex-col gap-4 items-center">
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
          <h1 className="text-2xl text-black font-bold mb-4">Lista de Hábitos</h1>
          <p className="text-sm text-gray-600 line-clamp-2">Cargando hábitos ... </p>
        </div>
      </div>
    )
  }
    return (
      <Habits habits={habits}/>
    );
}
