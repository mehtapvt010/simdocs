'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, XIcon } from "lucide-react"
import React from "react"
import { useSearchParam } from "@/hooks/use-search-param"

export const SearchInput = () => {
    const [search, setSearch] = useSearchParam();
    const [value, setValue] = React.useState(search);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }
    const handleClear = () => {
        setValue("");
        setSearch("");
        inputRef.current?.blur();
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearch(value);
        inputRef.current?.blur();
    }
    return (
        <div className="flex flex-1 items-center justify-center pt-1.5">
            <form onSubmit={handleSubmit} className="relative max-w-[720px] w-full">
                <Input className="w-full md:text-base placeholder:text-neutral-800 px-14 border-none focus-visible:shadow-[0_1px_1px_0_rgba(65, 69, 73, 0.3), 0_1px_3px_1px_rgba(65, 69, 73, 0.15)]
                bg-[#F0F4F8] rounded-full h-[48px] focus-visible:ring-0 focus:bg-white" placeholder="Search" type="search" 
                value={value}
                onChange={handleChange}
                ref={inputRef}
                />
                <Button className="absolute left-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full" type="submit" variant={"ghost"} size={"icon"}>
                    <SearchIcon/></Button>

                {value && (
                    <Button onClick={handleClear} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full" variant={"ghost"} size={"icon"}>
                        <XIcon />
                    </Button>
                )}    
            </form>
        </div>
    )
}