"use client"
import { DayLabelMode } from "@/lib/types/tracker";
import { createContext, ReactNode, useState } from "react";

interface contextType {
    initialValue : string,
    trackerName: string ,
    setTrackerName: React.Dispatch<React.SetStateAction<string>> ,
    customDaysInput: string, 
    setCustomDaysInput: React.Dispatch<React.SetStateAction<string>> ,
    customStartDate : string | null
    setCustomStartDate : React.Dispatch<React.SetStateAction<string | null>> ,
    dayLabelMode: DayLabelMode | undefined,
     setDayLabelMode :  React.Dispatch<React.SetStateAction<DayLabelMode>> ,
     includeGraph : boolean | undefined,
     setIncludeGraph: React.Dispatch<React.SetStateAction<boolean>> 
}

interface sheetContextProviderProps {
    children: ReactNode
}
export const SheetContext = createContext<contextType | null>(null)


export const SheetContextProvider = ({children} : sheetContextProviderProps)=>{
    const initialValue = 'value'
    const [trackerName, setTrackerName] = useState("");

  const [customDaysInput, setCustomDaysInput] = useState("30");
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [dayLabelMode, setDayLabelMode] = useState<DayLabelMode>("numbers");
    const [includeGraph, setIncludeGraph] = useState(true);
    return(
        <SheetContext.Provider value={{initialValue, trackerName, setTrackerName,customDaysInput, setCustomDaysInput, customStartDate, setCustomStartDate,dayLabelMode, setDayLabelMode, includeGraph, setIncludeGraph}}>
            {children}
        </SheetContext.Provider>
    )
}