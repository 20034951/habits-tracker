export const fetchHabits = async() => {
    const response = await fetch('http://localhost:3001/habits');
    if(!response.ok){
        throw new Error('Failed to fetch habits');
    }
    const responseJson = await response.json();
    console.log('responseJson fetchHabits habitApi ->', responseJson);
    return responseJson;
}

export const markHabitAsDone = async(id: string) => {
    const response = await fetch(`http://localhost:3001/habits/done/${id}`, {
        method: "PATCH"
    });
    if(!response.ok){
        throw new Error('Failed to mark habit as done');
    }
    const responseJson = await response.json();
    console.log('responseJson markHabitAsDone habitApi ->', responseJson);
    return responseJson;
}