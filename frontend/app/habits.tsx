import { useSelector, useDispatch } from 'react-redux';
import { fetchHabitsThunk, markAsDoneThunk, calculateProgress, isDoneDisabled } from '../features/habit/habitSlice';
import { RootState, AppDispatch } from '../redux/store';
import { toast } from 'react-hot-toast';

type Habit = {
    _id: string;
    title: string;
    description: string;
    days: number;
    createdAt: string;
    startedAt: string;
    lastUpdate: string;
    lastDone: string;
}

type HabitsProps = {
    habits: Habit[];
}

const handleMarkAsDone = async (id: string, dispatch: AppDispatch) => {
    try{
        await dispatch(markAsDoneThunk(id)).unwrap();
        toast.success("Habit marked as done!");
        dispatch(fetchHabitsThunk());
    }catch(error){
        toast.error(`${error}`);
    }
}

export default function Habits({habits}: HabitsProps){

    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector( (state: RootState) => state.habits.status );
    const error = useSelector( (state: RootState) => state.habits.error );

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
                                    onClick={() => handleMarkAsDone(habit._id, dispatch)} disabled={buttonDisabled}>
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
        </div>
    )
}