type Habit = {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
}
type HabitsProps = {
    habits: Habit[];
}

const calcularProgreso = (createdAt: string) => {
    const daysToCreateAHabit = 66;
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - createdDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    let progress = (differenceInDays / daysToCreateAHabit) * 100;
    progress = Math.min(Math.max(progress, 0), 100); //Debe estar entre 0 y 100;

    return `${progress.toFixed(2)}%`;
}

export default function Habits({habits}: HabitsProps){
    return (
        <div className="pt-12 flex flex-col gap-4 items-center">
            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">
                <h1 className="text-2xl text-black font-bold mb-4">Lista de Hábitos</h1>
                <ul className="space-y-4">
                    {habits.map((habit) => {
                    const progreso = calcularProgreso(habit.createdAt);
                    return (
                        <li key={habit._id} className="flex items-center justify-between">
                        <div className="w-96 h-40 bg-white shadow-lg rounded-2xl p-4 flex justify-between items-center border border-gray-200">
                            <div className="flex-1 overflow-hidden">
                                <h3 className="text-lg font-semibold text-gray-800">{habit.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{habit.description}</p>
                                <p className="text-xs text-gray-500 mt-1">Fecha de creación: {new Date(habit.createdAt).toLocaleDateString()}</p>
                    
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: progreso }}></div>
                                </div>
                            </div>                
                            <button className="ml-4 w-24 h-10 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-400 transition flex items-center justify-center">
                            Finalizado
                            </button>
                        </div>
                        </li>
                    );
                    })}
                </ul>
            </div>
        </div>
    )
}