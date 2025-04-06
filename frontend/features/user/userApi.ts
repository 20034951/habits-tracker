export const registerUser = async (username: string, password: string) => {
    const response = await fetch("https://backend-pabloalfonsovargas-20034951s-projects.vercel.app/users/register", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            'username' : username,
            'password' : password
        })
    });
    if(!response.ok){
        throw new Error('Failed to register user');
    }
    const responseJson = await response.json();
    console.log(`responseJson fetchRegisteredUser userApi -> ${responseJson}`);
    return responseJson;
}

export const loginUser = async (username: string, password: string) => {
    const response = await fetch("https://backend-pabloalfonsovargas-20034951s-projects.vercel.app/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            'username' : username,
            'password' : password
        })
    });
    if(!response.ok){
        throw new Error('Loging user failed');
    }
    const responseJson = await response.json();
    console.log(`responseJson fetchRegisteredUser userApi -> ${responseJson}`);
    return responseJson;
}

