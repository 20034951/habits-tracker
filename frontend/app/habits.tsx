type Habit = {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
}
type HabitsProps = {
    habits: Habit[];
}

export default function Habits({habits}: HabitsProps){
    return (
        <ul>
            {habits.map((habit) => (
                <li key={habit._id}>
                    <h2>{habit.title}</h2>
                    <p>{habit.description}</p>
                    <small>Fecha de creación: {new Date(habit.createdAt).toLocaleDateString()}</small>
                </li>
            ))}
        </ul>
    )
}