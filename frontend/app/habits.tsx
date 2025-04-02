import { useSelector, useDispatch } from 'react-redux';
import { fetchHabitsThunk, addHabitThunk, markAsDoneThunk, calculateProgress, isDoneDisabled } from '../features/habit/habitSlice';
import { RootState, AppDispatch } from '../redux/store';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

type Habit = {
    _id: string;
    title: string;
    description: string;
    days: number;
    createdAt: string;
    startedAt: string;
    lastUpdate: string;
    lastDone: string;
    userId: number;
}

type HabitsProps = {
    habits: Habit[];
}

const handleMarkAsDone = async (id: string, token: string, dispatch: AppDispatch) => {
    try{
        await dispatch(markAsDoneThunk({id, token})).unwrap();
        toast.success("Habit marked as done!");
        if(token){
            dispatch(fetchHabitsThunk(token));
        }    
    }catch(error){
        toast.error(`${error}`);
    }
}

export default function Habits({habits}: HabitsProps){

    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector( (state: RootState) => state.habits.status );
    const error = useSelector( (state: RootState) => state.habits.error );
    const user = useSelector( (state: RootState) => state.user.user );
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleAddHabit = () => {
        if(title && description){
            dispatch(addHabitThunk({
                token: user ? user.toString() : '',
                title,
                description
            }));
            setTitle('');
            setDescription('');
            dispatch(fetchHabitsThunk(user ? user.toString() : ''));
        }
    }

    return (
        <div className="pt-12 flex flex-col gap-4 items-center">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
                <h1 className="text-2xl text-black font-bold mb-4">Lista de Hábitos</h1>
                <ul className="space-y-4">
                    {habits.map((habit) => {
                    //const progreso = calcularProgreso(habit.createdAt);
                    //<progress className='bg-orange-500 h-2 rounded-full' value={progress} max='100'></progress>    
                    const progress = calculateProgress(habit.days);
                    const buttonDisabled = isDoneDisabled(habit.lastUpdate);
                    return (
                        <li key={habit._id} className="flex items-center justify-between">
                        <div className="w-96 h-40 bg-white shadow-lg rounded-2xl p-4 flex justify-between items-center border border-gray-200">
                            <div className="flex-1 overflow-hidden">
                                <h3 className="text-lg font-semibold text-gray-800">{habit.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{habit.description}</p>
                                <p className="text-xs text-gray-500 mt-1">Fecha de creación: {new Date(habit.createdAt).toLocaleDateString()}</p>
                    
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: progress }}></div>
                                </div>
                            </div>                
                            <button className={`ml-4 w-24 h-10 text-white text-sm font-medium rounded-lg transition flex items-center justify-center 
                                    ${buttonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-400'}`}
                                    onClick={() => handleMarkAsDone(habit._id, user ? user.toString() : '', dispatch)} disabled={buttonDisabled}>
                                {status[habit._id] === 'loading' ? 'Processing' : 'Mark as Done'}    
                            </button>          
                        </div>
                        </li>
                    );

                    /*
                    {status[habit._id]==='failed' && handleNotificationResult(error[habit._id], 'failed')};
                    {status[habit._id]==='success' && handleNotificationResult(status[habit._id], 'success')};
                    */

                    })}
                </ul>
            </div>
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
                <h1 className="text-2xl text-black font-bold mb-4">Agregar Hábito</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(element) => setTitle(element.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(element) => setDescription(element.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    />
                </div>
                <button className="ml-4 w-24 h-10 text-white text-sm font-medium rounded-lg transition flex items-center justify-center bg-blue-600 hover:bg-blue-400" onClick={() => handleAddHabit()}>
                    Agregar
                </button>          
            </div>
        </div>
    )
}