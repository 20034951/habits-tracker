export const fetchHabits = async() => {
    const response = await fetch('http://localhost:3001/habits');
    if(!response.ok){
        throw new Error('Failed to fetch habits');
    }
    //console.log('response.json ->', response.json);
    return response.json();
}