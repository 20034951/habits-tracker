import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchHabits, markHabitAsDone } from './habitApi';

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

type HabitState = {
    habits: Habit[];
    status: Record<string, 'idle' | 'loading' | 'success' | 'failed'>;
    error: Record<string, string | null>;

}

const initialState: HabitState = {
    habits: [],
    status: {},
    error: {}
}

export const fetchHabitsThunk = createAsyncThunk('habit/fetchHabits', async () => {
    const response = await fetchHabits();
    console.log('response fetchHabitsThunk habitSlice -> ', response);
    return response;
});

export const markAsDoneThunk = createAsyncThunk('habit/done', async (id: string, { rejectWithValue }) => {
    try{
        const response = await markHabitAsDone(id);
        console.log('response markAsDoneThunk  habitSlice -> ', response);

        if(response.message === "Habit restarted"){
            return rejectWithValue(response.message);
        }

        return response.message;
    }catch(error){
        return rejectWithValue('Failed to mark habit as done');
    }
    
});

export const calculateProgress = (days: number): string => {
    const progress = Math.min((days / 66) * 100, 100);
    return `${progress.toFixed(2)}%`;
}

const timeDifferenceInDays = (date1: any, date2: any) => {
    const differenceMS = Math.abs(date1 - date2);
    return Math.floor(differenceMS / (1000 * 3600 * 24));
  }

export const isDoneDisabled = (lastUpdate: string): boolean => {
    const todayDate = new Date();
    const lastUpdatedDate = new Date(lastUpdate);
    const disabled = timeDifferenceInDays(todayDate, lastUpdatedDate) === 0;
    console.log(`todayDate = ${todayDate} | lastUpdatedDate = ${lastUpdatedDate} | isDisabled = ${disabled}`);
    return disabled;
}

const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        getHabits: (state, action) => {
            state.habits = action.payload;
        },
        addHabit: (state, action) => {
            state.habits.push(action.payload);
        },
        removeHabit: (state, action) => {
            state.habits = state.habits.filter(habit => habit._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHabitsThunk.fulfilled, (state, action) => {
            state.habits = action.payload;
        }).addCase(markAsDoneThunk.fulfilled, (state, action) => {
            state.status[action.meta.arg] = 'success';
            state.error[action.meta.arg] = null;
        }).addCase(markAsDoneThunk.rejected, (state, action) => {
            state.status[action.meta.arg] = 'failed';
            state.error[action.meta.arg] = action.payload as string;
        })
    }
});

export const { getHabits, addHabit, removeHabit } = habitSlice.actions;
export default habitSlice.reducer;
