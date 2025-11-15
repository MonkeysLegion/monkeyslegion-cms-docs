"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DateTimePicker({
    date,
    setDate,
    granularity = "minute",
    placeholder = "Sélectionner une date et une heure",
    ...props
}: {
    date: string | number | Date
    setDate: (date: Date | null) => void
    granularity?: "minute" | "5minutes" | "15minutes"
    placeholder?: string
    children?: React.ReactNode
    [key: string]: unknown
}) {
    const minuteRef = React.useRef(null)
    const hourRef = React.useRef(null)

    // Get hours and minutes from the date
    const hours = date ? new Date(date).getHours() : 0
    const minutes = date ? new Date(date).getMinutes() : 0

    // Function to generate time options
    const getHourOptions = () => {
        return Array.from({ length: 24 }, (_, i) => ({
            value: i,
            label: i.toString().padStart(2, "0"),
        }))
    }

    const getMinuteOptions = () => {
        const interval =
            granularity === "minute"
                ? 1
                : granularity === "5minutes"
                    ? 5
                    : 15
        const options = []
        for (let i = 0; i < 60; i += interval) {
            options.push({
                value: i,
                label: i.toString().padStart(2, "0"),
            })
        }
        return options
    }

    // Handle time changes
    const handleHourChange = (newHour: string) => {
        const newDate = date ? new Date(date) : new Date()
        newDate.setHours(parseInt(newHour))
        setDate(newDate)
    }

    const handleMinuteChange = (newMinute: string) => {
        const newDate = date ? new Date(date) : new Date()
        newDate.setMinutes(parseInt(newMinute))
        setDate(newDate)
    }

    // Handle date selection
    const handleSelect = (newDate: Date | undefined) => {
        const currentDate = date ? new Date(date) : new Date()
        // Keep the current time when selecting a new date
        if (newDate) {
            newDate.setHours(currentDate.getHours(), currentDate.getMinutes())
        }
        setDate(newDate ?? null)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {props.children || (
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                            format(date, "PPP HH:mm")
                        ) : (
                            <span>{placeholder || 'Sélectionner une date'}</span>
                        )}
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Tabs defaultValue="date">
                    <div className="flex items-center justify-between px-3 pt-3">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="date">Date</TabsTrigger>
                            <TabsTrigger value="time">Heure</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="date" className="p-0">
                        <Calendar
                            mode="single"
                            selected={new Date(date)}
                            onSelect={handleSelect}
                            captionLayout="dropdown"
                            showOutsideDays={true}
                            required={false}
                        />
                    </TabsContent>
                    <TabsContent value="time" className="p-4 pt-2">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="flex flex-col">
                                <span className="text-xs mb-1 text-center text-muted-foreground">
                                    Heures
                                </span>
                                <Select
                                    value={hours.toString()}
                                    onValueChange={handleHourChange}
                                >
                                    <SelectTrigger
                                        ref={hourRef}
                                        className="w-16 border-0 bg-muted"
                                    >
                                        <SelectValue placeholder="00" />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="h-60"
                                        position="popper"
                                        sideOffset={5}
                                        align="center"
                                    >
                                        {getHourOptions().map((hour) => (
                                            <SelectItem
                                                key={hour.value}
                                                value={hour.value.toString()}
                                            >
                                                {hour.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="text-lg">:</div>
                            <div className="flex flex-col">
                                <span className="text-xs mb-1 text-center text-muted-foreground">
                                    Minutes
                                </span>
                                <Select
                                    value={minutes.toString()}
                                    onValueChange={handleMinuteChange}
                                >
                                    <SelectTrigger
                                        ref={minuteRef}
                                        className="w-16 border-0 bg-muted"
                                    >
                                        <SelectValue placeholder="00" />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="h-60"
                                        position="popper"
                                        sideOffset={5}
                                        align="center"
                                    >
                                        {getMinuteOptions().map((minute) => (
                                            <SelectItem
                                                key={minute.value}
                                                value={minute.value.toString()}
                                            >
                                                {minute.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                    const now = new Date()
                                    const newDate = date ? new Date(date) : new Date()
                                    newDate.setHours(now.getHours(), now.getMinutes())
                                    setDate(newDate)
                                }}
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Maintenant
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </PopoverContent>
        </Popover>
    )
}