export const fetchHabits = async(token : string) => {
    const response = await fetch('https://backend-6tz3pli8q-pabloalfonsovargas-20034951s-projects.vercel.app/habits', {
        headers : {
            Authorization : `Bearer ${token}`
        }
    });
    if(!response.ok){
        throw new Error('Failed to fetch habits');
    }
    const responseJson = await response.json();
    console.log(`responseJson fetchHabits habitApi -> ${responseJson}`);
    return responseJson;
}

export const addHabit = async(token : string, title : string, description : string) => {
    const response = await fetch('https://backend-6tz3pli8q-pabloalfonsovargas-20034951s-projects.vercel.app/habits', {
        method: 'POST',
        headers : {
            Authorization : `Bearer ${token}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({
            'title' : title,
            'description' : description
        })
    });
    if(!response.ok){
        throw new Error('Error creating habit');
    }
    const responseJson = await response.json();
    console.log(`responseJson fetchAddHabit habitApi -> ${responseJson}`);
    return responseJson;
}

export const markHabitAsDone = async(id: string, token: string) => {
    const response = await fetch(`https://backend-6tz3pli8q-pabloalfonsovargas-20034951s-projects.vercel.app/habits/done/${id}`, {
        method: 'PATCH',
        headers : {
            Authorization : `Bearer ${token}`,
            'Content_Type' : 'application/json'
        }
    });
    if(!response.ok){
        throw new Error('Failed to mark habit as done');
    }
    const responseJson = await response.json();
    console.log(`responseJson markHabitAsDone habitApi -> ${responseJson}`);
    return responseJson;
}