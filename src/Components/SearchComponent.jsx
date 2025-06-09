import React from "react";
const SearchComponent = ({serchTerm, setSearchTerm}) => {
    return (
        <div className="search">
            <div className="">
                <input 
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500" 
                type="text" placeholder="search for movie" value={serchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            </div>
        </div>
    );
};
export default SearchComponent