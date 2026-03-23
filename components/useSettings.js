import { create } from 'zustand';

export const useSettings = create((set) => ({
  interval: "30",
  timerLength: "60",
  title: "Reminder",
  body: "Stay active!",  
  setVals: (newInterval, newTimerLength, newTitle, newBody) => set({ 
    interval: newInterval, 
    timerLength: newTimerLength, 
    title: newTitle, 
    body: newBody
  }),
}));